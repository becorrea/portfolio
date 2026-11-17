"""Verificador de tema claro/escuro (Chrome headless, só stdlib).

Uso:
  python -I scripts/theme-check.py snapshot OUT.json [PAGE...]    grava cores computadas do claro
  python -I scripts/theme-check.py light BASELINE.json [PAGE...]  claro tem que ser igual ao baseline
  python -I scripts/theme-check.py dark [--scope SEL] [PAGE...]   regras do modo escuro
PAGE = index projetos servicos sobre contato clinica-horizonte (sem PAGE = as 6).
Cada página roda num iframe srcdoc com fetch/sendBeacon bloqueados: o formulário nunca chega ao CRM.
"""
import argparse, html, json, pathlib, re, shutil, subprocess, sys, tempfile

sys.stdout.reconfigure(encoding="utf-8")
ROOT = pathlib.Path(__file__).resolve().parent.parent
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PAGES = ["index", "projetos", "servicos", "sobre", "contato", "clinica-horizonte"]
SIZES = [(1440, 900), (390, 844)]
MOCKS = [".pv", ".stage", ".bw", ".phone", ".cs-hero", ".gal", ".phones", ".cpal", ".pillar .n"]
PROPS = ["color", "background-color", "background-image", "border-top-color", "border-right-color",
         "border-bottom-color", "border-left-color", "outline-color", "box-shadow", "fill", "stroke"]
DARK_BG = "rgb(28, 32, 41)"
BODY_BG = "rgb(11, 14, 20)"

PRE = ('<base href="{base}"><script>window.fetch=()=>Promise.reject(new Error("blocked"));'
       'navigator.sendBeacon=()=>false;</script>'
       '<style>*,*::before,*::after{{animation:none!important;transition:none!important}}</style>')

# ponytail: fundo efetivo = composição dos ancestrais no DOM; texto sobre irmão posicionado (imagem, onda) não é visto.
JS = r"""
<script>
const CFG = __CFG__;
const f = document.querySelector('iframe');
f.addEventListener('load', () => setTimeout(async () => {
  const d = f.contentDocument, w = f.contentWindow, r = {};
  const cs = (e, p) => w.getComputedStyle(e, p || null);
  const path = e => { const a = []; while (e && e !== d.body) { a.unshift(e.tagName.toLowerCase() + ':nth-child(' + ([...e.parentNode.children].indexOf(e) + 1) + ')'); e = e.parentElement; } return 'body>' + a.join('>'); };
  const MOCK = CFG.mocks.join(',');
  const inMock = e => !!e.closest(MOCK);
  r.mockHits = Object.fromEntries(CFG.mocks.map(s => [s, d.querySelectorAll(s).length]));
  // 1. cores computadas
  r.styles = {}; r.mock = [];
  for (const e of d.body.querySelectorAll('*')) {
    if (e.closest('template,script,style')) continue;
    const k = path(e), s = cs(e);
    r.styles[k] = CFG.props.map(p => s.getPropertyValue(p)).join(' ; ') + (e.tagName === 'IMG' ? ' ; src=' + e.currentSrc.split('/').pop() : '');
    for (const p of ['::before', '::after']) {
      const ps = cs(e, p);
      if (ps.content && ps.content !== 'none' && ps.content !== 'normal') r.styles[k + p] = CFG.props.map(q => ps.getPropertyValue(q)).join(' ; ');
    }
    if (inMock(e)) r.mock.push(k);
  }
  r.mq = w.matchMedia('(prefers-color-scheme: dark)').matches;
  r.body = cs(d.body).backgroundColor;
  r.overflow = d.documentElement.scrollWidth - d.documentElement.clientWidth;
  const logo = d.querySelector('.hdr .logo img'); r.logo = logo ? logo.currentSrc.split('/').pop() : null;
  if (!CFG.dark) { document.body.setAttribute('data-res', JSON.stringify(r)); return; }
  // 2. contraste
  const rgba = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [v[0], v[1], v[2], v.length > 3 ? v[3] : 1]; };
  const over = (top, bot) => { const a = top[3]; return [0, 1, 2].map(i => top[i] * a + bot[i] * (1 - a)).concat(1); };
  const lum = c => { const [R, G, B] = c.slice(0, 3).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * R + .7152 * G + .0722 * B; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const bgOf = e => { const layers = []; for (let n = e; n; n = n.parentElement) { const s = cs(n); if (s.backgroundImage !== 'none') return null; const c = rgba(s.backgroundColor); if (c && c[3] > 0) { layers.push(c); if (c[3] >= 1) break; } }
    let b = [255, 255, 255, 1]; for (let i = layers.length - 1; i >= 0; i--) b = over(layers[i], b); return b; };
  const visible = e => { if (!e.getClientRects().length) return false; const b = e.getBoundingClientRect(); if (b.width <= 1 || b.height <= 1) return false;
    for (let n = e; n; n = n.parentElement) { const s = cs(n); if (s.visibility === 'hidden' || s.opacity === '0') return false; } return true; };
  const contrast = (rootSel) => { const out = []; let skipped = 0;
    const roots = rootSel ? [...d.querySelectorAll(rootSel)] : [d.body];
    for (const root of roots) for (const e of [root, ...root.querySelectorAll('*')]) {
      if (e.closest('svg,template,script,style') || inMock(e)) continue;
      if (![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
      if (!visible(e)) continue;
      const bg = bgOf(e); if (!bg) { skipped++; continue; }
      const s = cs(e), fg = over(rgba(s.color), bg), fs = parseFloat(s.fontSize), fw = parseInt(s.fontWeight);
      const need = (fs >= 24 || (fs >= 18.66 && fw >= 700)) ? 3 : 4.5, got = ratio(fg, bg);
      if (got < need) out.push(`${got.toFixed(2)}<${need} "${e.textContent.trim().slice(0, 40)}" fg=${s.color} bg=rgb(${bg.slice(0, 3).map(Math.round).join(',')}) ${path(e)}`);
    } return { out, skipped }; };
  const c = contrast(CFG.scope); r.contrast = c.out; r.skipped = c.skipped;
  r.darkSec = [...d.querySelectorAll('.dark')].filter(e => !inMock(e) && (!CFG.scope || e.closest(CFG.scope)))
    .filter(e => cs(e).backgroundColor !== CFG.darkBg).map(e => path(e) + ' bg=' + cs(e).backgroundColor);
  // 3. menu móvel aberto
  const bu = d.querySelector('.burger'), mm = d.querySelector('#menu-mobile');
  if (bu && mm && cs(bu).display !== 'none' && (!CFG.scope || mm.matches(CFG.scope) || mm.closest(CFG.scope) || CFG.scope.includes('#menu-mobile'))) {
    bu.click(); r.menu = mm.hidden ? ['menu não abriu'] : contrast('#menu-mobile').out; bu.click();
  }
  document.body.setAttribute('data-res', JSON.stringify(r));
}, 1500));
</script>"""


def run(page, w, h, dark, scope=None):
    """Roda a página numa largura e devolve o dict do coletor."""
    tmp = pathlib.Path(tempfile.mkdtemp(prefix="theme-"))
    try:
        base = "file:///" + str(ROOT).replace("\\", "/") + "/"
        src = (ROOT / f"{page}.html").read_text(encoding="utf-8").replace("<head>", "<head>" + PRE.format(base=base), 1)
        cfg = {"dark": dark, "scope": scope, "mocks": MOCKS, "props": PROPS, "darkBg": DARK_BG}
        wrap = tmp / "w.html"
        wrap.write_text(f"<html><body style='margin:0'><iframe style='border:0;width:{w}px;height:{h}px' "
                        f"srcdoc=\"{html.escape(src, quote=True)}\"></iframe>{JS.replace('__CFG__', json.dumps(cfg))}</body></html>",
                        encoding="utf-8")
        args = [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=8000",
                f"--window-size={max(w, 500)},{h}", f"--user-data-dir={tmp / 'prof'}", "--dump-dom", wrap.as_uri()]
        if dark:
            args.insert(1, "--force-dark-mode")
        out = subprocess.run(args, capture_output=True, timeout=120).stdout.decode("utf-8", "replace")
        m = re.search(r'data-res="([^"]*)"', out)
        if not m:
            sys.exit(f"{page}@{w}: coletor não respondeu")
        return json.loads(html.unescape(m.group(1)))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def snapshot(pages):
    return {f"{p}|{w}": run(p, w, h, False)["styles"] for p in pages for w, h in SIZES}


def diff(a, b, prefix):
    lines = []
    for k in sorted(set(a) | set(b)):
        if a.get(k) == b.get(k):
            continue
        if k not in a or k not in b:
            lines.append(f"{prefix}|{k}: {'sumiu' if k not in b else 'novo'}")
            continue
        for name, x, y in zip(PROPS + ["src"], a[k].split(" ; "), b[k].split(" ; ")):
            if x != y:
                lines.append(f"{prefix}|{k}|{name}: {x} → {y}")
    return lines


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("mode", choices=["snapshot", "light", "dark"])
    ap.add_argument("rest", nargs="*")
    ap.add_argument("--scope")
    a = ap.parse_args()
    rest = a.rest
    if a.mode in ("snapshot", "light"):
        if not rest:
            sys.exit("falta o arquivo JSON")
        file, rest = pathlib.Path(rest[0]), rest[1:]
    pages = rest or PAGES
    bad = [p for p in pages if p not in PAGES]
    if bad:
        sys.exit(f"página desconhecida: {bad}")

    if a.mode == "snapshot":
        file.write_text(json.dumps(snapshot(pages)), encoding="utf-8")
        print(f"snapshot: {len(pages) * len(SIZES)} execuções gravadas em {file}")
        return 0

    if a.mode == "light":
        base = json.loads(file.read_text(encoding="utf-8"))
        lines = []
        for k, v in snapshot(pages).items():
            lines += diff(base.get(k, {}), v, k)
        for ln in lines[:30]:
            print(ln)
        print(f"light: {len(lines)} diferenças")
        return 1 if lines else 0

    fails, skipped, hits = [], 0, {s: 0 for s in MOCKS}
    for p in pages:
        for w, h in SIZES:
            tag = f"{p}@{w}"
            lt, dk = run(p, w, h, False), run(p, w, h, True, a.scope)
            if not dk["mq"] or lt["mq"]:
                sys.exit(f"{tag}: emulação de prefers-color-scheme quebrada (claro={lt['mq']} escuro={dk['mq']})")
            for s, n in dk["mockHits"].items():
                hits[s] += n
            skipped += dk["skipped"]
            if dk["body"] != BODY_BG:
                fails.append(f"{tag}: body bg — {dk['body']}")
            if not a.scope or ".hdr" in a.scope:
                if not (dk["logo"] or "").count("negativa"):
                    fails.append(f"{tag}: logo do topo — {dk['logo']}")
            if dk["overflow"]:
                fails.append(f"{tag}: overflow horizontal — {dk['overflow']}px")
            fails += [f"{tag}: contraste — {x}" for x in dk["contrast"]]
            fails += [f"{tag}: seção .dark — {x}" for x in dk["darkSec"]]
            fails += [f"{tag}: menu móvel — {x}" for x in dk.get("menu", [])]
            mk = set(lt["mock"]) | set(dk["mock"])
            fails += [f"{tag}: mock difere — {x}" for x in
                      diff({k: lt["styles"][k] for k in mk if k in lt["styles"]},
                           {k: dk["styles"][k] for k in mk if k in dk["styles"]}, "")]
    if set(pages) == set(PAGES):
        none = [s for s, n in hits.items() if not n]
        if none:
            print(f"seletores de mock sem nenhum elemento: {none}")
            return 2
    for ln in fails:
        print(ln)
    print(f"dark: {len(fails)} falhas, {skipped} pulados")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
