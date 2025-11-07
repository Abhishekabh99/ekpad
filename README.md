# Ekpad — Neon Gaming Story Pad

Ekpad is a Next.js 15 + TypeScript + Tailwind CSS landing experience inspired by neon-lit esports arenas. The scaffold is designed as an MVP landing for “Ekpad — one pad for every gamer’s story.”

## Stack

- [Next.js 15](https://nextjs.org/) with the App Router and `src/` directory
- TypeScript + ESLint
- Tailwind CSS with a dark neon token system
- [shadcn/ui](https://ui.shadcn.com) primitives (button, card, navigation menu, badge, input, avatar, dropdown)
- [Framer Motion](https://www.framer.com/motion/) for motion design
- [Lucide Icons](https://lucide.dev)

## Development

> **Note:** Package installation requires access to the npm registry. If the registry is unavailable you may need to configure an internal mirror before running the commands below.

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to see the neon landing page.

## Project structure

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    Navbar.tsx
    NeonButton.tsx
    GlitchButton.tsx
    FeatureCard.tsx
    ui/
      *.tsx (shadcn/ui primitives)
  lib/
    utils.ts
```

## License

MIT © Ekpad
