/* Reports page only. Figures are generated sample data: replace calc() with API data later. */
(function () {
  const A = window.AdDesk, $ = (s) => document.querySelector(s);
  const ic = (n, c = 'h-4 w-4') => `<i data-lucide="${n}" class="${c}"></i>`;
  const MO = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  const PERIODS = { 'Last 3 months': 3, 'Last 6 months': 6, 'Last 12 months': 12, 'This year': 11 };
  const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
  const lk = (n) => '₹' + n.toFixed(2) + 'L';
  const num = (n) => Math.round(n).toLocaleString('en-IN');

  /* n: name, b: base monthly spend (₹ lakh), g: growth, cpl: base cost per lead, ms: Meta share of spend, cv: lead to won rate */
  const CL = [
    { n: 'Sharma Garments', b: 1.5, g: 0.02, cpl: 280, ms: 0.6, cv: 0.12 }, { n: 'Kapoor Jewellers', b: 1.3, g: 0.015, cpl: 520, ms: 0.75, cv: 0.1 },
    { n: 'Urban Brew Café', b: 1.0, g: 0.018, cpl: 230, ms: 0.9, cv: 0.14 }, { n: 'FitZone Gym', b: 0.85, g: 0.012, cpl: 190, ms: 1, cv: 0.09 },
    { n: 'Glow Salon', b: 0.65, g: 0.022, cpl: 200, ms: 1, cv: 0.16 }, { n: 'Green Basket', b: 0.55, g: 0.025, cpl: 210, ms: 0.3, cv: 0.11 },
    { n: 'Nest Interiors', b: 0.5, g: 0.03, cpl: 410, ms: 0.65, cv: 0.08 }, { n: 'Zenith Motors', b: 1.1, g: 0.028, cpl: 650, ms: 0.55, cv: 0.06 },
  ];
  A.clients = CL.map((c) => c.n);
  const spendAt = (c, m) => c.b * (1 + c.g * m * 4) * (1 + 0.06 * Math.sin(m * 1.3 + c.n.length));
  const cplAt = (c, m) => c.cpl * (1 - 0.012 * m) * (1 + 0.05 * Math.cos(m + c.n.length) + (c.n === 'FitZone Gym' ? 0.02 * m : 0));
  const leadsAt = (c, m) => (spendAt(c, m) * 1e5) / cplAt(c, m);

  const st = { p: 'Last 6 months', c: '', pl: '', sort: 's', tab: 'gen' };

  function calc(o) {
    const n = PERIODS[o.p] || 6, cur = [], prev = [];
    for (let i = 12 - n; i < 12; i++) cur.push(i);
    for (let i = 12 - 2 * n; i < 12 - n; i++) if (i >= 0) prev.push(i);
    const list = CL.filter((c) => !o.c || c.n === o.c), pf = (c) => (!o.pl ? 1 : o.pl === 'Meta' ? c.ms : 1 - c.ms);
    const agg = (c, idx) => { let s = 0, l = 0; idx.forEach((m) => { s += spendAt(c, m) * pf(c); l += leadsAt(c, m) * pf(c); }); return { s, l, w: l * c.cv }; };
    const rows = list.map((c) => { const a = agg(c, cur), p = prev.length ? agg(c, prev) : null; return { name: c.n, s: a.s, l: a.l, w: a.w, cpl: a.l ? (a.s * 1e5) / a.l : 0, conv: a.l ? (a.w / a.l) * 100 : 0, pcpl: p && p.l ? (p.s * 1e5) / p.l : null, spark: cur.map((m) => spendAt(c, m) * pf(c)) }; });
    const sum = (k) => rows.reduce((t, r) => t + r[k], 0), T = { s: sum('s'), l: sum('l'), w: sum('w') };
    T.cpl = T.l ? (T.s * 1e5) / T.l : 0; T.conv = T.l ? (T.w / T.l) * 100 : 0;
    let P = null;
    if (prev.length) { let s = 0, l = 0, w = 0; list.forEach((c) => { const a = agg(c, prev); s += a.s; l += a.l; w += a.w; }); P = { s, l, w, cpl: l ? (s * 1e5) / l : 0, conv: l ? (w / l) * 100 : 0 }; }
    const series = { labels: cur.map((i) => MO[i]), spend: cur.map((m) => list.reduce((t, c) => t + spendAt(c, m) * pf(c), 0)), leads: cur.map((m) => list.reduce((t, c) => t + leadsAt(c, m) * pf(c), 0)) };
    let src;
    if (o.pl === 'Meta') src = [['Meta Lead Ad', T.l], ['Google Ads', 0], ['Website', 0], ['Manual', 0]];
    else if (o.pl === 'Google Ads') src = [['Meta Lead Ad', 0], ['Google Ads', T.l], ['Website', 0], ['Manual', 0]];
    else src = [['Meta Lead Ad', list.reduce((t, c) => t + agg(c, cur).l * c.ms * 0.78, 0)], ['Google Ads', list.reduce((t, c) => t + agg(c, cur).l * (1 - c.ms) * 0.78, 0)], ['Website', T.l * 0.15], ['Manual', T.l * 0.07]];
    return { rows, T, P, series, src };
  }
  let D = calc(st);

  /* KPIs */
  const pct = (a, b) => (b ? ((a - b) / b) * 100 : null);
  function kpis() {
    const { T, P } = D;
    const K = [['wallet', 'Ad spend', lk(T.s), 's', 0], ['users', 'Leads', num(T.l), 'l', 1], ['target', 'Cost per lead', inr(T.cpl), 'cpl', -1], ['trophy', 'Won', num(T.w), 'w', 1], ['percent', 'Conversion', T.conv.toFixed(1) + '%', 'conv', 1]];
    $('#kpis').innerHTML = K.map(([i, l, v, k, good]) => {
      const d = P ? pct(T[k], P[k]) : null;
      const chip = d == null ? '<span class="chip" style="background:var(--hover);color:var(--mute)">No earlier data</span>' : `<span class="chip ${good === 0 ? '' : (d >= 0) === (good > 0) ? '' : 'dn'}" ${good === 0 ? 'style="background:var(--hover);color:var(--mute)"' : ''}>${ic(d >= 0 ? 'arrow-up-right' : 'arrow-down-right', 'h-3 w-3')}${Math.abs(d).toFixed(1)}%</span>`;
      return `<div class="card"><div class="flex min-w-0 items-center gap-2.5 p-3 pb-2"><div class="ico">${ic(i)}</div><div class="min-w-0"><div class="ttl">${l}</div><div class="truncate text-lg font-bold leading-tight">${v}</div></div></div><div class="mx-2 mb-2 flex min-w-0 items-center gap-1.5 rounded-md bg-bg px-2 py-1 text-[11px] text-mute">${chip}<span class="truncate">${P ? 'vs previous period' : ''}</span></div></div>`;
    }).join('');
    $('#sub').textContent = `${st.p}, ${st.c || 'all clients'}${st.pl ? ', ' + st.pl : ''}. Sample figures.`;
  }

  /* Charts redraw at the real width */
  const nice = (v) => { const e = 10 ** Math.floor(Math.log10(v || 1)), f = v / e; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * e; };
  function combo() {
    const el = $('#combo'), { labels, spend, leads } = D.series, W = Math.max(el.parentElement.clientWidth, 240), H = 230, L = 36, R = 44, B = 24, T = 8, ph = H - B - T, n = labels.length;
    const ms = nice(Math.max(...spend)), ml = nice(Math.max(...leads)), gw = (W - L - R) / n, bw = Math.max(6, Math.min(26, gw * 0.5)), ev = gw < 34 ? 2 : 1;
    el.setAttribute('viewBox', `0 0 ${W} ${H}`); el.setAttribute('height', H);
    let s = '';
    for (let i = 0; i <= 4; i++) { const y = T + ph - (ph * i) / 4; s += `<line class="gl" x1="${L}" x2="${W - R}" y1="${y}" y2="${y}"/><text class="ax" x="${L - 6}" y="${y + 4}" text-anchor="end">${+((ms * i) / 4).toFixed(1)}</text><text class="ax" x="${W - R + 6}" y="${y + 4}">${+((ml * i) / 4 / 1000).toFixed(1)}k</text>`; }
    let pts = '';
    labels.forEach((m, i) => { const x = L + i * gw + gw / 2, h = (ph * spend[i]) / ms, y = T + ph - (ph * leads[i]) / ml; s += `<rect class="b1" rx="3" x="${x - bw / 2}" y="${T + ph - h}" width="${bw}" height="${h}"><title>${m}: ${lk(spend[i])} spend</title></rect>`; pts += `${i ? 'L' : 'M'}${x},${y} `; if (i % ev === 0) s += `<text class="ax" x="${x}" y="${H - 7}" text-anchor="middle">${m}</text>`; });
    labels.forEach((m, i) => { const x = L + i * gw + gw / 2, y = T + ph - (ph * leads[i]) / ml; s += `<circle cx="${x}" cy="${y}" r="3.2" fill="var(--ink)" stroke="var(--card)" stroke-width="1.5"><title>${m}: ${num(leads[i])} leads</title></circle>`; });
    el.innerHTML = s + `<path d="${pts}" fill="none" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    $('#sv').innerHTML = `${lk(D.T.s)} <span class="text-xs font-medium text-mute">${num(D.T.l)} leads</span>`;
  }
  function donut() {
    const S = D.src.map(([n, v], i) => [n, v, '--c' + (i + 1)]), tot = S.reduce((t, x) => t + x[1], 0) || 1, R = 46, C = 2 * Math.PI * R;
    let o = 0, ds = '<g transform="rotate(-90 64 64)">';
    S.forEach(([n, v, col]) => { if (!v) return; const l = (C * v) / tot; ds += `<circle cx="64" cy="64" r="${R}" fill="none" stroke="var(${col})" stroke-width="16" stroke-dasharray="${Math.max(l - (S.filter((x) => x[1]).length > 1 ? 2 : 0), 0.1)} ${C}" stroke-dashoffset="${-o}"><title>${n}: ${num(v)}</title></circle>`; o += l; });
    $('#donut').innerHTML = ds + `</g><text x="64" y="62" text-anchor="middle" class="ax">Leads</text><text x="64" y="80" text-anchor="middle" style="fill:var(--ink);font-size:15px;font-weight:700">${num(tot)}</text>`;
    $('#dv').textContent = num(tot) + ' leads';
    $('#dl').innerHTML = S.map(([n, v, col]) => `<div class="grid grid-cols-[10px_1fr_auto] items-center gap-2 text-xs"><i class="h-2.5 w-2.5 rounded-sm" style="background:var(${col})"></i><span class="min-w-0 truncate">${n}<small class="block text-[11px] text-mute">${num(v)} leads</small></span><strong class="text-sm">${Math.round((v / tot) * 100)}%</strong></div>`).join('');
  }

  /* Client table with sorting */
  const COLS = [['name', 'Client'], ['s', 'Ad spend'], ['l', 'Leads'], ['cpl', 'Cost per lead'], ['w', 'Won'], ['conv', 'Conversion'], ['', 'Spend trend']];
  const spark = (v) => { const mx = Math.max(...v), mn = Math.min(...v), r = mx - mn || 1; const p = v.map((y, i) => `${(i / Math.max(v.length - 1, 1)) * 76 + 2},${22 - ((y - mn) / r) * 18}`).join(' '); return `<svg viewBox="0 0 80 24" class="h-6 w-20" aria-hidden="true"><polyline points="${p}" fill="none" stroke="var(--c1)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`; };
  function table() {
    $('#th').innerHTML = `<tr class="text-left text-xs text-mute">${COLS.map(([k, l], i) => `<th class="${i ? 'px-2' : 'py-2 pr-2'} font-medium">${k ? `<button data-sort="${k}" class="inline-flex items-center gap-1 hover:text-ink ${st.sort === k ? 'text-ink' : ''}">${l}${st.sort === k ? ic('arrow-down', 'h-3 w-3') : ''}</button>` : l}</th>`).join('')}</tr>`;
    const rows = [...D.rows].sort((a, b) => (st.sort === 'name' ? a.name.localeCompare(b.name) : st.sort === 'cpl' ? a.cpl - b.cpl : b[st.sort] - a[st.sort]));
    $('#tb').innerHTML = rows.length ? rows.map((r) => `<tr class="border-t border-line"><td class="max-w-[190px] truncate py-2 pr-2 font-semibold">${r.name}</td><td class="whitespace-nowrap px-2">${lk(r.s)}</td><td class="px-2">${num(r.l)}</td><td class="whitespace-nowrap px-2">${inr(r.cpl)}</td><td class="px-2">${num(r.w)}</td><td class="px-2">${r.conv.toFixed(1)}%</td><td class="px-2">${spark(r.spark)}</td></tr>`).join('') : '<tr><td colspan="7" class="py-8 text-center text-mute">No data for these filters</td></tr>';
  }

  /* Insights worked out from the filtered data */
  function insights() {
    const r = D.rows, out = [];
    if (r.length > 1) {
      const best = [...r].sort((a, b) => a.cpl - b.cpl)[0], top = [...r].sort((a, b) => b.l - a.l)[0], big = [...r].sort((a, b) => b.s - a.s)[0];
      out.push(['g', 'trophy', `${best.name} has the lowest cost per lead`, `${inr(best.cpl)} per lead, ${best.conv.toFixed(1)}% conversion.`]);
      out.push(['o', 'users', `${top.name} brought the most leads`, `${num(top.l)} leads in this period.`]);
      out.push(['o', 'wallet', `${big.name} takes ${Math.round((big.s / D.T.s) * 100)}% of ad spend`, `${lk(big.s)} of ${lk(D.T.s)} total.`]);
    }
    r.filter((x) => x.pcpl && (x.cpl - x.pcpl) / x.pcpl > 0.08).forEach((x) => out.push(['r', 'trending-up', `${x.name}: cost per lead is rising`, `Up ${Math.round(((x.cpl - x.pcpl) / x.pcpl) * 100)}% to ${inr(x.cpl)}. Review creatives and audience.`]));
    r.filter((x) => x.conv < 8).forEach((x) => out.push(['a', 'filter', `${x.name}: low conversion (${x.conv.toFixed(1)}%)`, 'Many leads are not turning into customers. Check follow-up speed.']));
    if (!out.length) out.push(['o', 'info', 'Not enough data to compare', 'Select more clients or a longer period.']);
    const T = { o: 'bg-soft text-brand', g: 'bg-[var(--grnbg)] text-[var(--grn)]', r: 'bg-[var(--redbg)] text-[var(--red)]', a: 'bg-[var(--ambbg)] text-[var(--amb)]' };
    $('#ins').innerHTML = out.slice(0, 5).map(([t, i, a, b]) => `<div class="flex min-w-0 items-start gap-2.5 border-b border-line py-2 last:border-0 last:pb-0"><div class="grid h-8 w-8 shrink-0 place-items-center rounded-lg ${T[t]}">${ic(i)}</div><div class="min-w-0"><b class="block break-words text-[13px] font-semibold">${a}</b><span class="block break-words text-xs text-mute">${b}</span></div></div>`).join('');
  }

  /* Generated and scheduled reports */
  let G = [
    { id: 1, type: 'Performance summary', client: 'Sharma Garments', period: 'Last 3 months', format: 'PDF', by: 'John Doe', when: '1 Nov' },
    { id: 2, type: 'Lead report', client: 'All clients', period: 'Last 3 months', format: 'Excel (CSV)', by: 'Neha Rao', when: '28 Oct' },
    { id: 3, type: 'Campaign report', client: 'Urban Brew Café', period: 'Last 6 months', format: 'PDF', by: 'Riya Shah', when: '12 Oct' },
    { id: 4, type: 'Client monthly report', client: 'Glow Salon', period: 'Last 3 months', format: 'PDF', by: 'John Doe', when: '1 Oct' },
    { id: 5, type: 'Performance summary', client: 'All clients', period: 'Last 12 months', format: 'PDF', by: 'John Doe', when: '1 Sep' },
  ];
  let S = [
    { id: 1, type: 'Performance summary', client: 'All clients', freq: 'Weekly (Monday)', email: 'john@addesk.in', format: 'PDF', next: '23 Nov', active: true },
    { id: 2, type: 'Client monthly report', client: 'Glow Salon', freq: 'Monthly (1st)', email: 'pooja@glowsalon.in', format: 'PDF', next: '1 Dec', active: true },
    { id: 3, type: 'Lead report', client: 'FitZone Gym', freq: 'Weekly (Monday)', email: 'sandeep@fitzone.in', format: 'Excel (CSV)', next: '23 Nov', active: false },
  ];
  const ib = (act, id, icon, label, k = '') => `<button class="ibtn" data-act="${act}" data-id="${id}" data-k="${k}" aria-label="${label}" title="${label}">${ic(icon, 'h-3.5 w-3.5')}</button>`;
  function reports() {
    $('#tabs').innerHTML = [['gen', 'Generated reports', G.length], ['sch', 'Scheduled reports', S.length]].map(([k, l, n]) => { const on = st.tab === k; return `<button role="tab" aria-selected="${on}" data-tab="${k}" class="-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 pb-2 text-xs font-medium ${on ? 'border-brand text-ink' : 'border-transparent text-mute hover:text-ink'}">${l} <span class="ml-0.5 text-[11px] text-mute">${n}</span></button>`; }).join('');
    const fmt = (f) => `<span class="chip whitespace-nowrap" style="background:var(--hover);color:var(--mute)">${f}</span>`;
    const empty = (t) => `<div class="grid place-items-center gap-2 px-4 py-10 text-center"><div class="ico">${ic('file-text')}</div><b>${t}</b></div>`;
    $('#rep').innerHTML = st.tab === 'gen'
      ? (G.length ? `<div class="overflow-x-auto"><table class="w-full min-w-[720px] text-[13px]"><thead><tr class="text-left text-xs text-mute"><th class="py-2 pl-3 pr-2 font-medium">Report</th><th class="px-2 font-medium">Period</th><th class="px-2 font-medium">Format</th><th class="px-2 font-medium">Created by</th><th class="px-2 font-medium">Date</th><th class="py-2 pl-2 pr-3 text-right font-medium">Actions</th></tr></thead><tbody>${G.map((g) => `<tr class="border-t border-line"><td class="max-w-[260px] py-2 pl-3 pr-2"><b class="block truncate">${g.type}</b><span class="block truncate text-xs text-mute">${g.client}</span></td><td class="whitespace-nowrap px-2">${g.period}</td><td class="px-2">${fmt(g.format)}</td><td class="whitespace-nowrap px-2">${g.by}</td><td class="whitespace-nowrap px-2 text-xs text-mute">${g.when}</td><td class="py-2 pl-2 pr-3"><div class="flex justify-end gap-1.5">${ib('download', g.id, 'download', 'Download')}${ib('share', g.id, 'link', 'Copy link')}${ib('del', g.id, 'trash-2', 'Delete', 'gen')}</div></td></tr>`).join('')}</tbody></table></div>` : empty('No reports generated yet'))
      : (S.length ? `<div class="overflow-x-auto"><table class="w-full min-w-[720px] text-[13px]"><thead><tr class="text-left text-xs text-mute"><th class="py-2 pl-3 pr-2 font-medium">Report</th><th class="px-2 font-medium">Frequency</th><th class="px-2 font-medium">Send to</th><th class="px-2 font-medium">Next run</th><th class="px-2 font-medium">Status</th><th class="py-2 pl-2 pr-3 text-right font-medium">Actions</th></tr></thead><tbody>${S.map((x) => `<tr class="border-t border-line"><td class="max-w-[240px] py-2 pl-3 pr-2"><b class="block truncate">${x.type}</b><span class="block truncate text-xs text-mute">${x.client} · ${x.format}</span></td><td class="whitespace-nowrap px-2">${x.freq}</td><td class="max-w-[190px] truncate px-2">${x.email}</td><td class="whitespace-nowrap px-2">${x.active ? x.next : '-'}</td><td class="px-2"><span class="chip" ${x.active ? '' : 'style="background:var(--hover);color:var(--mute)"'}>${x.active ? 'Active' : 'Paused'}</span></td><td class="py-2 pl-2 pr-3"><div class="flex justify-end gap-1.5">${ib('toggle', x.id, x.active ? 'pause' : 'play', x.active ? 'Pause' : 'Resume')}${ib('del', x.id, 'trash-2', 'Delete', 'sch')}</div></td></tr>`).join('')}</tbody></table></div>` : empty('No scheduled reports'));
  }

  /* Downloads */
  function csvFile(rows, name) {
    const esc = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows.map((r) => r.map(esc).join(',')).join('\n')], { type: 'text/csv' })); a.download = name; document.body.append(a); a.click(); a.remove();
  }
  const tableRows = (d) => [['Client', 'Ad spend (INR lakh)', 'Leads', 'Cost per lead (INR)', 'Won', 'Conversion (%)'], ...d.rows.map((r) => [r.name, r.s.toFixed(2), Math.round(r.l), Math.round(r.cpl), Math.round(r.w), r.conv.toFixed(1)])];

  function render() { D = calc(st); kpis(); combo(); donut(); table(); insights(); reports(); A.icons(); }

  /* Events */
  document.addEventListener('click', (e) => {
    const sv = e.target.closest('[data-sort]'); if (sv) { st.sort = sv.dataset.sort; table(); A.icons(); return; }
    const tb = e.target.closest('[data-tab]'); if (tb) { st.tab = tb.dataset.tab; reports(); A.icons(); return; }
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act, id = +b.dataset.id;
    if (a === 'csv') { csvFile(tableRows(D), 'client-performance.csv'); A.toast('Exported client performance'); }
    else if (a === 'print') window.print();
    else if (a === 'download') {
      const g = G.find((x) => x.id === id);
      if (g.format.startsWith('Excel')) { csvFile(tableRows(calc({ p: g.period, c: g.client === 'All clients' ? '' : g.client, pl: '' })), g.type.toLowerCase().replace(/\s+/g, '-') + '.csv'); A.toast('Downloaded ' + g.type); }
      else A.toast('PDF files are created by the server in the live product (demo)');
    }
    else if (a === 'share') { try { navigator.clipboard.writeText('https://app.addesk.in/reports/' + id); } catch (x) {} A.toast('Link copied'); }
    else if (a === 'toggle') { const x = S.find((s) => s.id === id); x.active = !x.active; A.toast(x.type + (x.active ? ' resumed' : ' paused')); reports(); A.icons(); }
    else if (a === 'del') { const x = (b.dataset.k === 'gen' ? G : S).find((r) => r.id === id); A.openForm('reportDelete', { id, kind: b.dataset.k, label: x.type + ', ' + x.client }); }
  });
  const bind = (sel, key) => $(sel).addEventListener('change', (e) => { st[key] = e.target.value; render(); });
  bind('#fp', 'p'); bind('#fc', 'c'); bind('#fl', 'pl');
  $('#fc').innerHTML = '<option value="">All clients</option>' + A.clients.map((n) => `<option>${n}</option>`).join('');

  document.addEventListener('form:saved', ({ detail: { key, data, vals } }) => {
    const today = '18 Nov';
    if (key === 'report') { G.unshift({ id: Math.max(0, ...G.map((x) => x.id)) + 1, type: data.type, client: data.client, period: data.period, format: data.format, by: 'John Doe', when: today }); st.tab = 'gen'; if (data.email) A.toast('Report ready. A copy was emailed to ' + data.email); }
    else if (key === 'schedule') { S.unshift({ id: Math.max(0, ...S.map((x) => x.id)) + 1, type: data.type, client: data.client, freq: data.freq, email: data.email, format: data.format, next: data.freq.startsWith('Weekly') ? '23 Nov' : '1 Dec', active: true }); st.tab = 'sch'; }
    else if (key === 'reportDelete') { if (vals.kind === 'gen') G = G.filter((x) => x.id !== vals.id); else S = S.filter((x) => x.id !== vals.id); }
    else return;
    reports(); A.icons();
  });

  const cq = document.querySelector('.cq'); let raf;
  new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { combo(); A.icons(); }); }).observe(cq);
  render();
})();