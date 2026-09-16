import {
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';

/**
 * xAI Voice-style glass marble: dark core, sparse stars, chromatic rim.
 * Sits on the light #f4f4f2 card like the reference, not a metallic knot or nebula slop.
 */
const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vec3 n = normalize(normalMatrix * normal);
    vNormal = n;
    vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-viewPos.xyz);
    gl_Position = projectionMatrix * viewPos;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  uniform float uTime;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }

  float starField(vec3 dir, float scale) {
    vec3 cell = floor(dir * scale);
    float h = hash21(cell.xy + cell.z * 0.17);
    return smoothstep(0.992, 0.999, h);
  }

  vec3 marbleColor(vec3 n, vec3 v, float t) {
    vec3 dir = normalize(n);
    dir.xz *= mat2(cos(t * 0.04), -sin(t * 0.04), sin(t * 0.04), cos(t * 0.04));

    vec3 base = vec3(0.045, 0.045, 0.05);
    float stars = starField(dir, 95.0) * 0.55;
    float dust = starField(dir + vec3(1.7, 0.4, 2.1), 140.0) * 0.25;
    base += vec3(0.92, 0.94, 0.98) * (stars + dust);

    float ndv = max(dot(n, v), 0.0);
    float fres = pow(1.0 - ndv, 3.2);

    vec3 rimR = vec3(0.89, 0.1, 0.22);
    vec3 rimG = vec3(0.12, 0.78, 0.52);
    vec3 rimB = vec3(0.22, 0.42, 0.95);
    base += rimR * fres * 0.22;
    base += rimG * fres * 0.1;
    base += rimB * fres * 0.16;

    vec3 light = normalize(vec3(-0.55, 0.72, 0.85));
    float spec = pow(max(dot(reflect(-v, n), light), 0.0), 72.0);
    float sheen = pow(max(dot(n, light), 0.0), 8.0);
    base += vec3(1.0) * spec * 0.95;
    base += vec3(0.95, 0.97, 1.0) * sheen * 0.08;

    base = mix(base * 0.72, base, ndv);
    return base;
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);
    gl_FragColor = vec4(marbleColor(n, v, uTime), 1.0);
  }
`;

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
  const camera = new PerspectiveCamera(30, width() / height(), 0.1, 20);
  camera.position.z = 2.85;

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: { uTime: { value: 0 } },
  });
  const mesh = new Mesh(new SphereGeometry(1, 96, 96), material);
  scene.add(mesh);

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
    material.uniforms.uTime.value = t;
    mesh.rotation.y = t * 0.14;
    mesh.rotation.x = 0.12 + Math.sin(t * 0.09) * 0.03;
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
    const next = Boolean(entries[0]?.isIntersecting);
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
    material.dispose();
    mesh.geometry.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
