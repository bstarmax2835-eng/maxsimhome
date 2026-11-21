# Home Decor Style Quiz

A static, English quiz: 7 questions, 6 result pages (Japandi, Modern Minimalist, Boho, Scandinavian, Classic / Vintage, Industrial), each with tips, a "More home inspo" button (Linktree) and affiliate product cards. No server, no framework.

Design: `docs/superpowers/specs/2026-11-20-decor-quiz-design.md`. Plan: `docs/superpowers/plans/2026-11-20-decor-quiz.md`.

## Commands

```bash
npm install        # once
npm test           # unit tests (node:test)
npm run build      # writes the site to dist/
npx serve dist     # preview at http://localhost:3000
```

Open the site through a server, not by double-clicking `index.html`: the quiz loads its data with `fetch`.

## Set your real domain

Share links and Open Graph tags need an absolute URL. Build with your domain:

```bash
SITE_URL=https://your-domain.com npm run build
```

Or change `siteUrl` in `data/site.json`. The build warns while it is still `https://example.com`.

## Add affiliate links

Every product card links to an Amazon search for that product (for example "Rattan storage basket boho"), so the quiz ends with working Amazon links from day one.

1. Set `amazonTag` in `data/site.json` to your Amazon Associates tracking ID (like `yourname-20`) and rebuild. It is appended to every generated link. Without it the links work but earn nothing.
2. To point a card at one exact product, set `url` on it in `data/products.json` (your Amazon SiteStripe or amzn.to link). A `url` always wins over the generated search link.
3. To show a product photo on its card, add `"image": "https://..."` to the product. Without it the card shows a colored label. Use image links from Amazon's own tools (SiteStripe "Image" option or the Product Advertising API); Amazon's Associates terms don't allow saving their photos and hosting them yourself.
4. To change what the generated search looks for, add `"query": "moroccan leather pouf"` to a product. Titles and categories are placeholders: edit them, add more, or remove some (each style page shows up to 8).

The footer disclosure ("As an affiliate, I earn from qualifying purchases.") is on every page; keep it. Amazon Associates also expects a number of qualifying sales within roughly the first 180 days of approval (check Amazon's current terms), so start posting content soon after you apply.

## Add the email box

Set `emailFormAction` in `data/site.json` to your email service's form endpoint (Mailchimp, ConvertKit, etc.) and rebuild. While it is empty, the email box is left out on purpose: a form with nowhere to send would collect nothing.

## Images

The site works with zero images: every card falls back to a generated colored card. To use real images, put files in `public/images/` with these exact names (jpg, png or webp), then rebuild.

- **Option images** (4:3, about 800×600): `q{N}-{a-f}.jpg` for questions 1, 3, 4, 5, 6 and 7. The letter follows the style order: `a` Japandi, `b` Modern Minimalist, `c` Boho, `d` Scandinavian, `e` Classic / Vintage, `f` Industrial. Example: `q1-a.jpg` is the "tea house" option, `q5-f.jpg` is "exposed bulbs". Question 2 (palette) uses drawn color stripes and needs no photos; question 8 (budget) is text.
- **Style images** (16:10, about 1600×1000): `style-japandi.jpg`, `style-minimalist.jpg`, `style-boho.jpg`, `style-scandinavian.jpg`, `style-classic.jpg`, `style-industrial.jpg`. Used on the home page style guide and as the result page header.

That is 36 option images and 6 style images. Ready-to-use AI prompts for all 42 are in `docs/image-prompts.md`. Check your AI tool's commercial-use terms for your plan before publishing generated images.

## Deploy to GitHub Pages

`dist/` is plain static files. Easiest route: push this repo to GitHub, then add a GitHub Actions workflow that runs `npm ci && SITE_URL=https://your-domain.com npm run build` and publishes `dist/` with the official `actions/upload-pages-artifact` and `actions/deploy-pages` actions, with Pages set to deploy from Actions. All links inside the site are relative, so it also works under a `user.github.io/repo/` address. Any other static host (Netlify, Cloudflare Pages) works by publishing `dist/` after `npm run build`.

## Layout

```
data/       quiz questions, styles, products, site settings
src/        scoring, quiz state, product filter, page renderer, share cards (unit-tested)
scripts/    build.js
public/     index.html, quiz.js, result.js, style.css, images/
test/       node:test unit tests
```
