/* Integrations page only. Sample data: replace ACC / SVC / LOG with API data later. */
(function () {
  const A = window.AdDesk, $ = (s) => document.querySelector(s);
  const ic = (n, c = 'h-4 w-4') => `<i data-lucide="${n}" class="${c}"></i>`;
  const T0 = new Date('2026-11-26T00:00:00'), iso = (d) => d.toISOString().slice(0, 10);
  const fd = (i) => (i ? new Date(i + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
  const left = (i) => Math.round((new Date(i + 'T00:00:00') - T0) / 864e5);
  const plus = (n) => iso(new Date(T0.getTime() + n * 864e5));
  const inp = 'h-9 w-full rounded-lg border border-line bg-card px-2.5 text-ink outline-none';
  const PL = { Meta: 'facebook', 'Google Ads': 'search' };

  /* client, platform, account name, account id, connected, token expiry, last sync */
  let ACC = [
    ['Sharma Garments', 'Meta', 'Sharma Garments – FB & IG', 'act_4821937', 1, plus(48), 'Today, 6:00 am'],
    ['Sharma Garments', 'Google Ads', 'Sharma Garments Search', '482-193-7706', 1, plus(90), 'Today, 6:00 am'],
    ['Kapoor Jewellers', 'Meta', 'Kapoor Jewellers Official', 'act_7730412', 1, plus(5), 'Today, 6:00 am'],
    ['Kapoor Jewellers', 'Google Ads', 'Kapoor Gold Offers', '913-440-2281', 1, plus(61), 'Today, 6:00 am'],
    ['Urban Brew Café', 'Meta', 'Urban Brew Café', 'act_1190275', 1, plus(-3), '23 Nov, 6:00 am'],
    ['FitZone Gym', 'Meta', 'FitZone Gym Pune', 'act_5502876', 1, plus(33), 'Today, 6:00 am'],
    ['FitZone Gym', 'Google Ads', 'FitZone Memberships', '207-515-9942', 0, '', 'Never'],
    ['Glow Salon', 'Meta', 'Glow Salon & Spa', 'act_3068841', 1, plus(2), 'Today, 6:00 am'],
    ['Zenith Motors', 'Google Ads', 'Zenith Car Fest', '615-882-0034', 1, plus(75), 'Today, 6:00 am'],
    ['Nest Interiors', 'Meta', '', '', 0, '', 'Never'],
  ].map((r, i) => ({ id: i + 1, client: r[0], pf: r[1], name: r[2], acct: r[3], on: r[4], exp: r[5], sync: r[6] }));
  const st = (a) => (!a.on ? 'Not connected' : left(a.exp) < 0 ? 'Expired' : left(a.exp) <= 7 ? 'Expiring' : 'Connected');
  const BADGE = { Connected: 'var(--grnbg);color:var(--grn)', Expiring: 'var(--ambbg);color:var(--amb)', Expired: 'var(--redbg);color:var(--red)', 'Not connected': 'var(--hover);color:var(--mute)', 'Pending approval': 'var(--ambbg);color:var(--amb)' };
  const bdg = (s) => `<span class="inline-flex items-center whitespace-nowrap rounded-full px-2 text-[11px] font-semibold leading-5" style="background:${BADGE[s]}">${s}</span>`;

  /* key, name, category, icon, cost, required?, status, description */
  let SVC = [
    ['meta', 'Meta Marketing API & Lead Ads', 'Ads & leads', 'megaphone', 'Free', 1, 'Connected', 'Facebook and Instagram campaigns, metrics and lead webhooks. Needs app review.'],
    ['gads', 'Google Ads API', 'Ads & leads', 'search', 'Free', 1, 'Pending approval', 'Campaigns and performance data. Waiting for developer token approval.'],
    ['oauth', 'Meta & Google login (OAuth)', 'Ads & leads', 'key-round', 'Free', 1, 'Connected', 'Lets clients connect ad accounts without sharing passwords.'],
    ['email', 'Email service (SES / Brevo / Resend)', 'Messaging', 'mail', 'Free tier, then paid', 1, 'Connected', 'Approval, lead and invoice emails and scheduled reports.'],
    ['storage', 'File storage (S3 / Cloudflare R2)', 'Infrastructure', 'hard-drive', 'Pay as you use', 1, 'Connected', 'Images, videos, logos and generated PDFs.'],
    ['sentry', 'Sentry & UptimeRobot', 'Infrastructure', 'activity', 'Free tier', 1, 'Not connected', 'Error tracking and uptime alerts.'],
    ['wa', 'WhatsApp Business Platform', 'Messaging', 'message-circle', 'Per message', 0, 'Not connected', 'Approval and invoice alerts on WhatsApp. Templates need approval.'],
    ['sms', 'SMS gateway (MSG91 / Twilio)', 'Messaging', 'smartphone', 'Paid', 0, 'Not connected', 'SMS alerts. DLT registration needed in India.'],
    ['rzp', 'Razorpay', 'Payments & accounts', 'credit-card', 'Per transaction', 0, 'Not connected', 'Clients pay agency invoices online.'],
    ['acct', 'Zoho Books / Tally / ClearTax', 'Payments & accounts', 'calculator', 'Paid', 0, 'Not connected', 'GST e-invoicing and accounts sync.'],
    ['ga4', 'Google Analytics 4 & Looker Studio', 'Analytics', 'line-chart', 'Free', 0, 'Not connected', 'Website traffic beside ad results. Client must give access.'],
    ['shop', 'Shopify & WooCommerce', 'Commerce', 'shopping-bag', 'Free API', 0, 'Not connected', 'Sync products from client online stores.'],
    ['cat', 'Meta Commerce & Google Merchant Center', 'Commerce', 'package', 'Free', 0, 'Not connected', 'Product catalogue ads. Catalogue approval required.'],
    ['ai', 'AI API (Claude / OpenAI)', 'AI & media', 'sparkles', 'Pay per use', 0, 'Not connected', 'Caption and ad copy suggestions, always reviewed by a person.'],
    ['cdn', 'Cloudinary', 'AI & media', 'image', 'Free tier, then paid', 0, 'Not connected', 'Image and video resizing and delivery.'],
    ['li', 'LinkedIn Marketing API', 'Ads & leads', 'linkedin', 'Free API', 0, 'Not connected', 'LinkedIn ads for B2B clients. Needs LinkedIn approval.'],
  ].map((r) => ({ key: r[0], name: r[1], cat: r[2], icon: r[3], cost: r[4], req: r[5], status: r[6], desc: r[7] }));

  let LOG = [
    ['Today, 6:00 am', 'Meta', 'Performance sync completed for 7 accounts', 'ok'],
    ['Today, 6:00 am', 'Google Ads', 'Performance sync completed for 4 accounts', 'ok'],
    ['Today, 5:42 am', 'Meta Lead Ads', '3 new leads received from Glow Salon form', 'ok'],
    ['23 Nov, 6:00 am', 'Meta', 'Urban Brew Café: access token expired, sync stopped', 'err'],
    ['22 Nov, 4:15 pm', 'Google Ads', 'Developer token still waiting for Google approval', 'warn'],
    ['21 Nov, 11:20 am', 'Email service', 'Invoice reminder emails sent (12)', 'ok'],
  ].map((r) => ({ t: r[0], src: r[1], msg: r[2], lv: r[3] }));
  const log = (src, msg, lv = 'ok') => LOG.unshift({ t: 'Just now', src, msg, lv });

  let tab = 'acc', q = '', fs = '', fc = 'All';

  /* ---------- Overlay modal ---------- */
  const closeM = () => { const m = $('#imodal'); if (m) m.remove(); document.body.classList.remove('overflow-hidden'); };
  function modal(title, body, ok, onOk, danger) {
    closeM();
    const el = document.createElement('div');
    el.id = 'imodal'; el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6';
    el.innerHTML = `<form role="dialog" aria-modal="true" aria-label="${title}" class="flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl">
      <div class="flex items-center justify-between border-b border-line px-4 py-3"><h2 class="truncate text-base font-semibold">${title}</h2><button type="button" data-x aria-label="Close" class="grid h-8 w-8 place-items-center rounded-lg text-mute hover:bg-hov">${ic('x')}</button></div>
      <div class="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">${body}</div>
      <div class="flex justify-end gap-2 border-t border-line px-4 py-3"><button type="button" data-x class="h-9 rounded-lg border border-line px-4 font-medium hover:bg-hov">Cancel</button><button class="h-9 rounded-lg px-4 font-semibold text-white ${danger ? '' : 'bg-brand'}" ${danger ? 'style="background:var(--red)"' : ''}>${ok}</button></div></form>`;
    el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('[data-x]')) closeM(); });
    el.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); closeM(); onOk(d); });
    document.body.append(el); document.body.classList.add('overflow-hidden'); A.icons();
    const f = el.querySelector('input,select'); if (f) f.focus();
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeM(); });
  const lab = (l, c) => `<label class="block"><span class="mb-1 block text-xs font-medium text-mute">${l}</span>${c}</label>`;
  const opts = (a, v) => a.map((x) => `<option ${x === v ? 'selected' : ''}>${x}</option>`).join('');

  /* ---------- Actions ---------- */
  function connect(a) {
    const isNew = !a, pre = a || {};
    modal(pre.on ? 'Reconnect ad account' : 'Connect ad account',
      lab('Client', `<select name="client" class="${inp}" ${isNew ? '' : 'disabled'}>${opts(A.clients, pre.client)}</select>`) +
      lab('Platform', `<select name="pf" class="${inp}" ${isNew ? '' : 'disabled'}>${opts(['Meta', 'Google Ads'], pre.pf)}</select>`) +
      `<p class="rounded-lg bg-soft p-3 text-xs text-mute">${ic('shield-check', 'mr-1 inline h-3.5 w-3.5 text-brand')}You will be taken to the official Meta or Google sign-in page to give permission. No password is shared with the CRM and the access token is stored encrypted.</p>`,
      'Continue to sign-in', (d) => {
        let r = a || ACC.find((x) => x.client === d.client && x.pf === d.pf && !x.on);
        if (!r) { r = { id: ACC.length + 1, client: d.client, pf: d.pf }; ACC.push(r); }
        Object.assign(r, { on: 1, exp: plus(60), sync: 'Just now', name: r.name || r.client + ' – ' + r.pf, acct: r.acct || (r.pf === 'Meta' ? 'act_' : '') + String(1000000 + r.id * 7919).slice(0, 7) });
        log(r.pf, `${r.client}: account connected`); A.toast(`${r.pf} connected for ${r.client}`); draw();
      });
  }
  function disconnect(a) {
    modal('Disconnect account', `<p>Stop syncing <b>${a.name}</b> (${a.pf}) for ${a.client}? Live campaigns on the platform are not affected, but new performance data will stop coming in.</p>`, 'Disconnect', () => {
      Object.assign(a, { on: 0, exp: '', sync: 'Never' }); log(a.pf, `${a.client}: account disconnected`, 'warn'); A.toast('Account disconnected'); draw();
    }, 1);
  }
  function syncNow(a, btn) {
    if (btn) { btn.disabled = true; btn.querySelector('svg')?.classList.add('animate-spin'); }
    setTimeout(() => { a.sync = 'Just now'; log(a.pf, `${a.client}: performance data synced`); A.toast('Synced ' + a.client); draw(); }, 900);
  }
  function configure(s) {
    const on = s.status === 'Connected';
    modal((on ? 'Manage ' : 'Connect ') + s.name,
      `<p class="text-xs text-mute">${s.desc}</p>` +
      lab('API key / token', `<input name="key" type="password" autocomplete="off" placeholder="${on ? '••••••••••••••••' : 'Paste key here'}" ${on ? '' : 'required'} class="${inp}">`) +
      lab('Environment', `<select name="env" class="${inp}">${opts(['Production', 'Test / sandbox'])}</select>`) +
      `<p class="text-xs text-mute">Keys are kept on the server only and are never shown again after saving.</p>`,
      on ? 'Save changes' : 'Connect', () => { s.status = 'Connected'; log(s.name, 'Connection saved'); A.toast(s.name + ' connected'); draw(); });
  }

  /* ---------- Render ---------- */
  const kpi = (i, t, v, s, k) => `<div class="card" style="--k:${k}"><div class="flex items-center gap-3 p-3"><span class="ico h-10 w-10">${ic(i, 'h-5 w-5')}</span><div class="min-w-0"><div class="ttl">${t}</div><div class="truncate text-xl font-bold">${v}</div><div class="truncate text-[11px] text-mute">${s}</div></div></div></div>`;
  function head() {
    const on = ACC.filter((a) => a.on), bad = ACC.filter((a) => ['Expired', 'Expiring'].includes(st(a)));
    $('#kpis').innerHTML = kpi('plug-zap', 'Connected accounts', `${on.length}/${ACC.length}`, 'Meta and Google Ads', '#EF7F1B') +
      kpi('alert-triangle', 'Need attention', bad.length, 'Expiring or expired tokens', '#E0A100') +
      kpi('webhook', 'Leads via webhook', 27, 'Received today', '#2BB673') +
      kpi('refresh-cw', 'Last sync', 'Today, 6:00 am', 'Runs every 6 hours', '#3B82F6');
    $('#alert').innerHTML = bad.length ? `<div class="flex flex-wrap items-center gap-3 rounded-xl p-3" style="background:var(--redbg);color:var(--red)">${ic('alert-circle', 'h-5 w-5 shrink-0')}<div class="min-w-0 flex-1"><b>${bad.length} ad account${bad.length > 1 ? 's need' : ' needs'} to be reconnected.</b> <span class="opacity-90">Reports stop updating when a token expires: ${bad.map((a) => a.client + ' (' + a.pf + ')').join(', ')}.</span></div><button class="btn-d" data-act="fix">Reconnect now</button></div>` : '';
    const n = { acc: ACC.length, svc: SVC.length, log: LOG.length };
    $('#tabs').innerHTML = [['acc', 'Ad accounts', 'megaphone'], ['svc', 'Services', 'blocks'], ['log', 'Activity log', 'history']].map(([k, l, i]) => `<button role="tab" data-tab="${k}" aria-selected="${tab === k}" class="flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-semibold ${tab === k ? 'border-brand text-brand' : 'border-transparent text-mute hover:text-ink'}">${ic(i, 'h-3.5 w-3.5')}${l}<span class="rounded-full bg-hov px-1.5 text-[10px]">${n[k]}</span></button>`).join('');
  }
  function viewAcc() {
    const rows = ACC.filter((a) => (!fs || st(a) === fs) && (a.client + a.name + a.pf).toLowerCase().includes(q.toLowerCase()));
    return `<div class="flex flex-wrap items-center gap-2 border-b border-line p-3">
      <label class="flex h-8 min-w-[160px] flex-1 items-center gap-2 rounded-lg border border-line px-2.5 text-mute">${ic('search', 'h-3.5 w-3.5')}<input id="q" value="${q}" aria-label="Search accounts" placeholder="Search client, account or platform" class="w-full min-w-0 bg-transparent text-xs text-ink outline-none"></label>
      <select id="fs" class="sel" aria-label="Status"><option value="">All statuses</option>${opts(['Connected', 'Expiring', 'Expired', 'Not connected'], fs)}</select></div>
      <div class="overflow-x-auto"><table class="w-full min-w-[760px] text-left text-xs"><thead class="text-mute"><tr class="border-b border-line"><th class="px-3 py-2">Client</th><th class="px-3 py-2">Platform</th><th class="px-3 py-2">Account</th><th class="px-3 py-2">Status</th><th class="px-3 py-2">Token expires</th><th class="px-3 py-2">Last sync</th><th class="px-3 py-2 text-right">Actions</th></tr></thead><tbody>` +
      (rows.length ? rows.map((a) => { const s = st(a); return `<tr class="li border-b border-line"><td class="px-3 py-2.5 font-semibold">${a.client}</td><td class="px-3 py-2.5"><span class="inline-flex items-center gap-1.5">${ic(PL[a.pf], 'h-3.5 w-3.5 text-brand')}${a.pf}</span></td><td class="px-3 py-2.5"><div class="max-w-[200px] truncate">${a.name || '—'}</div><div class="text-[11px] text-mute">${a.acct || ''}</div></td><td class="px-3 py-2.5">${bdg(s)}</td><td class="whitespace-nowrap px-3 py-2.5">${a.on ? fd(a.exp) + (left(a.exp) <= 7 ? ` <span class="text-mute">(${left(a.exp) < 0 ? 'expired' : left(a.exp) + ' d left'})</span>` : '') : '—'}</td><td class="whitespace-nowrap px-3 py-2.5 text-mute">${a.sync}</td><td class="px-3 py-2.5"><div class="flex items-center justify-end gap-1.5">${!a.on ? `<button class="btn-p" data-a="conn" data-id="${a.id}">Connect</button>` : (s !== 'Connected' ? `<button class="btn-o" data-a="conn" data-id="${a.id}">Reconnect</button>` : '') + `<button class="ibtn" data-a="sync" data-id="${a.id}" title="Sync now" aria-label="Sync now">${ic('refresh-cw', 'h-3.5 w-3.5')}</button><button class="ibtn" data-a="disc" data-id="${a.id}" title="Disconnect" aria-label="Disconnect">${ic('unplug', 'h-3.5 w-3.5')}</button>`}</div></td></tr>`; }).join('') : `<tr><td colspan="7" class="p-8 text-center text-mute">No accounts match your filters.</td></tr>`) + `</tbody></table></div>`;
  }
  function viewSvc() {
    const cats = ['All', ...new Set(SVC.map((s) => s.cat))], list = SVC.filter((s) => fc === 'All' || s.cat === fc);
    return `<div class="flex gap-2 overflow-x-auto border-b border-line p-3">${cats.map((c) => `<button data-cat="${c}" class="shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${fc === c ? 'bg-brand text-white' : 'bg-hov text-mute hover:text-ink'}">${c}</button>`).join('')}</div>
      <div class="grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-3">${list.map((s) => `<div class="flex min-w-0 flex-col gap-2 rounded-xl border border-line p-3"><div class="flex items-start gap-3"><span class="ico h-10 w-10">${ic(s.icon, 'h-5 w-5')}</span><div class="min-w-0 flex-1"><div class="font-semibold leading-snug">${s.name}</div><div class="text-[11px] text-mute">${s.cat} · ${s.cost}</div></div></div><p class="flex-1 text-xs text-mute">${s.desc}</p><div class="flex items-center justify-between gap-2">${bdg(s.status)}<span class="text-[11px] text-mute">${s.req ? 'Required' : 'Optional'}</span><button class="${s.status === 'Connected' ? 'btn-o' : 'btn-p'}" data-a="cfg" data-k="${s.key}">${s.status === 'Connected' ? 'Manage' : 'Connect'}</button></div></div>`).join('')}</div>`;
  }
  function viewLog() {
    const C = { ok: ['check-circle-2', 'var(--grn)'], warn: ['alert-triangle', 'var(--amb)'], err: ['x-circle', 'var(--red)'] };
    return `<ul>${LOG.map((l) => `<li class="li flex items-start gap-3 border-b border-line px-3 py-2.5"><span style="color:${C[l.lv][1]}">${ic(C[l.lv][0], 'mt-0.5 h-4 w-4')}</span><div class="min-w-0 flex-1"><div>${l.msg}</div><div class="text-[11px] text-mute">${l.src}</div></div><span class="shrink-0 text-[11px] text-mute">${l.t}</span></li>`).join('')}</ul>`;
  }
  function draw() {
    head(); $('#view').innerHTML = tab === 'acc' ? viewAcc() : tab === 'svc' ? viewSvc() : viewLog(); A.icons();
    const s = $('#q'); if (s) { s.oninput = () => { q = s.value; const p = s.selectionStart; draw(); const n = $('#q'); n.focus(); n.setSelectionRange(p, p); }; }
    const f = $('#fs'); if (f) f.onchange = () => { fs = f.value; draw(); };
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-tab],[data-cat],[data-a],[data-act]'); if (!t) return;
    const d = t.dataset, acc = ACC.find((x) => x.id == d.id);
    if (d.tab) { tab = d.tab; draw(); }
    else if (d.cat) { fc = d.cat; draw(); }
    else if (d.a === 'conn') connect(acc);
    else if (d.a === 'disc') disconnect(acc);
    else if (d.a === 'sync') syncNow(acc, t);
    else if (d.a === 'cfg') configure(SVC.find((x) => x.key === d.k));
    else if (d.act === 'connect') connect();
    else if (d.act === 'fix') { tab = 'acc'; fs = ''; q = ''; const b = ACC.find((x) => ['Expired', 'Expiring'].includes(st(x))); draw(); if (b) connect(b); }
    else if (d.act === 'syncall') { const on = ACC.filter((x) => x.on); on.forEach((x) => (x.sync = 'Just now')); log('All', `Manual sync started for ${on.length} accounts`); A.toast(`Syncing ${on.length} accounts…`); draw(); }
  });
  draw();
})();