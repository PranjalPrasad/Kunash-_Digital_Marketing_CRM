/* Creatives & approvals page only. Sample data: replace `C` with API data later. */
(function () {
  const A = window.AdDesk, $ = (s) => document.querySelector(s);
  const ic = (n, c = 'h-4 w-4') => `<i data-lucide="${n}" class="${c}"></i>`;
  const PAGE = 8;
  A.clients = ['Sharma Garments', 'Kapoor Jewellers', 'Urban Brew Café', 'FitZone Gym', 'Glow Salon', 'Green Basket', 'Bright Smiles Dental', 'Nest Interiors', 'EduSpark Classes', 'Zenith Motors'];
  const CONTACT = { 'Sharma Garments': 'Rakesh Sharma', 'Kapoor Jewellers': 'Anita Kapoor', 'Urban Brew Café': 'Vikram Nair', 'FitZone Gym': 'Sandeep Patil', 'Glow Salon': 'Pooja Desai', 'Green Basket': 'Imran Shaikh', 'Bright Smiles Dental': 'Meera Joshi', 'Nest Interiors': 'Karan Malhotra', 'EduSpark Classes': 'Priya Kulkarni', 'Zenith Motors': 'Rohit Bhosale' };
  const FI = { Image: 'image', Carousel: 'layers', Video: 'circle-play' };
  const W = 'Waiting for approval', CH = 'Changes requested';

  /* status, days waiting, extra: { offer, caption, reason, approvedBy, comments:[[who, role, text, when]] } */
  const mk = (id, title, client, format, v, campaign, status, days, x = {}) => ({
    id, title, client, format, version: v, campaign, status, days,
    offer: x.offer || '', caption: x.caption || 'Shop now and save big this season.', link: x.link || 'https://' + client.toLowerCase().replace(/[^a-z]/g, '') + '.in/offers',
    designer: id % 2 ? 'Priya Menon' : 'Arjun Das', reason: x.reason || '', approvedBy: x.approvedBy || '',
    versions: Array.from({ length: v }, (_, i) => [v - i, i ? 'Revised after feedback' : 'Latest version']),
    log: x.log || [['Priya Menon', 'Team', 'Uploaded v' + v + ' and submitted for approval', days ? days + ' days ago' : 'Today']],
  });
  let C = [
    mk(1, 'Diwali carousel', 'Sharma Garments', 'Carousel', 3, 'Diwali Sale 2026', 'Approved', 0, { offer: '30% off on selected styles', approvedBy: 'Rakesh Sharma, 12 Nov', log: [['Rakesh Sharma', 'Client', 'Approved v3', '12 Nov'], ['Priya Menon', 'Team', 'Uploaded v3 and submitted for approval', '11 Nov']] }),
    mk(2, 'Festive reel', 'Sharma Garments', 'Video', 2, 'Diwali Sale 2026', 'Approved', 0, { offer: 'Free delivery above ₹1,999', approvedBy: 'Rakesh Sharma, 13 Nov' }),
    mk(3, 'Offer banner', 'Urban Brew Café', 'Image', 2, 'Cold Coffee Offer', 'Outdated', 0, { offer: 'Cold coffee ₹180', reason: 'Price changed: Cold coffee ₹180 to ₹160 (1 hr ago). The live ad may show the wrong price.', approvedBy: 'Vikram Nair, 2 Nov', log: [['System', 'System', 'Flagged outdated after price change. Task created for designer.', '1 hr ago'], ['Vikram Nair', 'Client', 'Approved v2', '2 Nov']] }),
    mk(4, 'Menu story', 'Urban Brew Café', 'Image', 1, 'Cold Coffee Offer', 'Approved', 0, { approvedBy: 'Vikram Nair, 3 Nov' }),
    mk(5, 'Winter lookbook', 'Nest Interiors', 'Carousel', 1, 'Winter Collection', W, 3, { offer: 'Flat 15% off sofas' }),
    mk(6, 'Sofa offer banner', 'Nest Interiors', 'Image', 2, 'Winter Collection', CH, 1, { offer: 'Flat 20% off', log: [['Karan Malhotra', 'Client', 'Please show the 20% off price larger and use the new logo.', 'Yesterday'], ['Arjun Das', 'Team', 'Uploaded v2 and submitted for approval', '3 days ago']] }),
    mk(7, 'Showroom video', 'Zenith Motors', 'Video', 1, 'Year-end Car Fest', W, 1, { offer: 'Exchange bonus ₹30,000' }),
    mk(8, 'Exchange offer banner', 'Zenith Motors', 'Image', 1, 'Year-end Car Fest', 'Outdated', 0, { offer: 'Exchange bonus ₹30,000', reason: 'Offer changed: Exchange bonus ₹30,000 to ₹40,000 (3 hrs ago).', log: [['System', 'System', 'Flagged outdated after offer change. Task created for designer.', '3 hrs ago']] }),
    mk(9, 'Batch fee banner', 'EduSpark Classes', 'Image', 1, 'Exam Prep Batch', 'Outdated', 0, { offer: 'Fee ₹12,000', reason: 'Price changed: Batch fee ₹12,000 to ₹10,500 (yesterday).', log: [['System', 'System', 'Flagged outdated after price change. Task created for designer.', 'Yesterday']] }),
    mk(10, 'Membership reel', 'FitZone Gym', 'Video', 1, 'Membership Drive', 'Approved', 0, { approvedBy: 'Sandeep Patil, 6 Nov' }),
    mk(11, 'Bridal reel', 'Glow Salon', 'Video', 2, 'Bridal Package', 'Approved', 0, { approvedBy: 'Pooja Desai, 2 Nov' }),
    mk(12, 'Wedding teaser', 'Kapoor Jewellers', 'Image', 1, '', 'Draft', 0, { log: [['Arjun Das', 'Team', 'Created draft', 'Today']] }),
  ];
  const find = (id) => C.find((c) => c.id === +id);
  const TABS = ['All', W, CH, 'Outdated', 'Approved', 'Draft'];
  $('#fc').innerHTML = '<option value="">All clients</option>' + A.clients.map((n) => `<option>${n}</option>`).join('');

  /* UI helpers */
  const SS = { Approved: '', [W]: 'background:var(--soft);color:var(--or)', [CH]: 'am', Outdated: 'dn', Draft: 'g' };
  const chip = (s) => { const v = SS[s]; return v === 'am' || v === 'dn' ? `<span class="chip whitespace-nowrap ${v}">${s}</span>` : `<span class="chip whitespace-nowrap" ${v === 'g' ? 'style="background:var(--hover);color:var(--mute)"' : v ? `style="${v}"` : ''}>${s}</span>`; };
  const waitTxt = (c) => (c.status === W ? (c.days ? `Waiting ${c.days} day${c.days > 1 ? 's' : ''}` : 'Submitted today') : '');
  const waitCls = (c) => (c.days >= 3 ? 'text-[var(--amb)] font-medium' : 'text-mute');
  const thumb = (c, cls = 'aspect-[16/10]') => { const h = (c.client.length * 37 + c.client.charCodeAt(0) * 11) % 360; return `<div class="relative grid ${cls} place-items-center overflow-hidden" style="background:linear-gradient(135deg,hsl(${h} 85% 55% / .28),hsl(${h} 85% 55% / .08))"><span class="text-mute">${ic(FI[c.format], 'h-8 w-8')}</span><span class="absolute left-2 top-2 rounded-md bg-card px-1.5 py-0.5 text-[11px] font-semibold">v${c.version}</span><span class="absolute bottom-2 left-2 rounded-md bg-card px-1.5 py-0.5 text-[11px] text-mute">${c.format}</span></div>`; };
  const ib = (act, id, icon, label) => `<button class="ibtn" data-act="${act}" data-id="${id}" aria-label="${label}" title="${label}">${ic(icon, 'h-3.5 w-3.5')}</button>`;
  const second = (c) => c.status === W ? ib('remind', c.id, 'bell-ring', 'Remind client') : c.status === CH || c.status === 'Outdated' ? ib('version', c.id, 'upload', 'Upload new version') : c.status === 'Draft' ? ib('submit', c.id, 'send', 'Submit for approval') : '';
  const actions = (c) => ib('view', c.id, 'eye', 'View') + second(c);
  const log = (c, text, who = 'John Doe', role = 'Team') => c.log.unshift([who, role, text, 'Just now']);

  const st = { tab: 'All', q: '', c: '', f: '', so: 'new', page: 1, view: 'cards', narrow: false };
  const base = () => { const q = st.q.trim().toLowerCase(); return C.filter((c) => (!q || [c.title, c.client, c.campaign].some((x) => x.toLowerCase().includes(q))) && (!st.c || c.client === st.c) && (!st.f || c.format === st.f)); };
  function filtered() {
    const by = { new: (a, b) => b.id - a.id, wait: (a, b) => (b.status === W) - (a.status === W) || b.days - a.days, name: (a, b) => a.title.localeCompare(b.title), client: (a, b) => a.client.localeCompare(b.client) };
    return base().filter((c) => st.tab === 'All' || c.status === st.tab).sort(by[st.so]);
  }
  const count = (s) => C.filter((c) => c.status === s).length;

  function summary() {
    const K = [['image', 'Total creatives', C.length], ['clock', 'Waiting for approval', count(W)], ['message-square-warning', 'Changes requested', count(CH)], ['file-warning', 'Outdated', count('Outdated')], ['circle-check', 'Approved', count('Approved')]];
    $('#kpis').innerHTML = K.map(([i, l, v]) => `<div class="card flex min-w-0 items-center gap-2.5 p-3"><div class="ico">${ic(i)}</div><div class="min-w-0"><div class="ttl">${l}</div><div class="truncate text-lg font-bold leading-tight">${v}</div></div></div>`).join('');
    const o = count('Outdated');
    $('#alert').innerHTML = o ? `<div class="flex flex-wrap items-center gap-2 rounded-xl bg-[var(--redbg)] px-3 py-2.5 text-[13px] text-[var(--red)]"><span class="shrink-0">${ic('alert-triangle')}</span><span class="min-w-0 flex-1"><b>${o} creative${o > 1 ? 's' : ''} may be outdated</b> because a price or offer changed. Upload a revised version and get it approved again.</span><button class="btn-o shrink-0 bg-card" data-tab="Outdated">Show outdated</button></div>` : '';
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
      $('#list').innerHTML = `<div class="grid place-items-center gap-2 px-4 py-12 text-center"><div class="ico">${ic('search-x')}</div><b>No creatives found</b><span class="text-xs text-mute">Change the filters or upload a new creative.</span><button class="btn-o" data-act="clear">Clear filters</button></div>`;
    } else if (cards) {
      $('#list').innerHTML = `<div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,230px),1fr))] gap-3 p-3">${sl.map((c) => `
        <div class="min-w-0 overflow-hidden rounded-xl border border-line">
          ${thumb(c)}
          <div class="p-3"><div class="flex min-w-0 items-start justify-between gap-2"><div class="min-w-0"><b class="block truncate text-[13px]">${c.title}</b><span class="block truncate text-xs text-mute">${c.client}</span></div></div>
            <div class="mt-2 flex flex-wrap items-center gap-1.5">${chip(c.status)}${waitTxt(c) ? `<span class="text-[11px] ${waitCls(c)}">${waitTxt(c)}</span>` : ''}</div>
            <p class="mt-2 line-clamp-2 min-h-[2rem] break-words text-xs text-mute">${c.reason || c.offer || c.caption}</p>
            <div class="mt-3 flex items-center justify-between gap-2"><span class="min-w-0 truncate text-[11px] text-mute">${c.campaign || 'Not linked to a campaign'}</span><div class="flex shrink-0 gap-1.5">${actions(c)}</div></div></div>
        </div>`).join('')}</div>`;
    } else {
      $('#list').innerHTML = `<div class="overflow-x-auto"><table class="w-full min-w-[780px] text-[13px]"><thead><tr class="text-left text-xs text-mute"><th class="py-2 pl-3 pr-2 font-medium">Creative</th><th class="px-2 font-medium">Format</th><th class="px-2 font-medium">Version</th><th class="px-2 font-medium">Campaign</th><th class="px-2 font-medium">Waiting</th><th class="px-2 font-medium">Status</th><th class="py-2 pl-2 pr-3 text-right font-medium">Actions</th></tr></thead><tbody>${sl.map((c) => `
        <tr class="border-t border-line hover:bg-hov/50">
          <td class="max-w-[230px] py-2 pl-3 pr-2"><b class="block truncate">${c.title}</b><span class="block truncate text-xs text-mute">${c.client}</span></td>
          <td class="px-2">${c.format}</td><td class="px-2">v${c.version}</td><td class="max-w-[170px] truncate px-2">${c.campaign || '-'}</td>
          <td class="whitespace-nowrap px-2 text-xs ${waitCls(c)}">${waitTxt(c) || '-'}</td><td class="px-2">${chip(c.status)}</td>
          <td class="py-2 pl-2 pr-3"><div class="flex justify-end gap-1.5">${actions(c)}</div></td></tr>`).join('')}</tbody></table></div>`;
    }
    const from = rows.length ? (st.page - 1) * PAGE + 1 : 0;
    $('#pager').innerHTML = `<span>Showing ${from}–${Math.min(st.page * PAGE, rows.length)} of ${rows.length} creatives</span><div class="flex items-center gap-2"><button class="ibtn disabled:opacity-40" data-act="prev" aria-label="Previous page" ${st.page <= 1 ? 'disabled' : ''}>${ic('chevron-left', 'h-3.5 w-3.5')}</button><span>Page ${st.page} of ${pages}</span><button class="ibtn disabled:opacity-40" data-act="next" aria-label="Next page" ${st.page >= pages ? 'disabled' : ''}>${ic('chevron-right', 'h-3.5 w-3.5')}</button></div>`;
    A.icons();
  }

  /* Creative details: centered overlay */
  function closeDetail() { const d = $('#detail'); if (d) d.remove(); document.body.classList.remove('overflow-hidden'); }
  function detail(id) {
    const c = find(id); if (!c) return;
    closeDetail();
    const row = (l, v) => `<div class="grid grid-cols-[92px_minmax(0,1fr)] gap-2 py-1.5 text-[13px]"><span class="text-mute">${l}</span><span class="min-w-0 break-words font-medium">${v}</span></div>`;
    const note = c.status === 'Outdated' ? `<div class="rounded-lg bg-[var(--redbg)] p-3 text-[13px] text-[var(--red)]"><b class="flex items-center gap-1.5">${ic('file-warning')}Outdated</b><p class="mt-1">${c.reason}</p></div>`
      : c.status === 'Approved' ? `<div class="flex items-center gap-1.5 rounded-lg bg-[var(--grnbg)] p-3 text-[13px] font-semibold text-[var(--grn)]">${ic('circle-check')}Approved by ${c.approvedBy || 'client'}</div>`
      : c.status === CH ? `<div class="rounded-lg bg-[var(--ambbg)] p-3 text-[13px] text-[var(--amb)]"><b class="flex items-center gap-1.5">${ic('message-square-warning')}Client asked for changes</b><p class="mt-1">Upload a new version to send it back for approval.</p></div>` : '';
    const B = (act, label, icon, p) => `<button class="${p ? 'btn-p' : 'btn-o'}" data-act="${act}" data-id="${c.id}">${ic(icon, 'h-3.5 w-3.5')}${label}</button>`;
    const btns = c.status === 'Draft' ? [B('submit', 'Submit for approval', 'send', 1)] : c.status === W ? [B('decision', 'Record client decision', 'circle-check', 1), B('remind', 'Remind client', 'bell-ring')] : c.status === 'Approved' ? [B('version', 'Upload new version', 'upload', 1)] : [B('version', c.status === 'Outdated' ? 'Upload revised version' : 'Upload new version', 'upload', 1)];
    btns.push(B('edit', 'Edit details', 'pencil'), B('comment', 'Add comment', 'message-square-plus'));
    const el = document.createElement('div');
    el.id = 'detail'; el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6';
    el.innerHTML = `<div role="dialog" aria-modal="true" aria-label="Creative details" class="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl sm:max-h-[90dvh]">
      <div class="flex shrink-0 items-center gap-2.5 border-b border-line p-4"><div class="min-w-0 flex-1"><h2 class="truncate text-base font-semibold">${c.title}</h2><span class="block truncate text-xs text-mute">${c.client}${waitTxt(c) ? ', ' + waitTxt(c).toLowerCase() : ''}</span></div>${chip(c.status)}<button data-close aria-label="Close" class="ibtn">${ic('x')}</button></div>
      <div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <div class="overflow-hidden rounded-xl">${thumb(c, 'h-36')}</div>
        ${note}
        <div class="divide-y divide-line">${row('Campaign', c.campaign || 'Not linked')}${row('Format', c.format + ', v' + c.version)}${row('Offer', c.offer || 'No offer')}${row('Caption', c.caption)}${row('Link', `<span class="break-all">${c.link}</span>`)}${row('Designer', c.designer)}</div>
        <div><h3 class="mb-2 text-xs font-semibold text-mute">Versions</h3><div class="space-y-1.5">${c.versions.map(([v, n], i) => `<div class="flex min-w-0 items-center gap-2 text-[13px]"><b class="w-8 shrink-0">v${v}</b><span class="min-w-0 flex-1 truncate text-mute">${n}</span>${i ? '<span class="chip" style="background:var(--hover);color:var(--mute)">Replaced</span>' : chip(c.status)}</div>`).join('')}</div></div>
        <div><h3 class="mb-2 text-xs font-semibold text-mute">Comments and activity</h3><div class="space-y-2.5">${c.log.map(([who, role, text, when]) => `<div class="flex gap-2.5 text-[13px]"><span class="mt-1.5 h-2 w-2 shrink-0 rounded-full ${role === 'Client' ? 'bg-brand' : role === 'System' ? 'bg-[var(--red)]' : 'bg-[var(--gry)]'}"></span><div class="min-w-0"><div class="break-words">${text}</div><div class="text-xs text-mute">${who}${role === 'Client' ? ' (client)' : ''}, ${when}</div></div></div>`).join('')}</div></div>
      </div>
      <div class="flex shrink-0 flex-wrap gap-2 border-t border-line p-3">${btns.join('')}</div></div>`;
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
    else if (a === 'edit') A.openForm('creativeEdit', c);
    else if (a === 'remind') A.openForm('remind', { id: c.id, client: c.client });
    else if (a === 'version') A.openForm('version', { id: c.id, creative: c.title });
    else if (a === 'comment') A.openForm('comment', { id: c.id, creative: c.title });
    else if (a === 'decision') A.openForm('decision', { id: c.id, creative: c.title, by: CONTACT[c.client] || '' });
    else if (a === 'submit') { c.status = W; c.days = 0; log(c, 'Submitted v' + c.version + ' for client approval'); A.toast(c.title + ' sent for approval'); refresh(c.id); }
    else if (a === 'prev') { st.page--; render(); } else if (a === 'next') { st.page++; render(); }
    else if (a === 'clear') { Object.assign(st, { tab: 'All', q: '', c: '', f: '', page: 1 }); $('#q').value = ''; $('#fc').value = ''; $('#ff').value = ''; render(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !e.defaultPrevented) closeDetail(); });
  const bind = (id, key, ev = 'change') => $(id).addEventListener(ev, (e) => { st[key] = e.target.value; st.page = 1; render(); });
  bind('#q', 'q', 'input'); bind('#fc', 'c'); bind('#ff', 'f'); bind('#so', 'so');
  $('#vt').onclick = (e) => { const b = e.target.closest('button'); if (b) { st.view = b.dataset.v; render(); } };

  /* Overlay forms */
  document.addEventListener('form:saved', ({ detail: { key, data, vals } }) => {
    const c = vals && vals.id ? find(vals.id) : null;
    if (key === 'creative') {
      const id = Math.max(0, ...C.map((x) => x.id)) + 1;
      C.unshift(mk(id, data.title, data.client, data.format, 1, '', W, 0, { offer: data.offer, caption: data.caption || undefined, link: data.link || undefined, log: [['John Doe', 'Team', 'Uploaded v1 (' + (data.file && data.file.name ? data.file.name : 'file') + ') and submitted for approval', 'Just now']] }));
      Object.assign(st, { tab: 'All', so: 'new', page: 1 }); $('#so').value = 'new';
    } else if (key === 'creativeEdit' && c) {
      const re = c.status === 'Approved' && (data.offer !== c.offer || data.caption !== c.caption || data.link !== c.link);
      Object.assign(c, { title: data.title, format: data.format, offer: data.offer, caption: data.caption, link: data.link });
      if (re) { c.status = W; c.days = 0; log(c, 'Offer, caption or link changed after approval. Sent for re-approval.'); } else log(c, 'Details updated');
    } else if (key === 'version' && c) {
      c.version++; c.status = W; c.days = 0; c.reason = ''; c.approvedBy = '';
      c.versions[0][1] = 'Earlier version';
      c.versions.unshift([c.version, data.note || 'Latest version']);
      log(c, `Uploaded v${c.version}: ${data.note}`);
    } else if (key === 'decision' && c) {
      if (data.decision === 'Approved') { c.status = 'Approved'; c.days = 0; c.approvedBy = data.by + ', today'; log(c, 'Approved v' + c.version + (data.comment ? ': ' + data.comment : ''), data.by, 'Client'); }
      else { c.status = CH; log(c, data.comment || 'Changes requested', data.by, 'Client'); }
    } else if (key === 'comment' && c) { log(c, data.comment); }
    else if (key === 'remind' && c) { log(c, 'Reminder sent to client'); }
    else return;
    refresh(vals && vals.id);
  });

  const cq = document.querySelector('.cq');
  new ResizeObserver(() => { const n = cq.clientWidth < 720; if (n !== st.narrow) { st.narrow = n; render(); } }).observe(cq);
  st.narrow = cq.clientWidth < 720;
  render();
})();