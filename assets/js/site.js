// Interactivity for the static portfolio pages (all CSS animations live in each page's <style>).
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Magnetic buttons
  $$('.mag').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--tx', ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + 'px');
      el.style.setProperty('--ty', ((e.clientY - r.top - r.height / 2) * 0.32).toFixed(1) + 'px');
    });
    el.addEventListener('mouseleave', () => { el.style.setProperty('--tx', '0px'); el.style.setProperty('--ty', '0px'); });
  });

  // Pointer parallax (hero, portrait): --mx / --my in [-1, 1]
  $$('[data-tilt]').forEach((el) => {
    let raf = 0;
    el.addEventListener('mousemove', (e) => {
      if (raf) return;
      const cx = e.clientX, cy = e.clientY;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (((cx - r.left) / r.width - 0.5) * 2).toFixed(3));
        el.style.setProperty('--my', (((cy - r.top) / r.height - 0.5) * 2).toFixed(3));
      });
    });
    el.addEventListener('mouseleave', () => { el.style.setProperty('--mx', '0'); el.style.setProperty('--my', '0'); });
  });

  // Mobile menu
  const burger = $('.burger'), menu = $('#menu-mobile');
  if (burger && menu) {
    const set = (open) => {
      menu.hidden = !open;
      burger.classList.toggle('on', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    burger.addEventListener('click', () => set(menu.hidden));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { set(false); burger.focus(); } });
  }

  // FAQ: one item open at a time
  const qs = $$('.faq-q');
  qs.forEach((q) => q.addEventListener('click', () => {
    const wasOpen = q.getAttribute('aria-expanded') === 'true';
    qs.forEach((o) => {
      const open = o === q && !wasOpen;
      o.setAttribute('aria-expanded', String(open));
      document.getElementById(o.getAttribute('aria-controls'))?.classList.toggle('open', open);
    });
  }));

  // Planos: chave Mensal/Anual troca preço, período e nota ([data-m] / [data-a]).
  const bills = $$('.bill button');
  bills.forEach((b) => b.addEventListener('click', () => {
    bills.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    $$('[data-m]').forEach((el) => { el.textContent = el.dataset[b.dataset.p]; });
  }));

  // Lab (index): segment / palette / type pickers re-render the preview
  const tplEl = $('#lab-tpl'), dataEl = $('#lab-data'), pv = $('.lab-pv');
  if (tplEl && dataEl && pv) {
    const tpl = tplEl.textContent, data = JSON.parse(dataEl.textContent);
    const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const get = (sc, p) => p.split('.').reduce((o, k) => (o == null ? o : o[k]), sc);
    // Same mini-template as the source: {{ a.b }}, <sc-for list as>, <sc-if value>
    const render = (t, sc) => {
      let out = '', i = 0, m;
      const open = /<sc-(for|if)\b([^>]*)>/g;
      while ((m = open.exec(t))) {
        out += t.slice(i, m.index).replace(/\{\{\s*([\w.$]+)\s*\}\}/g, (_, p) => esc(get(sc, p)));
        const tag = m[1], re = new RegExp(`<sc-${tag}\\b[^>]*>|</sc-${tag}>`, 'g');
        re.lastIndex = m.index + m[0].length;
        let depth = 1, c;
        while (depth && (c = re.exec(t))) depth += c[0][1] === '/' ? -1 : 1;
        const inner = t.slice(m.index + m[0].length, c.index);
        const ref = (n) => (m[2].match(new RegExp(`${n}="\\{\\{\\s*([\\w.$]+)\\s*\\}\\}"`)) || [])[1];
        if (tag === 'for') (get(sc, ref('list')) || []).forEach((it) => { out += render(inner, { ...sc, [m[2].match(/as="(\w+)"/)[1]]: it }); });
        else if (get(sc, ref('value'))) out += render(inner, sc);
        i = open.lastIndex = re.lastIndex;
      }
      return out + t.slice(i).replace(/\{\{\s*([\w.$]+)\s*\}\}/g, (_, p) => esc(get(sc, p)));
    };
    const st = { segs: 0, pals: 0, types: 0 }, flip = { v: false };
    const rows = { segs: '.seg-btn', pals: '.pal-btn', types: '.ty-btn' };
    Object.entries(rows).forEach(([key, sel]) => {
      const btns = $$(sel);
      st[key] = Math.max(0, btns.findIndex((b) => b.classList.contains('on')));
      btns.forEach((b, idx) => b.addEventListener('click', () => {
        st[key] = idx;
        flip.v = !flip.v;
        btns.forEach((o, j) => { o.classList.toggle('on', j === idx); o.setAttribute('aria-pressed', String(j === idx)); });
        const ty = data.types[st.types];
        pv.innerHTML = render(tpl, {
          seg: data.segs[st.segs], pal: data.pals[st.pals], ty,
          hf: ty.ff, hw: ty.w, hls: ty.ls, anim: flip.v ? 'sw-a' : 'sw-b',
        });
      }));
    });
  }

  // Contact form: live message preview + WhatsApp / e-mail links + lead into the CRM
  const nome = $('#f-nome');
  if (nome) {
    // Public (publishable) key: it can only call submit_lead and ping.
    const SUPABASE_URL = 'https://jodaiwlfvlkzrkntiaax.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_UmjmIGdH3JOXCTpJEyKgYQ_WbvmMtnA';
    const SERVICOS = { 'Site Essencial': 'essencial', 'Site Profissional': 'profissional', 'Planos de cuidado': 'manutencao', 'Ainda não sei': 'nao_sei' };
    const neg = $('#f-neg'), mail = $('#f-mail'), zap = $('#f-wa'), hp = $('#f-site'), msgEl = $('#f-msg'), out = $('.pvm p'), aviso = $('#f-erro');
    const wa = $('.send .btn-blue'), em = $('.send .btn-line'), chips = $$('.chip');
    let tipo = '';
    const update = () => {
      const n = nome.value.trim(), g = neg.value.trim(), e = mail.value.trim(), z = zap.value.trim(), m = msgEl.value.trim();
      const lines = ['Olá, Stelqo!' + (n ? ' Meu nome é ' + n + '.' : '')];
      if (g) lines.push('Negócio: ' + g + '.');
      lines.push(tipo ? 'Tenho interesse em: ' + tipo + '.' : 'Vi o site e gostaria de conversar sobre um site.');
      if (m) lines.push('', m);
      if (z || e) lines.push('');
      if (z) lines.push('Meu WhatsApp: ' + z);
      if (e) lines.push('Meu e-mail: ' + e);
      const msg = lines.join('\n');
      out.textContent = msg;
      if (wa) wa.href = 'https://wa.me/5511998150501?text=' + encodeURIComponent(msg);
      if (em) em.href = 'mailto:bernat.correa@gmail.com?subject=' + encodeURIComponent('Orçamento de site' + (g ? ' — ' + g : '')) + '&body=' + encodeURIComponent(msg);
    };
    [nome, neg, mail, zap, msgEl].forEach((el) => el.addEventListener('input', update));

    // Fire-and-forget: the WhatsApp/e-mail link must open even if this fails.
    const enviarLead = () => {
      try {
        const v = (el) => el.value.trim() || null;
        fetch(SUPABASE_URL + '/rest/v1/rpc/submit_lead', {
          method: 'POST', keepalive: true,
          headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ p_nome: nome.value.trim(), p_empresa: v(neg), p_whatsapp: v(zap), p_email: v(mail), p_servico: SERVICOS[tipo] || null, p_mensagem: v(msgEl), p_hp: v(hp) }),
        }).catch(() => {});
      } catch { /* never block the link */ }
    };
    [wa, em].forEach((btn) => btn && btn.addEventListener('click', (ev) => {
      const falta = !nome.value.trim() ? nome : (!zap.value.trim() && !mail.value.trim()) ? zap : null;
      if (falta) {
        ev.preventDefault();
        aviso.textContent = 'Preencha seu nome e um WhatsApp ou e-mail.';
        aviso.hidden = false;
        falta.focus();
        return;
      }
      aviso.hidden = true;
      enviarLead();
    }));
    chips.forEach((c) => c.addEventListener('click', () => {
      const label = c.textContent.trim();
      tipo = tipo === label ? '' : label;
      chips.forEach((o) => { const on = o.textContent.trim() === tipo; o.classList.toggle('on', on); o.setAttribute('aria-pressed', String(on)); });
      update();
    }));
    update();
  }
})();
