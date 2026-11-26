/* Campaigns page only. Sample data: replace `C` with API data later. */
(function () {
  const A = window.AdDesk, $ = (s) => document.querySelector(s);
  const ic = (n, c = 'h-4 w-4') => `<i data-lucide="${n}" class="${c}"></i>`;
  const TODAY = '2026-11-18', PAGE = 8;
  const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
  const L = (n) => (n >= 100000 ? '₹' + +(n / 100000).toFixed(2) + 'L' : inr(n));
  const fd = (i) => new Date(i + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const range = (c) => (c.start ? fd(c.start) + ' – ' + (c.end ? fd(c.end) : 'ongoing') : 'Not scheduled');
  const pctOf = (c) => (c.budget ? Math.round((c.spent / c.budget) * 100) : 0);

  A.clients = ['Sharma Garments', 'Kapoor Jewellers', 'Urban Brew Café', 'FitZone Gym', 'Glow Salon', 'Green Basket', 'Bright Smiles Dental', 'Nest Interiors', 'EduSpark Classes', 'Zenith Motors', 'Pune Pedal Cycles', 'Royal Tiffin'];

  /* creative status: ok | wait | out | chg */
  const cr = (t, s) => ({ t, s });
  const mk = (id, name, client, platform, objective, budget, spent, leads, start, end, status, creatives, brief, log) => ({
    id, name, client, platform, objective, budget, spent, leads, start, end, status, creatives, brief,
    log: log || [['Riya Shah', 'Created campaign brief', '3 weeks ago']],
  });
  let C = [
    mk(1, 'Diwali Sale 2026', 'Sharma Garments', 'Meta + Google', 'Sales', 250000, 198400, 612, '2026-10-20', '2026-11-20', 'Active', [cr('Diwali carousel v3', 'ok'), cr('Festive reel', 'ok'), cr('Search ad copy', 'ok')], 'Festival sale on ethnic wear, 30% off on selected styles.', [['Rohan Gupta', 'Published to Meta and Google Ads', '28 days ago'], ['Riya Shah', 'Budget changed from ₹2,00,000 to ₹2,50,000', '12 days ago']]),
    mk(2, 'Dhanteras Gold Offer', 'Kapoor Jewellers', 'Meta', 'Leads', 180000, 148000, 296, '2026-10-25', '2026-11-10', 'Completed', [cr('Gold coin banner', 'ok'), cr('Offer reel', 'ok')], 'Making charge discount on gold coins and bars.'),
    mk(3, 'Cold Coffee Offer', 'Urban Brew Café', 'Meta', 'Traffic', 90000, 61200, 120, '2026-11-01', '2026-11-30', 'Active', [cr('Offer banner', 'out'), cr('Menu story', 'ok')], 'Cold coffee combo to drive store visits.', [['Priya Menon', 'Offer banner flagged outdated after price change (₹180 to ₹160)', '1 hr ago'], ['Neha Rao', 'Created campaign brief', '2 weeks ago']]),
    mk(4, 'Membership Drive', 'FitZone Gym', 'Meta', 'Leads', 120000, 96000, 541, '2026-11-05', '2026-11-30', 'Paused', [cr('Membership reel', 'ok'), cr('Trial pass banner', 'ok')], 'New year membership leads for 3 branches.', [['John Doe', 'Paused: Ad account issue (Meta token expired)', '2 days ago'], ['Rohan Gupta', 'Published to Meta', '13 days ago']]),
    mk(5, 'Bridal Package', 'Glow Salon', 'Meta', 'Leads', 80000, 73600, 377, '2026-11-01', '2026-11-25', 'Active', [cr('Bridal reel', 'ok'), cr('Package carousel', 'ok')], 'Bridal makeup and hair packages for the wedding season.', [['Sneha Iyer', 'Budget alert: 92% of budget used', '3 hrs ago'], ['Rohan Gupta', 'Published to Meta', '17 days ago']]),
    mk(6, 'Fresh Veg Weekend', 'Green Basket', 'Google Ads', 'Traffic', 70000, 40100, 301, '2026-11-10', '2026-12-10', 'Active', [cr('Search ad copy', 'ok'), cr('Display banner', 'ok')], 'Weekend vegetable delivery offer.'),
    mk(7, 'Dental Checkup Camp', 'Bright Smiles Dental', 'Meta', 'Leads', 45000, 0, 0, '2026-11-25', '2026-12-15', 'Scheduled', [cr('Camp poster', 'ok'), cr('Doctor intro reel', 'ok')], 'Free dental checkup camp, 3 weekends.'),
    mk(8, 'Winter Collection', 'Nest Interiors', 'Meta + Google', 'Sales', 160000, 0, 0, '2026-12-01', '2026-12-31', 'Pending approval', [cr('Winter lookbook', 'wait'), cr('Sofa offer banner', 'chg')], 'Winter home decor collection.'),
    mk(9, 'Exam Prep Batch', 'EduSpark Classes', 'Google Ads', 'Leads', 55000, 0, 0, '2026-12-05', '2027-01-05', 'Draft', [], 'Admissions for the board exam crash course.'),
    mk(10, 'Year-end Car Fest', 'Zenith Motors', 'Meta + Google', 'Awareness', 200000, 0, 0, '2026-12-10', '2026-12-31', 'Draft', [cr('Showroom video', 'wait')], 'Year-end offers and test drive bookings.'),
    mk(11, 'Monsoon Cycle Sale', 'Pune Pedal Cycles', 'Meta', 'Sales', 40000, 40000, 98, '2026-07-01', '2026-07-31', 'Completed', [cr('Sale banner', 'ok')], 'Monsoon discount on city cycles.'),
    mk(12, 'Healthy Tiffin Launch', 'Royal Tiffin', 'Meta', 'Awareness', 30000, 29500, 76, '2026-08-01', '2026-08-20', 'Completed', [cr('Launch reel', 'ok')], 'Launch of daily tiffin plans.'),
  ];
  const find = (id) => C.find((c) => c.id === +id);
  const TABS = ['All', 'Active', 'Pending approval', 'Scheduled', 'Paused', 'Draft', 'Completed'];
  $('#fc').innerHTML = '<option value="">All clients</option>' + A.clients.map((n) => `<option>${n}</option>`).join('');

  /* Business rules from the brief */
  const blockers = (c) => {
    const b = [], out = c.creatives.filter((x) => x.s === 'out').length, wait = c.creatives.filter((x) => x.s === 'wait' || x.s === 'chg').length;
    if (!c.creatives.length) b.push('No creatives added yet');
    if (out) b.push(`${out} outdated creative${out > 1 ? 's' : ''} need a revised version`);
    if (wait) b.push(`${wait} creative${wait > 1 ? 's' : ''} not approved by the client`);
    if (!c.start) b.push('Schedule is not set');
    return b;
  };
  const attention = (c) => c.status === 'Active' && (pctOf(c) >= 90 || c.creatives.some((x) => x.s === 'out'));
  const log = (c, what) => c.log.unshift(['John Doe', what, 'Just now']);

  /* UI helpers */
  const SS = { Active: '', Scheduled: 'background:var(--soft);color:var(--or)', 'Pending approval': 'am', Paused: 'dn', Draft: 'g', Completed: 'g' };
  const chip = (s) => { const v = SS[s]; return v === 'am' || v === 'dn' ? `<span class="chip ${v}">${s}</span>` : `<span class="chip whitespace-nowrap" ${v === 'g' ? 'style="background:var(--hover);color:var(--mute)"' : v ? `style="${v}"` : ''}>${s}</span>`; };
  const CRS = { ok: ['Approved', ''], wait: ['Waiting for client', 'am'], out: ['Outdated, price changed', 'dn'], chg: ['Changes requested', 'dn'] };
  const bar = (c) => { const p = pctOf(c); return `<div class="min-w-[110px]"><div class="flex justify-between gap-2 text-xs"><span class="truncate">${L(c.spent)}</span><span class="text-mute">${p}%</span></div><div class="mt-1 h-1.5 overflow-hidden rounded-full bg-hov"><div class="h-full rounded-full ${p >= 90 ? 'bg-[var(--amb)]' : 'bg-brand'}" style="width:${Math.min(p, 100)}%"></div></div><div class="truncate text-[11px] text-mute">of ${L(c.budget)}</div></div>`; };
  const ib = (act, id, icon, label) => `<button class="ibtn" data-act="${act}" data-id="${id}" aria-label="${label}" title="${label}">${ic(icon, 'h-3.5 w-3.5')}</button>`;
  const third = (c) => c.status === 'Active' ? ib('pause', c.id, 'pause', 'Pause') : c.status === 'Paused' ? ib('resume', c.id, 'play', 'Resume') : c.status === 'Draft' || c.status === 'Pending approval' ? ib('publish', c.id, 'rocket', 'Publish') : '';
  const actions = (c) => ib('view', c.id, 'eye', 'View') + ib('edit', c.id, 'pencil', 'Edit') + third(c);
  const warn = (c) => (attention(c) ? `<span class="shrink-0 text-[var(--amb)]" title="Needs attention">${ic('alert-triangle', 'h-3.5 w-3.5')}</span>` : '');

  const st = { tab: 'All', q: '', c: '', p: '', so: 'new', page: 1, view: 'table', narrow: false };
  function base() {
    const q = st.q.trim().toLowerCase();
    return C.filter((c) => (!q || c.name.toLowerCase().includes(q) || c.client.toLowerCase().includes(q)) && (!st.c || c.client === st.c) && (!st.p || c.platform === st.p));
  }
  function filtered() {
    const by = { new: (a, b) => b.id - a.id, name: (a, b) => a.name.localeCompare(b.name), budget: (a, b) => b.budget - a.budget, spent: (a, b) => b.spent - a.spent, leads: (a, b) => b.leads - a.leads };
    return base().filter((c) => st.tab === 'All' || c.status === st.tab).sort(by[st.so]);
  }

  function summary() {
    const act = C.filter((c) => c.status === 'Active'), sum = (a, k) => a.reduce((t, c) => t + c[k], 0);
    const K = [['megaphone', 'Active campaigns', act.length], ['clock', 'Awaiting approval', C.filter((c) => c.status === 'Pending approval').length], ['wallet', 'Active budget', L(sum(act, 'budget'))], ['indian-rupee', 'Spent so far', L(sum(act, 'spent'))], ['users', 'Leads', sum(C, 'leads').toLocaleString('en-IN')]];
    $('#kpis').innerHTML = K.map(([i, l, v]) => `<div class="card flex min-w-0 items-center gap-2.5 p-3"><div class="ico">${ic(i)}</div><div class="min-w-0"><div class="ttl">${l}</div><div class="truncate text-lg font-bold leading-tight">${v}</div></div></div>`).join('');
    const b = base();
    $('#tabs').innerHTML = TABS.map((t) => { const n = t === 'All' ? b.length : b.filter((c) => c.status === t).length, on = st.tab === t; return `<button role="tab" aria-selected="${on}" data-tab="${t}" class="-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 pb-2 text-xs font-medium ${on ? 'border-brand text-ink' : 'border-transparent text-mute hover:text-ink'}">${t} <span class="ml-0.5 text-[11px] text-mute">${n}</span></button>`; }).join('');
  }

  function render() {
    summary();
    const rows = filtered(), pages = Math.max(1, Math.ceil(rows.length / PAGE));
    st.page = Math.min(st.page, pages);
    const sl = rows.slice((st.page - 1) * PAGE, st.page * PAGE), cards = st.narrow || st.view === 'cards';
    $('#vt').classList.toggle('hidden', st.narrow);
    document.querySelectorAll('#vt button').forEach((b) => { const on = b.dataset.v === (cards ? 'cards' : 'table'); b.classList.toggle('bg-card', on); b.classList.toggle('shadow-sm', on); b.classList.toggle('text-mute', !on); });

    if (!sl.length) {
      $('#list').innerHTML = `<div class="grid place-items-center gap-2 px-4 py-12 text-center"><div class="ico">${ic('search-x')}</div><b>No campaigns found</b><span class="text-xs text-mute">Change the filters or create a new campaign.</span><button class="btn-o" data-act="clear">Clear filters</button></div>`;
    } else if (cards) {
      $('#list').innerHTML = `<div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,270px),1fr))] gap-3 p-3">${sl.map((c) => `
        <div class="min-w-0 rounded-xl border border-line p-3">
          <div class="flex min-w-0 items-start gap-2"><div class="min-w-0 flex-1"><b class="flex min-w-0 items-center gap-1.5 text-[13px]"><span class="truncate">${c.name}</span>${warn(c)}</b><span class="block truncate text-xs text-mute">${c.client}</span></div>${chip(c.status)}</div>
          <div class="mt-3">${bar(c)}</div>
          <div class="mt-3 grid grid-cols-2 gap-2 text-xs"><div class="min-w-0 rounded-lg bg-bg p-1.5"><div class="truncate font-bold">${c.leads}</div><div class="text-[11px] text-mute">Leads</div></div><div class="min-w-0 rounded-lg bg-bg p-1.5"><div class="truncate font-bold">${c.platform}</div><div class="truncate text-[11px] text-mute">${range(c)}</div></div></div>
          <div class="mt-3 flex justify-end gap-1.5">${actions(c)}</div>
        </div>`).join('')}</div>`;
    } else {
      $('#list').innerHTML = `<div class="overflow-x-auto"><table class="w-full min-w-[820px] text-[13px]"><thead><tr class="text-left text-xs text-mute"><th class="py-2 pl-3 pr-2 font-medium">Campaign</th><th class="px-2 font-medium">Platform</th><th class="px-2 font-medium">Budget used</th><th class="px-2 font-medium">Leads</th><th class="px-2 font-medium">Schedule</th><th class="px-2 font-medium">Status</th><th class="py-2 pl-2 pr-3 text-right font-medium">Actions</th></tr></thead><tbody>${sl.map((c) => `
        <tr class="border-t border-line hover:bg-hov/50">
          <td class="max-w-[240px] py-2 pl-3 pr-2"><div class="flex min-w-0 items-center gap-1.5"><b class="truncate">${c.name}</b>${warn(c)}</div><span class="block truncate text-xs text-mute">${c.client} · ${c.objective}</span></td>
          <td class="whitespace-nowrap px-2">${c.platform}</td><td class="px-2">${bar(c)}</td><td class="px-2">${c.leads}</td><td class="whitespace-nowrap px-2 text-xs">${range(c)}</td><td class="px-2">${chip(c.status)}</td>
          <td class="py-2 pl-2 pr-3"><div class="flex justify-end gap-1.5">${actions(c)}</div></td></tr>`).join('')}</tbody></table></div>`;
    }
    const from = rows.length ? (st.page - 1) * PAGE + 1 : 0;
    $('#pager').innerHTML = `<span>Showing ${from}–${Math.min(st.page * PAGE, rows.length)} of ${rows.length} campaigns</span><div class="flex items-center gap-2"><button class="ibtn disabled:opacity-40" data-act="prev" aria-label="Previous page" ${st.page <= 1 ? 'disabled' : ''}>${ic('chevron-left', 'h-3.5 w-3.5')}</button><span>Page ${st.page} of ${pages}</span><button class="ibtn disabled:opacity-40" data-act="next" aria-label="Next page" ${st.page >= pages ? 'disabled' : ''}>${ic('chevron-right', 'h-3.5 w-3.5')}</button></div>`;
    A.icons();
  }

  /* Campaign details: centered overlay with readiness check and change log */
  function closeDetail() { const d = $('#detail'); if (d) d.remove(); document.body.classList.remove('overflow-hidden'); }
  function detail(id) {
    const c = find(id); if (!c) return;
    closeDetail();
    const row = (l, v) => `<div class="grid grid-cols-[88px_minmax(0,1fr)] gap-2 py-1.5 text-[13px]"><span class="text-mute">${l}</span><span class="min-w-0 break-words font-medium">${v}</span></div>`;
    const stat = (l, v) => `<div class="min-w-0 rounded-lg bg-bg p-2.5"><div class="truncate text-[11px] text-mute">${l}</div><div class="truncate text-base font-bold">${v}</div></div>`;
    const b = blockers(c), live = c.status !== 'Completed';
    const ready = !live ? '' : b.length
      ? `<div class="rounded-lg bg-[var(--ambbg)] p-3 text-[13px] text-[var(--amb)]"><b class="flex items-center gap-1.5">${ic('alert-triangle', 'h-4 w-4')}Not ready to go live</b><ul class="mt-1 list-disc space-y-0.5 pl-5">${b.map((x) => `<li>${x}</li>`).join('')}</ul></div>`
      : `<div class="flex items-center gap-1.5 rounded-lg bg-[var(--grnbg)] p-3 text-[13px] font-semibold text-[var(--grn)]">${ic('circle-check', 'h-4 w-4')}All creatives approved. Ready to go live.</div>`;
    const el = document.createElement('div');
    el.id = 'detail'; el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6';
    el.innerHTML = `<div role="dialog" aria-modal="true" aria-label="Campaign details" class="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl sm:max-h-[90dvh]">
      <div class="flex shrink-0 items-center gap-2.5 border-b border-line p-4"><div class="min-w-0 flex-1"><h2 class="truncate text-base font-semibold">${c.name}</h2><span class="block truncate text-xs text-mute">${c.client}</span></div>${chip(c.status)}<button data-close aria-label="Close" class="ibtn">${ic('x', 'h-4 w-4')}</button></div>
      <div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">${stat('Budget', L(c.budget))}${stat('Spent', L(c.spent) + ' (' + pctOf(c) + '%)')}${stat('Leads', c.leads)}${stat('Cost per lead', c.leads ? inr(Math.round(c.spent / c.leads)) : '-')}</div>
        ${ready}
        <div class="divide-y divide-line">${row('Platform', c.platform)}${row('Objective', c.objective)}${row('Schedule', range(c))}${row('Brief', c.brief || 'No brief added')}</div>
        <div><h3 class="mb-2 text-xs font-semibold text-mute">Creatives</h3>${c.creatives.length ? `<div class="space-y-1.5">${c.creatives.map((x) => `<div class="flex min-w-0 items-center gap-2 text-[13px]"><span class="min-w-0 flex-1 truncate">${x.t}</span><span class="chip ${CRS[x.s][1]} shrink-0">${CRS[x.s][0]}</span></div>`).join('')}</div>` : '<p class="text-[13px] text-mute">No creatives yet. Upload one from the Create menu.</p>'}</div>
        <div><h3 class="mb-2 text-xs font-semibold text-mute">Change log</h3><div class="space-y-2.5">${c.log.map(([who, what, when]) => `<div class="flex gap-2.5 text-[13px]"><span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand"></span><div class="min-w-0"><div class="break-words">${what}</div><div class="text-xs text-mute">${who}, ${when}</div></div></div>`).join('')}</div></div>
      </div>
      <div class="flex shrink-0 flex-wrap gap-2 border-t border-line p-3"><button class="btn-p" data-act="edit" data-id="${c.id}">${ic('pencil', 'h-3.5 w-3.5')}Edit</button>
        ${c.status === 'Active' ? `<button class="btn-o" data-act="pause" data-id="${c.id}">${ic('pause', 'h-3.5 w-3.5')}Pause</button>` : c.status === 'Paused' ? `<button class="btn-o" data-act="resume" data-id="${c.id}">${ic('play', 'h-3.5 w-3.5')}Resume</button>` : c.status === 'Draft' || c.status === 'Pending approval' ? `<button class="btn-o" data-act="publish" data-id="${c.id}">${ic('rocket', 'h-3.5 w-3.5')}Publish</button>` : ''}
        ${c.status === 'Active' || c.status === 'Paused' ? `<button class="btn-o ml-auto" data-act="complete" data-id="${c.id}">Mark completed</button>` : ''}</div></div>`;
    el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('[data-close]')) closeDetail(); });
    document.body.append(el); document.body.classList.add('overflow-hidden'); A.icons();
  }
  const refresh = (id) => { render(); if ($('#detail')) detail(id); };

  /* Actions */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-tab]'); if (t) { st.tab = t.dataset.tab; st.page = 1; render(); return; }
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act, c = find(b.dataset.id);
    if (a === 'view') detail(c.id);
    else if (a === 'edit') A.openForm('campaignEdit', c);
    else if (a === 'pause') A.openForm('pause', { id: c.id, campaign: c.name });
    else if (a === 'publish' || a === 'resume') {
      const bl = a === 'publish' ? blockers(c) : c.creatives.some((x) => x.s === 'out') ? ['Outdated creative needs a revised version'] : [];
      if (bl.length) { A.toast('Cannot ' + a + ': ' + bl[0]); detail(c.id); return; }
      c.status = a === 'resume' || c.start <= TODAY ? 'Active' : 'Scheduled';
      log(c, a === 'resume' ? 'Resumed campaign' : 'Published to ' + c.platform + (c.status === 'Scheduled' ? ', scheduled for ' + fd(c.start) : ''));
      A.toast(c.name + ' is now ' + c.status.toLowerCase()); refresh(c.id);
    } else if (a === 'complete') { c.status = 'Completed'; log(c, 'Marked as completed'); A.toast(c.name + ' completed'); refresh(c.id); }
    else if (a === 'prev') { st.page--; render(); } else if (a === 'next') { st.page++; render(); }
    else if (a === 'clear') { Object.assign(st, { tab: 'All', q: '', c: '', p: '', page: 1 }); $('#q').value = ''; $('#fc').value = ''; $('#fp').value = ''; render(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !e.defaultPrevented) closeDetail(); });

  const bind = (id, key, ev = 'change') => $(id).addEventListener(ev, (e) => { st[key] = e.target.value; st.page = 1; render(); });
  bind('#q', 'q', 'input'); bind('#fc', 'c'); bind('#fp', 'p'); bind('#so', 'so');
  $('#vt').onclick = (e) => { const b = e.target.closest('button'); if (b) { st.view = b.dataset.v; render(); } };

  /* Overlay forms: create, edit, pause */
  document.addEventListener('form:saved', ({ detail: { key, data, vals } }) => {
    if (key === 'campaign' || key === 'googleAd' || key === 'waCampaign') {
      if (key !== 'campaign') Object.assign(data, { platform: key === 'googleAd' ? 'Google Ads' : 'WhatsApp', objective: data.objective || 'Leads', brief: data.brief || data.message || '' });
      const id = Math.max(0, ...C.map((c) => c.id)) + 1;
      C.unshift(mk(id, data.name, data.client, data.platform, data.objective, +data.budget || 0, 0, 0, data.start || '', data.end || '', 'Draft', [], data.brief || '', [['John Doe', 'Created as draft', 'Just now']]));
      Object.assign(st, { tab: 'All', so: 'new', page: 1 }); $('#so').value = 'new';
    } else if (key === 'campaignEdit') {
      const c = find(vals.id), ch = [];
      if (+data.budget !== c.budget) ch.push(`Budget changed from ${inr(c.budget)} to ${inr(data.budget)}`);
      if (data.start !== c.start || data.end !== c.end) ch.push('Schedule changed to ' + range(data));
      if (data.platform !== c.platform) ch.push('Platform changed to ' + data.platform);
      if (data.objective !== c.objective) ch.push('Objective changed to ' + data.objective);
      Object.assign(c, { name: data.name, client: data.client, platform: data.platform, objective: data.objective, budget: +data.budget, start: data.start, end: data.end, brief: data.brief });
      (ch.length ? ch : ['Details updated']).reverse().forEach((x) => log(c, x));
    } else if (key === 'pause') {
      const c = find(vals.id); c.status = 'Paused'; log(c, 'Paused: ' + data.reason + (data.note ? ' (' + data.note + ')' : ''));
    } else return;
    refresh(vals && vals.id);
  });

  /* Cards view automatically when the content area is narrow (window resize or sidebar toggle) */
  const cq = document.querySelector('.cq');
  new ResizeObserver(() => { const n = cq.clientWidth < 720; if (n !== st.narrow) { st.narrow = n; render(); } }).observe(cq);
  st.narrow = cq.clientWidth < 720;
  render();
})();