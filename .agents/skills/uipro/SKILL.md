---
name: uipro
description: A skill for scaffolding, generating, and managing premium UI components and pages using the UIPro workflow powered by Antigravity AI. Use this skill when the user runs `uipro init --ai antigravity` or asks to generate/scaffold UI components, pages, or sections via UIPro.
---

# UIPro — AI-Powered UI Scaffolding

UIPro is a premium UI scaffolding assistant powered by Antigravity. It helps you rapidly generate, scaffold, and manage beautiful, production-ready UI components and full pages for your web projects.

## Trigger Command

```bash
uipro init --ai antigravity
```

Running this command (or asking Antigravity to run it) initializes UIPro in your project and begins the interactive scaffolding flow.

---

## Initialization Checklist

When `uipro init --ai antigravity` is invoked, follow these steps in order:

### 1. Detect Project Stack

Identify the current tech stack by checking:
- `package.json` for frameworks (React, Vue, Next.js, Svelte, Vite, etc.)
- Existing CSS approach (Vanilla CSS, Tailwind, CSS Modules, Styled Components)
- Existing component structure under `src/`

Report what was detected to the user before proceeding.

### 2. Confirm Design Tokens

Ask the user (or infer from existing CSS) the following design tokens that will govern all generated components:

| Token | Description |
|---|---|
| `--color-primary` | Main brand color |
| `--color-bg` | Background color |
| `--color-text` | Primary text color |
| `--font-heading` | Heading font family |
| `--font-body` | Body font family |
| `--radius` | Default border radius |

If a global CSS file (e.g., `index.css` or `App.css`) already defines these, extract and reuse them.

### 3. Scaffold the Requested Component or Page

Based on the user's request, generate the component using the following standards:

#### Component Quality Standards
- **Animations**: Use GSAP for entrance animations and scroll-triggered effects (`ScrollTrigger`). Use `useGSAP` hook for React projects.
- **Typography**: Use Google Fonts (Inter, Outfit, or Roboto) unless the project already defines fonts.
- **Responsiveness**: All components must be fully responsive — mobile-first breakpoints at `480px`, `768px`, `1024px`.
- **Accessibility**: Include `aria-label`, `role`, and semantic HTML elements.
- **No placeholders**: Use `generate_image` to create real images when visuals are needed.
- **Premium aesthetics**: Glassmorphism, subtle gradients, micro-animations, hover effects — never plain or minimal.

#### File Naming Convention
- Components: `ComponentName.jsx` + `ComponentName.css`
- Place inside `src/` or `src/components/` (match existing project structure)

### 4. Register the Component

After generating the files:
- Import the component in the appropriate parent file (e.g., `App.jsx`)
- Ensure the component is rendered in the correct position in the page layout
- If data-driven, add the required JSON shape to `public/data.json`

### 5. Verify

After scaffolding:
- Confirm the dev server (e.g., `npm run dev`) compiles without errors
- Check the browser to ensure the component renders correctly
- Fix any parse errors or missing imports before reporting completion

---

## Supported Component Types

UIPro can generate the following out of the box:

| Command Intent | What Gets Generated |
|---|---|
| `hero` | Full-screen hero section with headline, CTA, and background |
| `navbar` | Sticky/animated navigation bar with mobile menu |
| `about` | About/company section with image, text, and GSAP animations |
| `services` | Services grid or carousel with icon cards |
| `testimonials` | Testimonials slider or grid |
| `contact` | Contact form with validation and animations |
| `footer` | Full footer with links, socials, and branding |
| `page` | Full page scaffold combining multiple components |

---

## Usage Examples

```bash
# Initialize UIPro with Antigravity AI
uipro init --ai antigravity

# After init, you can ask:
"Generate a hero section"
"Scaffold a services carousel"
"Add a testimonials section"
"Create a full landing page"
```

---

## Design Principles

All UIPro-generated components follow these non-negotiable design principles:

1. **No generic colors** — Use curated HSL palettes, never plain red/blue/green
2. **Motion-first** — Every component has at least one GSAP entrance animation
3. **Dark-mode ready** — CSS variables make switching trivial
4. **Premium feel** — Shadows, gradients, glassmorphism where appropriate
5. **Data-driven** — Components read from `public/data.json` for easy content updates
6. **Zero placeholders** — Real images generated via `generate_image` tool

---

## Common Issues

- **GSAP parse error**: Ensure all `import` statements are complete (no dangling `import ` lines)
- **Empty JSX expressions**: Never use `src={}` — use `src=""` or a real value
- **ScrollTrigger not working**: Always call `gsap.registerPlugin(ScrollTrigger)` at the top level, outside components
- **Font not loading**: Add the Google Fonts `<link>` tag to `index.html` before using font variables
