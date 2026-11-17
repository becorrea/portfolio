# Rebrand Stelqo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the "Bernardo Corrêa" portfolio into the Stelqo site, following the brand manual.

**Architecture:** Static HTML, with no build step. The CSS block shared by the 6 pages (lines 9–227, identical in each) moves to `assets/css/stelqo.css`, already using the new brand. Each page keeps only its own CSS inline. Logo and favicon come from the official kit in `assets/brand/`. A grep script (`scripts/check-brand.sh`) serves as the conformance test. The final check uses screenshots in Chrome.

**Tech Stack:** HTML, CSS, vanilla JS (`assets/js/site.js`), Google Fonts, bash (Git Bash) for the check, `python -m http.server` + Chrome to view the pages.

**Spec:** `docs/superpowers/specs/2026-11-17-stelqo-rebrand-design.md`. Read it in full before any task. It is the source of truth for tokens, type scale, voice and the mock/Stelqo boundary.

## Global Constraints

- Pages in scope: `index.html projetos.html servicos.html sobre.html contato.html clinica-horizonte.html`. `identidade.html` is deleted (Task 8).
- Tokens: `--blue:#0A33FF; --blue-2:#0828D6; --lav:#8EA6FF; --ink:#0B0E14; --ink-2:#3C4150; --muted:#5E6372; --d-muted:#A6A9B3; --paper:#F8F5F2; --paper-2:#ECEAE6; --paper-3:#E4E2DE; --gray:#DDE4FF`.
- RGB for rgba: `24,27,32`→`11,14,20`; `245,243,239`→`248,245,242`; `55,76,255`→`10,51,255`; `184,199,255`→`142,166,255`.
- `--sans:"Plus Jakarta Sans", Arial, Helvetica, sans-serif`. Brand weights: 400/500/600/700/800 only (no 300/450/550/650).
- Instrument Serif in the brand **only italic, blue, at the end of a title, 1–3 words**. On `.dark` the highlight colour is `--lav` (#8EA6FF), never #0A33FF.
- Google Fonts on every page: `family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@400;500`. **Only `index.html`** also adds `family=Geist:wght@400;500;600` (the Lab's "Moderna" option).
- Logo only from the kit SVGs. Never retype "stelqo." as text.
- Do not change the Lab mocks (`index.html`: `<section … id="laboratorio">` through its `</section>`, `#lab-tpl`, `#lab-data`). On `clinica-horizonte.html`, follow the spec's boundary.
- `contato.html` form: the send button **keeps** the `btn-blue` class (`site.js:107` looks it up with `$('.send .btn-blue')`). Change strings only. Do not touch the submission/CRM flow.
- Do not send a test lead to the real CRM.
- Voice: "a Stelqo" + "você"; sentences of 20 words or fewer; benefit first; banned words from the manual (revolucionário, disruptivo, sinergia, o melhor do mercado, solução 360°, imperdível, barato, hackear, game changer, últimas vagas). Do not invent `@stelqo.com.br`. Contacts stay `bernat.correa@gmail.com`, `+55 11 99815-0501`.
- Untrusted kit: extract it into a new, empty directory under the scratchpad. Read each SVG as text before copying. Reject any SVG containing `<script`, `on*=` attributes, or an `href` pointing outside the file.

## Review Focus

1. A highlight `em` inside the Lab/Clínica mocks picks up the new global `em` rule and turns blue. Expected: the mocks look as they did before. Covered in Task 2 (title-scoped selector) and checked in Task 8.
2. A page-level button on a dark section becomes `btn-ink` and disappears into the Grafite background. Expected: on `.dark` it uses `btn-paper`. Checked in Task 3.
3. The contact form after the string changes: preview, WhatsApp link and mailto must carry "Olá, Stelqo!" and the visitor's data, and submission must keep working. Checked in Task 7.
4. Mobile menu at 390px: the 34px logo, burger and the menu's blue WhatsApp button stay visible and usable. Checked in Task 8.
5. `prefers-reduced-motion`: the Onda de Luz and the remaining animations stop. Checked in Task 6.

---

### Task 1: Brand assets + conformance script

**Files:**
- Create: `assets/brand/stelqo-horizontal-positiva.svg`, `assets/brand/stelqo-horizontal-negativa.svg`, `assets/brand/stelqo-simbolo.svg`, `assets/brand/favicon-32px.png`, `assets/brand/favicon-180px-apple-touch.png`, `assets/brand/favicon-512px.png`
- Create: `scripts/check-brand.sh`

**Interfaces:**
- Produces: the paths above; `bash scripts/check-brand.sh` → prints `FAIL: …` per violation, exit 1 if any, otherwise `OK` and exit 0.

- [ ] **Step 1:** Extract `C:\Users\berna\Downloads\Stelqo-Kit-de-Arquivos.zip` into `<scratchpad>/kit/` (new directory). Read the text of the 3 SVGs above. Confirm there is no `<script`, `on…=` or external `href`.
- [ ] **Step 2:** Copy the 3 SVGs (from `kit/svg/`) and the 3 PNGs (from `kit/png/`) into `assets/brand/` under the same names.
- [ ] **Step 3: Write `scripts/check-brand.sh`.** Files checked: the 6 pages + `assets/css/stelqo.css` (if present). In `index.html`, before grepping, blank out the lines from `id="laboratorio"` to the next `</section>`, and from `id="lab-tpl"` to the end of the file (mocks). Then fail (`grep -nF`) on each of these:
  `#374CFF #2335E6 #181B20 #F5F3EF #B8C7FF #ECE9E3 #E4E1DA #3F444D #5F646E #A4A9B4 rgba(24,27,32 rgba(245,243,239 rgba(55,76,255 rgba(184,199,255 "Geist", Geist, mono-mark sig-name ftr-big — Bernardo Corrêa Bernardo Corrêa — © 2026 Bernardo font-weight:550 font:450 font:550 font:650 [ADICIONAR identidade.html Vi seu portfólio Vi%20seu%20portf`
  - Exception: `index.html` may contain `family=Geist:` in the `<head>`. The check `family=Geist:` applies only to the other 5 pages.
  - Also check that `assets/js/site.js` does not contain `Olá, Bernardo!`, and that `identidade.html` does not exist.
  - Each page must contain `assets/css/stelqo.css`, `assets/brand/stelqo-horizontal-positiva.svg` and `assets/brand/favicon-32px.png`.
- [ ] **Step 4:** Run `bash scripts/check-brand.sh`. Expected: lots of `FAIL` and exit 1. That is the red state, and later tasks turn it green.
- [ ] **Step 5:** Commit: `git add assets/brand scripts/check-brand.sh && git commit -m "chore: assets oficiais da marca Stelqo e script de conformidade"`.

### Task 2: `stelqo.css` + head, header and footer on the 6 pages

**Files:**
- Create: `assets/css/stelqo.css`
- Modify: lines 6–227 + header (`<a class="sig"…>` in `.hdr`) + footer (`.ftr-brand`, `.ftr-big`, `.ftr-bot`) on the 6 pages

**Interfaces:**
- Consumes: `assets/brand/*` (Task 1).
- Produces: classes `.logo` (header `<a>`, img `height:34px;width:auto`), `.ftr-logo` (footer, img `height:40px`), `.eyebrow` with a blue line, `.h-display .h2 .h3 .h4 .lead .body .small` on the new scale. All the other classes in the block keep their names.

- [ ] **Step 1:** Run `bash scripts/check-brand.sh`. Confirm it FAILs on `mono-mark` and `stelqo.css`.
- [ ] **Step 2: Create `assets/css/stelqo.css`** from `index.html:9-227`, with these changes:
  - `:root` uses the Global Constraints tokens. Every rgba follows the RGB map. `#C9CCD3`/`#D7DAE0`/`#E6E7EA` become `var(--d-muted)` or `#ECEAE6`. `#F1EFEA`/`#D7D4CD`/`#E6E3DD`/`#6A6E76`/`#F9F8F4` become the nearest neutral from the manual (`--paper-2`, `#CFCDC8`, `--paper-3`, `--muted`, `#FFFFFF`).
  - Type: `.h-display` `clamp(44px,6vw,72px)/1.05`, `-.04em`, 800, `var(--sans)`. `.h2` `clamp(36px,4.6vw,56px)/1.07`, `-.03em`, 800. `.h3` `clamp(24px,2.4vw,28px)/1.2`, `-.02em`, 700. `.h4` `clamp(18px,1.6vw,20px)/1.4`, `-.01em`, 600. `.lead` `clamp(17px,1.4vw,18px)/1.55`. `.body` `16px/1.6`. `.small` `14px/1.45`, 500. `h1–h4` default weight 700.
  - `em,.it`: replace with `em{font-style:normal;font-weight:600}`. Then add `:is(.h-display,.h2,.h3) em{font-family:var(--serif);font-style:italic;font-weight:400;letter-spacing:-.01em;color:var(--blue)}` and `.dark :is(.h-display,.h2,.h3) em{color:var(--lav)}`. Scoped to title classes so the mocks are not affected.
  - `.eyebrow`: `700 12px/1 var(--sans)`, `letter-spacing:.16em`, uppercase, `--muted`, `flex-direction:column; align-items:flex-start; gap:10px`. Change `::before` to `::after` with `width:28px;height:2px;background:var(--blue);opacity:1`. On `.dark`: `--d-muted` text, `--lav` line.
  - `.mmenu nav a`: `800 36px/1.07 var(--sans)`, `-.03em`. `.nav a`: weight 500. `.btn`: weight 600. `.ftr-col h3`: same treatment as the eyebrow without the line.
  - `.ic` `stroke-width:1.75`. The current drawings (arrow, mail) already follow the Lucide grid; WhatsApp has no Lucide icon and stays. Do not change paths.
  - Delete the `/* signature & monogram */` block, `.ftr-brand .sig-name` and `.ftr-big*`. Add `.logo{display:inline-flex}` `.logo img{height:34px;width:auto}` `.ftr-logo img{height:40px;width:auto}`.
- [ ] **Step 3: On each of the 6 pages:**
  - Replace lines 9–227 of the `<style>` with nothing and put `<link rel="stylesheet" href="assets/css/stelqo.css">` before the `<style>`.
  - Fonts link as in the Global Constraints (Geist only on index).
  - `<title>` becomes `… — Stelqo`; on the home, `Stelqo — Sites para pequenos negócios`.
  - Add `<link rel="icon" type="image/png" sizes="32x32" href="assets/brand/favicon-32px.png">` and `<link rel="apple-touch-icon" href="assets/brand/favicon-180px-apple-touch.png">`.
- [ ] **Step 4:** On each of the 6 pages:
  - The header `<a class="sig" …>…</a>` becomes `<a class="logo" href="index.html" aria-label="Stelqo — página inicial"><img src="assets/brand/stelqo-horizontal-positiva.svg" alt="Stelqo" width="120" height="34"></a>`. Read the width from the SVG's `viewBox` to keep the proportion.
  - In the footer, the `.sig` becomes `<a class="ftr-logo" href="index.html" aria-label="Stelqo — página inicial"><img src="assets/brand/stelqo-horizontal-negativa.svg" alt="Stelqo" height="40" width="…"></a>`.
  - Remove `<div class="ftr-big">`.
  - `.ftr-bot` becomes `© 2026 Stelqo. Todos os direitos reservados.`
  - The `.ftr-brand` text becomes `Sites para pequenos negócios. São Paulo, Brasil.`
- [ ] **Step 5:** Run `bash scripts/check-brand.sh`. Expected: no more FAILs for `mono-mark`, `sig-name`, `ftr-big`, `Bernardo Corrêa —`, missing `stelqo.css`/logo/favicon, `"Geist",` or old hex in the shared block. FAILs may remain only in page-level CSS and copy.
- [ ] **Step 6:** Serve with `python -m http.server 8080` (in the background, from the repo root). Open `http://localhost:8080/index.html` and `sobre.html` in Chrome at 1440px. Confirm the logo in the header and footer, Jakarta in the titles, and nothing broken in the layout.
- [ ] **Step 7:** Commit: `feat: CSS compartilhado da marca Stelqo, logo e favicon`.

### Task 3: One blue button per screen

**Files:**
- Modify: every `btn-blue` outside the header and the mobile menu. Current lines: `index.html:850`, `projetos.html:611,628`, `servicos.html:333,427`, `sobre.html:314,383`, `clinica-horizonte.html:454,471`. Also the header CTA on `contato.html:304`.

**Interfaces:**
- Consumes: `.btn-ink`, `.btn-paper` (stelqo.css).

- [ ] **Step 1:** Run `grep -n 'btn-blue' *.html`. List each occurrence and whether it sits inside a `.dark` section.
- [ ] **Step 2:** Apply the rule:
  - The header CTA (`hdr-cta`) stays `btn-blue`, **except on `contato.html`**, where it becomes `btn-ink`.
  - The mobile menu's WhatsApp button (`.mmenu-ft`) stays `btn-blue`.
  - On `contato.html`, `.send .btn-blue` **does not change**.
  - Every other `btn-blue` becomes `btn-ink` on a light background, or `btn-paper` inside `.dark` (CTA bands, `.cs-*` dark). If a `.dark .btn-line` sits next to it, keep it.
- [ ] **Step 3:** Run `grep -n 'btn-blue' *.html`. Expected: only `hdr-cta` (5 pages), `.mmenu-ft` (6) and `contato.html` `.send`.
- [ ] **Step 4:** In Chrome at 1440px, scroll to the CTA band on `index.html`. The button must be clearly visible on Grafite (paper colour), with only the header button in blue.
- [ ] **Step 5:** Commit: `feat: um botão azul por tela`.

### Task 4: Page-level CSS (index, projetos, servicos, sobre, contato)

**Files:**
- Modify: the page `<style>` in each of the 5 pages (what remains after Task 2). Current locations: `index.html` 267–391, `projetos.html` 267–538, `servicos.html` 243–271, `sobre.html` 238–266, `contato.html` 241–263.

- [ ] **Step 1:** Run `bash scripts/check-brand.sh`. Note the FAILs on these 5 pages.
- [ ] **Step 2:** On each page, change:
  - rgba values via the RGB map.
  - Loose old hex values to the nearest token.
  - Every `var(--serif)` in a Stelqo element to `var(--sans)` at 800 (numbers: `.sd-n`, `.step-n`, `.prow-idx`, `.vis .n`; prices: `.sd-price b`, `.svc-price b`; headings: `.cmp thead th`, `.vis h3`, `.links a b`, `.mf-text`) with `letter-spacing:-.03em`.
  - Blue numbers stay blue (`--blue`, or `--lav` on dark).
  - Weights 300/450/550/650 to the nearest allowed weight.
  - **Do not touch** the Lab CSS (`.lab*`, `.pv*`, `.ty-*`, `.pal-*`) in `index.html`.
- [ ] **Step 3:** In each page's HTML, remove `em` from the middle of titles and `em` without a highlight function. Rule: in a title, only the last 1–3 words go in `<em>`.
- [ ] **Step 4:** Run `bash scripts/check-brand.sh`. Expected: no FAIL for colour, font or weight on these 5 pages (copy FAILs are allowed).
- [ ] **Step 5:** Check in Chrome at 1440px and 390px: `projetos.html`, `servicos.html`, `sobre.html`, `contato.html`.
- [ ] **Step 6:** Commit: `feat: CSS das páginas alinhado à marca Stelqo`.

### Task 5: `clinica-horizonte.html` — mock/Stelqo boundary

**Files:**
- Modify: `clinica-horizonte.html` (page CSS 228–310 + titles).

- [ ] **Step 1:** Run `grep -n 'serif\|rgba(\|#[0-9A-Fa-f]\{6\}' clinica-horizonte.html | sed -n '1,200p'`. Classify each rule as **clinic** (`.cs-hero`, `.gal`, `.phones`, the clinic palette, `.pillar .n`) or **Stelqo** (everything else, including `.dec h3`).
- [ ] **Step 2:** Make the changes:
  - Stelqo rules: same treatment as Task 4. `.dec h3` moves to Jakarta 700 on the h3 scale.
  - Clinic rules: keep `#112E2C`, `#CFE3DB`, `#EFEBE3`, serif and colours as they are.
  - rgba `24,27,32` / `245,243,239` follow the RGB map **in any rule**.
  - `em` in Stelqo titles is blue (`--lav` on dark). The `em` in the `.cs-hero` H1 keeps the clinic's mint.
- [ ] **Step 3:** Run `bash scripts/check-brand.sh`. Expected: no FAIL for colour/font on `clinica-horizonte.html`.
- [ ] **Step 4:** In Chrome at 1440px, the green hero, gallery and phones look as they did before the rebrand. Header, text and CTA band are Stelqo.
- [ ] **Step 5:** Commit: `feat: estudo de caso com moldura Stelqo, mock da clínica intacto`.

### Task 6: Home hero — Onda de Luz + copy

**Files:**
- Modify: `index.html` hero (HTML ~545–583 + `.hero`/`.stage`/`.lay`/`.win`/`.spec*`/`.comp*`/`.cur`/`.dotring` CSS in the page `<style>`); `assets/js/site.js` if it references `.stage`/`[data-tilt]`.

**Interfaces:**
- Produces: `<svg class="onda" aria-hidden="true">` inside `.hero`, with the class `.onda` in the page CSS.

- [ ] **Step 1:** Run `grep -n 'stage\|data-tilt\|\.lay\b' assets/js/site.js index.html`. Find which JS depends on the stage. If the JS does nothing beyond the tilt, remove that tilt code along with the stage.
- [ ] **Step 2:** Remove `.stage` (and `data-tilt` if no longer used) plus its CSS. Add an inline SVG `.onda`:
  - position absolute, top-right corner, bleeding off the edge (`right`/`top` negative);
  - at most 35% of the hero area;
  - 3–4 translucent curves with `linearGradient` 225°: `#0A33FF 0%` → `#3D6BFF 45%` → `#3D6BFF` with `stop-opacity:0` at 100%;
  - `pointer-events:none`;
  - it must not sit behind the H1 or the lead (use `z-index` and position).
  Visual reference: manual p. 1 and p. 38 (`C:\Users\berna\Downloads\Stelqo-Manual-de-Marca.pdf`).
- [ ] **Step 3:** Optional slow motion (drift ≤ 20s). Wrap it in `@media (prefers-reduced-motion: no-preference)`.
- [ ] **Step 4:** Hero copy:
  - Eyebrow: `Sites para pequenos negócios · São Paulo`. Remove the `<p class="mono">` line.
  - H1: 2–3 lines, benefit first, ending in `<em>` (e.g. `Seu negócio com um site que passa <em>confiança.</em>`, author's choice within the voice rules).
  - Lead (≤ 20 words): replaces "experiências digitais modernas… o melhor da sua empresa".
  - CTAs: `btn-ink` "Ver projetos" + `btn-line` "Pedir orçamento".
- [ ] **Step 5:** In Chrome at 1440px and 390px: the wave does not cover the text, there is no horizontal scroll, and the wave stops with DevTools "Emulate prefers-reduced-motion: reduce".
- [ ] **Step 6:** Commit: `feat: herói com Onda de Luz e voz Stelqo`.

### Task 7: Voice and copy on every page + contact strings

**Files:**
- Modify: copy on the 6 pages; `assets/js/site.js:111,113`; `contato.html:360-365`; `wa.me` links (`.mmenu-ft` and footer on the 6 pages).

- [ ] **Step 1: Contact strings.**
  - `site.js:111` `'Olá, Bernardo!'` becomes `'Olá, Stelqo!'`.
  - `site.js:113` `'Vi seu portfólio e gostaria de conversar sobre um site.'` becomes `'Vi o site e gostaria de conversar sobre um site.'`.
  - `contato.html` preview `<p>` and the initial `href` of `.send .btn-blue` / `.send .btn-line` change to the same text (URL-encoded: `Ol%C3%A1%2C%20Stelqo!%0AVi%20o%20site%20e%20gostaria%20de%20conversar%20sobre%20um%20site.`).
  - Change nothing else in `site.js`.
- [ ] **Step 2:** Every `wa.me/…?text=Ol%C3%A1%2C%20Bernardo!%20Vi%20seu%20portf%C3%B3lio…` becomes `?text=Ol%C3%A1%2C%20Stelqo!%20Vi%20o%20site%20e%20gostaria%20de%20conversar%20sobre%20um%20site.`
- [ ] **Step 3: Company voice.** Rewrite the copy on all 6 pages from "eu/desenvolvo/meus" to "a Stelqo"/"você", following the spec's "Voz e conteúdo" section:
  - On `sobre.html`, Bernardo appears in the 3rd person as the founder. The H1 "Oi, eu sou o Bernardo." becomes a Stelqo title, with Bernardo in the text and in the portrait's `figcaption`. Keep the "você fala direto com quem constrói" idea.
  - On `index.html`, the "Sobre" block (~770–776) follows the same rule.
  - The signature line `Estrutura que impulsiona <em>evolução.</em>` goes in the home CTA band (`#cta-t` or the line above the button).
  - The jargon and vague phrasing replacements from the spec, including `.pc-feats` (`index.html:622`) and the manifesto (`.mf-text`, with no `em` in the middle: keep the `.w` spans and drop "perfeitamente").
  - `servicos.html`: one line before the CTA band, `Também evoluímos para sistemas sob medida. Fale com a gente.`, with no price.
  - `sobre.html:359`: delete the `<div class="row">` that holds the placeholder.
  - The `.ring` CTA text: `Vamos conversar · São Paulo · Sites sob medida ·`.
- [ ] **Step 4:** Run `grep -niE 'revolucion|disruptiv|sinergia|o melhor|360|imperd|barato|hackear|game changer|últimas vagas|perfeitamente|experiências digitais' *.html`. Expected: empty, apart from the Lab mocks.
- [ ] **Step 5:** Run `bash scripts/check-brand.sh`. Expected: `OK` (everything except `identidade.html`, which is Task 8).
- [ ] **Step 6: Form, without sending.** Open `contato.html`, fill in name "Teste" and choose a chip.
  - Confirm the preview starts with `Olá, Stelqo! Meu nome é Teste.`.
  - Confirm the WhatsApp button's `href` contains `Ol%C3%A1%2C%20Stelqo!%20Meu%20nome%20%C3%A9%20Teste.`. Read it via `read_page`/JS, **without clicking**.
  - Do not submit.
- [ ] **Step 7:** Commit: `feat: voz da marca Stelqo nos textos e mensagens de contato`.

### Task 8: Delete `identidade.html` + final verification

**Files:**
- Delete: `identidade.html`

- [ ] **Step 1:** Run `grep -rn 'identidade.html' --include=*.html --include=*.js .`. Expected: empty (it is an orphan page).
- [ ] **Step 2:** `git rm identidade.html`.
- [ ] **Step 3:** Run `bash scripts/check-brand.sh`. Expected: `OK`, exit 0.
- [ ] **Step 4:** Take screenshots of the 6 pages at 1440px and 390px. Compare them with manual p. 30 (type) and p. 38 (site). Check:
  - one blue button per screen;
  - logo ≥ 34px tall;
  - `em` only at the end of titles;
  - #8EA6FF on dark backgrounds;
  - Lab working (switch segment, palette and typography; the mocks look the same as before);
  - mobile menu opens and closes;
  - no horizontal scroll at 390px.
- [ ] **Step 5:** Commit: `chore: remove guia da identidade antiga`.
