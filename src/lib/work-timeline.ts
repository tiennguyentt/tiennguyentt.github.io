export function mountWorkTimeline(root: ParentNode, reduced: boolean): () => void {
  const timeline = root.querySelector<HTMLElement>('[data-work-timeline]');
  if (!timeline) return () => {};

  const items = [...timeline.querySelectorAll<HTMLElement>('.work-timeline__item')];
  if (items.length === 0) return () => {};

  const setActive = (active: HTMLElement | null) => {
    for (const item of items) {
      item.classList.toggle('is-active', item === active);
    }
  };

  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
      }
    },
    { root: null, threshold: 0.22, rootMargin: '0px 0px -8% 0px' },
  );

  for (const item of items) revealObserver.observe(item);

  if (reduced) {
    for (const item of items) item.classList.add('is-visible');
    if (items[0]) setActive(items[0]);
    return () => revealObserver.disconnect();
  }

  let activeItem: HTMLElement | null = items[0] ?? null;
  setActive(activeItem);

  const activeObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      const next = (visible[0]?.target as HTMLElement | undefined) ?? activeItem;
      if (!next || next === activeItem) return;
      activeItem = next;
      setActive(activeItem);
    },
    { root: null, threshold: [0.35, 0.55, 0.75], rootMargin: '-20% 0px -35% 0px' },
  );

  for (const item of items) activeObserver.observe(item);

  return () => {
    revealObserver.disconnect();
    activeObserver.disconnect();
  };
}
