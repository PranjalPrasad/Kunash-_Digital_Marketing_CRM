/* Audit log page only.
   Sample data: replace `RAW` with API data (GET /api/audit-logs?category=&user=&client=&from=&to=&page=) later.
   Rules from the brief:
   - Entries are append-only. There is no edit and no delete anywhere on this page.
   - Only the Agency owner can open it ("Settings and audit log: Full" for owner, "-" for everyone else).
   - The backend must enforce both rules. This file only shows them.
   Each entry is linked to the one before it by a SHA-256 hash, so any change to an old entry can be detected ("Verify integrity"). */
(function () {
  const A = window.AdDesk, $ = (s) => document.querySelector(s);
  const ic = (n, c = 'h-4 w-4') => `<i data-lucide="${n}" class="${c}"></i>`;
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const AV = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const ME = 'John Doe', ME_ROLE = 'Agency owner', PAGE = 10, NOW = Date.now(), MIN = 60000, DAY = 864e5;

  /* Gate: only the agency owner may open the audit log. */
  if (ME_ROLE !== 'Agency owner') {
    document.querySelector('.cq').innerHTML = `<div class="card grid place-items-center gap-2 px-4 py-16 text-center"><div class="ico">${ic('lock')}</div><b>Audit log is for the agency owner only</b><span class="text-xs text-mute">Ask the owner if you need to check something.</span></div>`;
    A.icons();
    return;
  }

  /* ---------- Reference data ---------- */
  const CAT = {
    'Price change': { i: 'badge-indian-rupee', k: 'o' },
    Approval: { i: 'circle-check', k: '' },
    'Campaign edit': { i: 'megaphone', k: 'am' },
    'User access': { i: 'user-cog', k: 'g' },
    Billing: { i: 'receipt', k: 'o' },
    Security: { i: 'shield-alert', k: 'dn' },
    'Data export': { i: 'download', k: 'g' },
    Settings: { i: 'settings', k: 'g' },
  };
  const PEOPLE = {
    'John Doe': 'Agency owner', 'Riya Shah': 'Agency manager', 'Kabir Jain': 'Agency manager', 'Neha Rao': 'Agency manager',
    'Rohan Gupta': 'Ads manager', 'Sneha Iyer': 'Ads manager', 'Priya Menon': 'Designer', 'Arjun Das': 'Designer',
    'Rakesh Sharma': 'Client admin', 'Anita Kapoor': 'Client admin', 'Vikram Nair': 'Client admin', System: 'System',
  };
  const DEV = ['Chrome on Windows', 'Chrome on macOS', 'Safari on iPhone', 'Edge on Windows'];

  /* E(minutes ago, user, client, category, action, item, before, after, extras) */
  const E = (m, user, client, cat, action, entity, before = null, after = null, o = {}) => ({ m, user, role: PEOPLE[user], client, cat, action, entity, before, after, note: '', flag: 0, ...o });
  const RAW = [
    E(12, 'Rohan Gupta', 'Urban Brew Café', 'Campaign edit', 'Budget changed', 'Cold Coffee Offer', { 'Total budget': '₹90,000' }, { 'Total budget': '₹1,10,000' }),
    E(35, 'Vikram Nair', 'Urban Brew Café', 'Price change', 'Price changed', 'Cold Coffee', { Price: '₹150' }, { Price: '₹160' }, { note: '1 creative marked outdated (Offer banner).', flag: 1 }),
    E(58, 'Priya Menon', 'Urban Brew Café', 'Approval', 'Sent for approval', 'Menu story v3', { Status: 'Draft' }, { Status: 'Waiting for approval' }),
    E(95, 'Riya Shah', 'Sharma Garments', 'Billing', 'Invoice created', 'INV-2026-118', null, { Amount: '₹70,800 (incl. 18% GST)', 'Due date': '5 Dec 2026' }),
    E(130, 'John Doe', null, 'User access', 'Client access changed', 'Sneha Iyer', { Clients: '4 clients' }, { Clients: '5 clients' }, { note: 'Added Bright Smiles Dental.' }),
    E(170, 'Neha Rao', 'Zenith Motors', 'Price change', 'Price changed', 'Exchange Bonus', { Price: '₹35,000' }, { Price: '₹40,000' }, { note: '2 creatives marked outdated.', flag: 1 }),
    E(190, 'Rohan Gupta', 'FitZone Gym', 'Campaign edit', 'Campaign paused', 'Membership Drive', { Status: 'Active' }, { Status: 'Paused' }),
    E(215, 'John Doe', null, 'Security', 'Signed in', 'Web app', null, null, { note: 'New device: Chrome on macOS.', ip: '49.36.112.7', dev: 'Chrome on macOS' }),
    E(260, 'System', null, 'Security', 'Repeated failed sign-in', 'kabir@kunashmedia.com', null, null, { note: '5 failed attempts in 10 minutes. Account locked for 15 minutes.', flag: 1, ip: '103.211.40.18', dev: 'Chrome on Android' }),
    E(310, 'Rakesh Sharma', 'Sharma Garments', 'Approval', 'Creative approved', 'Diwali carousel v2', { Status: 'Waiting for approval' }, { Status: 'Approved' }),
    E(1500, 'Riya Shah', 'EduSpark Classes', 'Price change', 'Price changed', 'Board Exam Crash Course', { Price: '₹9,500' }, { Price: '₹10,500' }, { note: '1 creative marked outdated (Batch fee banner).', flag: 1 }),
    E(1560, 'Anita Kapoor', 'Kapoor Jewellers', 'Approval', 'Changes requested', 'Gold coin reel v1', { Status: 'Waiting for approval' }, { Status: 'Changes requested' }, { note: 'Client asked for the new coin price on the first frame.' }),
    E(1700, 'John Doe', null, 'User access', 'User invited', 'Pooja Desai', null, { Role: 'Client viewer', Client: 'Glow Salon' }, { note: 'Invite email sent.' }),
    E(2900, 'John Doe', null, 'User access', 'MFA reset', 'Neha Rao', { 'Two-step login': 'On' }, { 'Two-step login': 'Off' }, { note: 'User must set it up again at next login.', flag: 1 }),
    E(3100, 'Riya Shah', 'FitZone Gym', 'Billing', 'Invoice marked paid', 'INV-2026-104', { Status: 'Overdue' }, { Status: 'Paid' }, { note: 'Payment received by UPI.' }),
    E(3400, 'Priya Menon', 'Sharma Garments', 'Approval', 'Sent for approval', 'Festive reel v1', { Status: 'Draft' }, { Status: 'Waiting for approval' }),
    E(5200, 'John Doe', 'Glow Salon', 'Billing', 'Discount changed', 'Service package', { Discount: '0%' }, { Discount: '10%' }, { note: 'Reason: Loyalty.', flag: 1 }),
    E(7000, 'Rohan Gupta', null, 'Security', 'Meta ad account reconnected', 'Meta Ads', null, null, { note: 'Access token refreshed.' }),
    E(8000, 'John Doe', 'Sharma Garments', 'Data export', 'Client records exported', 'Sharma Garments', null, null, { note: 'CSV, 142 rows.', flag: 1 }),
    E(9000, 'Riya Shah', 'Sharma Garments', 'Data export', 'Report exported', 'Monthly report, Oct 2026', null, null, { note: 'PDF.' }),
    E(10000, 'John Doe', null, 'User access', 'User disabled', 'Meera Joshi', { Status: 'Active' }, { Status: 'Disabled' }, { note: 'All sessions ended.', flag: 1 }),
    E(15000, 'Rohan Gupta', 'Sharma Garments', 'Campaign edit', 'End date extended', 'Diwali Sale 2026', { 'End date': '15 Nov 2026' }, { 'End date': '20 Nov 2026' }),
    E(15840, 'Anita Kapoor', 'Kapoor Jewellers', 'Price change', 'Price changed', 'Gold Coin 5 g', { Price: '₹38,000' }, { Price: '₹38,500' }),
    E(24500, 'Rakesh Sharma', 'Sharma Garments', 'Price change', 'Offer price changed', 'Silk Saree Collection', { 'Offer price': '₹3,999' }, { 'Offer price': '₹3,499' }, { note: '2 creatives marked outdated.', flag: 1 }),
    E(32000, 'Rohan Gupta', 'Kapoor Jewellers', 'Campaign edit', 'Campaign published', 'Dhanteras Gold Offer', { Status: 'Scheduled' }, { Status: 'Active' }),
    E(44000, 'Rohan Gupta', null, 'Security', 'Two-step login enabled', 'Rohan Gupta', { 'Two-step login': 'Off' }, { 'Two-step login': 'On' }),
    E(53000, 'Rohan Gupta', 'Sharma Garments', 'Campaign edit', 'Campaign published', 'Diwali Sale 2026', { Status: 'Scheduled' }, { Status: 'Active' }),
    E(96000, 'John Doe', null, 'User access', 'Role changed', 'Kabir Jain', { Role: 'Ads manager' }, { Role: 'Agency manager' }, { flag: 1 }),
    E(6000, 'John Doe', null, 'Settings', 'Branding & domain updated', 'Settings', { 'Software name': 'AdDesk' }, { 'Software name': 'Kunash CRM' }),
    E(18000, 'John Doe', null, 'Security', 'Security settings updated', 'Settings', { 'Sign out after being idle for': '30 minutes' }, { 'Sign out after being idle for': '1 hour' }, { flag: 1 }),
    E(144000, 'John Doe', null, 'Billing', 'Plan price changed', 'Growth plan', { Price: '₹28,000' }, { Price: '₹30,000' }, { note: 'Effective 1 Sep 2026.', flag: 1 }),
  ];

  /* ---------- Data + tamper-evident chain ---------- */
  const sha = async (s) => {
    try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join(''); }
    catch (e) { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(16).padStart(8, '0').repeat(8); } /* demo fallback when SubtleCrypto is unavailable */
  };
  const payload = (e, prev) => [prev, e.id, e.ts, e.user, e.cat, e.action, e.entity, JSON.stringify(e.before), JSON.stringify(e.after)].join('|');
  const GENESIS = '0'.repeat(64);
  const LOG = RAW.sort((a, b) => b.m - a.m).map((e, i) => ({ ...e, seq: i + 1, id: 'AUD-' + (1001 + i), ts: NOW - e.m * MIN, ip: e.ip || '49.36.' + (100 + (i * 7) % 90) + '.' + (10 + (i * 13) % 200), dev: e.dev || DEV[i % DEV.length] }));

  async function seal(e, prev) { e.prev = prev; e.hash = await sha(payload(e, prev)); return e; }
  async function sealAll() { let p = GENESIS; for (const e of LOG) { await seal(e, p); p = e.hash; } }
  async function verify() {
    let p = GENESIS;
    for (const e of LOG) { if (e.prev !== p || e.hash !== (await sha(payload(e, p)))) return e; p = e.hash; }
    return null;
  }
  /* The only way to change the log: add a new entry at the end. Other pages can call AdDesk.audit.record({...}). */
  async function record({ user = ME, client = null, cat, action, entity = '', before = null, after = null, note = '', flag = 0 }) {
    const n = LOG.length + 1, e = { m: 0, user, role: PEOPLE[user] || '', client, cat, action, entity, before, after, note, flag, seq: n, id: 'AUD-' + (1000 + n), ts: Date.now(), ip: '49.36.112.7', dev: 'Chrome on macOS' };
    await seal(e, LOG.length ? LOG[LOG.length - 1].hash : GENESIS); LOG.push(e); return e;
  }
  A.audit = { record };

  /* ---------- UI helpers ---------- */
  const GREY = 'style="background:var(--hover);color:var(--mute)"', ORG = 'style="background:var(--soft);color:var(--or)"';
  const chip = (t, k = '') => `<span class="chip whitespace-nowrap ${/^(am|dn)$/.test(k) ? k : ''}" ${k === 'g' ? GREY : k === 'o' ? ORG : ''}>${esc(t)}</span>`;
  const catChip = (c) => chip(c, CAT[c].k);
  const sod = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const T0 = sod(NOW), YR = new Date(NOW).getFullYear();
  const hm = (d) => d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
  const when = (t) => { const d = new Date(t), s = sod(t); return (s === T0 ? 'Today' : s === T0 - DAY ? 'Yesterday' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', ...(d.getFullYear() !== YR ? { year: 'numeric' } : {}) })) + ', ' + hm(d); };
  const full = (t) => new Date(t).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
  const keysOf = (e) => [...new Set([...Object.keys(e.before || {}), ...Object.keys(e.after || {})])];
  const chg = (e) => { const k = keysOf(e); if (!k.length) return '<span class="text-mute">-</span>'; if (k.length > 1) return `<span class="text-mute">${k.length} fields changed</span>`; const b = e.before && e.before[k[0]], a = e.after && e.after[k[0]]; return `<span class="text-mute">${esc(b ?? '-')}</span> → <b class="font-semibold">${esc(a ?? '-')}</b>`; };
  const who = (e) => `<div class="flex min-w-0 items-center gap-2.5"><div class="av">${e.user === 'System' ? ic('cpu', 'h-4 w-4') : esc(AV(e.user))}</div><div class="min-w-0"><b class="block truncate">${esc(e.user)}</b><span class="block truncate text-xs text-mute">${esc(e.role)}</span></div></div>`;
  const act = (e) => `<b class="block truncate">${esc(e.action)}</b><span class="block truncate text-xs text-mute" title="${esc(e.entity)}">${esc(e.entity)}</span>`;
  const ib = (id) => `<button class="ibtn" data-act="view" data-id="${id}" aria-label="View entry" title="View entry">${ic('eye', 'h-3.5 w-3.5')}</button>`;
  const NONE = '__none';

  const st = { q: '', c: '', u: '', l: '', d: '', d1: '', d2: '', x: false, dir: 'desc', page: 1, narrow: false };
  const inRange = (e) => {
    if (st.d === 'today') return e.ts >= T0;
    if (st.d === '7') return e.ts >= NOW - 7 * DAY;
    if (st.d === '30') return e.ts >= NOW - 30 * DAY;
    if (st.d === 'custom') return (!st.d1 || e.ts >= new Date(st.d1 + 'T00:00:00').getTime()) && (!st.d2 || e.ts <= new Date(st.d2 + 'T23:59:59').getTime());
    return true;
  };
  const filtered = () => {
    const q = st.q.trim().toLowerCase();
    return LOG.filter((e) => (!q || [e.user, e.action, e.entity, e.client, e.note, e.id].join(' ').toLowerCase().includes(q)) && (!st.c || e.cat === st.c) && (!st.u || e.user === st.u) &&
      (!st.l || (st.l === NONE ? !e.client : e.client === st.l)) && (!st.x || e.flag) && inRange(e)).sort((a, b) => (st.dir === 'desc' ? b.ts - a.ts : a.ts - b.ts));
  };
  const fillFilters = () => {
    const users = [...new Set(LOG.map((e) => e.user))].sort(), cl = [...new Set(LOG.map((e) => e.client).filter(Boolean))].sort();
    $('#fc').innerHTML = '<option value="">All categories</option>' + Object.keys(CAT).map((c) => `<option>${c}</option>`).join('');
    $('#fu').innerHTML = '<option value="">All users</option>' + users.map((u) => `<option>${esc(u)}</option>`).join('');
    $('#fl').innerHTML = `<option value="">All clients</option><option value="${NONE}">Agency-wide</option>` + cl.map((c) => `<option>${esc(c)}</option>`).join('');
  };

  /* ---------- Views ---------- */
  function kpis() {
    const n = (f) => LOG.filter(f).length, d30 = (e) => e.ts >= NOW - 30 * DAY;
    const K = [['activity', 'Events today', n((e) => e.ts >= T0)], ['calendar-days', 'Last 7 days', n((e) => e.ts >= NOW - 7 * DAY)], ['badge-indian-rupee', 'Price changes (30 d)', n((e) => d30(e) && e.cat === 'Price change')],
      ['circle-check', 'Approvals (30 d)', n((e) => d30(e) && e.cat === 'Approval')], ['user-cog', 'Access & billing (30 d)', n((e) => d30(e) && (e.cat === 'User access' || e.cat === 'Billing'))], ['shield-alert', 'Sensitive (30 d)', n((e) => d30(e) && e.flag)]];
    $('#kpis').innerHTML = K.map(([i, l, v]) => `<div class="card flex min-w-0 items-center gap-2.5 p-3"><div class="ico">${ic(i)}</div><div class="min-w-0"><div class="ttl">${l}</div><div class="truncate text-lg font-bold leading-tight">${v}</div></div></div>`).join('');
  }

  function list() {
    const rows = filtered(), pages = Math.max(1, Math.ceil(rows.length / PAGE));
    st.page = Math.min(st.page, pages);
    const sl = rows.slice((st.page - 1) * PAGE, st.page * PAGE);
    if (!sl.length) $('#list').innerHTML = `<div class="grid place-items-center gap-2 px-4 py-12 text-center"><div class="ico">${ic('search-x')}</div><b>No entries match these filters</b><span class="text-xs text-mute">Try a different search, date range or category.</span><button class="btn-o" data-act="clear">Clear filters</button></div>`;
    else if (st.narrow) $('#list').innerHTML = `<div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-3 p-3">${sl.map((e) => `
      <div class="min-w-0 rounded-xl border border-line p-3">
        <div class="flex min-w-0 items-start justify-between gap-2"><div class="min-w-0">${act(e)}</div>${catChip(e.cat)}</div>
        <div class="mt-2 text-xs">${chg(e)}</div>
        <div class="mt-3 flex min-w-0 items-center gap-2 text-xs"><span class="truncate font-medium">${esc(e.user)}</span><span class="truncate text-mute">${esc(e.client || 'Agency-wide')}</span>${e.flag ? chip('Sensitive', 'dn') : ''}</div>
        <div class="mt-3 flex items-center justify-between gap-2"><span class="truncate text-xs text-mute">${when(e.ts)}</span>${ib(e.id)}</div></div>`).join('')}</div>`;
    else $('#list').innerHTML = `<div class="overflow-x-auto"><table class="w-full min-w-[980px] text-[13px]"><thead><tr class="text-left text-xs text-mute">
      <th class="py-2 pl-3 pr-2 font-medium"><button data-act="sort" class="inline-flex items-center gap-1 font-medium hover:text-ink" aria-label="Sort by time">Time ${ic(st.dir === 'desc' ? 'arrow-down' : 'arrow-up', 'h-3 w-3')}</button></th>
      <th class="px-2 font-medium">User</th><th class="px-2 font-medium">Category</th><th class="px-2 font-medium">Action</th><th class="px-2 font-medium">Client</th><th class="px-2 font-medium">Change</th><th class="py-2 pl-2 pr-3 text-right font-medium">View</th></tr></thead><tbody>${sl.map((e) => `
      <tr class="border-t border-line hover:bg-hov/50">
        <td class="whitespace-nowrap py-2 pl-3 pr-2 text-xs text-mute" title="${esc(full(e.ts))}">${when(e.ts)}</td>
        <td class="max-w-[200px] px-2">${who(e)}</td>
        <td class="px-2">${catChip(e.cat)}</td>
        <td class="max-w-[240px] px-2"><div class="flex min-w-0 items-center gap-1.5"><div class="min-w-0">${act(e)}</div>${e.flag ? chip('Sensitive', 'dn') : ''}</div></td>
        <td class="max-w-[160px] truncate px-2" title="${esc(e.client || '')}">${e.client ? esc(e.client) : '<span class="text-mute">Agency-wide</span>'}</td>
        <td class="max-w-[220px] truncate px-2">${chg(e)}</td>
        <td class="py-2 pl-2 pr-3"><div class="flex justify-end">${ib(e.id)}</div></td></tr>`).join('')}</tbody></table></div>`;
    const from = rows.length ? (st.page - 1) * PAGE + 1 : 0;
    $('#pager').innerHTML = `<span>Showing ${from}–${Math.min(st.page * PAGE, rows.length)} of ${rows.length} entries</span><div class="flex items-center gap-2"><button class="ibtn disabled:opacity-40" data-act="prev" aria-label="Previous page" ${st.page <= 1 ? 'disabled' : ''}>${ic('chevron-left', 'h-3.5 w-3.5')}</button><span>Page ${st.page} of ${pages}</span><button class="ibtn disabled:opacity-40" data-act="next" aria-label="Next page" ${st.page >= pages ? 'disabled' : ''}>${ic('chevron-right', 'h-3.5 w-3.5')}</button></div>`;
  }
  const render = () => { kpis(); list(); A.icons(); };

  /* ---------- Entry details (read-only) ---------- */
  const closeDetail = () => { const d = $('#detail'); if (d) d.remove(); document.body.classList.remove('overflow-hidden'); };
  function detail(id) {
    const e = LOG.find((x) => x.id === id); if (!e) return;
    closeDetail();
    const row = (l, v) => `<div class="grid grid-cols-[110px_minmax(0,1fr)] gap-2 py-1.5 text-[13px]"><span class="text-mute">${l}</span><span class="min-w-0 break-words font-medium">${v}</span></div>`;
    const k = keysOf(e);
    const diff = k.length ? `<div class="overflow-hidden rounded-xl border border-line"><table class="w-full text-[13px]"><thead><tr class="text-left text-xs text-mute"><th class="py-2 pl-3 pr-2 font-medium">Field</th><th class="px-2 font-medium">Before</th><th class="px-2 font-medium">After</th></tr></thead><tbody>${k.map((f) => `<tr class="border-t border-line"><td class="py-2 pl-3 pr-2 font-medium">${esc(f)}</td><td class="px-2"><span class="rounded px-1.5 py-0.5" style="background:var(--redbg);color:var(--red)">${esc(e.before && e.before[f] != null ? e.before[f] : '-')}</span></td><td class="px-2"><span class="rounded px-1.5 py-0.5" style="background:var(--grnbg);color:var(--grn)">${esc(e.after && e.after[f] != null ? e.after[f] : '-')}</span></td></tr>`).join('')}</tbody></table></div>` : '<p class="text-[13px] text-mute">No field values changed. This entry records an event.</p>';
    const el = document.createElement('div');
    el.id = 'detail'; el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6';
    el.innerHTML = `<aside role="dialog" aria-modal="true" aria-label="Audit entry" class="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl sm:max-h-[90dvh]">
      <div class="flex shrink-0 items-center gap-2.5 border-b border-line p-4"><div class="ico">${ic(CAT[e.cat].i)}</div><div class="min-w-0 flex-1"><h2 class="truncate text-base font-semibold">${esc(e.action)}</h2><span class="block truncate text-xs text-mute">${esc(e.entity)}</span></div>${catChip(e.cat)}<button data-close aria-label="Close" class="ibtn">${ic('x', 'h-4 w-4')}</button></div>
      <div class="scr min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <div class="divide-y divide-line">${row('When', esc(full(e.ts)))}${row('Who', `${esc(e.user)} <span class="text-xs font-normal text-mute">(${esc(e.role)})</span>`)}${row('Client', e.client ? esc(e.client) : 'Agency-wide')}${row('Item', esc(e.entity) || '-')}${row('IP address', esc(e.ip))}${row('Device', esc(e.dev))}${row('Entry ID', esc(e.id))}</div>
        ${e.flag ? `<div class="flex items-start gap-2 rounded-xl p-3 text-[13px]" style="background:var(--redbg);color:var(--red)">${ic('shield-alert', 'mt-0.5 h-4 w-4 shrink-0')}<span>Marked sensitive: worth a second look.</span></div>` : ''}
        <div><h3 class="mb-2 text-xs font-semibold text-mute">What changed</h3>${diff}${e.note ? `<p class="mt-2 text-[13px]">${esc(e.note)}</p>` : ''}</div>
        <div><h3 class="mb-2 text-xs font-semibold text-mute">Integrity</h3><div class="divide-y divide-line">${row('Entry no.', '#' + e.seq)}${row('Entry hash', `<code class="text-xs">${esc(e.hash.slice(0, 24))}…</code>`)}${row('Previous hash', `<code class="text-xs">${esc(e.prev.slice(0, 24))}…</code>`)}</div></div>
      </div>
      <div class="flex shrink-0 items-center justify-between gap-2 border-t border-line p-3"><span class="flex items-center gap-1.5 text-xs text-mute">${ic('lock', 'h-3.5 w-3.5')}Read-only entry</span><button class="btn-o" data-close>Close</button></div></aside>`;
    el.addEventListener('click', (ev) => { if (ev.target === el || ev.target.closest('[data-close]')) closeDetail(); });
    document.body.append(el); document.body.classList.add('overflow-hidden'); A.icons();
  }

  /* ---------- Export (the export itself is logged) ---------- */
  const csvCell = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const pair = (o) => Object.entries(o || {}).map(([k, v]) => `${k}: ${v}`).join('; ');
  async function exportCsv() {
    const rows = filtered(); if (!rows.length) { A.toast('Nothing to export for these filters'); return; }
    const head = ['Entry ID', 'Time', 'User', 'Role', 'Client', 'Category', 'Action', 'Item', 'Before', 'After', 'Note', 'IP address', 'Device'];
    const csv = [head, ...rows.map((e) => [e.id, new Date(e.ts).toISOString(), e.user, e.role, e.client || 'Agency-wide', e.cat, e.action, e.entity, pair(e.before), pair(e.after), e.note, e.ip, e.dev])].map((r) => r.map(csvCell).join(',')).join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })); a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    await record({ cat: 'Data export', action: 'Audit log exported', entity: 'Audit log', note: `CSV, ${rows.length} entries.`, flag: 1 });
    A.toast(`Exported ${rows.length} entries. This export was logged`); render();
  }

  /* ---------- Events ---------- */
  document.addEventListener('click', async (ev) => {
    const b = ev.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act;
    if (a === 'view') detail(b.dataset.id);
    else if (a === 'prev') { st.page--; render(); } else if (a === 'next') { st.page++; render(); }
    else if (a === 'sort') { st.dir = st.dir === 'desc' ? 'asc' : 'desc'; render(); }
    else if (a === 'export') exportCsv();
    else if (a === 'verify') { const bad = await verify(); A.toast(bad ? `Mismatch found at ${bad.id}. Contact support` : `Chain verified: all ${LOG.length} entries are intact`); }
    else if (a === 'clear') { Object.assign(st, { q: '', c: '', u: '', l: '', d: '', d1: '', d2: '', x: false, page: 1 }); ['#q', '#fc', '#fu', '#fl', '#fd', '#d1', '#d2'].forEach((s) => ($(s).value = '')); $('#fx').checked = false; $('#cust').classList.add('hidden'); $('#cust').classList.remove('flex'); render(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !e.defaultPrevented) closeDetail(); });

  const bind = (id, key, ev = 'change', get = (el) => el.value) => $(id).addEventListener(ev, (e) => { st[key] = get(e.target); st.page = 1; if (key === 'd') { $('#cust').classList.toggle('hidden', st.d !== 'custom'); $('#cust').classList.toggle('flex', st.d === 'custom'); } render(); });
  bind('#q', 'q', 'input'); bind('#fc', 'c'); bind('#fu', 'u'); bind('#fl', 'l'); bind('#fd', 'd'); bind('#d1', 'd1'); bind('#d2', 'd2'); bind('#fx', 'x', 'change', (el) => el.checked);

  const cq = document.querySelector('.cq');
  new ResizeObserver(() => { const n = cq.clientWidth < 720; if (n !== st.narrow) { st.narrow = n; render(); } }).observe(cq);
  st.narrow = cq.clientWidth < 720;

  fillFilters();
  sealAll().then(render);
})();