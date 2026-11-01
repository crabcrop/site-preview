"use strict";
/* crabcrop 3D pass: Snap, live on stage.
   One procedural clay Snap (three.js, vendored locally), two stages:
   the hero frame and the docked guide porthole. Falls back silently to
   the mascot WebP when WebGL is missing or motion is reduced. */

const stage = document.getElementById("snapStage");
const dockEl = document.getElementById("snapDock");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) { return false; }
}

if (stage && !reduceMotion && webglAvailable()) {
  init().catch(() => { /* fallback WebP stays visible */ });
}

async function init() {
  const THREE = await import("three");

  /* ---------- procedural textures ---------- */
  function stitchTexture() {
    const c = document.createElement("canvas"); c.width = c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = "#cfcfcf"; g.fillRect(0, 0, 256, 256);
    const row = 32;
    for (let y = 0; y < 256 + row; y += row) {
      const off = (Math.round(y / row) % 2) * 16;
      for (let x = -16; x < 256 + 16; x += 32) {
        g.strokeStyle = "rgba(40,40,40,.55)"; g.lineWidth = 5;
        g.beginPath(); g.arc(x + off, y, 13, Math.PI * 1.08, Math.PI * 1.92); g.stroke();
        g.strokeStyle = "rgba(235,235,235,.5)"; g.lineWidth = 3;
        g.beginPath(); g.arc(x + off, y - 3, 13, Math.PI * 1.12, Math.PI * 1.88); g.stroke();
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(7, 5);
    return t;
  }
  function spiralTexture() {
    const c = document.createElement("canvas"); c.width = c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = "#F5E8D0"; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "#DEC49C"; g.lineWidth = 9; g.lineCap = "round";
    g.beginPath();
    for (let a = 0; a < Math.PI * 11; a += 0.08) {
      const r = 4 + a * 3.4, x = 128 + Math.cos(a) * r, y = 128 + Math.sin(a) * r;
      if (a === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  function printTexture() {
    const c = document.createElement("canvas"); c.width = 256; c.height = 208;
    const g = c.getContext("2d");
    g.fillStyle = "#FBF3DF"; g.fillRect(0, 0, 256, 208);
    g.fillStyle = "#FFFDF6"; g.fillRect(18, 18, 220, 172);
    g.fillStyle = "#FFE9BC"; g.fillRect(26, 26, 204, 156);
    g.fillStyle = "#FFB020"; g.beginPath(); g.arc(178, 74, 17, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#0E7C7B"; g.beginPath(); g.moveTo(26, 182); g.lineTo(110, 96); g.lineTo(178, 182); g.closePath(); g.fill();
    g.fillStyle = "#084F57"; g.beginPath(); g.moveTo(118, 182); g.lineTo(178, 116); g.lineTo(230, 182); g.closePath(); g.fill();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  const stitch = stitchTexture();

  /* ---------- materials: claymorphism, matte and plump ---------- */
  function clay(color, opts) {
    return new THREE.MeshPhysicalMaterial(Object.assign({
      color, roughness: 1.0, metalness: 0,
      sheen: 0.7, sheenColor: new THREE.Color(0xFFD9CF), sheenRoughness: 0.55,
      bumpMap: stitch, bumpScale: 0.5,
      roughnessMap: stitch
    }, opts || {}));
  }
  const MAT = {
    coral: clay(0xE14E36),
    coralDark: clay(0xCB3E26),
    cream: clay(0xF5E8D0, { bumpScale: 0.25 }),
    belly: new THREE.MeshPhysicalMaterial({ map: spiralTexture(), roughness: 1.0, roughnessMap: stitch, bumpMap: stitch, bumpScale: 0.3, sheen: 0.5, sheenColor: new THREE.Color(0xFFF3D6), sheenRoughness: 0.6 }),
    peach: clay(0xF2A868, { bumpScale: 0.2 }),
    pink: clay(0xF6A8B8, { bumpScale: 0.15 }),
    eyeWhite: new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.32 }),
    pupil: new THREE.MeshPhysicalMaterial({ color: 0x17100D, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.18 }),
    glint: new THREE.MeshBasicMaterial({ color: 0xFFFFFF }),
    smile: new THREE.MeshStandardMaterial({ color: 0x8A3320, roughness: 0.7 }),
    sand: new THREE.MeshStandardMaterial({ color: 0xF1DCB2, roughness: 1 }),
    frameCream: new THREE.MeshStandardMaterial({ color: 0xFBF3DF, roughness: 0.85 })
  };

  /* ---------- the Snap rig ---------- */
  function buildSnap(seg) {
    const S = seg || 40;
    const snap = new THREE.Group();
    const rig = { legs: [] };
    const sph = (r, m) => new THREE.Mesh(new THREE.SphereGeometry(r, S, Math.round(S * 0.75)), m);
    const cap = (r, l, m) => new THREE.Mesh(new THREE.CapsuleGeometry(r, l, 6, Math.round(S * 0.5)), m);

    // legs, three a side, stubby
    [-1, 1].forEach(side => {
      for (let i = 0; i < 3; i++) {
        const leg = new THREE.Group();
        const limb = cap(0.105, 0.2, MAT.coralDark);
        limb.rotation.z = side * 1.05; limb.position.set(side * 0.1, -0.1, 0);
        const foot = sph(0.115, MAT.coralDark); foot.scale.set(1, 0.62, 1.25); foot.position.set(side * 0.24, -0.24, 0);
        leg.add(limb, foot);
        leg.position.set(side * 0.92, 0.34, -0.34 + i * 0.34);
        snap.add(leg); rig.legs.push(leg);
      }
    });

    // body
    const body = sph(1, MAT.coral); body.scale.set(1.12, 0.94, 0.98); body.position.y = 1.12;
    snap.add(body); rig.body = body;
    // belly with the spiral
    const belly = sph(0.6, MAT.belly); belly.scale.set(0.98, 0.86, 0.45); belly.position.set(0, 0.8, 0.76);
    snap.add(belly);
    // cheeks
    [-1, 1].forEach(side => {
      const ch = new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), MAT.pink);
      ch.position.set(side * 0.55, 1.14, 0.9); ch.rotation.y = side * 0.45;
      snap.add(ch);
    });
    // smile (proud of the body surface, or it sinks out of sight)
    const smile = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 8, 24, Math.PI * 0.8), MAT.smile);
    smile.position.set(0, 1.17, 1.0); smile.rotation.z = Math.PI * 1.1;
    snap.add(smile);

    // eyes on stalks
    function makeEye(side) {
      const stalkG = new THREE.Group();
      const stalk = cap(0.082, 0.3, MAT.coral);
      stalk.position.y = 0.2; stalk.rotation.z = side * -0.14;
      const ball = new THREE.Group(); ball.position.set(side * 0.07, 0.46, 0.02);
      const white = sph(0.185, MAT.eyeWhite);
      const pupil = sph(0.148, MAT.pupil); pupil.position.set(0, 0.014, 0.058);
      const glint = sph(0.036, MAT.glint); glint.position.set(-0.05, 0.062, 0.128);
      const glint2 = sph(0.02, MAT.glint); glint2.position.set(0.055, -0.045, 0.13);
      ball.add(white, pupil, glint, glint2);
      stalkG.add(stalk, ball);
      stalkG.position.set(side * 0.34, 1.88, 0.3);
      snap.add(stalkG);
      return { stalkG, ball };
    }
    rig.eyeL = makeEye(-1); rig.eyeR = makeEye(1);

    // big claw, raised on Snap's right (viewer left)
    function makeClaw(scaleF, withPad) {
      const clawG = new THREE.Group();
      const palm = sph(0.3, MAT.coral); palm.scale.set(0.95, 1.12, 0.88);
      const finger = sph(0.21, MAT.coral); finger.scale.set(0.72, 1.5, 0.78);
      finger.position.set(-0.05, 0.3, 0.02); finger.rotation.z = 0.32;
      const thumbPivot = new THREE.Group(); thumbPivot.position.set(0.16, 0.02, 0.06);
      const thumb = sph(0.165, MAT.coral); thumb.scale.set(0.68, 1.3, 0.72);
      thumb.position.set(0.02, 0.2, 0); thumb.rotation.z = -0.5;
      thumbPivot.add(thumb); thumbPivot.rotation.z = 0.12;
      clawG.add(palm, finger, thumbPivot);
      if (withPad) {
        const pad = sph(0.155, MAT.peach); pad.scale.set(0.75, 1, 0.45); pad.position.set(0.03, 0.02, 0.21);
        clawG.add(pad);
      }
      clawG.scale.setScalar(scaleF);
      return { clawG, thumbPivot };
    }
    const armBig = new THREE.Group();
    const bigUpper = cap(0.125, 0.26, MAT.coral); bigUpper.position.y = 0.16;
    const big = makeClaw(1.14, true); big.clawG.position.y = 0.44;
    armBig.add(bigUpper, big.clawG);
    armBig.position.set(-1.1, 1.4, 0.3); armBig.rotation.z = -0.38;
    snap.add(armBig);
    rig.armBig = armBig; rig.bigThumb = big.thumbPivot;

    // small claw holding the photo print (viewer right)
    const armSmall = new THREE.Group();
    const smUpper = cap(0.105, 0.2, MAT.coral); smUpper.position.y = 0.1;
    const small = makeClaw(0.6, false); small.clawG.position.set(0.05, 0.28, 0.05); small.clawG.rotation.z = -0.4;
    armSmall.add(smUpper, small.clawG);
    armSmall.position.set(0.95, 0.82, 0.34); armSmall.rotation.z = 0.5; armSmall.rotation.x = -0.25;
    snap.add(armSmall); rig.armSmall = armSmall;
    const printMats = [MAT.frameCream, MAT.frameCream, MAT.frameCream, MAT.frameCream,
      new THREE.MeshStandardMaterial({ map: printTexture(), roughness: 0.85 }), MAT.frameCream];
    const print = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.45, 0.035), printMats);
    print.position.set(1.24, 0.74, 0.6); print.rotation.set(-0.06, -0.28, 0.04);
    snap.add(print); rig.print = print;

    snap.traverse(o => { if (o.isMesh) { o.castShadow = true; } });
    rig.group = snap;
    return rig;
  }

  /* ---------- shared scene dressing ---------- */
  function dressScene(scene, opts) {
    scene.add(new THREE.HemisphereLight(0xFFF3D6, 0xE4C88F, 0.85));
    const key = new THREE.DirectionalLight(0xFFE3B3, 1.7);
    key.position.set(2.6, 4.4, 3.2);
    if (opts.shadows) {
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.left = key.shadow.camera.bottom = -3;
      key.shadow.camera.right = key.shadow.camera.top = 3;
      key.shadow.camera.near = 1; key.shadow.camera.far = 14; key.shadow.bias = -0.0004;
    }
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8FE3E1, 0.55); rim.position.set(-3, 2, -2.5); scene.add(rim);
    const fill = new THREE.PointLight(0xFFD9CF, 12, 12); fill.position.set(0, 1.4, 3.4); scene.add(fill);
    return key;
  }
  function sandDisc(THREEref, withCaustics, timeUniform) {
    const grp = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CircleGeometry(2.02, 48), MAT.sand);
    disc.rotation.x = -Math.PI / 2; disc.receiveShadow = true; grp.add(disc);
    if (withCaustics) {
      const sh = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false,
        uniforms: { uTime: timeUniform, uOpacity: { value: 0.13 } },
        vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: [
          "varying vec2 vUv; uniform float uTime; uniform float uOpacity;",
          "void main(){",
          "  vec2 p = vUv * 9.0; float t = uTime * 0.55; float c = 0.0;",
          "  for(int i = 1; i < 4; i++){ float fi = float(i);",
          "    p += vec2(sin(p.y * 1.25 + t + fi * 1.7), cos(p.x * 1.15 - t * 0.8 + fi)) * 0.38;",
          "    c += 0.055 / abs(sin(p.x * 0.6 + p.y * 0.6 + t * 0.5 + fi)); }",
          "  float d = distance(vUv, vec2(0.5)); float fall = smoothstep(0.5, 0.12, d);",
          "  vec3 col = mix(vec3(0.055, 0.486, 0.482), vec3(0.561, 0.890, 0.882), clamp(c, 0.0, 1.0));",
          "  gl_FragColor = vec4(col, clamp(c, 0.0, 1.0) * fall * uOpacity); }"
        ].join("\n")
      });
      const ca = new THREE.Mesh(new THREE.CircleGeometry(2.3, 48), sh);
      ca.rotation.x = -Math.PI / 2; ca.position.y = 0.004; ca.renderOrder = 1; grp.add(ca);
    }
    return grp;
  }
  function bubbles(n) {
    const grp = new THREE.Group(); const items = [];
    const cols = [0x8FE3E1, 0xFFD88A, 0xFFB59F, 0xFFFFFF];
    for (let i = 0; i < n; i++) {
      const r = 0.02 + Math.random() * 0.035;
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10),
        new THREE.MeshPhysicalMaterial({ color: cols[i % 4], roughness: 0.08, transmission: 0.6, transparent: true, opacity: 0.55, clearcoat: 1 }));
      const a = Math.random() * Math.PI * 2, rad = 1.55 + Math.random() * 1.1;
      m.position.set(Math.cos(a) * rad, 0.5 + Math.random() * 2.2, Math.sin(a) * rad * 0.6);
      grp.add(m); items.push({ m, a, rad, sp: 0.1 + Math.random() * 0.22, ph: Math.random() * 6.28 });
    }
    return { grp, items };
  }

  /* ---------- tween kit ---------- */
  const tweens = [];
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeBack = t => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  function tween(dur, fn, ease, done) { tweens.push({ t: 0, dur, fn, ease: ease || easeOut, done }); }
  function stepTweens(dt) {
    for (let i = tweens.length - 1; i >= 0; i--) {
      const tw = tweens[i]; tw.t += dt;
      const k = Math.min(tw.t / tw.dur, 1);
      tw.fn(tw.ease(k));
      if (k >= 1) { tweens.splice(i, 1); if (tw.done) tw.done(); }
    }
  }

  /* ---------- pointer state ---------- */
  const pointer = { x: 0, y: 0, sx: 0, sy: 0, fine: window.matchMedia("(hover: hover) and (pointer: fine)").matches };
  if (pointer.fine) {
    window.addEventListener("pointermove", e => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  /* ---------- gestures, shared by both rigs ---------- */
  function makeGestures(rig, scene3) {
    let snapping = false, lastGesture = 0;
    const api = {
      snap() {
        if (snapping) return; snapping = true;
        const thumb = rig.bigThumb, body = rig.body;
        tween(0.09, k => { thumb.rotation.z = 0.12 - 0.55 * k; }, easeInOut);
        tween(0.3, k => { body.scale.y = 0.94 + 0.058 * k; }, easeOut);
        setTimeout(() => {
          tween(0.34, k => { thumb.rotation.z = -0.43 + 0.55 * k; }, easeBack, () => { snapping = false; });
        }, 130);
        if (scene3 && scene3.keyPulse) scene3.keyPulse();
      },
      wave() {
        const arm = rig.armBig, base = -0.38; let n = 0;
        tween(1.15, k => { arm.rotation.z = base + Math.sin(k * Math.PI * 5) * 0.32 * (1 - k * 0.55); }, t => t,
          () => { arm.rotation.z = base; });
      },
      printRaise() {
        const arm = rig.armSmall, base = 0.5;
        tween(0.45, k => { arm.rotation.z = base - 0.38 * k; }, easeOut);
        setTimeout(() => tween(0.6, k => { arm.rotation.z = base - 0.38 + 0.38 * k; }, easeInOut), 950);
      },
      scan() {
        if (!scene3) return;
        tween(1.5, k => { scene3.spin = Math.sin(k * Math.PI * 2.2) * 0.34; }, t => t,
          () => { scene3.spin = 0; });
      },
      happy() {
        const g = rig.group;
        tween(0.62, k => { g.position.y = Math.sin(k * Math.PI) * 0.13; }, t => t, () => { g.position.y = 0; });
      },
      scuttle() {
        const g = rig.group;
        tween(0.85, k => {
          const s = Math.sin(k * Math.PI * 10) * 0.05 * (1 - k);
          g.position.x = s; rig.legs.forEach((l, i) => { l.rotation.x = Math.sin(k * Math.PI * 10 + i) * 0.35 * (1 - k); });
        }, t => t, () => { g.position.x = 0; rig.legs.forEach(l => { l.rotation.x = 0; }); });
      },
      perform(name) {
        const now = performance.now();
        if (now - lastGesture < 1600) return;
        lastGesture = now;
        if (api[name]) api[name]();
      }
    };
    return api;
  }

  /* ---------- a stage = renderer + scene + rig ---------- */
  function makeStage(container, opts) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.maxPR || 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    if (opts.shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const timeU = { value: 0 };
    const key = dressScene(scene, opts);
    const rig = buildSnap(opts.seg);
    scene.add(sandDisc(THREE, opts.caustics, timeU));
    scene.add(rig.group);
    let bub = null;
    if (opts.bubbles) { bub = bubbles(20); scene.add(bub.grp); }
    const camera = new THREE.PerspectiveCamera(opts.fov, 1, 0.1, 40);
    camera.position.set(0, opts.camY, opts.camZ);
    const st = {
      renderer, scene, camera, rig, timeU, key, bub,
      active: false, keyBoost: 0, spin: 0,
      keyPulse() { st.keyBoost = 0.55; },
      resize() {
        const w = container.clientWidth, h = container.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
      },
      frame(t, dt) {
        timeU.value = t;
        // idle life: breathing, bob, stalk sway (slow, cinematic, per the reel)
        rig.body.scale.x = 1.12 * (1 + Math.sin(t * 2.1) * 0.006);
        rig.body.position.y = 1.12 + Math.sin(t * 1.25) * 0.028;
        rig.eyeL.stalkG.rotation.z = Math.sin(t * 0.9) * 0.045;
        rig.eyeR.stalkG.rotation.z = Math.sin(t * 0.9 + 1.3) * 0.045;
        // gaze: pupils follow the visitor; body leans in a little
        pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 6);
        pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 6);
        const gx = pointer.sx * opts.gaze, gy = -pointer.sy * opts.gaze * 0.55;
        [rig.eyeL, rig.eyeR].forEach(e => { e.ball.rotation.y = gx; e.ball.rotation.x = gy; });
        rig.group.rotation.y += ((opts.baseRotY + pointer.sx * 0.22 + st.spin) - rig.group.rotation.y) * Math.min(1, dt * 4);
        // blink
        st.blinkT -= dt;
        if (st.blinkT < 0) { st.blinkT = 2.6 + Math.random() * 3; st.blink = 0.13; }
        if (st.blink > 0) {
          st.blink -= dt;
          const s = st.blink > 0.065 ? 1 - (0.13 - st.blink) / 0.065 * 0.88 : 0.12 + (0.065 - st.blink) / 0.065 * 0.88;
          rig.eyeL.ball.scale.y = rig.eyeR.ball.scale.y = Math.max(0.12, s);
        } else rig.eyeL.ball.scale.y = rig.eyeR.ball.scale.y = 1;
        // key light pulse after a snap
        if (st.keyBoost > 0) { st.keyBoost = Math.max(0, st.keyBoost - dt * 1.4); }
        key.intensity = 1.7 + st.keyBoost;
        // bubbles drift on the current
        if (bub) bub.items.forEach(b => {
          b.a += dt * b.sp * 0.4;
          b.m.position.x = Math.cos(b.a) * b.rad;
          b.m.position.z = Math.sin(b.a) * b.rad * 0.6;
          b.m.position.y += Math.sin(t * 0.8 + b.ph) * 0.0009;
        });
        camera.position.x = pointer.sx * opts.camDrift;
        camera.position.y = opts.camY - pointer.sy * opts.camDrift * 0.5;
        camera.lookAt(0, opts.lookY, 0);
        renderer.render(scene, camera);
      },
      blinkT: 2 + Math.random() * 2, blink: 0
    };
    rig.group.rotation.y = opts.baseRotY;
    st.resize();
    return st;
  }

  /* ---------- hero stage ---------- */
  const glBox = document.getElementById("snapGL");
  const bubble = document.getElementById("snapBubble");
  const hero = makeStage(glBox, {
    shadows: true, caustics: true, bubbles: true, seg: 40,
    fov: 34, camY: 1.62, camZ: 5.9, lookY: 1.02, gaze: 0.5, camDrift: 0.32, baseRotY: -0.06, maxPR: 1.75
  });
  document.body.classList.add("gl-on");
  const heroGestures = makeGestures(hero.rig, hero);
  const OPS = ["format(avif)", "crop:1200x630:smart", "resize:800x600", "quality(80)", "filters:sharpen(1.2)", "studio(product)", "fit-in:1000x667", "filters:saturation(1.1)"];
  let opIdx = 0;
  function heroSnap() {
    heroGestures.snap();
    if (bubble) {
      bubble.textContent = OPS[opIdx++ % OPS.length];
      bubble.classList.remove("pop"); void bubble.offsetWidth; bubble.classList.add("pop");
    }
  }
  stage.addEventListener("click", heroSnap);
  stage.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); heroSnap(); }
  });
  let heroVisible = true;
  new IntersectionObserver(es => { es.forEach(e => { heroVisible = e.isIntersecting; }); }, { threshold: 0.05 })
    .observe(stage);

  /* ---------- docked guide ---------- */
  let dock = null, dockGestures = null, dockDismissed = false, dockOn = false;
  const fineDock = window.matchMedia("(min-width: 901px)").matches;
  if (dockEl && fineDock) {
    const dockGL = document.getElementById("dockGL");
    dock = makeStage(dockGL, {
      shadows: false, caustics: false, bubbles: false, seg: 26,
      fov: 36, camY: 1.45, camZ: 5.1, lookY: 1.0, gaze: 0.65, camDrift: 0.14, baseRotY: 0.1, maxPR: 1.5
    });
    dockGestures = makeGestures(dock.rig, dock);
    const close = document.getElementById("dockClose");
    if (close) close.addEventListener("click", () => {
      dockDismissed = true; dockEl.classList.remove("on"); dockOn = false;
    });
    dockEl.addEventListener("click", e => { if (e.target.closest(".dock-close")) return; dockGestures.perform("snap"); });
    // he fades politely while a demo is in use
    document.addEventListener("pointerover", e => {
      if (!dockOn) return;
      dockEl.classList.toggle("dim", !!e.target.closest(".ba, .code-window, .panel, .toy-stage"));
    });
    // the route: a gesture per place, as each section arrives
    const ROUTE = { install: "wave", features: "happy", sign: "snap", studio: "printRaise", ai: "scan" };
    const secIO = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting && dockOn && ROUTE[e.target.id]) dockGestures.perform(ROUTE[e.target.id]);
      });
    }, { threshold: 0.35 });
    Object.keys(ROUTE).forEach(id => { const s = document.getElementById(id); if (s) secIO.observe(s); });
    // dock appears once the hero is left behind; he arrives with a scuttle and a wave
    new IntersectionObserver(es => {
      es.forEach(e => {
        const past = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (past && !dockDismissed && !dockOn) {
          dockOn = true; dockEl.classList.add("on");
          setTimeout(() => { dockGestures.scuttle(); setTimeout(() => dockGestures.wave(), 1000); }, 350);
        } else if (e.isIntersecting && dockOn) {
          dockOn = false; dockEl.classList.remove("on");
        }
      });
    }, { threshold: 0.12 }).observe(stage);
  }

  /* ---------- one clock for both stages ---------- */
  const clock = { last: performance.now() };
  function loop(now) {
    const dt = Math.min((now - clock.last) / 1000, 0.05); clock.last = now;
    const t = now / 1000;
    stepTweens(dt);
    if (heroVisible && !document.hidden) hero.frame(t, dt);
    if (dock && dockOn && !document.hidden) dock.frame(t, dt);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  window.addEventListener("resize", () => { hero.resize(); if (dock) dock.resize(); });
  setTimeout(() => heroGestures.wave(), 1400);
}
