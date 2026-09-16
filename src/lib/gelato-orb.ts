import {
  AdditiveBlending,
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  TorusKnotGeometry,
  WebGLRenderer,
} from 'three';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

/** Site palette: ink, accent red, card surface. */
const INK = 0x171717;
const ACCENT = 0xe31937;
const PEARL = 0xf8f8f6;

export function mountGelatoOrb(host: HTMLElement): () => void {
  const width = () => Math.max(host.clientWidth, 1);
  const height = () => Math.max(host.clientHeight, 1);

  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width(), height());
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  scene.background = null;

  const camera = new PerspectiveCamera(34, width() / height(), 0.1, 40);
  camera.position.set(0, 0, 3.4);

  const rig = new Group();
  scene.add(rig);

  const geometry = new TorusKnotGeometry(0.62, 0.19, 160, 24);
  const material = new MeshPhysicalMaterial({
    color: new Color(PEARL),
    emissive: new Color(ACCENT),
    emissiveIntensity: 0.08,
    metalness: 0.35,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    reflectivity: 0.9,
  });
  const knot = new Mesh(geometry, material);
  rig.add(knot);

  const accentShell = new Mesh(
    geometry.clone(),
    new MeshPhysicalMaterial({
      color: new Color(ACCENT),
      transparent: true,
      opacity: 0.14,
      metalness: 0.6,
      roughness: 0.08,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
  accentShell.scale.setScalar(1.04);
  rig.add(accentShell);

  const ambient = new AmbientLight(0xffffff, 1.15);
  scene.add(ambient);

  const key = new DirectionalLight(0xffffff, 1.4);
  key.position.set(2.5, 3, 4);
  scene.add(key);

  const fill = new DirectionalLight(0xf4f4f2, 0.55);
  fill.position.set(-3, -1, 2);
  scene.add(fill);

  const rim = new DirectionalLight(ACCENT, 1.1);
  rim.position.set(-2.5, 1.5, -3);
  scene.add(rim);

  const inkRim = new DirectionalLight(INK, 0.35);
  inkRim.position.set(0, -3, 1);
  scene.add(inkRim);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const afterimagePass = new AfterimagePass(0.86);
  composer.addPass(afterimagePass);
  composer.addPass(new OutputPass());

  const started = performance.now();
  let frame = 0;
  let stopped = false;
  let inView = true;

  const draw = () => {
    if (stopped) return;
    if (!inView) {
      frame = 0;
      return;
    }

    const t = (performance.now() - started) / 1000;
    rig.rotation.x = t * 0.38 + 0.2;
    rig.rotation.y = t * 0.52;
    rig.rotation.z = Math.sin(t * 0.31) * 0.12;
    material.emissiveIntensity = 0.06 + Math.sin(t * 1.4) * 0.04;

    composer.render();
    frame = window.requestAnimationFrame(draw);
  };

  const resize = () => {
    const w = width();
    const h = height();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
  };

  const onVisibility = () => {
    if (document.hidden) {
      inView = false;
      return;
    }
    if (!inView) {
      inView = true;
      draw();
    }
  };

  const observer = new ResizeObserver(resize);
  observer.observe(host);

  const viewObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];
    const next = Boolean(entry?.isIntersecting);
    if (next && !inView) {
      inView = true;
      draw();
      return;
    }
    inView = next;
  });
  viewObserver.observe(host);

  document.addEventListener('visibilitychange', onVisibility);
  draw();

  return () => {
    stopped = true;
    window.cancelAnimationFrame(frame);
    document.removeEventListener('visibilitychange', onVisibility);
    observer.disconnect();
    viewObserver.disconnect();
    geometry.dispose();
    material.dispose();
    accentShell.geometry.dispose();
    (accentShell.material as MeshPhysicalMaterial).dispose();
    composer.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
