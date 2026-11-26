/* Users & roles page only. Sample data: replace `U` with API data (GET /api/users) later. */
(function () {
  const A = window.AdDesk, $ = (s) => document.querySelector(s);
  const ic = (n, c = 'h-4 w-4') => `<i data-lucide="${n}" class="${c}"></i>`;
  const AV = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const ME = 'John Doe', PAGE = 8;
  const CL = ['Sharma Garments', 'Kapoor Jewellers', 'Urban Brew Café', 'FitZone Gym', 'Glow Salon', 'Green Basket', 'Bright Smiles Dental', 'Nest Interiors', 'EduSpark Classes', 'Zenith Motors', 'Pune Pedal Cycles', 'Royal Tiffin'];
  A.clients = CL;

  /* Six roles from the brief. client = tied to exactly one client. */
  const OWNER = 'Agency owner';
  const ROLES = {
    'Agency owner': { d: 'Full control of clients, team, billing, integrations, settings and reports.', no: 'Nothing is restricted.' },
    'Agency manager': { d: 'Runs assigned clients, assigns tasks, follows up approvals, prepares reports and invoices.', no: 'Cannot see unassigned clients or change global settings.' },
    'Ads manager': { d: 'Connects ad accounts, publishes, pauses and updates campaigns, checks performance.', no: 'Cannot publish unapproved creatives or open billing.' },
    Designer: { d: 'Creates creatives and captions, uses brand assets, submits work for approval.', no: 'Cannot publish, approve or see billing.' },
    'Client admin': { client: 1, d: 'Manages own profile, products, prices and media. Approves creatives. Views campaigns and reports.', no: "Cannot see other clients or other clients' agency fees." },
    'Client viewer': { client: 1, d: 'Views the campaigns, leads and reports shared with them.', no: 'Cannot edit or approve anything.' },
  };
  const RN = Object.keys(ROLES), isClient = (r) => !!ROLES[r].client;
  const MOD = ['Clients and team', 'Products and prices', 'Media library', 'Creatives', 'Campaigns', 'Ad accounts', 'Leads', 'Reports', 'Agency billing', 'Settings and audit log'];
  const MX = [['Full', 'Assigned', '-', '-', '-', '-'], ['Full', 'Edit', 'View', 'View', 'Edit', 'View'], ['Full', 'Edit', 'View', 'Edit', 'Edit', 'View'], ['Full', 'Edit', 'View', 'Edit', 'Approve', '-'], ['Full', 'Edit', 'Edit', 'View', 'View', 'View'],
    ['Full', '-', 'Edit', '-', 'Connect', '-'], ['Full', 'Edit', 'View', '-', 'Edit', 'View'], ['Full', 'Edit', 'View', '-', 'View', 'View'], ['Full', 'Edit', '-', '-', '-', '-'], ['Full', '-', '-', '-', '-', '-']];
  const LV = { Full: '', Edit: 'o', Approve: 'o', Connect: 'o', Assigned: 'am', View: 'g' };

  /* id, name, email, phone, role, clients, mfa, last login, status, created */
  const mk = (id, name, email, role, clients, mfa, last, status, created) => ({ id, name, email, role, clients, mfa, last, status, created, phone: '+91 98220 2' + String(1000 + id * 53).slice(-4), log: [['System', 'Account created', created]] });
  let U = [
    mk(1, 'John Doe', 'john@kunashmedia.com', OWNER, [], true, 'Today, 9:12 am', 'Active', 'Jan 2025'),
    mk(2, 'Riya Shah', 'riya@kunashmedia.com', 'Agency manager', ['Sharma Garments', 'FitZone Gym', 'EduSpark Classes', 'Bright Smiles Dental'], true, 'Today, 8:40 am', 'Active', 'Jan 2025'),
    mk(3, 'Kabir Jain', 'kabir@kunashmedia.com', 'Agency manager', ['Kapoor Jewellers', 'Green Basket', 'Nest Interiors', 'Royal Tiffin'], true, 'Yesterday', 'Active', 'Jan 2025'),
    mk(4, 'Neha Rao', 'neha@kunashmedia.com', 'Agency manager', ['Urban Brew Café', 'Glow Salon', 'Zenith Motors', 'Pune Pedal Cycles'], false, '3 days ago', 'Active', 'Feb 2025'),
    mk(5, 'Rohan Gupta', 'rohan@kunashmedia.com', 'Ads manager', ['Sharma Garments', 'Kapoor Jewellers', 'Urban Brew Café', 'FitZone Gym', 'Zenith Motors'], true, 'Today, 10:05 am', 'Active', 'Mar 2025'),
    mk(6, 'Sneha Iyer', 'sneha@kunashmedia.com', 'Ads manager', ['Glow Salon', 'Green Basket', 'Nest Interiors', 'EduSpark Classes', 'Bright Smiles Dental'], true, 'Yesterday', 'Active', 'Mar 2025'),
    mk(7, 'Priya Menon', 'priya@kunashmedia.com', 'Designer', ['Sharma Garments', 'Urban Brew Café', 'Nest Interiors', 'Zenith Motors'], false, 'Today, 9:50 am', 'Active', 'Apr 2025'),
    mk(8, 'Arjun Das', 'arjun@kunashmedia.com', 'Designer', ['Kapoor Jewellers', 'FitZone Gym', 'Glow Salon', 'EduSpark Classes'], true, '2 days ago', 'Active', 'Apr 2025'),
    mk(9, 'Rakesh Sharma', 'rakesh@sharmagarments.in', 'Client admin', ['Sharma Garments'], false, '2 days ago', 'Active', 'Mar 2025'),
    mk(10, 'Anita Kapoor', 'anita@kapoorjewellers.in', 'Client admin', ['Kapoor Jewellers'], true, 'Last week', 'Active', 'Jan 2025'),
    mk(11, 'Vikram Nair', 'vikram@urbanbrew.in', 'Client admin', ['Urban Brew Café'], false, 'Yesterday', 'Active', 'Jun 2025'),
    mk(12, 'Sandeep Patil', 'sandeep@fitzonegym.in', 'Client viewer', ['FitZone Gym'], false, '5 days ago', 'Active', 'Aug 2025'),
    mk(13, 'Pooja Desai', 'pooja@glowsalon.in', 'Client viewer', ['Glow Salon'], false, 'Never', 'Invited', 'Nov 2026'),
    mk(14, 'Meera Joshi', 'meera@brightsmiles.in', 'Client admin', ['Bright Smiles Dental'], false, '2 months ago', 'Disabled', 'Nov 2025'),
  ];
  const find = (id) => U.find((u) => u.id === +id);
  const log = (u, t) => u.log.unshift([ME, t, 'Just now']);
  const owners = () => U.filter((u) => u.role === OWNER && u.status !== 'Disabled');
  $('#fr').innerHTML = '<option value="">All roles</option>' + RN.map((r) => `<option>${r}</option>`).join('');

  /* UI helpers */
  const GREY = 'style="background:var(--hover);color:var(--mute)"', ORG = 'style="background:var(--soft);color:var(--or)"';
  const chip = (t, k = '') => `<span class="chip whitespace-nowrap ${/^(am|dn)$/.test(k) ? k : ''}" ${k === 'g' ? GREY : k === 'o' ? ORG : ''}>${t}</span>`;
  const SK = { Active: '', Invited: 'o', Disabled: 'g' };
  const mfaChip = (u) => (u.mfa ? chip('On') : chip('Off', isClient(u.role) ? 'g' : 'dn'));
  const access = (u) => (u.role === OWNER ? 'All clients' : u.clients.length ? (isClient(u.role) ? u.clients[0] : `${u.clients.length} client${u.clients.length === 1 ? '' : 's'}`) : '<span class="text-[var(--amb)]">None assigned</span>');
  const ib = (act, id, icon, label) => `<button class="ibtn" data-act="${act}" data-id="${id}" aria-label="${label}" title="${label}">${ic(icon, 'h-3.5 w-3.5')}</button>`;
  const actions = (u) => ib('view', u.id, 'eye', 'View') + ib('access', u.id, 'building-2', 'Client access') + ib('edit', u.id, 'pencil', 'Edit');

  const st = { tab: 'Users', q: '', r: '', s: '', page: 1, narrow: false };
  const filtered = () => { const q = st.q.trim().toLowerCase(); return U.filter((u) => (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) && (!st.r || u.role === st.r) && (!st.s || u.status === st.s)).sort((a, b) => RN.indexOf(a.role) - RN.indexOf(b.role) || a.name.localeCompare(b.name)); };

  function kpis() {
    const staff = U.filter((u) => !isClient(u.role));
    const K = [['users', 'Total users', U.length], ['circle-check', 'Active', U.filter((u) => u.status === 'Active').length], ['briefcase', 'Agency staff', staff.length], ['building-2', 'Client users', U.length - staff.length], ['shield-alert', 'Staff without MFA', staff.filter((u) => !u.mfa && u.status !== 'Disabled').length], ['mail', 'Pending invites', U.filter((u) => u.status === 'Invited').length]];
    $('#kpis').innerHTML = K.map(([i, l, v]) => `<div class="card flex min-w-0 items-center gap-2.5 p-3"><div class="ico">${ic(i)}</div><div class="min-w-0"><div class="ttl">${l}</div><div class="truncate text-lg font-bold leading-tight">${v}</div></div></div>`).join('');
  }

  function usersView() {
    const rows = filtered(), pages = Math.max(1, Math.ceil(rows.length / PAGE));
    st.page = Math.min(st.page, pages);
    const sl = rows.slice((st.page - 1) * PAGE, st.page * PAGE);
    if (!sl.length) $('#list').innerHTML = `<div class="grid place-items-center gap-2 px-4 py-12 text-center"><div class="ico">${ic('search-x')}</div><b>No users match these filters</b><span class="text-xs text-mute">Try a different search or clear the filters.</span><button class="btn-o" data-act="clear">Clear filters</button></div>`;
    else if (st.narrow) $('#list').innerHTML = `<div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-3 p-3">${sl.map((u) => `
      <div class="min-w-0 rounded-xl border border-line p-3">
        <div class="flex min-w-0 items-center gap-2.5"><div class="av">${AV(u.name)}</div><div class="min-w-0 flex-1"><b class="block truncate text-[13px]">${u.name}</b><span class="block truncate text-xs text-mute">${u.email}</span></div>${chip(u.status, SK[u.status])}</div>
        <div class="mt-3 flex flex-wrap items-center gap-2 text-xs"><span class="font-medium">${u.role}</span><span class="text-mute">${access(u)}</span>${mfaChip(u)}</div>
        <div class="mt-3 flex items-center justify-between gap-2"><span class="truncate text-xs text-mute">Last login: ${u.last}</span><div class="flex gap-1.5">${actions(u)}</div></div></div>`).join('')}</div>`;
    else $('#list').innerHTML = `<div class="overflow-x-auto"><table class="w-full min-w-[820px] text-[13px]"><thead><tr class="text-left text-xs text-mute"><th class="py-2 pl-3 pr-2 font-medium">User</th><th class="px-2 font-medium">Role</th><th class="px-2 font-medium">Client access</th><th class="px-2 font-medium">MFA</th><th class="px-2 font-medium">Last login</th><th class="px-2 font-medium">Status</th><th class="py-2 pl-2 pr-3 text-right font-medium">Actions</th></tr></thead><tbody>${sl.map((u) => `
      <tr class="border-t border-line hover:bg-hov/50">
        <td class="max-w-[260px] py-2 pl-3 pr-2"><div class="flex min-w-0 items-center gap-2.5"><div class="av">${AV(u.name)}</div><div class="min-w-0"><b class="block truncate">${u.name}${u.name === ME ? ' <span class="text-xs font-normal text-mute">(you)</span>' : ''}</b><span class="block truncate text-xs text-mute">${u.email}</span></div></div></td>
        <td class="whitespace-nowrap px-2">${u.role}</td><td class="max-w-[180px] truncate px-2" title="${u.clients.join(', ')}">${access(u)}</td><td class="px-2">${mfaChip(u)}</td><td class="whitespace-nowrap px-2 text-xs text-mute">${u.last}</td><td class="px-2">${chip(u.status, SK[u.status])}</td>
        <td class="py-2 pl-2 pr-3"><div class="flex justify-end gap-1.5">${actions(u)}</div></td></tr>`).join('')}</tbody></table></div>`;
    const from = rows.length ? (st.page - 1) * PAGE + 1 : 0;
    $('#pager').innerHTML = `<span>Showing ${from}–${Math.min(st.page * PAGE, rows.length)} of ${rows.length} users</span><div class="flex items-center gap-2"><button class="ibtn disabled:opacity-40" data-act="prev" aria-label="Previous page" ${st.page <= 1 ? 'disabled' : ''}>${ic('chevron-left', 'h-3.5 w-3.5')}</button><span>Page ${st.page} of ${pages}</span><button class="ibtn disabled:opacity-40" data-act="next" aria-label="Next page" ${st.page >= pages ? 'disabled' : ''}>${ic('chevron-right', 'h-3.5 w-3.5')}</button></div>`;
  }

  function rolesView() {
    const n = (r) => U.filter((u) => u.role === r).length;
    $('#list').innerHTML = `<div class="space-y-4 p-3">
      <div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-3">${RN.map((r) => `
        <div class="min-w-0 rounded-xl border border-line p-3"><div class="flex items-center gap-2"><b class="min-w-0 flex-1 truncate text-[13px]">${r}</b>${chip(n(r) + ' user' + (n(r) === 1 ? '' : 's'), 'g')}</div>
          <p class="mt-2 text-xs">${ROLES[r].d}</p><p class="mt-2 text-xs text-mute"><b class="font-semibold">Cannot:</b> ${ROLES[r].no}</p><p class="mt-2 text-xs text-mute">${isClient(r) ? 'Tied to exactly one client.' : r === OWNER ? 'Sees every client.' : 'Sees only assigned clients.'}</p></div>`).join('')}</div>
      <div><h3 class="mb-2 text-xs font-semibold text-mute">Access by module</h3><div class="overflow-x-auto rounded-xl border border-line"><table class="w-full min-w-[760px] text-[13px]"><thead><tr class="text-left text-xs text-mute"><th class="py-2 pl-3 pr-2 font-medium">Module</th>${RN.map((r) => `<th class="px-2 font-medium">${r}</th>`).join('')}</tr></thead><tbody>${MOD.map((m, i) => `<tr class="border-t border-line"><td class="py-2 pl-3 pr-2 font-medium">${m}</td>${MX[i].map((v) => `<td class="px-2">${v === '-' ? '<span class="text-mute">-</span>' : chip(v, LV[v])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <p class="mt-2 text-xs text-mute">Starting point from the brief. Confirm the exact rules with the agency before the backend enforces them.</p></div></div>`;
    $('#pager').innerHTML = '';
  }

  function render() {
    kpis();
    $('#tabs').innerHTML = ['Users', 'Roles & access'].map((t) => `<button role="tab" aria-selected="${st.tab === t}" data-act="tab" data-tab="${t}" class="-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 pb-2 text-xs font-medium ${st.tab === t ? 'border-brand text-ink' : 'border-transparent text-mute hover:text-ink'}">${t}</button>`).join('');
    $('#bar').classList.toggle('hidden', st.tab !== 'Users'); $('#bar').classList.toggle('flex', st.tab === 'Users');
    st.tab === 'Users' ? usersView() : rolesView();
    A.icons();
  }

  /* User details */
  let cur = null;
  const closeDetail = () => { const d = $('#detail'); if (d) d.remove(); cur = null; document.body.classList.remove('overflow-hidden'); };
  function detail(id) {
    const u = find(id); if (!u) return;
    const keep = $('#detail .scr') ? $('#detail .scr').scrollTop : 0;
    closeDetail(); cur = u.id;
    const row = (l, v) => `<div class="grid grid-cols-[110px_minmax(0,1fr)] gap-2 py-1.5 text-[13px]"><span class="text-mute">${l}</span><span class="min-w-0 break-words font-medium">${v}</span></div>`;
    const el = document.createElement('div');
    el.id = 'detail'; el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6';
    el.innerHTML = `<aside role="dialog" aria-modal="true" aria-label="User details" class="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl sm:max-h-[90dvh]">
      <div class="flex shrink-0 items-center gap-2.5 border-b border-line p-4"><div class="av h-10 w-10 text-xs">${AV(u.name)}</div><div class="min-w-0 flex-1"><h2 class="truncate text-base font-semibold">${u.name}</h2><span class="block truncate text-xs text-mute">${u.email}</span></div>${chip(u.status, SK[u.status])}<button data-close aria-label="Close" class="ibtn">${ic('x', 'h-4 w-4')}</button></div>
      <div class="scr min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <div class="divide-y divide-line">${row('Role', u.role)}${row('Phone', u.phone)}${row('Added', u.created)}${row('Last login', u.last)}${row('Two-step login', u.mfa ? 'On (authenticator app)' : 'Off' + (isClient(u.role) ? '' : '. Recommended for all agency staff.'))}</div>
        <div><h3 class="mb-1 text-xs font-semibold text-mute">What this role can do</h3><p class="text-[13px]">${ROLES[u.role].d}</p><p class="mt-1 text-xs text-mute">Cannot: ${ROLES[u.role].no}</p></div>
        <div><h3 class="mb-2 text-xs font-semibold text-mute">Client access</h3>${u.role === OWNER ? '<p class="text-[13px]">Owner can open every client.</p>' : u.clients.length ? `<div class="flex flex-wrap gap-1.5">${u.clients.map((c) => chip(c, 'g')).join('')}</div>` : '<p class="text-[13px] text-[var(--amb)]">No clients assigned yet. This user cannot open any client.</p>'}</div>
        <div><h3 class="mb-2 text-xs font-semibold text-mute">Recent activity</h3><div class="space-y-1.5">${u.log.slice(0, 6).map(([w, t, when]) => `<div class="flex items-start justify-between gap-3 text-[13px]"><span class="min-w-0">${t} <span class="text-xs text-mute">by ${w}</span></span><span class="shrink-0 text-xs text-mute">${when}</span></div>`).join('')}</div></div>
      </div>
      <div class="flex shrink-0 flex-wrap gap-2 border-t border-line p-3"><button class="btn-p" data-act="edit" data-id="${u.id}">${ic('pencil', 'h-3.5 w-3.5')}Edit</button><button class="btn-o" data-act="access" data-id="${u.id}">${ic('building-2', 'h-3.5 w-3.5')}Client access</button><button class="btn-o" data-act="pwd" data-id="${u.id}">${ic('key-round', 'h-3.5 w-3.5')}Reset password</button>${u.mfa ? `<button class="btn-o" data-act="mfa" data-id="${u.id}">${ic('shield-off', 'h-3.5 w-3.5')}Reset MFA</button>` : ''}${u.status === 'Invited' ? `<button class="btn-o" data-act="resend" data-id="${u.id}">${ic('mail', 'h-3.5 w-3.5')}Resend invite</button>` : ''}<button class="btn-o ml-auto" data-act="toggle" data-id="${u.id}">${u.status === 'Disabled' ? 'Enable user' : 'Disable user'}</button></div></aside>`;
    el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('[data-close]')) closeDetail(); });
    document.body.append(el); document.body.classList.add('overflow-hidden'); A.icons(); $('#detail .scr').scrollTop = keep;
  }

  /* Client access dialog: checkboxes for staff, one radio for client users */
  const closeAcc = () => { const a = $('#acc'); if (a) a.remove(); if (!$('#detail')) document.body.classList.remove('overflow-hidden'); };
  function accessDialog(u) {
    closeAcc();
    const el = document.createElement('div');
    el.id = 'acc'; el.className = 'fixed inset-0 z-[55] flex items-center justify-center bg-black/40 p-3 sm:p-6';
    const one = isClient(u.role), body = u.role === OWNER ? '<p class="p-4 text-[13px]">Agency owners can open every client. Nothing to assign.</p>' :
      `<div class="min-h-0 flex-1 overflow-y-auto p-4"><p class="mb-3 text-xs text-mute">${one ? 'Client users are tied to exactly one client.' : 'Pick the clients this person can open. They will not see any others.'}</p>${one ? '' : '<label class="mb-2 flex items-center gap-2 text-[13px] font-medium"><input type="checkbox" id="all"> Select all</label>'}<div class="grid gap-1.5 sm:grid-cols-2">${CL.map((c) => `<label class="flex min-w-0 items-center gap-2 rounded-lg border border-line px-2.5 py-2 text-[13px]"><input type="${one ? 'radio' : 'checkbox'}" name="cl" value="${c}" ${u.clients.includes(c) ? 'checked' : ''}><span class="truncate">${c}</span></label>`).join('')}</div></div>`;
    el.innerHTML = `<form role="dialog" aria-modal="true" aria-label="Client access" class="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl sm:max-h-[90dvh]"><div class="flex items-center justify-between border-b border-line px-4 py-3"><h2 class="truncate text-base font-semibold">Client access: ${u.name}</h2><button type="button" data-close aria-label="Close" class="ibtn">${ic('x', 'h-4 w-4')}</button></div>${body}<div class="flex justify-end gap-2 border-t border-line px-4 py-3"><button type="button" data-close class="h-9 rounded-lg border border-line px-4 font-medium hover:bg-hov">Cancel</button>${u.role === OWNER ? '' : '<button class="h-9 rounded-lg bg-brand px-4 font-semibold text-white">Save access</button>'}</div></form>`;
    el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('[data-close]')) closeAcc(); });
    const all = el.querySelector('#all'); if (all) all.onchange = () => el.querySelectorAll('input[name=cl]').forEach((c) => (c.checked = all.checked));
    el.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const v = [...el.querySelectorAll('input[name=cl]:checked')].map((c) => c.value);
      if (one && v.length !== 1) { A.toast('Choose exactly one client for a client user'); return; }
      u.clients = v; log(u, v.length ? `Client access set to ${v.length} client${v.length === 1 ? '' : 's'}` : 'All client access removed');
      closeAcc(); A.toast('Client access saved'); render(); if (cur) detail(cur);
    });
    document.body.append(el); document.body.classList.add('overflow-hidden'); A.icons();
  }

  /* Clicks */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act, u = find(b.dataset.id);
    if (a === 'tab') { st.tab = b.dataset.tab; render(); }
    else if (a === 'view') detail(u.id);
    else if (a === 'edit') A.openForm('userEdit', u);
    else if (a === 'access') accessDialog(u);
    else if (a === 'pwd') { log(u, 'Password reset email sent'); A.toast('Password reset link sent to ' + u.email); detail(u.id); }
    else if (a === 'mfa') { u.mfa = false; log(u, 'Two-step login reset. User must set it up again at next login'); A.toast('MFA reset for ' + u.name); render(); detail(u.id); }
    else if (a === 'resend') { log(u, 'Invite sent again'); A.toast('Invite sent again to ' + u.email); detail(u.id); }
    else if (a === 'toggle') {
      if (u.status !== 'Disabled' && u.name === ME) { A.toast('You cannot disable your own account'); return; }
      if (u.status !== 'Disabled' && u.role === OWNER && owners().length < 2) { A.toast('Keep at least one active agency owner'); return; }
      u.status = u.status === 'Disabled' ? 'Active' : 'Disabled'; log(u, u.status === 'Disabled' ? 'User disabled. All sessions ended' : 'User enabled'); A.toast(`${u.name} is now ${u.status.toLowerCase()}`); render(); detail(u.id);
    }
    else if (a === 'prev') { st.page--; render(); } else if (a === 'next') { st.page++; render(); }
    else if (a === 'clear') { Object.assign(st, { q: '', r: '', s: '', page: 1 }); $('#q').value = ''; $('#fr').value = ''; $('#fs').value = ''; render(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key !== 'Escape' || e.defaultPrevented) return; if ($('#acc')) { e.preventDefault(); closeAcc(); } else closeDetail(); });

  const bind = (id, key, ev = 'change') => $(id).addEventListener(ev, (e) => { st[key] = e.target.value; st.page = 1; render(); });
  bind('#q', 'q', 'input'); bind('#fr', 'r'); bind('#fs', 's');

  /* Saved forms */
  document.addEventListener('form:saved', ({ detail: { key, data, vals } }) => {
    if (key === 'userInvite') {
      const email = data.email.trim().toLowerCase(), r = data.role;
      if (U.some((u) => u.email.toLowerCase() === email)) { A.toast('A user with this email already exists'); return; }
      if (isClient(r) && data.client === 'Not applicable') { A.toast('Choose the client for a client user'); return; }
      if (!isClient(r) && data.client !== 'Not applicable') { A.toast('Client is only for client roles. Set it to Not applicable'); return; }
      const u = mk(Math.max(0, ...U.map((x) => x.id)) + 1, data.name.trim(), email, r, isClient(r) ? [data.client] : r === OWNER || data.access === 'All clients' ? (r === OWNER ? [] : CL.slice()) : [], false, 'Never', 'Invited', 'Nov 2026');
      if (data.phone) u.phone = data.phone;
      log(u, 'Invited as ' + r); U.unshift(u); Object.assign(st, { tab: 'Users', page: 1, q: '', r: '', s: '' }); $('#q').value = ''; $('#fr').value = ''; $('#fs').value = '';
      render(); A.toast('Invite sent to ' + email);
      if (!isClient(r) && r !== OWNER && data.access !== 'All clients') accessDialog(u);
    } else if (key === 'userEdit') {
      const u = find(vals.id); if (!u) return;
      if (data.role !== u.role) {
        if (isClient(data.role) !== isClient(u.role)) { A.toast('Staff and client users cannot swap type. Invite a new user instead'); return; }
        if (u.role === OWNER && owners().length < 2) { A.toast('Keep at least one active agency owner'); return; }
        if (u.name === ME) { A.toast('You cannot change your own role'); return; }
        log(u, `Role changed from ${u.role} to ${data.role}`);
        if (data.role === OWNER) u.clients = []; else if (u.role === OWNER) u.clients = [];
      }
      Object.assign(u, { name: data.name.trim(), phone: data.phone || u.phone, role: data.role });
    } else return;
    render(); if (cur) detail(cur);
  });

  const cq = document.querySelector('.cq');
  new ResizeObserver(() => { const n = cq.clientWidth < 720; if (n !== st.narrow) { st.narrow = n; render(); } }).observe(cq);
  st.narrow = cq.clientWidth < 720;
  render();
})();