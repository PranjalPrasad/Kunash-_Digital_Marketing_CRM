/* Media library page only. Sample data: replace `M` with API data later. */
(function () {
  const A = window.AdDesk, $ = (s) => document.querySelector(s);
  const ic = (n, c = 'h-4 w-4') => `<i data-lucide="${n}" class="${c}"></i>`;
  const PAGE = 12, QUOTA = 10e9, MB = 1e6;
  const fmtSize = (b) => (b >= 1e9 ? (b / 1e9).toFixed(2) + ' GB' : b >= 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB');
  const TYPE = { Image: 'image', Video: 'circle-play', Document: 'file-text' };
  const typeOf = (name, mime = '') => { const e = name.split('.').pop().toLowerCase(); return mime.startsWith('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(e) ? 'Image' : mime.startsWith('video') || ['mp4', 'mov', 'webm'].includes(e) ? 'Video' : 'Document'; };
  const metaOf = (t) => (t === 'Image' ? 'Image file' : t === 'Video' ? 'Video file' : 'Document');

  let F = ['Sharma Garments', 'Urban Brew Café', 'Kapoor Jewellers', 'FitZone Gym', 'Glow Salon', 'Nest Interiors', 'Zenith Motors', 'Agency templates'];
  A.folders = F;

  /* id, name, folder, type, size (MB), meta, tags, date, used in creatives */
  const mk = (id, name, folder, type, size, meta, tags, when, used = []) => ({ id, name, folder, type, size: size * MB, meta, tags, when, used, by: id % 2 ? 'Priya Menon' : 'Arjun Das' });
  let M = [
    mk(1, 'logo-sharma.png', 'Sharma Garments', 'Image', 1.2, '2400 x 2400 px', ['logo', 'brand'], '12 Mar 2025', ['Diwali carousel']),
    mk(2, 'diwali-model-shoot-01.jpg', 'Sharma Garments', 'Image', 3.8, '4000 x 2667 px', ['diwali', 'model'], '9 Nov', ['Diwali carousel']),
    mk(3, 'diwali-festive-reel.mp4', 'Sharma Garments', 'Video', 86, '0:30, 1080p', ['diwali', 'reel'], '10 Nov', ['Festive reel']),
    mk(4, 'brand-guidelines.pdf', 'Sharma Garments', 'Document', 4.2, '18 pages', ['brand', 'guidelines'], '12 Mar 2025'),
    mk(5, 'cold-coffee-hero.jpg', 'Urban Brew Café', 'Image', 2.6, '3000 x 2000 px', ['coffee', 'hero'], '2 Nov', ['Offer banner']),
    mk(6, 'menu-2026.pdf', 'Urban Brew Café', 'Document', 1.9, '4 pages', ['menu', 'price'], '1 Nov'),
    mk(7, 'gold-coin-closeup.jpg', 'Kapoor Jewellers', 'Image', 5.1, '4500 x 3000 px', ['gold', 'coin'], '24 Oct'),
    mk(8, 'dhanteras-reel.mp4', 'Kapoor Jewellers', 'Video', 112, '0:25, 1080p', ['dhanteras', 'reel'], '25 Oct'),
    mk(9, 'gym-floor-wide.jpg', 'FitZone Gym', 'Image', 4.4, '5000 x 3333 px', ['gym', 'branch'], '4 Nov', ['Membership reel']),
    mk(10, 'trainer-intro.mp4', 'FitZone Gym', 'Video', 64, '0:20, 1080p', ['trainer'], '5 Nov', ['Membership reel']),
    mk(11, 'bridal-makeup-look-3.jpg', 'Glow Salon', 'Image', 3.3, '3600 x 2400 px', ['bridal', 'makeup'], '1 Nov', ['Bridal reel']),
    mk(12, 'sofa-hero.jpg', 'Nest Interiors', 'Image', 3.9, '4200 x 2800 px', ['sofa', 'hero'], '16 Nov', ['Sofa offer banner']),
    mk(13, 'living-room-lookbook.pdf', 'Nest Interiors', 'Document', 8.6, '24 pages', ['lookbook'], '15 Nov', ['Winter lookbook']),
    mk(14, 'showroom-walkthrough.mp4', 'Zenith Motors', 'Video', 148, '1:10, 1080p', ['showroom'], '17 Nov', ['Showroom video']),
    mk(15, 'car-lineup.jpg', 'Zenith Motors', 'Image', 6.2, '5200 x 3467 px', ['cars', 'lineup'], '17 Nov'),
    mk(16, 'festival-post-template.psd', 'Agency templates', 'Document', 38, 'PSD, 3 layers', ['template', 'festival'], '3 Jan 2026'),
    mk(17, 'agency-logo-pack.zip', 'Agency templates', 'Document', 12.4, 'ZIP, 8 files', ['logo', 'agency'], '3 Jan 2026'),
  ];
  const find = (id) => M.find((m) => m.id === +id);
  const TABS = ['All', 'Image', 'Video', 'Document'], TL = { All: 'All', Image: 'Images', Video: 'Videos', Document: 'Documents' };
  const sel = new Set();
  const st = { folder: '', tab: 'All', q: '', so: 'new', page: 1, view: 'grid', narrow: false };
  const hue = (f) => (f.length * 37 + f.charCodeAt(0) * 11) % 360;
  const ext = (n) => n.split('.').pop().toUpperCase();

  const base = () => { const q = st.q.trim().toLowerCase(); return M.filter((m) => (!st.folder || m.folder === st.folder) && (!q || [m.name, m.folder, ...m.tags].some((x) => x.toLowerCase().includes(q)))); };
  function filtered() {
    const by = { new: (a, b) => b.id - a.id, name: (a, b) => a.name.localeCompare(b.name), size: (a, b) => b.size - a.size };
    return base().filter((m) => st.tab === 'All' || m.type === st.tab).sort(by[st.so]);
  }
  const thumb = (m, cls = 'aspect-[4/3]', badge = true) => `<div class="relative grid ${cls} place-items-center overflow-hidden" style="background:linear-gradient(135deg,hsl(${hue(m.folder)} 85% 55% / .28),hsl(${hue(m.folder)} 85% 55% / .08))"><span class="text-mute">${ic(TYPE[m.type], 'h-8 w-8')}</span>${badge ? `<span class="absolute bottom-2 left-2 rounded-md bg-card px-1.5 py-0.5 text-[11px] text-mute">${ext(m.name)}${m.type === 'Video' ? ' · ' + m.meta.split(',')[0] : ''}</span>` : ''}</div>`;
  const tagChips = (m, n = 2) => m.tags.slice(0, n).map((t) => `<span class="max-w-[90px] truncate rounded bg-bg px-1.5 text-[11px] text-mute">${t}</span>`).join('');
  const ib = (act, id, icon, label) => `<button class="ibtn" data-act="${act}" data-id="${id}" aria-label="${label}" title="${label}">${ic(icon, 'h-3.5 w-3.5')}</button>`;
  const cb = (m) => `<input type="checkbox" data-sel="${m.id}" ${sel.has(m.id) ? 'checked' : ''} aria-label="Select ${m.name}" class="h-3.5 w-3.5 accent-[var(--or)]">`;

  function summary() {
    const used = M.reduce((t, m) => t + m.size, 0), n = (t) => M.filter((m) => m.type === t).length;
    const K = [['folder-open', 'Total files', M.length], ['hard-drive', 'Storage used', fmtSize(used) + ' / 10 GB'], ['image', 'Images', n('Image')], ['circle-play', 'Videos', n('Video')], ['file-text', 'Documents', n('Document')]];
    $('#kpis').innerHTML = K.map(([i, l, v]) => `<div class="card flex min-w-0 items-center gap-2.5 p-3"><div class="ico">${ic(i)}</div><div class="min-w-0"><div class="ttl">${l}</div><div class="truncate text-lg font-bold leading-tight">${v}</div></div></div>`).join('');
    const fc = (f) => M.filter((m) => m.folder === f).length;
    $('#folders').innerHTML = [['', 'All files', M.length], ...F.map((f) => [f, f, fc(f)])].map(([v, l, n]) => { const on = st.folder === v; return `<button data-folder="${v}" class="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium ${on ? 'border-brand bg-soft text-brand' : 'border-line text-mute hover:bg-hov hover:text-ink'}">${ic(v ? 'folder' : 'folders', 'h-3.5 w-3.5')}<span class="max-w-[140px] truncate">${l}</span><span class="text-[11px] opacity-70">${n}</span></button>`; }).join('');
    const b = base();
    $('#tabs').innerHTML = TABS.map((t) => { const c = t === 'All' ? b.length : b.filter((m) => m.type === t).length, on = st.tab === t; return `<button role="tab" aria-selected="${on}" data-tab="${t}" class="-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 pb-2 text-xs font-medium ${on ? 'border-brand text-ink' : 'border-transparent text-mute hover:text-ink'}">${TL[t]} <span class="ml-0.5 text-[11px] text-mute">${c}</span></button>`; }).join('');
    $('#selbar').innerHTML = sel.size ? `<div class="flex flex-wrap items-center gap-2 border-b border-line bg-soft px-3 py-2"><b class="text-xs text-brand">${sel.size} selected</b><div class="ml-auto flex flex-wrap gap-2"><button class="btn-o bg-card" data-act="bmove">${ic('folder-input', 'h-3.5 w-3.5')}Move</button><button class="btn-d bg-card" data-act="bdelete">${ic('trash-2', 'h-3.5 w-3.5')}Delete</button><button class="btn-o bg-card" data-act="bclear">Clear</button></div></div>` : '';
  }

  function render() {
    summary();
    const rows = filtered(), pages = Math.max(1, Math.ceil(rows.length / PAGE));
    st.page = Math.min(st.page, pages);
    const sl = rows.slice((st.page - 1) * PAGE, st.page * PAGE), grid = st.narrow || st.view === 'grid';
    $('#vt').classList.toggle('hidden', st.narrow);
    document.querySelectorAll('#vt button').forEach((b) => { const on = b.dataset.v === (grid ? 'grid' : 'list'); b.classList.toggle('bg-card', on); b.classList.toggle('shadow-sm', on); b.classList.toggle('text-mute', !on); });
    if (!sl.length) {
      $('#list').innerHTML = `<div class="grid place-items-center gap-2 px-4 py-12 text-center"><div class="ico">${ic('search-x')}</div><b>No files found</b><span class="text-xs text-mute">Change the filters or upload new media.</span><div class="flex gap-2"><button class="btn-o" data-act="clear">Clear filters</button><button class="btn-p" data-act="upload">Upload media</button></div></div>`;
    } else if (grid) {
      $('#list').innerHTML = `<div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,190px),1fr))] gap-3 p-3">${sl.map((m) => `
        <div class="relative min-w-0 overflow-hidden rounded-xl border ${sel.has(m.id) ? 'border-brand' : 'border-line'}">
          <label class="absolute right-2 top-2 z-10 grid h-6 w-6 place-items-center rounded-md bg-card">${cb(m)}</label>
          <button data-act="view" data-id="${m.id}" class="block w-full text-left">${thumb(m)}
            <div class="p-2.5"><b class="block truncate text-[13px]">${m.name}</b><span class="block truncate text-xs text-mute">${m.folder} · ${fmtSize(m.size)}</span><div class="mt-1.5 flex min-h-[18px] gap-1 overflow-hidden">${tagChips(m)}</div></div></button>
        </div>`).join('')}</div>`;
    } else {
      const all = sl.every((m) => sel.has(m.id));
      $('#list').innerHTML = `<div class="overflow-x-auto"><table class="w-full min-w-[720px] text-[13px]"><thead><tr class="text-left text-xs text-mute"><th class="w-9 py-2 pl-3"><input type="checkbox" data-selall ${all ? 'checked' : ''} aria-label="Select all on this page" class="h-3.5 w-3.5 accent-[var(--or)]"></th><th class="px-2 font-medium">File</th><th class="px-2 font-medium">Folder</th><th class="px-2 font-medium">Type</th><th class="px-2 font-medium">Size</th><th class="px-2 font-medium">Uploaded</th><th class="py-2 pl-2 pr-3 text-right font-medium">Actions</th></tr></thead><tbody>${sl.map((m) => `
        <tr class="border-t border-line hover:bg-hov/50"><td class="py-2 pl-3">${cb(m)}</td>
          <td class="max-w-[260px] px-2"><div class="flex min-w-0 items-center gap-2.5"><div class="w-10 shrink-0 overflow-hidden rounded-md">${thumb(m, 'h-8', false)}</div><div class="min-w-0"><b class="block truncate">${m.name}</b><div class="flex gap-1 overflow-hidden">${tagChips(m)}</div></div></div></td>
          <td class="max-w-[150px] truncate px-2">${m.folder}</td><td class="px-2">${m.type}</td><td class="whitespace-nowrap px-2">${fmtSize(m.size)}</td><td class="whitespace-nowrap px-2 text-xs text-mute">${m.when}</td>
          <td class="py-2 pl-2 pr-3"><div class="flex justify-end gap-1.5">${ib('view', m.id, 'eye', 'View')}${ib('download', m.id, 'download', 'Download')}</div></td></tr>`).join('')}</tbody></table></div>`;
    }
    const from = rows.length ? (st.page - 1) * PAGE + 1 : 0;
    $('#pager').innerHTML = `<span>Showing ${from}–${Math.min(st.page * PAGE, rows.length)} of ${rows.length} files</span><div class="flex items-center gap-2"><button class="ibtn disabled:opacity-40" data-act="prev" aria-label="Previous page" ${st.page <= 1 ? 'disabled' : ''}>${ic('chevron-left', 'h-3.5 w-3.5')}</button><span>Page ${st.page} of ${pages}</span><button class="ibtn disabled:opacity-40" data-act="next" aria-label="Next page" ${st.page >= pages ? 'disabled' : ''}>${ic('chevron-right', 'h-3.5 w-3.5')}</button></div>`;
    A.icons();
  }

  /* File details: centered overlay */
  function closeDetail() { const d = $('#detail'); if (d) d.remove(); document.body.classList.remove('overflow-hidden'); }
  function detail(id) {
    const m = find(id); if (!m) return;
    closeDetail();
    const row = (l, v) => `<div class="grid grid-cols-[88px_minmax(0,1fr)] gap-2 py-1.5 text-[13px]"><span class="text-mute">${l}</span><span class="min-w-0 break-words font-medium">${v}</span></div>`;
    const B = (act, label, icon, cls) => `<button class="${cls}" data-act="${act}" data-id="${m.id}">${ic(icon, 'h-3.5 w-3.5')}${label}</button>`;
    const el = document.createElement('div');
    el.id = 'detail'; el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6';
    el.innerHTML = `<div role="dialog" aria-modal="true" aria-label="File details" class="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl sm:max-h-[90dvh]">
      <div class="flex shrink-0 items-center gap-2.5 border-b border-line p-4"><div class="min-w-0 flex-1"><h2 class="truncate text-base font-semibold">${m.name}</h2><span class="block truncate text-xs text-mute">${m.folder}</span></div><button data-close aria-label="Close" class="ibtn">${ic('x')}</button></div>
      <div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <div class="overflow-hidden rounded-xl">${thumb(m, 'h-40')}</div>
        <div class="divide-y divide-line">${row('Type', m.type)}${row('Size', fmtSize(m.size))}${row('Details', m.meta)}${row('Uploaded', `${m.by}, ${m.when}`)}${row('Used in', m.used.length ? m.used.join(', ') : 'Not used in any creative yet')}</div>
        <div><h3 class="mb-2 text-xs font-semibold text-mute">Tags</h3><div class="flex flex-wrap gap-1.5">${m.tags.length ? m.tags.map((t) => `<span class="rounded-md bg-bg px-2 py-0.5 text-xs">${t}</span>`).join('') : '<span class="text-[13px] text-mute">No tags</span>'}</div></div>
      </div>
      <div class="flex shrink-0 flex-wrap gap-2 border-t border-line p-3">${B('edit', 'Edit', 'pencil', 'btn-p')}${B('move', 'Move', 'folder-input', 'btn-o')}${B('copy', 'Copy link', 'link', 'btn-o')}${B('download', 'Download', 'download', 'btn-o')}${B('delete', 'Delete', 'trash-2', 'btn-d ml-auto')}</div></div>`;
    el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('[data-close]')) closeDetail(); });
    document.body.append(el); document.body.classList.add('overflow-hidden'); A.icons();
  }
  const refresh = (id) => { render(); if ($('#detail')) (find(id) ? detail(id) : closeDetail()); };

  /* Delete rule: a file used in a creative cannot be deleted */
  function askDelete(ids) {
    const items = ids.map(find).filter(Boolean), ok = items.filter((m) => !m.used.length), skip = items.length - ok.length;
    if (!ok.length) { A.toast(items.length === 1 ? items[0].name + ' is used in a creative and cannot be deleted' : 'These files are used in creatives and cannot be deleted'); return; }
    A.openForm('delete', { ids: ok.map((m) => m.id), label: ok.length === 1 ? ok[0].name : ok.length + ' files' + (skip ? ` (${skip} in use will be kept)` : '') });
  }

  /* Clicks */
  document.addEventListener('click', (e) => {
    const f = e.target.closest('[data-folder]'); if (f) { st.folder = f.dataset.folder; st.page = 1; render(); return; }
    const t = e.target.closest('[data-tab]'); if (t) { st.tab = t.dataset.tab; st.page = 1; render(); return; }
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act, m = find(b.dataset.id), ids = [...sel];
    if (a === 'upload') A.openForm('media', { folder: st.folder || F[0] });
    else if (a === 'view') detail(m.id);
    else if (a === 'edit') A.openForm('mediaEdit', { id: m.id, name: m.name, folder: m.folder, tags: m.tags.join(', ') });
    else if (a === 'move') A.openForm('move', { ids: [m.id], label: m.name, folder: m.folder });
    else if (a === 'delete') askDelete([m.id]);
    else if (a === 'download') A.toast('Downloading ' + m.name + ' (demo)');
    else if (a === 'copy') { const u = 'https://cdn.addesk.app/files/' + m.id + '/' + m.name; try { navigator.clipboard.writeText(u); } catch (x) {} A.toast('Link copied'); }
    else if (a === 'bmove') A.openForm('move', { ids, label: ids.length + ' files', folder: st.folder || F[0] });
    else if (a === 'bdelete') askDelete(ids);
    else if (a === 'bclear') { sel.clear(); render(); }
    else if (a === 'prev') { st.page--; render(); } else if (a === 'next') { st.page++; render(); }
    else if (a === 'clear') { Object.assign(st, { folder: '', tab: 'All', q: '', page: 1 }); $('#q').value = ''; render(); }
  });
  document.addEventListener('change', (e) => {
    const c = e.target.closest('[data-sel]'), all = e.target.closest('[data-selall]');
    if (c) { c.checked ? sel.add(+c.dataset.sel) : sel.delete(+c.dataset.sel); render(); }
    else if (all) { filtered().slice((st.page - 1) * PAGE, st.page * PAGE).forEach((m) => (all.checked ? sel.add(m.id) : sel.delete(m.id))); render(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !e.defaultPrevented) closeDetail(); });
  $('#q').addEventListener('input', (e) => { st.q = e.target.value; st.page = 1; render(); });
  $('#so').addEventListener('change', (e) => { st.so = e.target.value; st.page = 1; render(); });
  $('#vt').onclick = (e) => { const b = e.target.closest('button'); if (b) { st.view = b.dataset.v; render(); } };

  /* Overlay forms */
  document.addEventListener('form:saved', ({ detail: { key, data, vals } }) => {
    const ids = (vals && (vals.ids || (vals.id ? [vals.id] : []))) || [];
    if (key === 'media') {
      let id = Math.max(0, ...M.map((m) => m.id));
      const tags = (data.tags || '').split(',').map((t) => t.trim()).filter(Boolean);
      (data.files || []).forEach((f) => { const t = typeOf(f.name, f.type); M.unshift(mk(++id, f.name, data.folder, t, f.size / MB, metaOf(t), tags, 'Today')); });
      st.so = 'new'; $('#so').value = 'new'; st.page = 1;
    } else if (key === 'mediaEdit') {
      const m = find(vals.id); if (m) Object.assign(m, { name: data.name, folder: data.folder, tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean) });
    } else if (key === 'move') { ids.forEach((i) => { const m = find(i); if (m) m.folder = data.folder; }); sel.clear(); }
    else if (key === 'folder') { const n = data.name.trim(); if (n && !F.includes(n)) { F.push(n); st.folder = n; } }
    else if (key === 'delete') { M = M.filter((m) => !ids.includes(m.id)); ids.forEach((i) => sel.delete(i)); }
    else return;
    refresh(ids[0]);
  });

  const cq = document.querySelector('.cq');
  new ResizeObserver(() => { const n = cq.clientWidth < 720; if (n !== st.narrow) { st.narrow = n; render(); } }).observe(cq);
  st.narrow = cq.clientWidth < 720;
  render();
})();