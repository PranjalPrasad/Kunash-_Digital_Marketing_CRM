/* Dashboard page only. Sample data: replace with API calls later. */
(function () {
  const $ = (s) => document.querySelector(s);
  const ic = (n, c = 'h-4 w-4') => `<i data-lucide="${n}" class="${c}"></i>`;
  const up = (t) => `<span class="chip">${ic('arrow-up-right', 'h-3 w-3')}${t}</span>`;
  const AV = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const TONE = { o: 'bg-soft text-brand', r: 'bg-[var(--redbg)] text-[var(--red)]', a: 'bg-[var(--ambbg)] text-[var(--amb)]', g: 'bg-[var(--grnbg)] text-[var(--grn)]' };
  const item = (av, title, sub, right = '') => `<div class="li">${av}<div class="min-w-0 flex-1"><b class="block truncate text-[13px] font-semibold">${title}</b><span class="block truncate text-xs text-mute">${sub}</span></div>${right}</div>`;

  /* KPI cards */
  const K = [['building-2', 'Total clients', '24', up('+2'), 'new this month'], ['megaphone', 'Active campaigns', '47', up('+6'), 'vs last month'], ['wallet', 'Ad spend', '₹8.42L', up('12.4%'), 'vs last 30 days'], ['indian-rupee', 'Agency revenue', '₹6.80L', up('8.1%'), 'vs last 30 days'], ['users', 'Leads', '3,284', up('18.2%'), 'vs last 30 days'], ['receipt', 'Pending payments', '₹1.92L', '<span class="chip dn">2 overdue</span>', '5 open']];
  $('#kpis').innerHTML = K.map(([i, l, v, c, s]) => `<div class="card"><div class="flex min-w-0 items-center gap-2.5 p-3 pb-2"><div class="ico">${ic(i)}</div><div class="min-w-0"><div class="ttl">${l}</div><div class="truncate text-lg font-bold leading-tight">${v}</div></div></div><div class="mx-2 mb-2 flex min-w-0 items-center gap-1.5 rounded-md bg-bg px-2 py-1 text-[11px] text-mute">${c}<span class="truncate">${s}</span></div></div>`).join('');

  /* Charts redraw at the real width, so they never overflow or shrink the text */
  const MO = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  const D = {
    spend: { a: [3.1, 3.8, 4.2, 4, 4.9, 5.3, 5.1, 6, 6.4, 7.2, 7.9, 8.4], p: [3.5, 4, 4.5, 4.5, 5, 5.5, 5.8, 6.2, 6.8, 7, 8.2, 8.8], max: 10, step: 2, f: (v) => '₹' + v + 'L', t: 'Ad spend (₹ lakh)', cur: '₹8.42L', ch: '12.4%' },
    leads: { a: [1210, 1380, 1500, 1460, 1790, 1920, 1880, 2240, 2410, 2760, 3010, 3284], p: [1300, 1450, 1600, 1600, 1800, 2000, 2100, 2300, 2500, 2700, 3100, 3400], max: 4000, step: 1000, f: (v) => v.toLocaleString('en-IN'), t: 'Leads', cur: '3,284', ch: '18.2%' },
  };
  let mode = 'spend';

  function bars() {
    const el = $('#bars'), W = Math.max(el.parentElement.clientWidth, 220), H = 210, L = 34, B = 24, T = 6, ph = H - B - T, d = D[mode];
    const gw = (W - L) / 12, bw = Math.max(3, Math.min(14, gw * 0.3)), ev = gw < 30 ? 2 : 1;
    el.setAttribute('viewBox', `0 0 ${W} ${H}`); el.setAttribute('height', H);
    let s = '';
    for (let v = 0; v <= d.max; v += d.step) {
      const y = T + ph - (ph * v) / d.max;
      s += `<line class="gl" x1="${L}" x2="${W}" y1="${y}" y2="${y}"/><text class="ax" x="${L - 6}" y="${y + 4}" text-anchor="end">${mode === 'spend' ? v : v / 1000 + 'k'}</text>`;
    }
    MO.forEach((m, i) => {
      const x = L + i * gw + gw / 2, a = (ph * d.a[i]) / d.max, p = (ph * d.p[i]) / d.max;
      s += `<rect class="b1" rx="3" x="${x - bw - 1}" y="${T + ph - a}" width="${bw}" height="${a}"><title>${m} actual: ${d.f(d.a[i])}</title></rect><rect class="b2" rx="3" x="${x + 1}" y="${T + ph - p}" width="${bw}" height="${p}"><title>${m} planned: ${d.f(d.p[i])}</title></rect>`;
      if (i % ev === 0) s += `<text class="ax" x="${x}" y="${H - 7}" text-anchor="middle">${m}</text>`;
    });
    el.innerHTML = s; $('#mt').textContent = d.t; $('#mv').innerHTML = d.cur + ' ' + up(d.ch); A.icons();
  }

  function area() {
    const el = $('#area'), v = [3.2, 3.5, 3.9, 4.1, 4.4, 4.8, 5, 5.4, 5.9, 6.2, 6.5, 6.8];
    const W = Math.max(el.parentElement.clientWidth, 200), H = 210, L = 26, B = 24, T = 6, ph = H - B - T, mx = 8, st = (W - L - 8) / 11;
    el.setAttribute('viewBox', `0 0 ${W} ${H}`); el.setAttribute('height', H);
    const P = v.map((y, i) => [L + i * st, T + ph - (ph * y) / mx]);
    let d = 'M' + P[0];
    for (let i = 1; i < P.length; i++) { const a = P[i - 1], b = P[i], cx = (a[0] + b[0]) / 2; d += ` C${cx},${a[1]} ${cx},${b[1]} ${b}`; }
    let s = '<defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--c1);stop-opacity:.35"/><stop offset="1" style="stop-color:var(--c1);stop-opacity:.02"/></linearGradient></defs>';
    for (let t = 0; t <= 8; t += 2) { const y = T + ph - (ph * t) / mx; s += `<line class="gl" x1="${L}" x2="${W}" y1="${y}" y2="${y}"/><text class="ax" x="${L - 5}" y="${y + 4}" text-anchor="end">${t}</text>`; }
    const ev = st < 26 ? 3 : 2;
    MO.forEach((m, i) => { if (i % ev === 0) s += `<text class="ax" x="${P[i][0]}" y="${H - 7}" text-anchor="middle">${m}</text>`; });
    s += `<path d="${d} L${P[11][0]},${T + ph} L${L},${T + ph} Z" fill="url(#ag)"/><path d="${d}" fill="none" stroke="var(--c1)" stroke-width="2.4" stroke-linecap="round"/><circle cx="${P[11][0]}" cy="${P[11][1]}" r="4" fill="var(--c1)" stroke="var(--card)" stroke-width="2"/>`;
    el.innerHTML = s;
  }

  $('#seg').onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    mode = b.dataset.m;
    document.querySelectorAll('#seg button').forEach((x) => { const on = x === b; x.classList.toggle('bg-card', on); x.classList.toggle('shadow-sm', on); x.classList.toggle('text-mute', !on); });
    bars();
  };

  /* Donut */
  const S = [['New', 1248, '--c1'], ['Contacted', 887, '--c2'], ['Qualified', 722, '--c3'], ['Won', 427, '--c4']], TOT = 3284, R = 46, C = 2 * Math.PI * R;
  let o = 0, ds = '<g transform="rotate(-90 64 64)">';
  S.forEach(([n, c, col]) => { const l = (C * c) / TOT; ds += `<circle cx="64" cy="64" r="${R}" fill="none" stroke="var(${col})" stroke-width="16" stroke-dasharray="${l - 2} ${C - l + 2}" stroke-dashoffset="${-o}"><title>${n}: ${c}</title></circle>`; o += l; });
  $('#donut').innerHTML = ds + '</g><text x="64" y="62" text-anchor="middle" class="ax">This month</text><text x="64" y="80" text-anchor="middle" style="fill:var(--ink);font-size:15px;font-weight:700">3,284</text>';
  $('#dl').innerHTML = S.map(([n, c, col]) => `<div class="grid grid-cols-[10px_1fr_auto] items-center gap-2 text-xs"><i class="h-2.5 w-2.5 rounded-sm" style="background:var(${col})"></i><span class="min-w-0 truncate">${n}<small class="block text-[11px] text-mute">${c.toLocaleString('en-IN')} leads</small></span><strong class="text-sm">${Math.round((c / TOT) * 100)}%</strong></div>`).join('');

  /* Lists */
  $('#appr').innerHTML = [['Sharma Garments', 'Diwali carousel v3, waiting 2 days'], ['Urban Brew Café', 'Cold coffee price changed, new creative due'], ['Kapoor Jewellers', 'Dhanteras banner, waiting 1 day'], ['FitZone Gym', 'Membership reel, changes requested'], ['Glow Salon', 'Bridal package caption, waiting 4 hrs']]
    .map(([c, s]) => item(`<div class="av">${AV(c)}</div>`, c, s, `<button class="btn-o" data-form="remind" data-client="${c}">Remind</button>`)).join('');

  $('#alerts').innerHTML = [['r', 'refresh-cw', '2 accounts need reconnect', 'Meta token expiring: FitZone, Glow Salon', 'Reconnect'], ['a', 'file-warning', '3 creatives may be outdated', 'Offer prices changed in live ads', 'Review'], ['a', 'gauge', '1 campaign near budget', 'Glow Salon Meta ads at 92%', 'Check'], ['r', 'receipt', '2 invoices overdue', '₹58,400: Urban Brew, FitZone', 'Remind']]
    .map(([t, i, a, b, btn]) => item(`<div class="ai ${TONE[t]}">${ic(i)}</div>`, a, b, btn === 'Remind' ? `<button class="btn-o" data-form="remind">Remind</button>` : `<button class="btn-o" data-toast="${btn} comes with its module">${btn}</button>`)).join('');

  const ST = { ok: ['', 'Active'], up: ['am', 'Update creative'], bd: ['am', 'Budget 92%'], rc: ['dn', 'Reconnect Meta'] };
  $('#tb').innerHTML = [['Sharma Garments', 6, '₹1.64L', '612', 'ok'], ['Kapoor Jewellers', 5, '₹1.48L', '296', 'ok'], ['Urban Brew Café', 4, '₹1.12L', '488', 'up'], ['FitZone Gym', 3, '₹0.96L', '541', 'rc'], ['Glow Salon', 4, '₹0.72L', '377', 'bd']]
    .map(([n, c, s, l, st]) => `<tr class="border-t border-line"><td class="py-2 pr-2"><div class="flex min-w-0 items-center gap-2"><div class="av">${AV(n)}</div><span class="truncate font-semibold">${n}</span></div></td><td class="px-2">${c}</td><td class="px-2">${s}</td><td class="px-2">${l}</td><td class="pl-2"><span class="chip ${ST[st][0]}">${ST[st][1]}</span></td></tr>`).join('');

  $('#act').innerHTML = [['o', 'upload', 'Priya uploaded v3 of Diwali carousel', 'Sharma Garments, 12 min ago'], ['a', 'tags', 'Price changed: Cold coffee ₹180 to ₹160', '3 creatives flagged, 1 hr ago'], ['g', 'rocket', 'Rohan published Festive Sale on Meta', 'Kapoor Jewellers, 2 hrs ago'], ['o', 'user-plus', 'New lead from Meta Lead Ad', 'Glow Salon, 3 hrs ago'], ['g', 'circle-check', 'Invoice INV-0142 marked paid', 'Sharma Garments, yesterday']]
    .map(([t, i, a, b]) => item(`<div class="ai ${TONE[t]}">${ic(i)}</div>`, a, b)).join('');

  /* Redraw charts whenever the content width changes (window resize or sidebar expand/collapse) */
  const A = window.AdDesk; let raf;
  new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { bars(); area(); }); }).observe(document.querySelector('.cq'));
  bars(); area(); A.icons();
})();