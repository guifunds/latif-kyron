/* Latif Home: apresentação 3D da empilhadeira (three.js). */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { GTAOPass } from "three/addons/postprocessing/GTAOPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { Reflector } from "three/addons/objects/Reflector.js";

const stage = document.getElementById("stage");
const LITE = matchMedia("(pointer: coarse)").matches || Math.min(screen.width, screen.height) < 700;
const DPR = LITE ? Math.min(devicePixelRatio, 2) : Math.min(Math.max(devicePixelRatio, 1.5), 2);

const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" }); // se falhar, a foto de reserva continua visível
renderer.setPixelRatio(DPR);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000, 1);
stage.prepend(renderer.domElement);
renderer.domElement.setAttribute("aria-hidden", "true");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
camera.layers.enable(1);

/* =================== Estúdio de luz (reflexos) =================== */
function studio() {
  const s = new THREE.Scene();
  s.background = new THREE.Color(0x000000);
  const room = new THREE.Mesh(new THREE.BoxGeometry(30, 16, 30), new THREE.MeshBasicMaterial({ color: 0x040405, side: THREE.BackSide }));
  room.position.y = 7; s.add(room);
  const panel = (w, h, k, pos, tint = 0xffffff) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos); m.lookAt(0, 1, 0); s.add(m);
  };
  panel(9, 3.2, 5.0, [0.5, 9, 1.5]);               // softbox de teto
  panel(1.6, 8, 7.0, [-9, 4, 4]);                   // faixa lateral esquerda
  panel(1.6, 8, 6.0, [7, 4, -7]);                   // faixa traseira direita
  panel(7, 3.4, 2.6, [7, 2.6, 7], 0xfff1dc);        // rebatedor quente frontal
  panel(3, 6, 3.2, [10, 3.5, 0]);                    // faixa frontal (lado dos garfos)
  panel(8, 2, 2.0, [-2, 5, 9]);                       // faixa lateral alta
  panel(6, 1.0, 1.6, [-5, 0.8, -8], 0xd9e6ff);      // contraluz baixa fria
  return s;
}
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(studio(), 0.015).texture;
scene.environmentIntensity = 1.05;

/* =================== Luzes =================== */
const key = new THREE.DirectionalLight(0xfff3e4, 3.0);
key.position.set(4.5, 8.5, 5.5);
key.castShadow = true;
key.shadow.mapSize.set(LITE ? 2048 : 4096, LITE ? 2048 : 4096);
Object.assign(key.shadow.camera, { left: -3.6, right: 3.6, top: 5.2, bottom: -3.2, near: 2, far: 22 });
key.shadow.bias = -0.0003; key.shadow.normalBias = 0.015; key.shadow.radius = 3;
scene.add(key);
const rimL = new THREE.DirectionalLight(0xdbe7ff, 3.4); rimL.position.set(-7, 4.5, -3.5); scene.add(rimL);
const rimR = new THREE.DirectionalLight(0xffffff, 2.6); rimR.position.set(5, 3.8, -7.5); scene.add(rimR);
const top = new THREE.DirectionalLight(0xffffff, 1.4); top.position.set(-1.5, 10, -3); scene.add(top);
const front = new THREE.DirectionalLight(0xfff6ea, 0.9); front.position.set(9, 2.5, 1); scene.add(front);
scene.add(new THREE.HemisphereLight(0xffffff, 0x0a0a0a, 0.35));

/* =================== Texturas procedurais =================== */
const cv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function noise(size, octaves, stretch = 1, base = 0) {
  const [c, g] = cv(size, size);
  g.fillStyle = "#808080"; g.fillRect(0, 0, size, size);
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
  for (const [n, a] of octaves) {
    const [s, sg] = cv(n, Math.max(1, Math.round(n / stretch)));
    const id = sg.createImageData(s.width, s.height);
    for (let i = 0; i < id.data.length; i += 4) { const v = rnd() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
    sg.putImageData(id, 0, 0); g.globalAlpha = a; g.drawImage(s, 0, 0, size, size);
  }
  g.globalAlpha = 1;
  if (base) { g.fillStyle = `rgba(255,255,255,${base})`; g.fillRect(0, 0, size, size); }
  return c;
}
function normalFrom(hc, strength) {
  const w = hc.width, h = hc.height, src = hc.getContext("2d").getImageData(0, 0, w, h).data;
  const [c, g] = cv(w, h), out = g.createImageData(w, h), d = out.data;
  const H = (x, y) => src[((((y + h) % h) * w) + ((x + w) % w)) * 4] / 255;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = (H(x + 1, y) - H(x - 1, y)) * strength, dy = (H(x, y + 1) - H(x, y - 1)) * strength;
    const l = Math.hypot(dx, dy, 1), i = (y * w + x) * 4;
    d[i] = (-dx / l * 0.5 + 0.5) * 255; d[i + 1] = (dy / l * 0.5 + 0.5) * 255; d[i + 2] = (1 / l * 0.5 + 0.5) * 255; d[i + 3] = 255;
  }
  g.putImageData(out, 0, 0); return c;
}
function blurred(c, px) { const [o, g] = cv(c.width, c.height); g.filter = `blur(${px}px)`; g.drawImage(c, 0, 0); return o; }
const ANISO = Math.min(8, renderer.capabilities.getMaxAnisotropy());
function T(c, rx = 1, ry = 1, srgb = false) {
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry);
  t.anisotropy = ANISO; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t;
}
const paintRough = noise(512, [[6, .5], [24, .35], [96, .25]], 1, 0.72);
const coatRough = noise(512, [[8, .5], [40, .35], [160, .3]], 1, 0.6);
const brushed = noise(512, [[16, .4], [128, .35], [512, .3]], 24, 0.55);
const grain = normalFrom(noise(256, [[64, .5], [256, .5]]), 1.2);
function diamondPlate() {
  const S = 128, [c, g] = cv(S, S);
  g.fillStyle = "#000"; g.fillRect(0, 0, S, S); g.fillStyle = "#fff";
  const lug = (x, y, a) => { g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.ellipse(0, 0, 22, 6, 0, 0, Math.PI * 2); g.fill(); g.restore(); };
  for (const [x, y, a] of [[32, 32, .785], [96, 32, -.785], [32, 96, -.785], [96, 96, .785], [0, 0, -.785], [128, 0, -.785], [0, 128, -.785], [128, 128, -.785], [64, 64, .785 * 0]]) if (!(x === 64)) lug(x, y, a);
  return normalFrom(blurred(c, 2), 3.2);
}
const diamondN = diamondPlate();
function treadNormal(lugs) {
  const W = 2048, H = 256, [c, g] = cv(W, H);
  g.fillStyle = "#fff"; g.fillRect(0, 0, W, H);
  g.fillStyle = "#b8b8b8"; for (const y of [.05, .1, .15, .2, .8, .85, .9, .95]) g.fillRect(0, y * H, W, 2);
  const t0 = .27 * H, t1 = .73 * H, mid = H / 2, st = W / lugs;
  g.fillStyle = "#000";
  const poly = (p) => { g.beginPath(); g.moveTo(...p[0]); for (const q of p.slice(1)) g.lineTo(...q); g.closePath(); g.fill(); };
  for (let k = -1; k <= lugs; k++) {
    const x = k * st;
    poly([[x, mid - 3], [x + st * .34, mid - 3], [x + st * .95, t0 - 10], [x + st * .6, t0 - 10]]);
    const x2 = x + st * .5;
    poly([[x2, mid + 3], [x2 + st * .34, mid + 3], [x2 + st * .95, t1 + 10], [x2 + st * .6, t1 + 10]]);
  }
  g.fillRect(0, mid - 2, W, 4);
  return normalFrom(blurred(c, 1.1), 2.6);
}
function decal(text, sub, w = 512, h = 160) {
  const [c, g] = cv(w, h);
  g.fillStyle = "#121214"; g.beginPath(); g.roundRect(0, 0, w, h, 24); g.fill();
  g.fillStyle = "#fdb913"; g.font = "700 96px Inter Tight, system-ui, sans-serif"; g.textBaseline = "middle"; g.fillText(text, 34, h / 2 + 4);
  g.fillStyle = "#f5f5f7"; g.font = "600 38px Inter, system-ui, sans-serif"; g.fillText(sub, w - 34 - g.measureText(sub).width, h / 2 + 4);
  return T(c, 1, 1, true);
}
function lcd() {
  const [c, g] = cv(256, 160);
  g.fillStyle = "#04070a"; g.fillRect(0, 0, 256, 160);
  g.strokeStyle = "#3fd0ff"; g.lineWidth = 6; g.beginPath(); g.arc(70, 92, 44, Math.PI * .8, Math.PI * 1.9); g.stroke();
  g.fillStyle = "#3fd0ff"; for (let i = 0; i < 6; i++) g.fillRect(140, 120 - i * 16, 70 - i * 6, 10);
  g.fillStyle = "#9ff0ff"; g.font = "600 26px Inter, system-ui, sans-serif"; g.fillText("12.4h", 40, 150);
  const t = T(c, 1, 1, true); return t;
}

/* =================== Materiais =================== */
const paint = new THREE.MeshPhysicalMaterial({ color: "#fdb913", roughness: 0.46, roughnessMap: T(paintRough, 2, 2), metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.18 });
const coat = new THREE.MeshPhysicalMaterial({ color: "#222327", roughness: 0.52, roughnessMap: T(coatRough, 2, 2), metalness: 0.1, clearcoat: 0.4, clearcoatRoughness: 0.28 });
const coat2 = coat.clone(); coat2.side = THREE.DoubleSide;
const chassis = new THREE.MeshStandardMaterial({ color: "#141518", roughness: 0.7, metalness: 0.1 });
const steel = new THREE.MeshPhysicalMaterial({ color: "#2a2b30", roughness: 0.5, roughnessMap: T(brushed, 1, 3), metalness: 0.3, clearcoat: 0.3, clearcoatRoughness: 0.3 });
const fork = new THREE.MeshStandardMaterial({ color: "#3a3b40", roughness: 0.55, roughnessMap: T(brushed, 3, 1), metalness: 0.55 });
const chrome = new THREE.MeshStandardMaterial({ color: "#f0f0f0", roughness: 0.07, metalness: 1 });
const alu = new THREE.MeshStandardMaterial({ color: "#a7abb1", roughness: 0.42, roughnessMap: T(brushed, 2, 2), metalness: 1 });
const plate = new THREE.MeshStandardMaterial({ color: "#55575c", roughness: 0.42, metalness: 0.85, normalMap: T(diamondN, 5, 5), normalScale: new THREE.Vector2(1, 1) });
const seatM = new THREE.MeshPhysicalMaterial({ color: "#151517", roughness: 0.74, normalMap: T(grain, 4, 4), normalScale: new THREE.Vector2(.35, .35), sheen: 0.5, sheenRoughness: 0.6, sheenColor: new THREE.Color("#3a3a3a") });
const hoseM = new THREE.MeshStandardMaterial({ color: "#0d0d0e", roughness: 0.55, metalness: 0 });
const engM = new THREE.MeshStandardMaterial({ color: "#2e353d", roughness: 0.5, metalness: 0.55 });
const redM = new THREE.MeshPhysicalMaterial({ color: "#a8231b", roughness: 0.35, metalness: 0.1, clearcoat: 0.5 });
const lensW = new THREE.MeshPhysicalMaterial({ color: "#ffffff", emissive: "#fff3dc", emissiveIntensity: 1.6, roughness: 0.05, transmission: 0, clearcoat: 1 });
const lensR = new THREE.MeshPhysicalMaterial({ color: "#5a0000", emissive: "#ff1a10", emissiveIntensity: 1.1, roughness: 0.08, clearcoat: 1 });
const lensA = new THREE.MeshPhysicalMaterial({ color: "#8a4600", emissive: "#ff9100", emissiveIntensity: 1.0, roughness: 0.08, clearcoat: 1 });
const beltM = new THREE.MeshStandardMaterial({ color: "#d45a10", roughness: 0.7 });
const lcdM = new THREE.MeshBasicMaterial({ map: lcd() });

/* =================== Auxiliares =================== */
const all = new THREE.Group(); scene.add(all);
const named = {};
function add(mesh, parent = all) { mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh; }
function rbox(w, h, d, mat, x, y, z, r = 0.012, parent) {
  const rr = Math.max(0.001, Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3));
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, rr), mat); m.position.set(x, y, z); return add(m, parent);
}
const UP = new THREE.Vector3(0, 1, 0);
function between(geo, mat, a, b, parent) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), dir = B.clone().sub(A), len = dir.length();
  geo.scale(1, len, 1);
  const m = new THREE.Mesh(geo, mat); m.position.copy(A).add(B).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(UP, dir.normalize()); return add(m, parent);
}
const tube = (r, mat, a, b, parent, seg = 24) => between(new THREE.CylinderGeometry(r, r, 1, seg), mat, a, b, parent);
const bar = (w, d, mat, a, b, parent) => between(new RoundedBoxGeometry(w, 1, d, 2, Math.min(w, d) * 0.18), mat, a, b, parent);
function extrude(shape, depth, mat, z, bevel = 0.012, parent = all) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 64 });
  g.translate(0, 0, -depth / 2);
  const m = new THREE.Mesh(g, mat); m.position.z = z; return add(m, parent);
}
function hose(points, r = 0.016, parent = all) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  return add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, r, 10), hoseM), parent);
}

/* =================== Geometria base =================== */
const FX = 0.45, FR = 0.37, RX = -1.1, RR = 0.30;
const fa = FR + 0.06, ra = RR + 0.07;
const yb = 0.24, xRear = -1.2, xFront = 0.62, yTop = 1.07;

/* ----- Rodas ----- */
function wheel(R, W, rimR, x, z, lugs, nuts) {
  const g = new THREE.Group(); g.position.set(x, R, z); all.add(g);
  const side = Math.sign(z);
  const pts = [], sh = 0.055;
  for (let i = 0; i < 8; i++) { const t = i / 8; pts.push(new THREE.Vector2(rimR + (R - sh - rimR) * t, -W / 2 + 0.012 - Math.sin(Math.PI * t) * 0.012)); }
  for (let i = 0; i <= 5; i++) { const a = -Math.PI / 2 + (i / 5) * Math.PI / 2; pts.push(new THREE.Vector2(R - sh + Math.cos(a) * sh, -W / 2 + sh + Math.sin(a) * sh)); }
  for (let i = 1; i < 7; i++) { const t = i / 7; pts.push(new THREE.Vector2(R + Math.sin(Math.PI * t) * 0.004, -W / 2 + sh + (W - 2 * sh) * t)); }
  for (let i = 0; i <= 5; i++) { const a = (i / 5) * Math.PI / 2; pts.push(new THREE.Vector2(R - sh + Math.cos(a) * sh, W / 2 - sh + Math.sin(a) * sh)); }
  for (let i = 1; i <= 8; i++) { const t = i / 8; pts.push(new THREE.Vector2(R - sh - (R - sh - rimR) * t, W / 2 - 0.012 + Math.sin(Math.PI * t) * 0.012)); }
  const tg = new THREE.LatheGeometry(pts, 96); tg.rotateX(Math.PI / 2);
  const tm = new THREE.MeshStandardMaterial({ color: "#151516", roughness: 0.9, normalMap: T(treadNormal(lugs)), normalScale: new THREE.Vector2(1.6, 1.6) });
  add(new THREE.Mesh(tg, tm), g);
  // aro de aço
  const rp = [
    new THREE.Vector2(rimR + 0.004, -W * .44), new THREE.Vector2(rimR - 0.02, -W * .44), new THREE.Vector2(rimR - 0.025, -W * .3),
    new THREE.Vector2(rimR - 0.025, W * .3), new THREE.Vector2(rimR - 0.02, W * .44), new THREE.Vector2(rimR + 0.004, W * .44)];
  const rim = new THREE.Mesh(new THREE.LatheGeometry(rp, 64), coat2); rim.geometry.rotateX(Math.PI / 2); add(rim, g);
  const dp = [new THREE.Vector2(0.001, side * W * .32), new THREE.Vector2(rimR * .3, side * W * .32), new THREE.Vector2(rimR * .55, side * W * .26),
    new THREE.Vector2(rimR * .82, side * W * .3), new THREE.Vector2(rimR - 0.02, side * W * .36)];
  if (side < 0) dp.reverse();
  const dish = new THREE.Mesh(new THREE.LatheGeometry(dp, 64), coat2); dish.geometry.rotateX(Math.PI / 2); add(dish, g);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(rimR * .22, rimR * .26, 0.06, 32), alu); hub.rotation.x = Math.PI / 2; hub.position.z = side * W * .36; add(hub, g);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(rimR * .1, rimR * .13, 0.03, 24), chrome); cap.rotation.x = Math.PI / 2; cap.position.z = side * W * .4; add(cap, g);
  const holeM = new THREE.MeshBasicMaterial({ color: 0x000000 });
  for (let i = 0; i < nuts; i++) {
    const a = i / nuts * Math.PI * 2;
    const n = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.03, 6), chrome); n.rotation.x = Math.PI / 2;
    n.position.set(Math.cos(a) * rimR * .4, Math.sin(a) * rimR * .4, side * W * .345); add(n, g);
    const h = new THREE.Mesh(new THREE.CircleGeometry(0.028, 20), holeM); const b = a + Math.PI / nuts;
    h.position.set(Math.cos(b) * rimR * .66, Math.sin(b) * rimR * .66, side * (W * .276 + 0.004)); if (side < 0) h.rotation.y = Math.PI; g.add(h);
  }
  return g;
}
named.wheelFL = wheel(FR, 0.25, 0.2, FX, 0.5, 26, 8);
wheel(FR, 0.25, 0.2, FX, -0.5, 26, 8);
wheel(RR, 0.19, 0.15, RX, 0.47, 20, 6);
wheel(RR, 0.19, 0.15, RX, -0.47, 20, 6);

/* ----- Laterais com recorte das rodas ----- */
{
  const fxL = FX - Math.sqrt(fa * fa - (FR - yb) ** 2);
  const rxR = RX + Math.sqrt(ra * ra - (RR - yb) ** 2);
  const yRA = RR + Math.sqrt(ra * ra - (xRear - RX) ** 2);
  const yFA = FR + Math.sqrt(fa * fa - (xFront - FX) ** 2);
  const aR0 = Math.atan2(yb - RR, rxR - RX), aR1 = Math.atan2(yRA - RR, xRear - RX);
  const aF0 = Math.atan2(yFA - FR, xFront - FX); let aF1 = Math.atan2(yb - FR, fxL - FX); if (aF1 < aF0) aF1 += Math.PI * 2;
  const sh = new THREE.Shape();
  sh.moveTo(fxL, yb); sh.lineTo(rxR, yb);
  sh.absarc(RX, RR, ra, aR0, aR1, false);
  sh.lineTo(xRear, yTop); sh.lineTo(xFront - 0.09, yTop);
  sh.quadraticCurveTo(xFront, yTop, xFront, yTop - 0.09);
  sh.lineTo(xFront, yFA);
  sh.absarc(FX, FR, fa, aF0, aF1, false);
  for (const s of [1, -1]) extrude(sh, 0.085, paint, s * 0.488, 0.012);

  // frisos de borracha nos arcos
  const trim = (cx, cy, r, a0, a1, z) => {
    const t = new THREE.Shape(); t.absarc(cx, cy, r + 0.035, a0, a1, false); t.absarc(cx, cy, r, a1, a0, true);
    const m = extrude(t, 0.11, chassis, z, 0.006); return m;
  };
  for (const s of [1, -1]) { trim(FX, FR, fa - 0.01, aF0 + 0.02, aF1 - 0.02, s * 0.49); trim(RX, RR, ra - 0.01, aR0 + 0.02, aR1, s * 0.49); }

  // contrapeso esculpido, com recorte da roda traseira
  const yCB = 0.2, xCr = -1.9, yCt = 1.28;
  const xAL = RX - Math.sqrt(ra * ra - (RR - yCB) ** 2);
  let aC1 = Math.atan2(yCB - RR, xAL - RX); if (aC1 < aR1) aC1 += Math.PI * 2;
  const c = new THREE.Shape();
  c.moveTo(xRear, yRA); c.lineTo(xRear, yCt); c.lineTo(-1.52, yCt);
  c.bezierCurveTo(-1.78, yCt, xCr, 1.2, xCr, 0.96);
  c.lineTo(xCr, 0.42); c.quadraticCurveTo(xCr, yCB, -1.7, yCB);
  c.lineTo(xAL, yCB);
  c.absarc(RX, RR, ra, aC1, aR1, true);
  named.cw = extrude(c, 1.16, paint, 0, 0.03);
  for (const s of [1, -1]) trim(RX, RR, ra - 0.01, aR1, aC1 - 0.02, s * 0.6);
}

/* ----- Chassi, cofre do motor e posto do operador ----- */
rbox(1.76, 0.36, 0.68, chassis, -0.29, 0.4, 0, 0.02);                 // chassi
rbox(1.12, 0.02, 0.9, chassis, -0.6, 0.59, 0, 0.004);                // fundo do cofre
rbox(0.05, 0.5, 0.92, coat, -0.0, 0.83, 0, 0.01);                    // divisória
rbox(0.58, 0.035, 0.9, plate, 0.3, 0.865, 0, 0.006);                 // piso em chapa xadrez
rbox(0.12, 0.46, 0.9, coat, 0.555, 1.09, 0, 0.02);                   // painel frontal
rbox(0.24, 0.05, 0.86, coat, 0.5, 1.33, 0, 0.02);                    // tampa do painel
{ const d = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 0.094), lcdM); d.position.set(0.425, 1.375, -0.16); d.rotation.set(0, -Math.PI / 2, 0); d.rotateX(-0.5); all.add(d);
  rbox(0.05, 0.12, 0.2, coat, 0.44, 1.37, -0.16, 0.01).rotation.z = 0.5; }
for (const s of [1, -1]) {                                             // degraus
  rbox(0.36, 0.03, 0.1, plate, -0.2, 0.42, s * 0.575, 0.004);
  rbox(0.36, 0.06, 0.012, chassis, -0.2, 0.4, s * 0.625, 0.003);
}
// frisos de borracha no topo das laterais
for (const s of [1, -1]) rbox(1.62, 0.028, 0.06, chassis, -0.33, 1.088, s * 0.515, 0.01);
// adesivo de capacidade
{
  const m = new THREE.MeshStandardMaterial({ map: decal("3.0 t", "DIESEL"), roughness: 0.45, transparent: true, polygonOffset: true, polygonOffsetFactor: -2 });
  for (const s of [1, -1]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.119), m); p.position.set(-1.5, 0.98, s * 0.6155); if (s < 0) p.rotation.y = Math.PI; all.add(p); }
}
// detalhes do contrapeso: grade, lanternas, engate
for (let i = 0; i < 7; i++) rbox(0.3, 0.012, 0.035, chassis, -1.38, 1.296, -0.27 + i * 0.09, 0.004);
for (const s of [1, -1]) {
  rbox(0.06, 0.16, 0.16, chassis, -1.9, 0.9, s * 0.44, 0.02);
  rbox(0.02, 0.07, 0.12, lensR, -1.935, 0.93, s * 0.44, 0.008);
  rbox(0.02, 0.05, 0.12, lensA, -1.935, 0.86, s * 0.44, 0.008);
}
rbox(0.05, 0.13, 0.26, chassis, -1.915, 0.42, 0, 0.012);
{ const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.1, 20), alu); pin.position.set(-1.945, 0.42, 0); add(pin); }

/* ----- Motor ----- */
const engine = new THREE.Group(); engine.position.set(-0.58, 0.6, 0); all.add(engine); named.engine = engine;
rbox(0.62, 0.22, 0.42, engM, 0, 0.11, 0, 0.02, engine);
rbox(0.56, 0.08, 0.34, alu, 0, 0.26, 0, 0.015, engine);
for (let i = 0; i < 4; i++) { rbox(0.1, 0.045, 0.2, redM, -0.21 + i * 0.14, 0.32, 0, 0.012, engine); tube(0.008, alu, [-0.21 + i * 0.14, 0.3, 0.13], [-0.21 + i * 0.14, 0.36, 0.13], engine); }
tube(0.065, coat, [0.18, 0.28, -0.27], [-0.22, 0.28, -0.27], engine, 32);
{ const p = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 32), alu); p.rotation.z = Math.PI / 2; p.position.set(-0.34, 0.12, 0.1); add(p, engine); }
rbox(0.05, 0.24, 0.6, steel, -0.46, 0.13, 0, 0.006, engine);
for (let i = 0; i < 10; i++) rbox(0.052, 0.004, 0.58, chassis, -0.46, 0.03 + i * 0.022, 0, 0.001, engine);
hose([[0.2, 0.1, 0.22], [0.27, 0.06, 0.28], [0.3, 0.02, 0.32]], 0.022, engine);
hose([[-0.3, 0.2, 0.15], [-0.4, 0.28, 0.2], [-0.46, 0.2, 0.25]], 0.014, engine);

/* ----- Capô com banco (bascula) ----- */
const hood = new THREE.Group(); hood.position.set(0.0, 1.07, 0); all.add(hood);
rbox(1.17, 0.05, 0.94, coat, -0.6, 0.0, 0, 0.012, hood);
for (let i = 0; i < 6; i++) rbox(0.03, 0.01, 0.3, chassis, -1.0 - i * 0.03, 0.03, 0.28, 0.003, hood);
for (let i = 0; i < 6; i++) rbox(0.03, 0.01, 0.3, chassis, -1.0 - i * 0.03, 0.03, -0.28, 0.003, hood);
rbox(0.36, 0.06, 0.36, chassis, -0.62, 0.05, 0, 0.01, hood);
rbox(0.5, 0.11, 0.5, seatM, -0.63, 0.13, 0, 0.04, hood);
for (const s of [1, -1]) rbox(0.42, 0.07, 0.07, seatM, -0.63, 0.19, s * 0.22, 0.03, hood);
const back = rbox(0.11, 0.56, 0.48, seatM, -0.93, 0.44, 0, 0.045, hood); back.rotation.z = 0.16;
rbox(0.09, 0.15, 0.32, seatM, -0.99, 0.79, 0, 0.04, hood).rotation.z = 0.16;
rbox(0.34, 0.035, 0.06, coat, -0.6, 0.27, 0.29, 0.012, hood);

/* ----- Direção e comandos ----- */
tube(0.032, coat, [0.5, 1.3, 0], [0.32, 1.56, 0]);
{
  const dir = new THREE.Vector3(0.32 - 0.5, 1.56 - 1.3, 0).normalize();
  const sw = new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.021, 20, 64), seatM);
  sw.position.set(0.31, 1.575, 0); sw.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir); add(sw);
  for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2 + Math.PI / 2; const q = sw.quaternion; const v = new THREE.Vector3(Math.cos(a) * 0.15, Math.sin(a) * 0.15, 0).applyQuaternion(q).add(sw.position); tube(0.01, coat, [sw.position.x, sw.position.y, sw.position.z], [v.x, v.y, v.z]); }
  const hubM = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.025, 24), coat); hubM.position.copy(sw.position); hubM.quaternion.setFromUnitVectors(UP, dir); add(hubM);
  tube(0.013, chrome, [0.31, 1.575, 0.12], [0.36, 1.61, 0.13]);
  const kn = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 12), seatM); kn.position.set(0.36, 1.615, 0.13); add(kn);
}
for (let i = 0; i < 3; i++) { tube(0.01, chrome, [0.54, 1.22, 0.22 + i * 0.06], [0.44, 1.46, 0.22 + i * 0.06]); const k = new THREE.Mesh(new THREE.SphereGeometry(0.026, 16, 12), seatM); k.scale.y = 1.3; k.position.set(0.44, 1.48, 0.22 + i * 0.06); add(k); }

/* ----- Protetor do operador ----- */
const TOP = 2.2, gz = 0.5;
for (const s of [1, -1]) {
  bar(0.075, 0.075, coat, [0.57, 1.06, s * gz], [0.37, TOP, s * gz]);
  bar(0.075, 0.075, coat, [-1.22, 1.27, s * gz], [-1.22, TOP, s * gz]);
  bar(0.065, 0.065, coat, [0.37, TOP, s * gz], [-1.22, TOP, s * gz]);
  rbox(0.07, 0.1, 0.1, chassis, 0.62, 1.2, s * (gz + 0.07), 0.015);
  rbox(0.012, 0.07, 0.075, lensW, 0.657, 1.2, s * (gz + 0.07), 0.006);
  rbox(0.08, 0.11, 0.13, chassis, 0.38, TOP - 0.11, s * (gz + 0.05), 0.02);
  rbox(0.012, 0.08, 0.1, lensW, 0.423, TOP - 0.11, s * (gz + 0.05), 0.006);
  rbox(0.07, 0.035, 0.035, chassis, -1.24, 1.26, s * gz, 0.008);
}
const roof = new THREE.Group(); roof.position.set(-0.42, TOP, 0); all.add(roof); named.roof = roof;
bar(0.065, 0.065, coat, [0.37, TOP, gz], [0.37, TOP, -gz]);
bar(0.065, 0.065, coat, [-1.22, TOP, gz], [-1.22, TOP, -gz]);
for (let i = 0; i < 11; i++) { const z = -0.42 + i * 0.084; bar(0.044, 0.016, coat, [0.34, TOP + 0.012, z], [-1.19, TOP + 0.012, z]); }
tube(0.016, coat, [0.52, 1.3, gz + 0.06], [0.42, 1.9, gz + 0.06]);                       // pega-mão
for (const y of [1.3, 1.9]) tube(0.012, coat, [y === 1.3 ? 0.52 : 0.42, y, gz + 0.06], [y === 1.3 ? 0.5 : 0.4, y, gz]);
// escapamento com protetor de calor
tube(0.04, chassis, [-1.3, 1.25, -0.5], [-1.3, 2.36, -0.5]);
{ const s = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.5, 24, 1, true), alu); s.position.set(-1.3, 1.95, -0.5); add(s);
  const t = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.04, 0.06, 24), chrome); t.position.set(-1.3, 2.39, -0.5); add(t); }
{ const b = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.066, 0.12, 32), lensA); b.position.set(-1.0, TOP + 0.1, 0); add(b); rbox(0.15, 0.03, 0.15, chassis, -1.0, TOP + 0.03, 0, 0.008); }
tube(0.011, coat, [0.38, TOP - 0.16, gz + 0.03], [0.5, TOP - 0.06, gz + 0.2]);
{ const m = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.018, 32), chrome); m.rotation.z = Math.PI / 2; m.position.set(0.5, TOP - 0.06, gz + 0.22); add(m);
  const h = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.02, 32), coat); h.rotation.z = Math.PI / 2; h.position.set(0.488, TOP - 0.06, gz + 0.22); add(h); }

/* ----- Mastro ----- */
const MX = 0.82, MH = 2.15, MB = 0.1;
const mastBase = new THREE.Group(); mastBase.position.set(MX, 0, 0); all.add(mastBase);
function channel(parent, x, z, h, s) {
  const sh = new THREE.Shape();
  const W = 0.11, D = 0.075, t = 0.016;
  sh.moveTo(-W / 2, 0); sh.lineTo(W / 2, 0); sh.lineTo(W / 2, D); sh.lineTo(W / 2 - t, D); sh.lineTo(W / 2 - t, t);
  sh.lineTo(-W / 2 + t, t); sh.lineTo(-W / 2 + t, D); sh.lineTo(-W / 2, D); sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 1 });
  g.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(g, steel); m.position.set(x, 0, s * z); if (s < 0) m.scale.z = -1;
  return add(m, parent);
}
function stageRails(parent, x, z, h, rollers) {
  for (const s of [1, -1]) {
    channel(parent, x, z, h, s);
    if (rollers) for (const y of [h - 0.12, h - 0.4]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 24), alu); r.rotation.x = Math.PI / 2; r.position.set(x + 0.02, y, s * (z - 0.09)); add(r, parent); }
  }
  rbox(0.07, 0.09, z * 2, steel, x - 0.01, h - 0.05, 0, 0.006, parent);
  rbox(0.05, 0.06, z * 2, steel, x - 0.02, h * 0.45, 0, 0.006, parent);
}
const stage1 = new THREE.Group(); stage1.position.y = MB; mastBase.add(stage1); stageRails(stage1, 0, 0.4, MH, false);
rbox(0.09, 0.12, 0.8, steel, -0.02, 0.1, 0, 0.008, stage1);
const stage2 = new THREE.Group(); stage2.position.y = MB; mastBase.add(stage2); stageRails(stage2, 0.05, 0.315, MH - 0.05, true);
const stage3 = new THREE.Group(); stage3.position.y = MB; mastBase.add(stage3); stageRails(stage3, 0.1, 0.23, MH - 0.1, true); named.stage3 = stage3;
for (const s of [1, -1]) { const sv = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 32), alu); sv.rotation.x = Math.PI / 2; sv.position.set(0.12, MH - 0.16, s * 0.13); add(sv, stage3); }
// cilindro de elevação
{ const b = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 1.25, 32), coat); b.position.set(-0.06, MB + 0.69, 0); add(b, mastBase); }
const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 1, 32), chrome); rod.position.set(-0.06, 0, 0); add(rod, mastBase);
// cilindros de inclinação
for (const s of [1, -1]) { tube(0.045, coat, [0.55, 0.88, s * 0.44], [0.69, 0.99, s * 0.44]); tube(0.024, chrome, [0.69, 0.99, s * 0.44], [MX - 0.03, 1.09, s * 0.44]); }
// mangueiras hidráulicas
hose([[0.56, 0.95, 0.12], [0.68, 0.85, 0.1], [0.74, 0.3, 0.06], [MX - 0.06, 0.16, 0.03]]);
hose([[0.56, 0.95, -0.12], [0.68, 0.85, -0.1], [0.74, 0.3, -0.06], [MX - 0.06, 0.16, -0.03]]);
// carro porta-garfos
const carriage = new THREE.Group(); mastBase.add(carriage); named.carriage = carriage;
const CX = 0.2;
rbox(0.05, 0.12, 1.06, steel, CX, 0.16, 0, 0.01, carriage);
rbox(0.05, 0.12, 1.06, steel, CX, 0.55, 0, 0.01, carriage);
for (const s of [1, -1]) rbox(0.05, 0.52, 0.05, steel, CX, 0.35, s * 0.5, 0.008, carriage);
for (let i = 0; i < 9; i++) bar(0.022, 0.022, steel, [CX, 0.61, -0.44 + i * 0.11], [CX, 1.3, -0.44 + i * 0.11], carriage);
bar(0.05, 0.05, steel, [CX, 1.31, 0.52], [CX, 1.31, -0.52], carriage);
bar(0.04, 0.04, steel, [CX, 0.95, 0.5], [CX, 0.95, -0.5], carriage);
for (const s of [1, -1]) bar(0.045, 0.045, steel, [CX, 0.61, s * 0.5], [CX, 1.31, s * 0.5], carriage);
{
  const sh = new THREE.Shape();
  sh.moveTo(0, 0); sh.lineTo(1.22, 0); sh.lineTo(1.22, 0.01); sh.lineTo(0.16, 0.05); sh.lineTo(0.05, 0.05);
  sh.lineTo(0.05, 0.6); sh.lineTo(0.0, 0.6); sh.lineTo(0, 0);
  const g = new THREE.ExtrudeGeometry(sh, { depth: 0.122, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.005, bevelSegments: 2 });
  for (const z of [0.31, -0.31]) { const f = new THREE.Mesh(g, fork); f.position.set(CX + 0.03, 0.0, z - 0.061); add(f, carriage); rbox(0.06, 0.08, 0.13, steel, CX + 0.02, 0.56, z, 0.008, carriage); }
}
// correntes de elevação (instanciadas)
const linkGeo = new THREE.BoxGeometry(0.024, 0.042, 0.022);
const chain = new THREE.InstancedMesh(linkGeo, steel, 900); chain.castShadow = true; chain.receiveShadow = true;
chain.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mastBase.add(chain);
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion().setFromAxisAngle(UP, Math.PI / 2), _p = new THREE.Vector3(), _s = new THREE.Vector3(1, 1, 1);
function layChains() {
  let n = 0;
  const yTopS = stage3.position.y + MH - 0.16, yCar = carriage.position.y + 0.58, yAnc = stage2.position.y + 0.3;
  for (const z of [0.13, -0.13]) for (const [x, y0, y1] of [[0.175, yCar, yTopS], [0.065, yAnc, yTopS]]) {
    for (let y = y0, k = 0; y < y1 && n < 900; y += 0.036, k++) {
      _p.set(x, y, z); _m.compose(_p, k % 2 ? _q2 : _q.identity(), _s); chain.setMatrixAt(n++, _m);
    }
  }
  chain.count = n; chain.instanceMatrix.needsUpdate = true;
}

/* =================== Piso: reflexo escurecido, luz e sombra =================== */
const FLOOR = 14;
const refl = new Reflector(new THREE.PlaneGeometry(FLOOR, FLOOR), { textureWidth: 512, textureHeight: 512, color: new THREE.Color().setRGB(0.5, 0.5, 0.5, THREE.LinearSRGBColorSpace), clipBias: 0.003, multisample: LITE ? 2 : 4 });
refl.rotation.x = -Math.PI / 2; refl.layers.set(1); scene.add(refl);
function radial(stops, size = 512) {
  const [c, g] = cv(size, size), gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) gr.addColorStop(o, col); g.fillStyle = gr; g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const overlay = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR, FLOOR), new THREE.MeshBasicMaterial({
  map: radial([[0, "rgba(24,24,27,0.9)"], [0.22, "rgba(14,14,16,0.93)"], [0.5, "rgba(4,4,5,0.97)"], [0.7, "rgba(0,0,0,1)"], [1, "rgba(0,0,0,1)"]]),
  transparent: true, depthWrite: false, toneMapped: false }));
overlay.rotation.x = -Math.PI / 2; overlay.position.set(-0.3, 0.001, 0); overlay.layers.set(1); overlay.renderOrder = 1; scene.add(overlay);
const blob = new THREE.Mesh(new THREE.PlaneGeometry(3.9, 1.7), new THREE.MeshBasicMaterial({
  map: radial([[0, "rgba(0,0,0,0.75)"], [0.6, "rgba(0,0,0,0.35)"], [1, "rgba(0,0,0,0)"]], 256), transparent: true, depthWrite: false }));
blob.rotation.x = -Math.PI / 2; blob.position.set(-0.4, 0.002, 0); blob.layers.set(1); blob.renderOrder = 2; scene.add(blob);
const shadowCatcher = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR, FLOOR), new THREE.ShadowMaterial({ opacity: 0.6 }));
shadowCatcher.rotation.x = -Math.PI / 2; shadowCatcher.position.y = 0.003; shadowCatcher.receiveShadow = true; shadowCatcher.layers.set(1); shadowCatcher.renderOrder = 3; scene.add(shadowCatcher);

/* =================== Pós-processamento =================== */
const maxS = renderer.capabilities.maxSamples || 4;
const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: Math.min(maxS, LITE ? 4 : 8) });
const composer = new EffectComposer(renderer, rt);
composer.setPixelRatio(DPR);
composer.addPass(new RenderPass(scene, camera));
const aoCam = camera.clone();
let gtao = null;
if (!LITE) {
  gtao = new GTAOPass(scene, aoCam, 1, 1);
  gtao.updateGtaoMaterial({ radius: 0.28, distanceExponent: 1.6, thickness: 1.2, scale: 1.25, samples: 16 });
  gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 5, rings: 2, samples: 16 });
  composer.addPass(gtao);
}
composer.addPass(new OutputPass());
composer.addPass(new ShaderPass({
  uniforms: { tDiffuse: { value: null }, contrast: { value: 1.08 }, sat: { value: 1.07 }, vig: { value: 0.22 } },
  vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
  fragmentShader: `uniform sampler2D tDiffuse; uniform float contrast, sat, vig; varying vec2 vUv;
    void main(){ vec3 c = texture2D(tDiffuse, vUv).rgb; float l = dot(c, vec3(0.2126,0.7152,0.0722));
      c = mix(vec3(l), c, sat); c = (c - 0.5) * contrast + 0.5; vec2 d = vUv - 0.5; c *= 1.0 - vig * dot(d, d) * 2.0;
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0); }`
}));

/* =================== Estado, câmera e animação =================== */
const CH = window.CHAPTERS;
const S = { p: new THREE.Vector3(), t: new THREE.Vector3(), lift: 0, hood: 0 };
const cur = { p: new THREE.Vector3(...CH[0].cam.p), t: new THREE.Vector3(...CH[0].cam.t), lift: -1, hood: -1 };
const ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3();
let dist = 1, shiftX = 0, shiftY = 0, dirty = 3;
function targetState() {
  const p = window.getProgress(), i = Math.min(Math.floor(p), CH.length - 2), f = p - i;
  const t = ease(Math.min(1, Math.max(0, (f - 0.22) / 0.56)));
  const a = CH[i], b = CH[i + 1];
  S.p.set(...a.cam.p).lerp(tmpA.set(...b.cam.p), t);
  S.t.set(...a.cam.t).lerp(tmpB.set(...b.cam.t), t);
  S.lift = a.lift + (b.lift - a.lift) * t;
  S.hood = a.hood + (b.hood - a.hood) * t;
  if (dist !== 1) { const off = S.p.clone().sub(S.t); S.p.copy(S.t).add(off.multiplyScalar(dist)); }
  return p;
}
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight, asp = w / h, landShort = h < 520 && asp > 1.3;
  renderer.setSize(w, h, false); composer.setSize(w, h);
  refl.getRenderTarget().setSize(Math.round(w * DPR * 0.5), Math.round(h * DPR * 0.5));
  camera.aspect = asp;
  dist = asp < 0.62 ? 1.75 : asp < 0.8 ? 1.5 : asp < 1.15 ? 1.22 : landShort ? 1.0 : asp < 1.55 ? 1.08 : 0.92;
  camera.clearViewOffset();
  if (w > 900 || landShort) camera.setViewOffset(w, h, -w * (landShort ? 0.16 : 0.15), h * 0.035, w, h);
  else camera.setViewOffset(w, h, 0, -h * (asp < 0.8 ? 0.17 : 0.13), w, h);
  camera.updateProjectionMatrix();
  dirty = 3;
}
addEventListener("resize", resize); resize();

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const pins = [...document.querySelectorAll(".pin")];
const tmp = new THREE.Vector3();
let visible = true;
new IntersectionObserver(e => { visible = e[0].isIntersecting; if (visible) dirty = 2; }).observe(stage);

function apply() {
  const L = cur.lift;
  stage2.position.y = MB + 1.3 * L;
  stage3.position.y = MB + 2.6 * L;
  carriage.position.y = 2.6 * L + 0.55 * L + 0.04;
  const len = 0.55 + 1.3 * L; rod.scale.y = len; rod.position.y = MB + 1.32 + len / 2;
  hood.rotation.z = -0.78 * cur.hood;
  camera.position.copy(cur.p); camera.lookAt(cur.t);
}
let last = performance.now(), first = true, lastLift = -9;
function frame(time) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.1, (time - last) / 1000); last = time;
  if (!visible && !first) return;
  const p = targetState();
  const k = reduce || first ? 1 : 1 - Math.exp(-dt * 5.5);
  const moving = cur.p.distanceToSquared(S.p) > 1e-7 || cur.t.distanceToSquared(S.t) > 1e-7 || Math.abs(cur.lift - S.lift) > 1e-4 || Math.abs(cur.hood - S.hood) > 1e-4;
  if (moving || dirty > 0 || first) {
    cur.p.lerp(S.p, k); cur.t.lerp(S.t, k);
    cur.lift += (S.lift - cur.lift) * k; cur.hood += (S.hood - cur.hood) * k;
    if (first) { cur.lift = S.lift; cur.hood = S.hood; }
    apply();
    if (Math.abs(cur.lift - lastLift) > 1e-4) { layChains(); lastLift = cur.lift; }
    aoCam.copy(camera); aoCam.layers.set(0);
    composer.render();
    if (dirty > 0) dirty--;
  }
  const w = stage.clientWidth, h = stage.clientHeight;
  pins.forEach(el => {
    const i = +el.dataset.i, c = CH[i], obj = named[c.pin.obj];
    tmp.set(...c.pin.off); obj.localToWorld(tmp); tmp.project(camera);
    el.style.transform = `translate(${(tmp.x + 1) / 2 * w}px, ${(1 - tmp.y) / 2 * h}px)`;
    el.style.opacity = Math.max(0, 1 - Math.abs(p - i) / 0.25);
  });
  if (first) { first = false; document.getElementById("fallback").classList.add("off"); }
}
requestAnimationFrame(frame);
