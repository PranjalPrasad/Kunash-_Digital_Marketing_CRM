/* Agency pricing page only. Sample data: replace PL, AD, CL with API data later. */
(function () {
  const A = window.AdDesk, $ = (s) => document.querySelector(s);
  const ic = (n, c = 'h-4 w-4') => `<i data-lucide="${n}" class="${c}"></i>`;
  const TODAY = '2026-11-18', ME = 'John Doe', PAGE = 8;
  const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
  const fd = (i) => new Date(i + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const AV = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const CYC = { Monthly: [1, 'month'], Quarterly: [3, 'quarter'], Yearly: [12, 'year'] };

  /* Plans. pending = a price change that starts on a future date */
  let PL = [
    { id: 1, name: 'Starter', price: 15000, billing: 'Monthly', gst: 18, campaigns: 2, creatives: 8, platforms: 'Meta', reports: 'Monthly', extra: '', desc: 'For small local businesses starting with paid ads.', status: 'Active', popular: false, pending: null },
    { id: 2, name: 'Growth', price: 30000, billing: 'Monthly', gst: 18, campaigns: 5, creatives: 16, platforms: 'Meta + Google', reports: 'Weekly + monthly', extra: 'Monthly strategy call', desc: 'For growing brands running campaigns on more than one platform.', status: 'Active', popular: true, pending: null },
    { id: 3, name: 'Premium', price: 60000, billing: 'Monthly', gst: 18, campaigns: 10, creatives: 30, platforms: 'Meta + Google', reports: 'Weekly + monthly', extra: 'Dedicated account manager', desc: 'For high-spend brands that need a dedicated team.', status: 'Active', popular: false, pending: null },
  ];
  let AD = [
    { id: 1, name: 'Extra creative', price: 1500, unit: 'Per creative', desc: 'One additional image or carousel beyond the plan limit.', status: 'Active', used: 9 },
    { id: 2, name: 'Video shoot (half day)', price: 12000, unit: 'One-time', desc: 'On-site shoot with basic editing.', status: 'Active', used: 3 },
    { id: 3, name: 'Landing page', price: 8000, unit: 'One-time', desc: 'Single page built for a campaign.', status: 'Active', used: 4 },
    { id: 4, name: 'Extra platform management', price: 5000, unit: 'Per month', desc: 'Manage one more ad platform.', status: 'Active', used: 2 },
    { id: 5, name: 'WhatsApp follow-up setup', price: 4000, unit: 'One-time', desc: 'Automated first reply for new leads.', status: 'Inactive', used: 0 },
  ];
  /* custom = fixed price override, disc = % off plan price, from = date the adjustment starts */
  const c = (id, name, plan, custom = 0, disc = 0, from = '', reason = 'Standard pricing', status = 'Active') => ({ id, name, plan, custom, disc, from, reason, status });
  let CL = [
    c(1, 'Sharma Garments', 'Premium'), c(2, 'Kapoor Jewellers', 'Premium'), c(3, 'Zenith Motors', 'Premium', 55000, 0, '2026-12-01', 'Long-term contract'),
    c(4, 'Urban Brew Café', 'Growth'), c(5, 'FitZone Gym', 'Growth'), c(6, 'Green Basket', 'Growth'), c(7, 'Nest Interiors', 'Growth'), c(8, 'EduSpark Classes', 'Growth'),
    c(9, 'Glow Salon', 'Starter', 0, 10, '2026-12-01', 'Loyalty'), c(10, 'Bright Smiles Dental', 'Starter'), c(11, 'Pune Pedal Cycles', 'Starter', 0, 0, '', 'Standard pricing', 'Inactive'),
  ];
  let H = [
    ['Zenith Motors: custom price ₹55,000 set from 1 Dec 2026 (Long-term contract)', ME, 'Yesterday'],
    ['Glow Salon: 10% discount set from 1 Dec 2026 (Loyalty)', ME, '3 days ago'],
    ['Growth plan price changed from ₹28,000 to ₹30,000, effective 1 Sep 2026', ME, 'Aug 2026'],
    ['Add-on "Video shoot (half day)" price changed from ₹10,000 to ₹12,000', ME, 'Jul 2026'],
    ['Premium plan created at ₹60,000', ME, 'Jan 2025'],
  ];
  const syncPlans = () => { A.plans = PL.filter((p) => p.status === 'Active').map((p) => p.name); };
  syncPlans();
  const hist = (t) => H.unshift([t, ME, 'Just now']);
  const plan = (n) => PL.find((p) => p.name === n);
  $('#fp').innerHTML = '<option value="">All plans</option>' + PL.map((p) => `<option>${p.name}</option>`).join('');

  /* Money rules: fee = custom price, or plan price less discount, once the adjustment has started */
  const adj = (x) => (x.custom || x.disc) && x.from && x.from <= TODAY;
  const fee = (x) => { const p = plan(x.plan); if (!p) return 0; return adj(x) ? (x.custom || p.price * (1 - x.disc / 100)) : p.price; };
  const perMonth = (x) => { const p = plan(x.plan); return p ? fee(x) / CYC[p.billing][0] : 0; };
  const gstOf = (x) => { const p = plan(x.plan); return p ? p.gst : 0; };
  const on = (p) => CL.filter((x) => x.plan === p.name && x.status === 'Active');

  function kpis() {
    const act = CL.filter((x) => x.status === 'Active'), mrr = act.reduce((t, x) => t + perMonth(x), 0);
    const K = [['layers', 'Active plans', PL.filter((p) => p.status === 'Active').length], ['users', 'Clients on plans', act.length], ['indian-rupee', 'Monthly revenue', inr(mrr)], ['trending-up', 'Avg per client', inr(act.length ? mrr / act.length : 0)], ['badge-percent', 'Custom pricing', CL.filter((x) => x.custom || x.disc).length]];
    $('#kpis').innerHTML = K.map(([i, l, v]) => `<div class="card flex min-w-0 items-center gap-2.5 p-3"><div class="ico">${ic(i)}</div><div class="min-w-0"><div class="ttl">${l}</div><div class="truncate text-lg font-bold leading-tight">${v}</div></div></div>`).join('');
  }

  function plans() {
    $('#pv').textContent = PL.filter((p) => p.status === 'Active').length + ' active plans';
    $('#plans').innerHTML = `<div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-3">${PL.map((p) => {
      const n = on(p).length, feats = [`${p.campaigns} active campaigns`, `${p.creatives} creatives per month`, p.platforms, `${p.reports} reports`, p.extra].filter(Boolean);
      return `<div class="relative flex min-w-0 flex-col rounded-xl border ${p.popular ? 'border-brand' : 'border-line'} p-4 ${p.status === 'Active' ? '' : 'opacity-70'}">
        <div class="flex min-w-0 items-center gap-2"><b class="min-w-0 flex-1 truncate text-base">${p.name}</b>${p.popular ? '<span class="chip">Most popular</span>' : ''}${p.status === 'Active' ? '' : '<span class="chip" style="background:var(--hover);color:var(--mute)">Archived</span>'}</div>
        <p class="mt-1 line-clamp-2 min-h-[2rem] break-words text-xs text-mute">${p.desc}</p>
        <div class="mt-3"><span class="text-2xl font-bold">${inr(p.price)}</span><span class="text-xs text-mute"> / ${CYC[p.billing][1]} + ${p.gst}% GST</span></div>
        ${p.pending ? `<div class="mt-1"><span class="chip am">${inr(p.pending.price)} from ${fd(p.pending.from)}</span></div>` : ''}
        <ul class="mt-3 space-y-1.5">${feats.map((f) => `<li class="flex min-w-0 items-start gap-2 text-[13px]"><span class="mt-0.5 shrink-0 text-[var(--grn)]">${ic('check', 'h-3.5 w-3.5')}</span><span class="min-w-0 break-words">${f}</span></li>`).join('')}</ul>
        <div class="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3"><span class="min-w-0 flex-1 truncate text-xs text-mute">${n} client${n === 1 ? '' : 's'}</span>
          <button class="ibtn" data-act="pedit" data-id="${p.id}" aria-label="Edit ${p.name}" title="Edit plan">${ic('pencil', 'h-3.5 w-3.5')}</button>
          <button class="ibtn" data-act="pprice" data-id="${p.id}" aria-label="Change price" title="Change price">${ic('badge-indian-rupee', 'h-3.5 w-3.5')}</button>
          <button class="ibtn" data-act="ptoggle" data-id="${p.id}" aria-label="${p.status === 'Active' ? 'Archive' : 'Activate'} ${p.name}" title="${p.status === 'Active' ? 'Archive' : 'Activate'}">${ic(p.status === 'Active' ? 'archive' : 'archive-restore', 'h-3.5 w-3.5')}</button></div></div>`;
    }).join('')}</div>`;
  }

  /* Client pricing list */
  const st = { q: '', p: '', custom: false, page: 1, narrow: false };
  const rows = () => { const q = st.q.trim().toLowerCase(); return CL.filter((x) => (!q || x.name.toLowerCase().includes(q)) && (!st.p || x.plan === st.p) && (!st.custom || x.custom || x.disc)); };
  const adjHtml = (x) => { if (!x.custom && !x.disc) return '<span class="text-xs text-mute">Standard</span>'; const t = x.custom ? 'Custom ' + inr(x.custom) : '-' + x.disc + '%'; return `<span class="chip ${adj(x) ? '' : 'am'} whitespace-nowrap">${t}</span>${adj(x) ? '' : `<div class="text-[11px] text-mute">from ${fd(x.from)}</div>`}`; };
  const feeHtml = (x) => `<b class="whitespace-nowrap">${inr(fee(x))}</b><div class="whitespace-nowrap text-[11px] text-mute">${inr(fee(x) * (1 + gstOf(x) / 100))} with GST</div>`;
  const stChip = (s) => `<span class="chip whitespace-nowrap" ${s === 'Active' ? '' : 'style="background:var(--hover);color:var(--mute)"'}>${s}</span>`;
  function clients() {
    const r = rows(), pages = Math.max(1, Math.ceil(r.length / PAGE)); st.page = Math.min(st.page, pages);
    const sl = r.slice((st.page - 1) * PAGE, st.page * PAGE), edit = (x) => `<button class="ibtn" data-act="cedit" data-id="${x.id}" aria-label="Edit pricing for ${x.name}" title="Edit pricing">${ic('pencil', 'h-3.5 w-3.5')}</button>`;
    $('#cu').className = `flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium ${st.custom ? 'border-brand bg-soft text-brand' : 'border-line text-mute hover:bg-hov hover:text-ink'}`;
    if (!sl.length) $('#list').innerHTML = `<div class="grid place-items-center gap-2 px-4 py-10 text-center"><div class="ico">${ic('search-x')}</div><b>No clients found</b><button class="btn-o" data-act="clear">Clear filters</button></div>`;
    else if (st.narrow) $('#list').innerHTML = `<div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-3 p-3">${sl.map((x) => `<div class="min-w-0 rounded-xl border border-line p-3"><div class="flex min-w-0 items-center gap-2"><div class="av">${AV(x.name)}</div><div class="min-w-0 flex-1"><b class="block truncate text-[13px]">${x.name}</b><span class="block truncate text-xs text-mute">${x.plan} plan</span></div>${stChip(x.status)}</div><div class="mt-3 flex items-end justify-between gap-2"><div class="min-w-0">${feeHtml(x)}</div><div class="shrink-0">${adjHtml(x)}</div></div><div class="mt-3 flex justify-end">${edit(x)}</div></div>`).join('')}</div>`;
    else $('#list').innerHTML = `<div class="overflow-x-auto"><table class="w-full min-w-[640px] text-[13px]"><thead><tr class="text-left text-xs text-mute"><th class="py-2 pl-3 pr-2 font-medium">Client</th><th class="px-2 font-medium">Plan</th><th class="px-2 font-medium">Adjustment</th><th class="px-2 font-medium">Monthly fee</th><th class="px-2 font-medium">Status</th><th class="py-2 pl-2 pr-3 text-right font-medium">Edit</th></tr></thead><tbody>${sl.map((x) => `<tr class="border-t border-line hover:bg-hov/50"><td class="max-w-[220px] py-2 pl-3 pr-2"><div class="flex min-w-0 items-center gap-2"><div class="av">${AV(x.name)}</div><b class="truncate">${x.name}</b></div></td><td class="px-2">${x.plan}</td><td class="px-2">${adjHtml(x)}</td><td class="px-2">${feeHtml(x)}</td><td class="px-2">${stChip(x.status)}</td><td class="py-2 pl-2 pr-3"><div class="flex justify-end">${edit(x)}</div></td></tr>`).join('')}</tbody></table></div>`;
    $('#pager').classList.toggle('hidden', pages <= 1);
    $('#pager').innerHTML = `<span>Showing ${(st.page - 1) * PAGE + 1}–${Math.min(st.page * PAGE, r.length)} of ${r.length} clients</span><div class="flex items-center gap-2"><button class="ibtn disabled:opacity-40" data-act="prev" aria-label="Previous page" ${st.page <= 1 ? 'disabled' : ''}>${ic('chevron-left', 'h-3.5 w-3.5')}</button><span>Page ${st.page} of ${pages}</span><button class="ibtn disabled:opacity-40" data-act="next" aria-label="Next page" ${st.page >= pages ? 'disabled' : ''}>${ic('chevron-right', 'h-3.5 w-3.5')}</button></div>`;
  }

  function history() { $('#hist').innerHTML = H.slice(0, 8).map(([t, by, when]) => `<div class="flex min-w-0 gap-2.5 border-b border-line py-2 text-[13px] last:border-0 last:pb-0"><span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand"></span><div class="min-w-0"><div class="break-words">${t}</div><div class="text-xs text-mute">${by}, ${when}</div></div></div>`).join(''); }

  function addons() {
    $('#addons').innerHTML = `<div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))] gap-3">${AD.map((a) => `<div class="min-w-0 rounded-xl border border-line p-3 ${a.status === 'Active' ? '' : 'opacity-70'}"><div class="flex min-w-0 items-start gap-2"><b class="min-w-0 flex-1 truncate text-[13px]">${a.name}</b>${stChip(a.status)}</div><div class="mt-1"><b class="text-base">${inr(a.price)}</b> <span class="text-xs text-mute">${a.unit.toLowerCase()}</span></div><p class="mt-1 line-clamp-2 min-h-[2rem] break-words text-xs text-mute">${a.desc}</p><div class="mt-3 flex items-center gap-2"><span class="min-w-0 flex-1 truncate text-xs text-mute">Used by ${a.used} client${a.used === 1 ? '' : 's'}</span><button class="ibtn" data-act="aedit" data-id="${a.id}" aria-label="Edit ${a.name}" title="Edit">${ic('pencil', 'h-3.5 w-3.5')}</button><button class="ibtn" data-act="atoggle" data-id="${a.id}" aria-label="${a.status === 'Active' ? 'Deactivate' : 'Activate'} ${a.name}" title="${a.status === 'Active' ? 'Deactivate' : 'Activate'}">${ic(a.status === 'Active' ? 'pause' : 'play', 'h-3.5 w-3.5')}</button></div></div>`).join('')}</div>`;
  }

  function render() { kpis(); plans(); clients(); history(); addons(); A.icons(); }

  /* Impact shown before a plan price changes */
  function impact(p, np) {
    const act = on(p), std = act.filter((x) => !x.custom), cus = act.length - std.length;
    const diff = std.reduce((t, x) => t + (np - p.price) * (1 - (adj(x) ? x.disc : 0) / 100), 0) / CYC[p.billing][0];
    return `${std.length} client${std.length === 1 ? '' : 's'} pay the standard price and will be billed the new price on invoices from the effective date. Monthly revenue changes by ${diff >= 0 ? '+' : '-'}${inr(Math.abs(diff))} in total.${cus ? ` ${cus} client${cus === 1 ? ' has' : 's have'} a custom price and ${cus === 1 ? 'is' : 'are'} not affected.` : ''} Invoices already sent do not change.`;
  }

  /* Clicks */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act, id = +b.dataset.id;
    if (a === 'pedit') { const p = PL.find((x) => x.id === id); A.openForm('planEdit', { ...p }); }
    else if (a === 'pprice') { const p = PL.find((x) => x.id === id); A.openForm('planPrice', { id, plan: p.name, current: inr(p.price) + ' / ' + CYC[p.billing][1], price: p.price, from: TODAY, impact: impact(p, p.price) }); }
    else if (a === 'ptoggle') {
      const p = PL.find((x) => x.id === id), n = on(p).length;
      if (p.status === 'Active' && n) { A.toast(`Move the ${n} client${n > 1 ? 's' : ''} on ${p.name} to another plan before archiving it`); return; }
      p.status = p.status === 'Active' ? 'Archived' : 'Active'; hist(`${p.name} plan ${p.status === 'Active' ? 'activated' : 'archived'}`); syncPlans(); A.toast(`${p.name} ${p.status === 'Active' ? 'activated' : 'archived'}`); render();
    }
    else if (a === 'aedit') { const x = AD.find((q) => q.id === id); A.openForm('addonEdit', { ...x }); }
    else if (a === 'atoggle') { const x = AD.find((q) => q.id === id); x.status = x.status === 'Active' ? 'Inactive' : 'Active'; hist(`Add-on "${x.name}" ${x.status === 'Active' ? 'activated' : 'deactivated'}`); A.toast(x.name + ' is now ' + x.status.toLowerCase()); render(); }
    else if (a === 'cedit') { const x = CL.find((q) => q.id === id); A.openForm('clientPrice', { id, client: x.name, plan: x.plan, custom: x.custom || '', discount: x.disc || '', from: x.from || TODAY, reason: x.reason }); }
    else if (a === 'prev') { st.page--; clients(); A.icons(); } else if (a === 'next') { st.page++; clients(); A.icons(); }
    else if (a === 'clear') { Object.assign(st, { q: '', p: '', custom: false, page: 1 }); $('#q').value = ''; $('#fp').value = ''; clients(); A.icons(); }
  });
  $('#q').addEventListener('input', (e) => { st.q = e.target.value; st.page = 1; clients(); A.icons(); });
  $('#fp').addEventListener('change', (e) => { st.p = e.target.value; st.page = 1; clients(); A.icons(); });
  $('#cu').addEventListener('click', () => { st.custom = !st.custom; st.page = 1; clients(); A.icons(); });

  /* Overlay forms */
  const planFields = (d) => ({ billing: d.billing, campaigns: +d.campaigns || 0, creatives: +d.creatives || 0, platforms: d.platforms, reports: d.reports, extra: d.extra || '', desc: d.desc || '' });
  document.addEventListener('form:saved', ({ detail: { key, data, vals } }) => {
    if (key === 'plan') {
      if (PL.some((p) => p.name.toLowerCase() === data.name.trim().toLowerCase())) { A.toast('A plan with this name already exists'); return; }
      PL.push({ id: Math.max(0, ...PL.map((p) => p.id)) + 1, name: data.name.trim(), price: +data.price || 0, gst: 18, ...planFields(data), status: 'Active', popular: false, pending: null });
      hist(`${data.name} plan created at ${inr(+data.price)}`); syncPlans();
    } else if (key === 'planEdit') {
      const p = PL.find((x) => x.id === vals.id), old = p.name, nn = data.name.trim();
      if (nn !== old && PL.some((x) => x.name.toLowerCase() === nn.toLowerCase())) { A.toast('A plan with this name already exists'); return; }
      Object.assign(p, { name: nn, ...planFields(data) }); CL.forEach((x) => { if (x.plan === old) x.plan = nn; });
      hist(`${nn} plan details updated`); syncPlans();
    } else if (key === 'planPrice') {
      const p = PL.find((x) => x.id === vals.id), np = +data.price;
      if (!(np > 0) || np === p.price) { A.toast('Enter a new price that is different from the current one'); return; }
      const was = p.price;
      if (data.from <= TODAY) { p.price = np; p.pending = null; } else p.pending = { price: np, from: data.from };
      hist(`${p.name} plan price changed from ${inr(was)} to ${inr(np)}, effective ${fd(data.from)} (${data.reason})`);
      A.toast(data.from <= TODAY ? `${p.name} is now ${inr(np)}` : `${p.name} will change to ${inr(np)} from ${fd(data.from)}`);
    } else if (key === 'addon') {
      AD.push({ id: Math.max(0, ...AD.map((a) => a.id)) + 1, name: data.name, price: +data.price || 0, unit: data.unit, desc: data.desc || '', status: 'Active', used: 0 }); hist(`Add-on "${data.name}" created at ${inr(+data.price)}`);
    } else if (key === 'addonEdit') {
      const x = AD.find((q) => q.id === vals.id), was = x.price; Object.assign(x, { name: data.name, price: +data.price || 0, unit: data.unit, desc: data.desc || '' });
      hist(was !== x.price ? `Add-on "${x.name}" price changed from ${inr(was)} to ${inr(x.price)}` : `Add-on "${x.name}" updated`);
    } else if (key === 'clientPrice') {
      const x = CL.find((q) => q.id === vals.id), cu = +data.custom || 0, di = +data.discount || 0;
      if (di < 0 || di > 100) { A.toast('Discount must be between 0 and 100'); return; }
      const keepCustom = cu > 0; if (keepCustom && di) A.toast('Custom price overrides the discount');
      const planChanged = data.plan !== x.plan; x.plan = data.plan; x.custom = cu; x.disc = keepCustom ? 0 : di; x.from = cu || di ? data.from : ''; x.reason = data.reason;
      hist(`${x.name}: ${planChanged ? 'moved to ' + data.plan + '. ' : ''}${keepCustom ? 'custom price ' + inr(cu) : di ? di + '% discount' : 'standard pricing'}${cu || di ? ' from ' + fd(data.from) : ''} (${data.reason})`);
    } else return;
    render();
  });

  const cq = document.querySelector('.cq');
  new ResizeObserver(() => { const n = cq.clientWidth < 560; if (n !== st.narrow) { st.narrow = n; clients(); A.icons(); } }).observe(cq);
  st.narrow = cq.clientWidth < 560;
  render();
})();