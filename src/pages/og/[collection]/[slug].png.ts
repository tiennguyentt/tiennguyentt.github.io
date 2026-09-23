import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import { SITE } from '../../../consts';

// Build-time generated Open Graph images for the site, blog posts, and work entries,
// rendered in the portfolio palette (see global.css tokens).

interface OgProps {
  title: string;
  description: string;
  kind: string;
}

export const getStaticPaths = (async () => {
  const blog = await getCollection('blog', ({ data }) => !data.draft);
  const works = await getCollection('works');
  return [
    {
      params: { collection: 'site', slug: 'portfolio' },
      props: {
        title: 'Product work, from requirements to release.',
        description:
          'Tien Nguyen works across payments, consumer products, and agentic operations.',
        kind: 'Portfolio',
      } satisfies OgProps,
    },
    ...blog.map((entry) => ({
      params: { collection: 'blog', slug: entry.id },
      props: {
        title: entry.data.title,
        description: entry.data.description,
        kind: 'Blog',
      } satisfies OgProps,
    })),
    ...works.map((entry) => ({
      params: { collection: 'works', slug: entry.id },
      props: {
        title: entry.data.title,
        description: entry.data.description,
        kind: 'Work',
      } satisfies OgProps,
    })),
  ];
}) satisfies GetStaticPaths;

// Keep these values aligned with the light-theme tokens in global.css.
const COLOR = {
  bg: '#f5f2ea',
  surface: '#fffdf8',
  text: '#0b1117',
  muted: '#59636b',
  line: '#dce0db',
  accent: '#a94e08',
  signal: '#f2a623',
};

const require = createRequire(import.meta.url);
const font = (pkgPath: string) => readFile(require.resolve(pkgPath));

// Latin subsets, to keep the build light. Satori draws any glyph these fonts
// lack as an empty box, which is why the `kind` labels above stay Latin rather
// than going through the UI dictionary — `SITE.locale = 'ja'` would otherwise
// render them as tofu in every share image. Post titles in a non-Latin script
// hit the same limit: install a face that covers them (e.g.
// `@fontsource/noto-sans-jp`) and point the paths below at it.
const [interRegular, interSemibold] = await Promise.all([
  font('@fontsource/inter/files/inter-latin-400-normal.woff'),
  font('@fontsource/inter/files/inter-latin-600-normal.woff'),
]);

const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

export const GET: APIRoute<OgProps> = async ({ props }) => {
  const { title, description, kind } = props;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: COLOR.bg,
          padding: 40,
          fontFamily: 'Inter',
        },
        children: {
          type: 'div',
          props: {
            style: {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: `1px solid ${COLOR.line}`,
              borderRadius: 24,
              backgroundColor: COLOR.surface,
              padding: '52px 60px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', gap: 16 },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: 22,
                          height: 22,
                          backgroundColor: COLOR.signal,
                          borderRadius: 4,
                        },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: 30,
                          fontWeight: 600,
                          color: COLOR.text,
                        },
                        children: SITE.title,
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column' },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          marginBottom: 28,
                          color: COLOR.accent,
                          fontSize: 24,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 4,
                        },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                width: 40,
                                height: 1,
                                backgroundColor: COLOR.accent,
                              },
                            },
                          },
                          { type: 'div', props: { children: kind } },
                        ],
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: title.length > 55 ? 54 : 64,
                          fontWeight: 600,
                          lineHeight: 1.15,
                          color: COLOR.text,
                        },
                        children: truncate(title, 90),
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 26,
                    lineHeight: 1.4,
                    color: COLOR.muted,
                  },
                  children: truncate(description, 120),
                },
              },
            ],
          },
        },
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: interSemibold, weight: 600, style: 'normal' },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
