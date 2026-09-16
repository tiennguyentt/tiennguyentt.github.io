import {
  Clock,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorld;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorld;
  uniform float uTime;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 dir = normalize(vWorld);
    float stars = smoothstep(0.985, 0.997, hash(floor(dir * 90.0)));
    float rim = pow(1.0 - abs(dot(n, vec3(0.0, 0.0, 1.0))), 2.2);
    float pole = smoothstep(0.15, 0.85, abs(dir.y));
    vec3 nebula = mix(vec3(0.08, 0.04, 0.16), vec3(0.22, 0.08, 0.42), pole);
    nebula += vec3(0.55, 0.12, 0.18) * rim * 0.35;
    nebula += vec3(0.95, 0.97, 1.0) * stars;
    float spec = pow(max(dot(n, normalize(vec3(-0.4, 0.6, 0.7))), 0.0), 48.0);
    nebula += vec3(1.0) * spec * 0.55;
    nebula += 0.04 * sin(uTime * 0.25);
    gl_FragColor = vec4(nebula, 1.0);
  }
`;

export function mountGelatoOrb(host: HTMLElement): () => void {
  const width = () => Math.max(host.clientWidth, 1);
  const height = () => Math.max(host.clientHeight, 1);

  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width(), height());
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, width() / height(), 0.1, 20);
  camera.position.z = 3.15;

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: { uTime: { value: 0 } },
  });
  const mesh = new Mesh(new SphereGeometry(1, 64, 64), material);
  scene.add(mesh);

  const clock = new Clock();
  let frame = 0;
  let stopped = false;

  const draw = () => {
    if (stopped) return;
    const t = clock.getElapsedTime();
    material.uniforms.uTime.value = t;
    mesh.rotation.y = t * 0.12;
    mesh.rotation.x = 0.18 + Math.sin(t * 0.08) * 0.04;
    renderer.render(scene, camera);
    frame = window.requestAnimationFrame(draw);
  };

  const resize = () => {
    const w = width();
    const h = height();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  const observer = new ResizeObserver(resize);
  observer.observe(host);
  draw();

  return () => {
    stopped = true;
    window.cancelAnimationFrame(frame);
    observer.disconnect();
    material.dispose();
    mesh.geometry.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
