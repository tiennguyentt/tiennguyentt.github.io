import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Mesh,
  PerspectiveCamera,
  Points,
  PointsMaterial,
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

  float hash13(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.11, 0.17, 0.13));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash13(i);
    float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash13(i + vec3(1.0, 1.0, 1.0));
    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);
    float nxy0 = mix(nx00, nx10, f.y);
    float nxy1 = mix(nx01, nx11, f.y);
    return mix(nxy0, nxy1, f.z);
  }

  float fbm(vec3 p) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      sum += amp * noise(p);
      p = p * 2.07 + vec3(0.17, 0.31, 0.13);
      amp *= 0.5;
    }
    return sum;
  }

  mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 dir = normalize(vWorld);

    vec3 p = dir;
    p.xz *= rot(uTime * 0.11);
    p.xy *= rot(uTime * 0.045 + 0.4);
    p.yz *= rot(sin(uTime * 0.07) * 0.18);

    float neb = fbm(p * 2.15);
    float neb2 = fbm(p * 3.4 + vec3(9.0, 4.0, 1.5));
    float band = exp(-pow(p.y * 3.2, 2.0));

    vec3 col = vec3(0.015, 0.01, 0.04);
    col = mix(col, vec3(0.16, 0.04, 0.34), neb);
    col = mix(col, vec3(0.04, 0.2, 0.36), neb2 * 0.7);
    col = mix(col, vec3(0.62, 0.16, 0.38), pow(neb * neb2, 1.35));
    col += vec3(0.55, 0.62, 0.95) * band * (0.22 + neb * 0.35);
    col += vec3(0.85, 0.35, 0.2) * band * neb2 * 0.12;

    float stars = smoothstep(0.93, 0.996, hash13(floor(p * 86.0)));
    float dust = smoothstep(0.97, 0.999, hash13(floor(p * 170.0 + 8.0)));
    col += vec3(0.95, 0.97, 1.0) * stars;
    col += vec3(0.7, 0.88, 1.0) * dust * 0.85;

    float sparkA = smoothstep(0.987, 0.999, hash13(floor(p * 42.0 + uTime * 0.2)));
    float sparkB = smoothstep(0.99, 1.0, hash13(floor(p * 36.0 - uTime * 0.13)));
    col += vec3(0.35, 1.0, 0.82) * sparkA;
    col += vec3(1.0, 0.38, 0.72) * sparkB;

    float ndv = abs(dot(n, vec3(0.0, 0.0, 1.0)));
    float fres = pow(1.0 - ndv, 2.6);
    col *= mix(0.52, 1.18, ndv);
    col += vec3(0.58, 0.5, 0.78) * fres * 0.38;

    vec3 light = normalize(vec3(-0.42, 0.66, 0.72));
    float spec = pow(max(dot(n, light), 0.0), 64.0);
    float sheen = pow(max(dot(n, light), 0.0), 10.0);
    col += vec3(1.0) * spec * 0.9;
    col += vec3(0.72, 0.82, 1.0) * sheen * 0.14;

    gl_FragColor = vec4(col, 1.0);
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
  const camera = new PerspectiveCamera(28, width() / height(), 0.1, 20);
  camera.position.z = 2.55;

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: { uTime: { value: 0 } },
    toneMapped: false,
  });
  const mesh = new Mesh(new SphereGeometry(1, 96, 96), material);
  scene.add(mesh);

  const sparkCount = 220;
  const positions = new Float32Array(sparkCount * 3);
  const colors = new Float32Array(sparkCount * 3);
  const palette = [
    [0.45, 1.0, 0.86],
    [1.0, 0.42, 0.72],
    [0.95, 0.96, 1.0],
    [1.0, 0.78, 0.38],
  ];
  for (let i = 0; i < sparkCount; i += 1) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const radius = 1.02 + Math.random() * 0.1;
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    const color = palette[i % palette.length];
    colors[i * 3] = color[0];
    colors[i * 3 + 1] = color[1];
    colors[i * 3 + 2] = color[2];
  }
  const sparkGeometry = new BufferGeometry();
  sparkGeometry.setAttribute('position', new BufferAttribute(positions, 3));
  sparkGeometry.setAttribute('color', new BufferAttribute(colors, 3));
  const sparkMaterial = new PointsMaterial({
    size: 0.038,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: AdditiveBlending,
    toneMapped: false,
  });
  const sparks = new Points(sparkGeometry, sparkMaterial);
  scene.add(sparks);

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
    mesh.rotation.y = t * 0.22;
    mesh.rotation.x = 0.16 + Math.sin(t * 0.11) * 0.08;
    mesh.rotation.z = Math.sin(t * 0.07) * 0.04;
    sparks.rotation.copy(mesh.rotation);
    sparks.rotation.y += t * 0.05;
    renderer.render(scene, camera);
    frame = window.requestAnimationFrame(draw);
  };

  const resize = () => {
    const nextWidth = width();
    const nextHeight = height();
    camera.aspect = nextWidth / nextHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(nextWidth, nextHeight);
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
    material.dispose();
    mesh.geometry.dispose();
    sparkGeometry.dispose();
    sparkMaterial.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
