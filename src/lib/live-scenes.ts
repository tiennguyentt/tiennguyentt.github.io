export type LiveKind = 'chat' | 'build' | 'bot' | 'plane';

export function mountLiveScenes(root: ParentNode, reduced: boolean): () => void {
  const stops: Array<() => void> = [];

  for (const host of root.querySelectorAll<HTMLElement>('[data-live]')) {
    const kind = parseLiveKind(host.dataset.live);
    if (kind === null) continue;

    switch (kind) {
      case 'chat':
        stops.push(mountChat(host, reduced));
        break;
      case 'build':
        stops.push(mountBuild(host, reduced));
        break;
      case 'bot':
        stops.push(mountBot(host, reduced));
        break;
      case 'plane':
        stops.push(mountPlane(host, reduced));
        break;
      default: {
        const _never: never = kind;
        void _never;
      }
    }
  }

  return () => {
    for (const stop of stops) stop();
  };
}

function parseLiveKind(value: string | undefined): LiveKind | null {
  switch (value) {
    case 'chat':
    case 'build':
    case 'bot':
    case 'plane':
      return value;
    default:
      return null;
  }
}

function mountChat(host: HTMLElement, reduced: boolean): () => void {
  const live = host.querySelector<HTMLElement>('.scene-live');
  const script = host.querySelector('.scene-script');
  if (!live || !script) return () => {};

  const messages = [...script.children] as HTMLElement[];
  if (messages.length === 0) return () => {};

  const windowSize = Math.min(3, messages.length);
  let index = 0;
  let timer = 0;

  const paint = (entering: boolean) => {
    live.replaceChildren();
    for (let offset = 0; offset < windowSize; offset += 1) {
      const node = messages[(index + offset) % messages.length].cloneNode(true) as HTMLElement;
      node.removeAttribute('hidden');
      if (entering && offset === windowSize - 1) node.classList.add('is-enter');
      live.append(node);
    }
  };

  paint(false);
  if (reduced) return () => {};

  timer = window.setInterval(() => {
    index = (index + 1) % messages.length;
    paint(true);
  }, 2200);

  return () => window.clearInterval(timer);
}

function mountBuild(host: HTMLElement, reduced: boolean): () => void {
  const live = host.querySelector<HTMLElement>('.scene-live');
  const frames = [...host.querySelectorAll<HTMLElement>('.scene-script [data-frame]')];
  if (!live || frames.length === 0) return () => {};

  let frame = 0;
  let timeout = 0;
  let stopped = false;

  const show = (frameIndex: number, animate: boolean) => {
    const lines = [...frames[frameIndex].children];
    if (!animate) {
      live.replaceChildren(...lines.map((node) => node.cloneNode(true)));
      return;
    }

    live.replaceChildren();
    let line = 0;
    const add = () => {
      if (stopped) return;
      if (line >= lines.length) return;
      const node = lines[line].cloneNode(true) as HTMLElement;
      node.classList.add('is-enter');
      live.append(node);
      line += 1;
      timeout = window.setTimeout(add, 280);
    };
    add();
  };

  show(0, false);
  if (reduced) return () => {};

  const cycle = () => {
    const lineCount = frames[frame].childElementCount;
    const playMs = lineCount * 280;
    timeout = window.setTimeout(() => {
      if (stopped) return;
      frame = (frame + 1) % frames.length;
      show(frame, true);
      cycle();
    }, playMs + 2000);
  };
  cycle();

  return () => {
    stopped = true;
    window.clearTimeout(timeout);
  };
}

function mountBot(host: HTMLElement, reduced: boolean): () => void {
  const frames = [...host.querySelectorAll<HTMLElement>(':scope > .scene-frame')];
  if (frames.length === 0) return () => {};

  frames.forEach((frame, index) => {
    frame.classList.toggle('is-active', index === 0);
  });
  if (reduced || frames.length < 2) return () => {};

  let index = 0;
  const timer = window.setInterval(() => {
    frames[index].classList.remove('is-active');
    index = (index + 1) % frames.length;
    frames[index].classList.add('is-active');
  }, 3800);

  return () => window.clearInterval(timer);
}

function mountPlane(host: HTMLElement, reduced: boolean): () => void {
  const detail = host.querySelector<HTMLElement>('.scene-live');
  const rows = [...host.querySelectorAll<HTMLElement>('.plane-row')];
  const frames = [...host.querySelectorAll<HTMLElement>('.scene-script [data-frame]')];
  if (!detail || rows.length === 0 || frames.length === 0) return () => {};

  let frameIndex = 0;

  const paint = (index: number, animate: boolean) => {
    const frame = frames[index];
    const routeId = frame?.dataset.frame ?? '';
    detail.textContent = frame?.textContent ?? '';
    if (animate) detail.classList.add('is-enter');
    else detail.classList.remove('is-enter');

    for (const row of rows) {
      row.classList.toggle('is-active', row.dataset.route === routeId);
    }
  };

  paint(0, false);
  if (reduced) return () => {};

  const timer = window.setInterval(() => {
    frameIndex = (frameIndex + 1) % frames.length;
    paint(frameIndex, true);
    window.setTimeout(() => detail.classList.remove('is-enter'), 480);
  }, 3200);

  return () => window.clearInterval(timer);
}
