/* Shared core: toast + overlay forms. Load this first on every page. */
(function () {
  const A = (window.AdDesk = {});
  A.icons = () => window.lucide && lucide.createIcons();

  /* Toast */
  const tEl = document.createElement('div');
  tEl.className = 'fixed bottom-5 left-1/2 z-[60] max-w-[90vw] -translate-x-1/2 translate-y-4 rounded-lg bg-ink px-4 py-2 text-center font-medium text-bg opacity-0 pointer-events-none transition-all';
  tEl.setAttribute('role', 'status');
  document.body.appendChild(tEl);
  let tt;
  A.toast = (m) => {
    tEl.textContent = m;
    tEl.classList.remove('opacity-0', 'translate-y-4');
    clearTimeout(tt);
    tt = setTimeout(() => tEl.classList.add('opacity-0', 'translate-y-4'), 2200);
  };

  /* Form definitions: [name, label, type, options, required, fullWidth] */
  /* Client names used by every client dropdown. Pages can replace A.clients with live data. */
  A.clients = ['Sharma Garments', 'Urban Brew Café', 'Kapoor Jewellers', 'FitZone Gym', 'Glow Salon'];
  A.people = { manager: ['Riya Shah', 'Kabir Jain', 'Neha Rao'], ads: ['Rohan Gupta', 'Sneha Iyer'], designer: ['Priya Menon', 'Arjun Das'] };
  const P = A.people;
  const FORMS = {
    client: { t: 'New client', ok: 'Create client', f: [['name', 'Business name', 'text', 0, 1, 1], ['contact', 'Contact person', 'text'], ['phone', 'Phone', 'tel'], ['email', 'Email', 'email', 0, 1], ['plan', 'Service package', 'select', ['Starter', 'Growth', 'Premium']], ['manager', 'Assign manager', 'select', P.manager], ['website', 'Website', 'url', 0, 0, 1]] },
    campaign: { t: 'New campaign', ok: 'Save draft', f: [['client', 'Client', 'select', '$c', 1], ['name', 'Campaign name', 'text', 0, 1], ['platform', 'Platform', 'select', ['Meta', 'Google Ads', 'Meta + Google']], ['objective', 'Objective', 'select', ['Leads', 'Traffic', 'Sales', 'Awareness']], ['budget', 'Budget (₹)', 'number', 0, 1], ['start', 'Start date', 'date'], ['end', 'End date', 'date'], ['brief', 'Brief', 'textarea', 0, 0, 1]] },
    creative: { t: 'Upload creative', ok: 'Submit for approval', f: [['client', 'Client', 'select', '$c', 1], ['title', 'Creative title', 'text', 0, 1], ['file', 'Image or video', 'file', 0, 1, 1], ['caption', 'Caption', 'textarea', 0, 0, 1], ['link', 'Destination link', 'url', 0, 0, 1]] },
    clientEdit: { t: 'Edit client', ok: 'Save changes', f: [['name', 'Business name', 'text', 0, 1, 1], ['contact', 'Contact person', 'text'], ['phone', 'Phone', 'tel'], ['email', 'Email', 'email', 0, 1], ['plan', 'Service package', 'select', ['Starter', 'Growth', 'Premium']], ['manager', 'Manager', 'select', P.manager], ['status', 'Status', 'select', ['Active', 'Inactive']], ['website', 'Website', 'text']] },
    invite: { t: 'Invite client', ok: 'Send invite', f: [['client', 'Client', 'select', '$c', 1], ['email', 'Invite email', 'email', 0, 1], ['role', 'Access', 'select', ['Client admin', 'Client viewer']], ['msg', 'Message', 'textarea', 0, 0, 1]] },
    team: { t: 'Assign team', ok: 'Save team', f: [['client', 'Client', 'select', '$c', 1], ['manager', 'Manager', 'select', P.manager], ['ads', 'Ads manager', 'select', P.ads], ['designer', 'Designer', 'select', P.designer]] },
    campaignEdit: { t: 'Edit campaign', ok: 'Save changes', f: [['name', 'Campaign name', 'text', 0, 1, 1], ['client', 'Client', 'select', '$c', 1], ['platform', 'Platform', 'select', ['Meta', 'Google Ads', 'Meta + Google']], ['objective', 'Objective', 'select', ['Leads', 'Traffic', 'Sales', 'Awareness']], ['budget', 'Budget (₹)', 'number', 0, 1], ['start', 'Start date', 'date'], ['end', 'End date', 'date'], ['brief', 'Brief', 'textarea', 0, 0, 1]] },
    pause: { t: 'Pause campaign', ok: 'Pause campaign', f: [['campaign', 'Campaign', 'text', 0, 0, 1, 1], ['reason', 'Reason', 'select', ['Budget reached', 'Client request', 'Creative outdated', 'Ad account issue', 'Other'], 1, 1], ['note', 'Note for the change log', 'textarea', 0, 0, 1]] },
    lead: { t: 'Add lead', ok: 'Add lead', f: [['name', 'Name', 'text', 0, 1], ['phone', 'Phone', 'tel', 0, 1], ['client', 'Client', 'select', '$c', 1], ['source', 'Source', 'select', ['Meta Lead Ad', 'Google Ads', 'Website', 'Manual']], ['note', 'Notes', 'textarea', 0, 0, 1]] },
    invoice: { t: 'Create invoice', ok: 'Create invoice', f: [['client', 'Client', 'select', '$c', 1], ['due', 'Due date', 'date', 0, 1], ['item', 'Description', 'text', 0, 1, 1], ['amount', 'Amount (₹)', 'number', 0, 1], ['tax', 'GST', 'select', ['18%', '12%', '5%', 'None']]] },
    remind: { t: 'Send reminder', ok: 'Send reminder', f: [['client', 'Client', 'select', '$c', 1], ['msg', 'Message', 'textarea', 0, 1, 1]] },
  };

  const inp = 'w-full min-w-0 rounded-lg border border-line bg-card px-3 text-sm text-ink outline-none focus:border-brand';
  const field = ([n, l, t, o, r, full, ro], v) => {
    const req = r ? 'required' : '';
    if (o === '$c') o = A.clients;
    let c;
    if (t === 'select') c = `<select name="${n}" ${req} class="${inp} h-9">${o.map((y) => `<option ${v[n] === y ? 'selected' : ''}>${y}</option>`).join('')}</select>`;
    else if (t === 'textarea') c = `<textarea name="${n}" rows="3" ${req} class="${inp} resize-none py-2">${v[n] || ''}</textarea>`;
    else c = `<input name="${n}" type="${t}" ${req} ${ro ? 'readonly' : ''} ${t !== 'file' && v[n] != null ? `value="${String(v[n]).replace(/"/g, '&quot;')}"` : ''} class="${inp} ${t === 'file' ? 'py-1.5' : 'h-9'}">`;
    return `<label class="block min-w-0 ${full ? 'sm:col-span-2' : ''}"><span class="mb-1 block text-xs font-medium text-mute">${l}${r ? ' *' : ''}</span>${c}</label>`;
  };

  let root = null;
  A.closeForm = () => { if (root) root.remove(); root = null; if (!document.getElementById('detail')) document.body.classList.remove('overflow-hidden'); };
  A.openForm = (key, vals = {}) => {
    const d = FORMS[key]; if (!d) return;
    A.closeForm();
    if (key === 'remind') vals = { msg: 'Your creative is waiting for approval. Please review it when you can.', ...vals };
    root = document.createElement('div');
    root.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6';
    root.innerHTML = `<form role="dialog" aria-modal="true" aria-label="${d.t}" class="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl sm:max-h-[90dvh]">
      <div class="flex items-center justify-between border-b border-line px-4 py-3"><h2 class="truncate text-base font-semibold">${d.t}</h2><button type="button" data-close aria-label="Close" class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-mute hover:bg-hov"><i data-lucide="x" class="h-4 w-4"></i></button></div>
      <div class="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-y-auto p-4 sm:grid-cols-2">${d.f.map((x) => field(x, vals)).join('')}</div>
      <div class="flex justify-end gap-2 border-t border-line px-4 py-3"><button type="button" data-close class="h-9 rounded-lg border border-line px-4 font-medium hover:bg-hov">Cancel</button><button class="h-9 rounded-lg bg-brand px-4 font-semibold text-white">${d.ok}</button></div></form>`;
    root.addEventListener('click', (e) => { if (e.target === root || e.target.closest('[data-close]')) A.closeForm(); });
    root.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      A.closeForm(); A.toast(d.t + ': saved (demo)');
      document.dispatchEvent(new CustomEvent('form:saved', { detail: { key, data, vals } }));
    });
    document.body.append(root);
    document.body.classList.add('overflow-hidden');
    A.icons();
    const first = root.querySelector('input,select,textarea'); if (first) first.focus();
  };

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root) { e.preventDefault(); A.closeForm(); } });
  document.addEventListener('click', (e) => {
    const f = e.target.closest('[data-form]');
    if (f) A.openForm(f.dataset.form, f.dataset.client ? { client: f.dataset.client } : {});
    const t = e.target.closest('[data-toast]');
    if (t) A.toast(t.dataset.toast);
  });
})();
