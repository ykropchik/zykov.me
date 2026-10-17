# zykov.me

My personal website: a short, honest page about who I am, how I work and where to find me.

**Live:** [zykov.me](https://zykov.me)

<img src="/docs/demo.gif" width="576" height="360"/>

## Stack

- **React 19** and **TypeScript**
- **Vite**, with static pre-rendering via [vite-react-ssg](https://github.com/Daydreamer-riri/vite-react-ssg): the page ships as ready HTML, then hydrates
- **Motion** for animations, loaded lazily (`LazyMotion` + `domAnimation`) to keep the bundle small
- **SCSS modules** for styles
- **ESLint** and **Stylelint**
- Hosted on **Cloudflare Workers** (static assets)

## Details worth a look

- **Section pager.** The page is split into sections, and scrolling at a section's edge turns the page, while scrolling inside a section still scrolls its content. Trackpad inertia is handled by treating each burst of wheel or touch events as one gesture, so a single swipe never skips two sections. See [`src/hooks/useSectionPager.ts`](src/hooks/useSectionPager.ts).
- **Reduced motion.** Animations respect the system "reduce motion" setting (`MotionConfig reducedMotion="user"`).
- **Keyboard navigation.** Arrow keys move between sections, except while focus is in a form field.

## Running locally

```bash
npm install
npm run dev        # dev server
npm run build      # type-check and pre-render to dist/
npm run preview    # serve the built site
npm run lint-js    # ESLint
npm run lint-styles  # Stylelint
```

## Deploy

The built `dist/` folder is served by Cloudflare Workers as static assets (see [`wrangler.jsonc`](wrangler.jsonc)):

```bash
npm run build
npx wrangler deploy
```
