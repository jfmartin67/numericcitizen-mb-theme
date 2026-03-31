# Numeric Citizen — Micro.blog Theme

A clean, minimal, dark-first theme for [Micro.blog](https://micro.blog), built by [Numeric Citizen](https://numericcitizen.me). It features a left sidebar layout, an animated Matrix-style background, a first-class Photos page, a full archive view, and a polished dark/light mode toggle — all without requiring any plugins.

**Current version:** 0.11.4

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Pages & Sections](#pages--sections)
- [Dark / Light Mode](#dark--light-mode)
- [Photos Page](#photos-page)
- [Archive Page](#archive-page)
- [Customisation](#customisation)
- [IndieWeb & Micro.blog Integration](#indieweb--microblog-integration)
- [Typography & Icons](#typography--icons)
- [JavaScript Features](#javascript-features)
- [Design Tokens](#design-tokens)
- [Responsive Behaviour](#responsive-behaviour)
- [Development Notes](#development-notes)

---

## Features

- **Dark-first design** — looks great in dark mode right out of the box; smooth light-mode option with a one-click toggle
- **Animated Matrix background** — subtle falling-character rain in dark mode (invisible in light mode)
- **Left sidebar navigation** — avatar, bio, about text (pulled from `/about` page), nav links, pages, categories, and theme toggle
- **Multi-view homepage** — Posts, Archive, and Photos all served from the same Hugo template with JavaScript URL-based view switching (works around Micro.blog's routing behaviour)
- **Photos page** — grid and masonry layout with a segmented control; layout preference saved in `localStorage`
- **Image lightbox** — click any post image to view it full-size
- **Image captions** — images with alt text automatically get a hover-reveal caption overlay
- **Archive page** — compact dated list of all posts at `/archive/`
- **Responsive** — single-column mobile layout with slide-in sidebar via hamburger menu
- **IndieWeb-ready** — full set of `rel=me` links, microformat markup (`h-entry`, `h-card`, `u-url`, `dt-published`, `e-content`, etc.), and Micro.blog endpoint links
- **Self-hosted fonts** — Inter (body) and Manrope (headings), no external font requests
- **Plugin-compatible** — respects all Micro.blog microhook injection points

---

## Installation

1. In Micro.blog, go to **Design → Edit Themes**
2. Click **New Theme**
3. Choose **Upload from GitHub** and enter `jfmartin67/numericcitizen-mb-theme`
4. Select the theme and click **Apply**

Micro.blog will pull the latest version automatically.

---

## Configuration

The theme reads the following site parameters. Set them in Micro.blog under **Design → Edit Custom Themes → Theme Parameters**, or in a local `config.json`:

| Parameter | Type | Description |
|-----------|------|-------------|
| `avatar` | string | URL to your avatar image. Shown in sidebar (large) and mobile top bar (small). Defaults to `/images/avatar.png` |
| `bio` | string | Short tagline shown below your name in the sidebar |
| `description` | string | Longer description; shown as fallback if no `/about` page exists |
| `mastodon_url` | string | Your Mastodon profile URL. Adds a `rel="me"` link and a footer icon |
| `bluesky_url` | string | Your Bluesky profile URL. Adds a `rel="me"` link and a footer icon |
| `show_reading_time` | bool | Show estimated reading time on posts (default: `true`) |
| `show_archive` | bool | Show the Archive link in the sidebar nav (default: `true`) |
| `favicon` | string | URL to your favicon |
| `plugins_css` | list | Micro.blog plugin stylesheets (auto-managed by Micro.blog) |
| `plugins_html` | list | Micro.blog plugin HTML partials (auto-managed by Micro.blog) |

### About Text in Sidebar

The sidebar pulls the "About" blurb from the first source it finds:

1. The content of your `/about` page
2. `site.Params.description`
3. `site.Params.bio`

---

## Pages & Sections

### Posts (homepage — `/`)

Recent posts in reverse-chronological order, 10 per page. Short posts (microblog entries without a title) display inline. Long posts show a title, content, date, reading time, categories, and a permalink.

### Archive (`/archive/`)

A full chronological list of all posts as `Date — Title (or excerpt)`. Enable in Micro.blog under **Pages** and ensure an `archive.md` content file exists with `type: archive`.

### Photos (`/photos/`)

A photo grid of all image posts. Requires enabling **Photos** in Micro.blog → Settings → Pages. See [Photos Page](#photos-page) for details.

### Search (`/search/`)

If you enable the Search page in Micro.blog, a search link automatically appears at the bottom of the sidebar Pages section.

### Custom Pages

Any root-level page you create (About, Now, Uses, etc.) appears automatically in the **Pages** section of the sidebar. The `/archive/` and `/search/` pages are excluded from this list — they get their own dedicated sidebar placement.

### Categories

All categories appear in the sidebar under a **Categories** section with post counts. The `Newsletter` category is filtered out of all displays (sidebar, post footers, category pages) — if you send newsletters via Micro.blog, they stay hidden from the main site.

---

## Dark / Light Mode

The theme is dark by default. Theme preference is stored in `localStorage` under the key `nc-theme`.

**How it works:**

1. An inline script in `<head>` reads `localStorage` and applies `.nc-light` or `.nc-dark` to `<html>` *before* the page renders, preventing any flash of wrong theme
2. Without a saved preference, the theme respects `prefers-color-scheme` (OS setting)
3. Clicking the **sun/moon toggle** at the bottom of the sidebar saves the preference explicitly

**CSS cascade (highest wins):**
- `html.nc-dark { … }` — explicit dark override
- `html.nc-light { … }` — explicit light override
- `@media (prefers-color-scheme: light)` — system preference (if no explicit override)
- `:root { … }` — dark mode defaults

The Matrix animation background is visible only in dark mode (opacity ~14%); it fades to fully transparent in light mode.

---

## Photos Page

The Photos page at `/photos/` displays all posts that contain images in a responsive photo grid.

### Enabling the Photos Page

1. In Micro.blog, go to **Settings → Pages**
2. Enable the **Photos** page

A `/photos/` link will appear in the **Pages** section of the sidebar automatically.

### Layout Modes

Use the segmented control in the page header to switch between:

| Mode | Description |
|------|-------------|
| **Grid** | Equal-size square tiles in a responsive grid (auto-fill, min 200px per column) |
| **Masonry** | Natural-aspect-ratio columns using CSS `columns` |

Your layout preference is saved in `localStorage` under `nc-photos-layout` and restored on next visit.

### Mobile Layout

- Grid: 3 columns
- Masonry: 2 columns

### How Photos Are Sourced

The theme reads photo URLs from the Micro.blog-populated `.Params.photos` front matter field, which is automatically added to any post containing images.

---

## Archive Page

The Archive page shows a complete dated list of all posts, newest first. Each entry shows:

```
Jan 02, 2006   Post Title (or truncated excerpt for untitled posts)
```

Replies (posts in a `replies` section) are excluded.

---

## Customisation

### Custom CSS

Micro.blog injects a `custom.css` file that overrides anything in the theme stylesheet. Go to **Design → Edit CSS** to add your own rules. Changes there survive theme updates.

### Design Tokens

The theme's visual language is controlled by CSS custom properties. Override any of them in your `custom.css`:

```css
:root {
  --radius: 8px;           /* Base border radius */
  --image-radius: 4px;     /* Image-specific radius (defaults to --radius) */
  --sidebar-width: 240px;  /* Sidebar width on desktop */
  --content-max: 700px;    /* Max width of the main content area */
  --accent: #ff6600;       /* Link and accent colour */
}
```

See [Design Tokens](#design-tokens) below for the full list.

### Disabling the Matrix Background

Add this to your custom CSS:

```css
#matrix-canvas { display: none; }
```

### Square Image Corners

Images use `--image-radius` independently of `--radius`, so you can keep rounded cards while making images perfectly square:

```css
:root {
  --image-radius: 0px;
}
```

---

## IndieWeb & Micro.blog Integration

### Endpoints (in `<head>`)

| Endpoint | URL |
|----------|-----|
| `authorization_endpoint` | `https://micro.blog/indieauth/auth` |
| `token_endpoint` | `https://micro.blog/indieauth/token` |
| `rel="micropub"` | `https://micro.blog/micropub` |
| `rel="webmention"` | `https://micro.blog/webmention` |
| `rel="pingback"` | `https://micro.blog/pingback` |

### Microformats

Posts are marked up as `h-entry` with `e-content`, `dt-published`, `u-url`, `p-name`, `p-category`, `p-summary`, and `u-photo`. The footer includes an `h-card` credit.

### Feeds

Both RSS (`/feed.xml`) and JSON Feed (`/feed.json`) alternate links are included in `<head>`.

### Microhook Injection Points

The theme includes all standard Micro.blog microhook partials for plugin compatibility:

| Hook | Purpose |
|------|---------|
| `microhook-navigation.html` | Inject items before the sidebar nav links |
| `microhook-before-post.html` | Inject content before each post |
| `microhook-after-post.html` | Conversation link, reply links, Micro.blog reply/conversation scripts |
| `microhook-post-byline.html` | Extend the post byline area |
| `microhook-categories.html` | Extend category display |
| `microhook-footer.html` | Ko-fi widget (included by default) |

---

## Typography & Icons

### Fonts

Both fonts are self-hosted as `.woff2` files — no external font requests:

| Font | Usage | Weights |
|------|-------|---------|
| **Inter** | Body text, UI | 400, 600 |
| **Manrope** | Headings | 600, 700 |

### Font Awesome

Icons are loaded from the Font Awesome 6.7.2 CDN. Icons used throughout the theme:

| Icon | Used For |
|------|----------|
| `fa-solid fa-newspaper` | Posts nav link |
| `fa-solid fa-box-archive` | Archive nav link |
| `fa-solid fa-file-lines` | Pages section label |
| `fa-solid fa-tags` | Categories section label |
| `fa-solid fa-magnifying-glass` | Search link |
| `fa-solid fa-chevron-left / right` | Pagination buttons |
| `fa-solid fa-link` | Permalink icon |
| `fa-regular fa-calendar` | Post date |
| `fa-regular fa-clock` | Reading time |
| `fa-brands fa-mastodon` | Mastodon footer link |
| `fa-brands fa-bluesky` | Bluesky footer link |

---

## JavaScript Features

All JavaScript runs as self-contained IIFEs (no dependencies, no build step).

### `theme.js`

| Feature | Description |
|---------|-------------|
| **Hamburger menu** | Toggles slide-in sidebar on mobile; closes on backdrop click, Escape key, or nav link click |
| **Archive view swap** | On `/archive/`, hides the posts view and shows the archive list |
| **Archive nav active state** | Fixes active link highlight for `/archive/` (Micro.blog serves homepage HTML there) |
| **Photos view swap** | On `/photos/`, hides the posts view and shows the photos grid |
| **Photos nav active state** | Fixes active link highlight for `/photos/` |
| **Image lightbox** | Click any post image to open it full-size in an accessible overlay dialog |
| **Image alt-text captions** | Wraps images that have alt text in a `.nc-image-wrap` div; caption reveals on hover |
| **Theme toggle** | Switches between dark and light mode; persists preference in `localStorage` |
| **Photos layout toggle** | Switches photos grid between Grid and Masonry modes; persists in `localStorage` |

### `matrix.js`

Renders a Matrix-style falling-characters animation on a full-page `<canvas>` element behind all content. The character set blends standard alphanumerics with mathematical symbols (ℕ ℝ ℤ Δ ⊕ ⊗ ∇ ∞ ≈ ≠ ± × ÷).

- Visible only in dark mode (~14% opacity); fully transparent in light mode
- Responds to theme changes in real time via `MutationObserver`
- Adapts to window resize
- Renders at ~10 fps to minimise CPU usage

---

## Design Tokens

Complete list of CSS custom properties defined in `style.css`:

| Token | Dark value | Light value | Purpose |
|-------|-----------|------------|---------|
| `--bg` | `#0f0f0f` | `#fafafa` | Page background |
| `--bg-surface` | `#1a1a1a` | `#f3f3f3` | Cards, code blocks, sidebar surface |
| `--border` | `#2a2a2a` | `#e0e0e0` | Dividers, borders |
| `--text` | `#e2e2e2` | `#1a1a1a` | Primary text |
| `--text-muted` | `#888` | `#666` | Secondary text, metadata |
| `--accent` | `#007aff` | `#007aff` | Links, active states |
| `--accent-hover` | `#3395ff` | `#005ecb` | Link hover |
| `--accent-visited` | `#3d6fa8` | `#1a4d88` | Visited links |
| `--radius` | `6px` | `6px` | Base border radius |
| `--image-radius` | *(= `--radius`)* | *(= `--radius`)* | Image border radius (overridable) |
| `--sidebar-width` | `220px` | `220px` | Desktop sidebar width |
| `--content-max` | `660px` | `660px` | Main content max-width |
| `--font-sans` | Inter, system stack | — | Body font |
| `--font-heading` | Manrope, system stack | — | Heading font |
| `--font-mono` | System monospace stack | — | Code font |

---

## Responsive Behaviour

| Viewport | Layout |
|----------|--------|
| **≥ 701px** | Two-column: 220px fixed sidebar + flexible main content |
| **≤ 700px** | Single column; fixed 56px top bar with site title and hamburger; sidebar slides in on demand with a dimming backdrop |

Photos grid adapts independently:

| Mode | Desktop | Mobile |
|------|---------|--------|
| Grid | `auto-fill`, min 200px columns | 3 fixed columns |
| Masonry | 3 CSS columns | 2 CSS columns |

---

## Development Notes

### Version Bumping

Three files must be updated together when bumping the theme version:

- `plugin.json` — `"version"` field
- `layouts/_default/baseof.html` — fallback version string in `?v=` query params
- `layouts/partials/head.html` — fallback version string in `?v=` query param

### Why Homepage-Embedded Views?

Micro.blog serves the homepage HTML at special URLs like `/archive/` and `/photos/`, regardless of what Hugo template files exist. The only reliable solution is to embed all views in `index.html` and use JavaScript URL detection to show the correct one. This is the same pattern used by the official Micro.blog plugins.

### Micro.blog Hugo Version

Micro.blog runs Hugo 0.158.0. All template features are constrained to that version.

### Newsletter Category Filtering

`Newsletter` is excluded from all category displays throughout the theme (sidebar list, post footers, taxonomy pages). This matches Micro.blog's convention of using the `Newsletter` category for email newsletters, which should not appear as regular site content.

---

## License

MIT — feel free to fork, adapt, or build on this theme for your own Micro.blog.
