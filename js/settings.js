/* Settings page only.
   Sample data: replace `S` with API data (GET /api/settings) and send changes with PUT /api/settings/{section}.
   Rules from the brief:
   - Only the Agency owner can open or change settings ("Settings and audit log: Full" for owner, "-" for everyone else).
   - Every saved change is written to the audit log (AdDesk.audit.record, when the audit module is loaded).
   - The backend must enforce the owner rule and re-check every value. This file only shows and pre-checks them.
   - Never store full card numbers or passwords here. Bank details are for printing on invoices only. */
(function () {
  const A = window.AdDesk, $ = (s) => document.querySelector(s);
  const ic = (n, c = 'h-4 w-4') => `<i data-lucide="${n}" class="${c}"></i>`;
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const ME = 'John Doe', ME_ROLE = 'Agency owner';

  /* Gate: owner only. */
  if (ME_ROLE !== 'Agency owner') {
    document.querySelector('.cq').innerHTML = `<div class="card grid place-items-center gap-2 px-4 py-16 text-center"><div class="ico">${ic('lock')}</div><b>Settings are for the agency owner only</b><span class="text-xs text-mute">Ask the owner if something needs to change.</span></div>`;
    A.icons();
    return;
  }

  /* ---------- Layout of the page ---------- */
  const TABS = [
    ['profile', 'Agency profile', 'Name, contact details, time zone and logo shown across the CRM and on invoices.'],
    ['branding', 'Branding & domain', 'White-label: the name, colour and web address your clients see in their portal and emails. (Phase 5)'],
    ['invoicing', 'Invoicing & tax', 'GST details, invoice numbering, payment terms and the bank details printed on agency invoices.'],
    ['notifications', 'Notifications', 'Choose which alerts go out and where. Clients and staff get alerts based on their role.'],
    ['security', 'Security', 'Sign-in rules for everyone who uses the CRM. Stricter rules are safer but add a little friction.'],
    ['data', 'Data & backups', 'Daily backups of the database and files, and exports of client records on request.'],
  ];
  const INP = 'h-9 w-full rounded-lg border border-line bg-card px-2.5 text-ink outline-none disabled:opacity-60';
  const STATES = ['Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal', 'Other'];
  const ipOk = (s) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean).every((x) => /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/.test(x) && x.split('/')[0].split('.').every((n) => +n <= 255) && (!x.includes('/') || +x.split('/')[1] <= 32));
  const int = (min, max) => (s) => (/^\d+$/.test(s) && +s >= min && +s <= max ? '' : `Enter a whole number from ${min} to ${max}`);

  /* Field list. s = section, k = key, l = label, t = type. req = required, re/m = pattern and message, chk = custom check, up = upper-case, mask = hide in logs. */
  const f = (s, k, l, t = 'text', o = {}) => ({ s, k, l, t, ...o });
  const F = [
    f('profile', 'logo', 'Agency logo', 'logo'),
    f('profile', 'agency', 'Agency name', 'text', { req: 1, hint: 'Shown in the sidebar, emails and reports.' }),
    f('profile', 'legal', 'Legal business name', 'text', { hint: 'Printed on invoices.' }),
    f('profile', 'email', 'Contact email', 'email', { req: 1, re: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, m: 'Enter a valid email address' }),
    f('profile', 'phone', 'Phone', 'tel', { re: /^\+?[0-9 ()-]{8,16}$/, m: 'Enter a valid phone number' }),
    f('profile', 'website', 'Website', 'text', { re: /^https?:\/\/[^\s.]+\.[^\s]+$/i, m: 'Start with https://' }),
    f('profile', 'pin', 'PIN code', 'text', { re: /^\d{6}$/, m: 'PIN code has 6 digits' }),
    f('profile', 'address', 'Address', 'textarea', { full: 1 }),
    f('profile', 'city', 'City'),
    f('profile', 'state', 'State', 'select', { opts: STATES }),
    f('profile', 'tz', 'Time zone', 'select', { opts: [['Asia/Kolkata', 'India (IST, UTC+5:30)'], ['Asia/Dubai', 'Dubai (UTC+4)'], ['Asia/Singapore', 'Singapore (UTC+8)'], ['Europe/London', 'London'], ['America/New_York', 'New York']], hint: 'Used for schedules, reports and reminders.' }),
    f('profile', 'dateFmt', 'Date format', 'select', { opts: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] }),
    f('profile', 'fy', 'Financial year starts in', 'select', { opts: ['April', 'January'] }),
    f('profile', 'currency', 'Currency', 'text', { dis: 1, hint: 'Rupees only for now.' }),

    f('branding', 'swName', 'Software name shown to clients', 'text', { req: 1, hint: 'Appears in the portal header, login page and emails.' }),
    f('branding', 'tagline', 'Tagline'),
    f('branding', 'color', 'Brand colour', 'color', { re: /^#[0-9a-f]{6}$/i, m: 'Use a colour like #EF7F1B' }),
    f('branding', 'domain', 'Custom domain', 'text', { re: /^(?!-)([a-z0-9-]+\.)+[a-z]{2,}$/i, m: 'Enter only the domain, like crm.youragency.com', hint: 'Leave empty to use the default address.' }),
    f('branding', 'fromName', 'Email sender name'),
    f('branding', 'fromEmail', 'Email sender address', 'email', { re: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, m: 'Enter a valid email address' }),
    f('branding', 'loginMsg', 'Message on the login page', 'textarea', { full: 1 }),
    f('branding', 'poweredBy', 'Show a "Powered by" line on the client portal', 'toggle', { hint: 'Turn off for a fully white-label portal.' }),

    f('invoicing', 'gstin', 'GSTIN', 'text', { up: 1, re: /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, m: 'GSTIN has 15 characters, like 27ABCDE1234F1Z5', hint: 'Sample value. Replace with the agency GSTIN.' }),
    f('invoicing', 'pan', 'PAN', 'text', { up: 1, re: /^[A-Z]{5}\d{4}[A-Z]$/, m: 'PAN has 10 characters, like ABCDE1234F' }),
    f('invoicing', 'gstRate', 'Default GST rate', 'select', { opts: [['0', '0%'], ['5', '5%'], ['12', '12%'], ['18', '18%'], ['28', '28%']] }),
    f('invoicing', 'terms', 'Payment terms', 'select', { opts: [['0', 'Due on receipt'], ['7', '7 days'], ['15', '15 days'], ['30', '30 days']] }),
    f('invoicing', 'prefix', 'Invoice number prefix', 'text', { req: 1, re: /^[A-Za-z0-9/_-]{1,12}$/, m: 'Up to 12 letters, digits, - or /' }),
    f('invoicing', 'next', 'Next invoice number', 'number', { req: 1, chk: int(1, 999999), hint: 'Numbers always go up. They are never reused.' }),
    f('invoicing', 'remindBefore', 'Remind client before due date (days)', 'number', { chk: int(0, 30) }),
    f('invoicing', 'overdueEvery', 'Repeat overdue reminder every (days)', 'number', { chk: int(1, 30) }),
    f('invoicing', 'bankName', 'Bank name'),
    f('invoicing', 'acctName', 'Account holder name'),
    f('invoicing', 'acctNo', 'Account number', 'text', { mask: 1, re: /^\d{9,18}$/, m: 'Account number has 9 to 18 digits' }),
    f('invoicing', 'ifsc', 'IFSC code', 'text', { up: 1, re: /^[A-Z]{4}0[A-Z0-9]{6}$/, m: 'IFSC has 11 characters, like HDFC0001234' }),
    f('invoicing', 'upi', 'UPI ID', 'text', { re: /^[\w.-]{2,}@[a-z]{2,}$/i, m: 'Enter a UPI ID like name@bank' }),
    f('invoicing', 'footer', 'Invoice footer note', 'textarea', { full: 1 }),
    f('invoicing', 'showGst', 'Show the CGST / SGST / IGST split on invoices', 'toggle', { hint: 'Needed for GST-ready invoices.' }),

    f('notifications', 'digestOn', 'Send staff a daily summary email', 'toggle', { hint: 'One email with pending approvals, new leads and overdue invoices.' }),
    f('notifications', 'digestTime', 'Daily summary time', 'select', { opts: ['08:00', '09:00', '10:00', '18:00'] }),

    f('security', 'mfaStaff', 'Require two-step login for all agency staff', 'toggle', { hint: 'Uses an authenticator app. Strongly recommended.' }),
    f('security', 'mfaClients', 'Offer two-step login to client users', 'toggle', { hint: 'Optional for clients.' }),
    f('security', 'loginAlert', 'Email the owner when someone signs in from a new device', 'toggle'),
    f('security', 'pwMixed', 'Passwords must mix letters, numbers and a symbol', 'toggle'),
    f('security', 'pwMin', 'Minimum password length', 'select', { opts: [['8', '8 characters'], ['10', '10 characters'], ['12', '12 characters']] }),
    f('security', 'idle', 'Sign out after being idle for', 'select', { opts: [['30', '30 minutes'], ['60', '1 hour'], ['240', '4 hours'], ['480', '8 hours']] }),
    f('security', 'maxFails', 'Lock account after failed sign-ins', 'select', { opts: [['3', '3 attempts'], ['5', '5 attempts'], ['10', '10 attempts']] }),
    f('security', 'lockMins', 'Lock duration', 'select', { opts: [['10', '10 minutes'], ['15', '15 minutes'], ['30', '30 minutes'], ['60', '1 hour']] }),
    f('security', 'ips', 'Allowed IP addresses (optional)', 'textarea', { full: 1, chk: (s) => (ipOk(s) ? '' : 'One IPv4 address or range per line, like 49.36.112.7 or 49.36.0.0/16'), hint: 'Leave empty to allow sign-in from anywhere. Be careful: a wrong list can lock everyone out.' }),

    f('data', 'backupTime', 'Daily backup time', 'select', { opts: ['01:00', '02:00', '03:00', '04:00'], hint: 'Pick a quiet hour.' }),
    f('data', 'retention', 'Keep backups for', 'select', { opts: [['7', '7 days'], ['14', '14 days'], ['30', '30 days'], ['90', '90 days']] }),
    f('data', 'backupFail', 'Email the owner if a backup fails', 'toggle'),
  ];
  const FD = Object.fromEntries(F.map((x) => [x.k, x]));

  const EV = [['approval', 'Creative waiting for approval'], ['response', 'Client approved or asked for changes'], ['outdated', 'Outdated creative after a price change'], ['lead', 'New lead received'], ['due', 'Invoice due soon'], ['overdue', 'Invoice overdue'], ['adfail', 'Ad account connection failed or expiring'], ['report', 'Scheduled report ready']];
  const CH = [['app', 'In-app'], ['email', 'Email'], ['wa', 'WhatsApp']];

  /* ---------- Saved settings (sample) ---------- */
  const S = {
    logo: '', agency: 'Kunash Media', legal: 'Kunash Media Pvt. Ltd.', email: 'hello@kunashmedia.com', phone: '+91 98220 21000', website: 'https://kunashmedia.com', pin: '411045',
    address: 'Office 12, Baner Road', city: 'Pune', state: 'Maharashtra', tz: 'Asia/Kolkata', dateFmt: 'DD/MM/YYYY', fy: 'April', currency: 'INR (₹)',
    swName: 'Kunash CRM', tagline: 'Your growth partner', color: '#EF7F1B', domain: 'crm.kunashmedia.com', fromName: 'Kunash Media', fromEmail: 'no-reply@kunashmedia.com', loginMsg: 'Welcome back. Sign in to review your campaigns.', poweredBy: false,
    gstin: '27ABCDE1234F1Z5', pan: 'ABCDE1234F', gstRate: '18', terms: '15', prefix: 'INV-2026-', next: '119', remindBefore: '3', overdueEvery: '7', bankName: 'HDFC Bank', acctName: 'Kunash Media Pvt. Ltd.', acctNo: '50200012345678', ifsc: 'HDFC0001234', upi: 'kunashmedia@hdfcbank', footer: 'Thank you for your business. Payment is due by the date shown.', showGst: true,
    digestOn: true, digestTime: '09:00',
    notif: Object.fromEntries(EV.map(([e]) => [e, { app: true, email: true, wa: false }])),
    mfaStaff: true, mfaClients: false, loginAlert: true, pwMixed: true, pwMin: '10', idle: '60', maxFails: '5', lockMins: '15', ips: '',
    backupTime: '02:00', retention: '30', backupFail: true,
  };
  let D = clone(S);
  const DOM = { status: 'Not verified' };
  const HIST = [
    { who: ME, sec: 'Branding & domain', text: 'Software name', when: 'Yesterday, 4:20 pm' },
    { who: ME, sec: 'Security', text: 'Idle timeout', when: '12 Nov, 11:05 am' },
  ];
  const mkDays = () => { const r = []; for (let i = 1; i <= 7; i++) { const d = new Date(); d.setDate(d.getDate() - i); r.push({ d: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ', ' + S.backupTime, size: (1.78 + (7 - i) * 0.02).toFixed(2) + ' GB', st: i === 3 ? 'Retried' : 'Success' }); } return r; };
  const BK = mkDays();
  const XR = [{ client: 'Sharma Garments', parts: 'Profile, Products & prices, Leads', fmt: 'CSV', who: ME, when: '12 Nov, 3:40 pm', st: 'Ready' }];
  const st = { tab: 'profile', errs: {} };

  /* ---------- Helpers ---------- */
  const flat = (o) => { const r = {}; F.forEach((x) => { r[x.k] = o[x.k]; }); EV.forEach(([e]) => CH.forEach(([c]) => { r[`n:${e}:${c}`] = o.notif[e][c]; })); return r; };
  const secOf = (k) => (k.startsWith('n:') ? 'notifications' : FD[k].s);
  const labOf = (k) => { if (k.startsWith('n:')) { const [, e, c] = k.split(':'); return `${EV.find((x) => x[0] === e)[1]} / ${CH.find((x) => x[0] === c)[1]}`; } return FD[k].l; };
  const showV = (k, v) => { if (typeof v === 'boolean') return v ? 'On' : 'Off'; if (k === 'logo') return v ? 'Custom logo' : 'Default logo'; if (v === '' || v == null) return '(empty)'; if (!k.startsWith('n:') && FD[k].mask) return '••••' + String(v).slice(-4); const s = String(v).replace(/\s+/g, ' '); return s.length > 40 ? s.slice(0, 40) + '…' : s; };
  const changed = () => { const a = flat(S), b = flat(D); return Object.keys(b).filter((k) => a[k] !== b[k]); };
  const check = (x, v) => {
    if (x.t === 'toggle' || x.t === 'logo') return '';
    const s = String(v ?? '').trim();
    if (x.req && !s) return `${x.l} is required`;
    if (s && x.re && !x.re.test(s)) return x.m;
    if (x.chk && (s || x.t === 'number')) return x.chk(s) || '';
    return '';
  };
  const setErr = (k, m) => { const el = document.querySelector(`[data-err="${k}"]`); if (!el) return; el.textContent = m || ''; el.classList.toggle('hidden', !m); const i = document.getElementById('f_' + k); if (i) i.setAttribute('aria-invalid', m ? 'true' : 'false'); };

  /* ---------- Rendering ---------- */
  const toggle = (k, on) => `<label class="relative inline-flex shrink-0 cursor-pointer items-center"><input type="checkbox" id="f_${k}" data-k="${k}" class="peer sr-only" ${on ? 'checked' : ''}><span class="h-5 w-9 rounded-full bg-[var(--gry)] transition peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--c2)]"></span><span class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4"></span></label>`;
  function fld(x) {
    if (x.t === 'logo') return '';
    const v = D[x.k], id = 'f_' + x.k;
    if (x.t === 'toggle') return `<div class="flex items-start justify-between gap-3 rounded-xl border border-line p-3 sm:col-span-2"><div class="min-w-0"><label for="${id}" class="block cursor-pointer text-[13px] font-medium">${esc(x.l)}</label>${x.hint ? `<p class="mt-0.5 text-xs text-mute">${esc(x.hint)}</p>` : ''}</div>${toggle(x.k, v)}</div>`;
    let c;
    if (x.t === 'select') c = `<select id="${id}" data-k="${x.k}" class="${INP}">${x.opts.map((o) => { const [val, lab] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(val)}" ${String(val) === String(v) ? 'selected' : ''}>${esc(lab)}</option>`; }).join('')}</select>`;
    else if (x.t === 'textarea') c = `<textarea id="${id}" data-k="${x.k}" rows="3" class="${INP} h-auto py-2">${esc(v)}</textarea>`;
    else if (x.t === 'color') c = `<div class="flex gap-2"><input type="color" data-k="${x.k}" data-sync value="${esc(v)}" aria-label="Pick colour" class="h-9 w-12 shrink-0 rounded-lg border border-line bg-card p-1"><input id="${id}" data-k="${x.k}" value="${esc(v)}" maxlength="7" class="${INP}"></div>`;
    else c = `<input id="${id}" data-k="${x.k}" type="${x.t}" value="${esc(v)}" ${x.dis ? 'disabled' : ''} ${x.t === 'number' ? 'min="0" inputmode="numeric"' : ''} class="${INP}">`;
    return `<div class="min-w-0 ${x.full ? 'sm:col-span-2' : ''}"><label for="${id}" class="mb-1 block text-xs font-medium">${esc(x.l)}${x.req ? ' <span style="color:var(--red)">*</span>' : ''}</label>${c}${x.hint ? `<p class="mt-1 text-xs text-mute">${esc(x.hint)}</p>` : ''}<p data-err="${x.k}" class="mt-1 hidden text-xs" style="color:var(--red)"></p></div>`;
  }

  const chipS = (t, k) => `<span class="inline-flex items-center whitespace-nowrap rounded-full px-2 text-[11px] font-semibold leading-5" style="background:${k}">${esc(t)}</span>`;
  const OK = 'var(--grnbg);color:var(--grn)', WARN = 'var(--ambbg);color:var(--amb)', BAD = 'var(--redbg);color:var(--red)', GRY = 'var(--hover);color:var(--mute)';

  const PRE = {
    profile: () => `<div class="flex flex-wrap items-center gap-3 rounded-xl border border-line p-3">
      <div class="grid h-16 w-28 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-white p-1"><img id="logoimg" src="${esc(D.logo || '/assets/logo.png')}" alt="Agency logo" class="max-h-full max-w-full object-contain"></div>
      <div class="min-w-0 flex-1"><b class="block text-[13px]">Agency logo</b><p class="text-xs text-mute">PNG, JPG, SVG or WebP, up to 2 MB. Shown in the sidebar, invoices and reports.</p></div>
      <div class="flex gap-2"><input type="file" id="logoFile" class="hidden" accept="image/png,image/jpeg,image/svg+xml,image/webp"><button class="btn-o" data-act="logo">${ic('upload', 'h-3.5 w-3.5')}Upload</button>${D.logo ? `<button class="btn-o" data-act="logo-reset">Use default</button>` : ''}</div></div>`,
    branding: () => `<div class="flex flex-wrap items-center gap-3 rounded-xl border border-line p-3"><div id="pvb" class="flex h-14 min-w-[190px] items-center gap-2 rounded-xl px-3 text-white"><img id="pvl" alt="" class="h-8 w-8 rounded bg-white object-contain p-0.5"><div class="min-w-0"><b id="pvn" class="block truncate text-[13px]"></b><span id="pvt" class="block truncate text-[11px] opacity-80"></span></div></div><p class="min-w-0 flex-1 text-xs text-mute">Preview of the client portal header. The logo comes from Agency profile.</p></div>`,
    notifications: () => `<div class="overflow-x-auto rounded-xl border border-line"><table class="w-full min-w-[520px] text-[13px]"><thead><tr class="text-left text-xs text-mute"><th class="py-2 pl-3 pr-2 font-medium">Alert</th>${CH.map(([, l]) => `<th class="px-2 text-center font-medium">${l}</th>`).join('')}</tr></thead><tbody>${EV.map(([e, l]) => `<tr class="border-t border-line"><td class="py-2 pl-3 pr-2">${l}</td>${CH.map(([c]) => `<td class="px-2 text-center"><input type="checkbox" data-ev="${e}" data-ch="${c}" aria-label="${esc(l)} by ${c}" ${D.notif[e][c] ? 'checked' : ''} ${c === 'wa' ? 'disabled title="Needs WhatsApp Business (Phase 5)"' : ''}></td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="text-xs text-mute">WhatsApp alerts need the WhatsApp Business connection (Phase 5). Connect it under Integrations first.</p>`,
  };

  const POST = {
    branding: () => `<div class="rounded-xl border border-line p-3"><div class="flex flex-wrap items-center justify-between gap-2"><div class="flex items-center gap-2"><b class="text-[13px]">Domain status</b>${chipS(DOM.status, DOM.status === 'Verified' ? OK : DOM.status === 'Checking…' ? WARN : GRY)}</div><button class="btn-o" data-act="domain" ${D.domain ? '' : 'disabled'}>${ic('globe', 'h-3.5 w-3.5')}Check domain</button></div><p class="mt-2 text-xs text-mute">After you save, add a CNAME record for this domain at your domain provider. Ask your developer for the exact value. A secure certificate (SSL) is issued once the record is found.</p></div>`,
    invoicing: () => `<div class="grid gap-3 sm:grid-cols-2"><div class="rounded-xl border border-line p-3"><div class="ttl">Next invoice will be numbered</div><div id="pvInv" class="mt-0.5 text-lg font-bold"></div></div><div class="rounded-xl border border-line p-3"><div class="ttl">GST example on ₹10,000</div><div id="pvGst" class="mt-0.5 text-[13px] font-medium"></div></div></div>`,
    security: () => `<div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3" style="border-color:var(--red)"><div class="min-w-0"><b class="block text-[13px]">Sign out all users</b><p class="text-xs text-mute">Ends every active session, including yours on other devices. Everyone must sign in again.</p></div><button class="btn-o" data-act="signout" style="border-color:var(--red);color:var(--red)">${ic('log-out', 'h-3.5 w-3.5')}Sign out everyone</button></div>`,
    data: () => `
      <div class="grid gap-4 lg:grid-cols-2">
        <div class="min-w-0 rounded-xl border border-line"><div class="flex flex-wrap items-center justify-between gap-2 border-b border-line p-3"><div><b class="text-[13px]">Backup history</b><p class="text-xs text-mute">Database and files. Runs every day and cannot be turned off.</p></div><button class="btn-o" data-act="backup">${ic('hard-drive-download', 'h-3.5 w-3.5')}Back up now</button></div>
          <div class="overflow-x-auto"><table class="w-full min-w-[320px] text-[13px]"><tbody id="bk">${bkRows()}</tbody></table></div></div>
        <div class="min-w-0 rounded-xl border border-line"><div class="border-b border-line p-3"><b class="text-[13px]">Export client records</b><p class="text-xs text-mute">A download link is sent to the owner's email. Every export is written to the audit log.</p></div>
          <div class="space-y-3 p-3"><div class="grid gap-3 sm:grid-cols-2"><div><label for="xc" class="mb-1 block text-xs font-medium">Client</label><select id="xc" class="${INP}">${(A.clients || []).length ? A.clients.map((c) => `<option>${esc(c)}</option>`).join('') : '<option>Sharma Garments</option>'}</select></div><div><label for="xf" class="mb-1 block text-xs font-medium">Format</label><select id="xf" class="${INP}"><option>CSV</option><option>Excel (.xlsx)</option><option>JSON</option></select></div></div>
            <div class="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px]">${['Profile', 'Products & prices', 'Campaigns', 'Leads', 'Invoices'].map((p) => `<label class="flex items-center gap-1.5"><input type="checkbox" name="xp" value="${p}" ${p === 'Profile' || p === 'Products & prices' ? 'checked' : ''}>${p}</label>`).join('')}</div>
            <button class="btn-p" data-act="export">${ic('download', 'h-3.5 w-3.5')}Request export</button></div>
          <div class="border-t border-line"><div class="px-3 pt-2 text-xs font-semibold text-mute">Recent requests</div><div id="xr" class="p-3 pt-1">${xrRows()}</div></div></div>
      </div>`,
  };
  const bkRows = () => BK.slice(0, 8).map((b) => `<tr class="border-t border-line first:border-t-0"><td class="py-2 pl-3 pr-2">${esc(b.d)}</td><td class="px-2 text-xs text-mute">${esc(b.size)}</td><td class="py-2 pl-2 pr-3 text-right">${chipS(b.st, b.st === 'Success' ? OK : b.st === 'Running' ? WARN : b.st === 'Retried' ? WARN : BAD)}</td></tr>`).join('');
  const xrRows = () => XR.length ? XR.slice(0, 5).map((x) => `<div class="flex items-start justify-between gap-2 py-1.5 text-[13px]"><div class="min-w-0"><b class="block truncate">${esc(x.client)}</b><span class="block truncate text-xs text-mute">${esc(x.parts)} · ${esc(x.fmt)} · ${esc(x.when)}</span></div>${chipS(x.st, x.st === 'Ready' ? OK : WARN)}</div>`).join('') : '<p class="text-xs text-mute">No exports yet.</p>';

  function view() {
    const T = TABS.find((t) => t[0] === st.tab);
    $('#view').innerHTML = `<div class="space-y-4 p-4"><div><h2 class="text-base font-semibold">${T[1]}</h2><p class="text-xs text-mute">${T[2]}</p></div>${PRE[st.tab] ? PRE[st.tab]() : ''}<div class="grid gap-3 sm:grid-cols-2">${F.filter((x) => x.s === st.tab).map(fld).join('')}</div>${POST[st.tab] ? POST[st.tab]() : ''}</div>`;
    Object.entries(st.errs).forEach(([k, m]) => setErr(k, m));
  }
  function tabs() {
    const n = (key) => changed().filter((k) => secOf(k) === key).length;
    $('#tabs').innerHTML = TABS.map(([k, l]) => `<button role="tab" aria-selected="${st.tab === k}" data-act="tab" data-tab="${k}" class="-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 pb-2 text-xs font-medium ${st.tab === k ? 'border-brand text-ink' : 'border-transparent text-mute hover:text-ink'}">${l}${n(k) ? ' <span class="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-brand align-middle"></span>' : ''}</button>`).join('');
  }
  function previews() {
    const pb = $('#pvb'); if (pb) { pb.style.background = /^#[0-9a-f]{6}$/i.test(D.color) ? D.color : S.color; $('#pvn').textContent = D.swName || 'Software name'; $('#pvt').textContent = D.tagline || ''; $('#pvl').src = D.logo || '/assets/logo.png'; }
    const pi = $('#pvInv'); if (pi) { pi.textContent = (D.prefix || '') + String(D.next || '').padStart(4, '0'); const r = +D.gstRate || 0, g = 10000 * r / 100; $('#pvGst').textContent = r ? `₹10,000 + ${r}% GST (₹${g.toLocaleString('en-IN')}) = ₹${(10000 + g).toLocaleString('en-IN')}` : '₹10,000, no GST'; }
  }
  function dirty() {
    const n = changed().length, el = $('#dirty');
    el.classList.toggle('hidden', !n); el.classList.toggle('flex', !!n);
    el.innerHTML = n ? `<span class="flex items-center gap-2 text-[13px]">${ic('pencil', 'h-4 w-4 text-mute')}${n} unsaved change${n === 1 ? '' : 's'}</span><div class="flex gap-2"><button class="btn-o" data-act="discard">Discard</button><button class="btn-p" data-act="save">${ic('check', 'h-3.5 w-3.5')}Save changes</button></div>` : '';
    tabs(); A.icons();
  }
  function hist() {
    $('#hist').innerHTML = HIST.length ? `<div class="divide-y divide-line">${HIST.slice(0, 6).map((h) => `<div class="flex flex-wrap items-start justify-between gap-2 px-3 py-2 text-[13px]"><span class="min-w-0"><b>${esc(h.sec)}</b> <span class="text-mute">· ${esc(h.text)} · by ${esc(h.who)}</span></span><span class="shrink-0 text-xs text-mute">${esc(h.when)}</span></div>`).join('')}</div>` : '<p class="px-3 py-6 text-center text-xs text-mute">No changes yet.</p>';
  }
  const render = () => { view(); tabs(); previews(); dirty(); hist(); A.icons(); };

  /* ---------- Saving ---------- */
  function save() {
    const errs = {};
    F.forEach((x) => { const m = check(x, D[x.k]); if (m) errs[x.k] = m; });
    st.errs = errs;
    const first = Object.keys(errs)[0];
    if (first) { st.tab = FD[first].s; render(); A.toast('Fix the highlighted fields first'); const i = document.getElementById('f_' + first); if (i) i.focus(); return; }
    const keys = changed(), a = flat(S), b = flat(D), bySec = {};
    keys.forEach((k) => (bySec[secOf(k)] = bySec[secOf(k)] || []).push(k));
    Object.entries(bySec).forEach(([sec, ks]) => {
      const T = TABS.find((t) => t[0] === sec), before = {}, after = {};
      ks.forEach((k) => { before[labOf(k)] = showV(k, a[k]); after[labOf(k)] = showV(k, b[k]); });
      const labels = ks.map(labOf); HIST.unshift({ who: ME, sec: T[1], text: labels.slice(0, 3).join(', ') + (labels.length > 3 ? ` +${labels.length - 3} more` : ''), when: 'Just now' });
      if (A.audit) A.audit.record({ user: ME, cat: sec === 'invoicing' ? 'Billing' : sec === 'security' ? 'Security' : 'Settings', action: `${T[1]} updated`, entity: 'Settings', before, after, flag: sec === 'security' || sec === 'invoicing' ? 1 : 0 });
      document.dispatchEvent(new CustomEvent('settings:saved', { detail: { section: sec, before, after } })); /* hook for the API call */
    });
    Object.assign(S, clone(D)); st.errs = {};
    A.toast(`Saved ${keys.length} change${keys.length === 1 ? '' : 's'}`); render();
  }

  /* ---------- Events ---------- */
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-act]'); if (!b || b.disabled) return;
    const a = b.dataset.act;
    if (a === 'tab') { st.tab = b.dataset.tab; render(); }
    else if (a === 'save') save();
    else if (a === 'discard') { D = clone(S); st.errs = {}; render(); A.toast('Changes discarded'); }
    else if (a === 'logo') $('#logoFile').click();
    else if (a === 'logo-reset') { D.logo = ''; render(); }
    else if (a === 'domain') {
      if (changed().includes('domain')) { A.toast('Save the new domain first'); return; }
      DOM.status = 'Checking…'; render(); setTimeout(() => { DOM.status = 'Not verified'; if (st.tab === 'branding') render(); A.toast('CNAME record not found yet. DNS changes can take a few hours (demo)'); }, 1400);
    }
    else if (a === 'signout') {
      if (!confirm('Sign out every user, including you? Everyone must sign in again.')) return;
      HIST.unshift({ who: ME, sec: 'Security', text: 'Signed out all users', when: 'Just now' });
      if (A.audit) A.audit.record({ user: ME, cat: 'Security', action: 'All users signed out', entity: 'All sessions', flag: 1 });
      A.toast('All sessions ended (demo)'); hist();
    }
    else if (a === 'backup') {
      const row = { d: 'Today, ' + new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }), size: '—', st: 'Running' }; BK.unshift(row);
      if (A.audit) A.audit.record({ user: ME, cat: 'Data export', action: 'Manual backup started', entity: 'Database and files' });
      $('#bk').innerHTML = bkRows(); A.toast('Backup started');
      setTimeout(() => { row.st = 'Success'; row.size = '1.93 GB'; const el = $('#bk'); if (el) el.innerHTML = bkRows(); }, 1800);
    }
    else if (a === 'export') {
      const parts = [...document.querySelectorAll('input[name=xp]:checked')].map((c) => c.value);
      if (!parts.length) { A.toast('Choose at least one thing to export'); return; }
      const client = $('#xc').value, fmt = $('#xf').value, row = { client, parts: parts.join(', '), fmt, who: ME, when: 'Just now', st: 'Preparing' }; XR.unshift(row);
      if (A.audit) A.audit.record({ user: ME, client, cat: 'Data export', action: 'Client records exported', entity: client, note: `${fmt}: ${row.parts}.`, flag: 1 });
      $('#xr').innerHTML = xrRows(); A.toast('Export requested. A link will be emailed to you');
      setTimeout(() => { row.st = 'Ready'; const el = $('#xr'); if (el) el.innerHTML = xrRows(); }, 1800);
    }
  });

  document.addEventListener('input', (ev) => {
    const t = ev.target, k = t.dataset && t.dataset.k; if (!k) return;
    const x = FD[k];
    if (t.type === 'checkbox') D[k] = t.checked;
    else {
      let v = t.value; if (x.up) { v = v.toUpperCase(); if (v !== t.value) t.value = v; }
      D[k] = v;
      if (x.t === 'color') { const sib = t.closest('div').querySelectorAll('[data-k]'); sib.forEach((s) => { if (s !== t && (s.type === 'color' ? /^#[0-9a-f]{6}$/i.test(v) : true)) s.value = v; }); }
    }
    if (st.errs[k]) { delete st.errs[k]; setErr(k, ''); }
    previews(); dirty();
  });
  document.addEventListener('focusout', (ev) => { const k = ev.target.dataset && ev.target.dataset.k; if (k && FD[k] && ev.target.type !== 'checkbox') { const m = check(FD[k], D[k]); if (m) st.errs[k] = m; else delete st.errs[k]; setErr(k, m); } });
  document.addEventListener('change', (ev) => {
    const t = ev.target;
    if (t.dataset && t.dataset.ev) { D.notif[t.dataset.ev][t.dataset.ch] = t.checked; dirty(); }
    else if (t.id === 'logoFile') {
      const file = t.files[0]; if (!file) return;
      if (!/^image\/(png|jpe?g|svg\+xml|webp)$/.test(file.type)) { A.toast('Use a PNG, JPG, SVG or WebP image'); t.value = ''; return; }
      if (file.size > 2 * 1024 * 1024) { A.toast('Logo must be under 2 MB'); t.value = ''; return; }
      const r = new FileReader(); r.onload = () => { D.logo = r.result; render(); }; r.readAsDataURL(file);
    }
  });
  addEventListener('beforeunload', (e) => { if (changed().length) { e.preventDefault(); e.returnValue = ''; } });

  render();
})();