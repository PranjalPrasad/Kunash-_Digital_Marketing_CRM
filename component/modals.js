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
  A.team = [...P.manager, ...P.ads, ...P.designer, 'John Doe'];
  A.owners = ['Unassigned', ...A.team];
  const FORMS = {
    client: { t: 'New client', ok: 'Create client', f: [['name', 'Business name', 'text', 0, 1, 1], ['contact', 'Contact person', 'text'], ['phone', 'Phone', 'tel'], ['email', 'Email', 'email', 0, 1], ['plan', 'Service package', 'select', ['Starter', 'Growth', 'Premium']], ['manager', 'Assign manager', 'select', P.manager], ['scope', 'Service scope', 'select', ['Full ad management', 'Ads + social posting', 'Social posting only']], ['website', 'Website', 'url', 0, 0, 1]] },
    campaign: { t: 'New campaign', ok: 'Save draft', f: [['client', 'Client', 'select', '$c', 1], ['name', 'Campaign name', 'text', 0, 1], ['platform', 'Platform', 'select', ['Meta', 'Google Ads', 'Meta + Google', 'WhatsApp', 'LinkedIn']], ['objective', 'Objective', 'select', ['Leads', 'Traffic', 'Sales', 'Awareness']], ['budget', 'Budget (₹)', 'number', 0, 1], ['start', 'Start date', 'date'], ['end', 'End date', 'date'], ['brief', 'Brief', 'textarea', 0, 0, 1]] },
    creative: { t: 'Upload creative', ok: 'Submit for approval', f: [['client', 'Client', 'select', '$c', 1], ['title', 'Creative title', 'text', 0, 1], ['format', 'Format', 'select', ['Image', 'Carousel', 'Video']], ['offer', 'Offer', 'text'], ['file', 'Image or video', 'file', 0, 1, 1], ['caption', 'Caption', 'textarea', 0, 0, 1], ['link', 'Destination link', 'url', 0, 0, 1]] },
    creativeEdit: { t: 'Edit creative details', ok: 'Save changes', f: [['title', 'Creative title', 'text', 0, 1, 1], ['format', 'Format', 'select', ['Image', 'Carousel', 'Video']], ['offer', 'Offer', 'text'], ['link', 'Destination link', 'url', 0, 0, 1], ['caption', 'Caption', 'textarea', 0, 0, 1]] },
    version: { t: 'Upload new version', ok: 'Submit for approval', f: [['creative', 'Creative', 'text', 0, 0, 1, 1], ['file', 'New version file', 'file', 0, 1, 1], ['note', 'What changed', 'textarea', 0, 1, 1]] },
    decision: { t: 'Record client decision', ok: 'Save decision', f: [['creative', 'Creative', 'text', 0, 0, 1, 1], ['decision', 'Decision', 'select', ['Approved', 'Changes requested'], 1], ['by', 'Decided by', 'text', 0, 1], ['comment', 'Client comment', 'textarea', 0, 0, 1]] },
    comment: { t: 'Add comment', ok: 'Post comment', f: [['creative', 'Creative', 'text', 0, 0, 1, 1], ['comment', 'Comment', 'textarea', 0, 1, 1]] },
    clientEdit: { t: 'Edit client', ok: 'Save changes', f: [['name', 'Business name', 'text', 0, 1, 1], ['contact', 'Contact person', 'text'], ['phone', 'Phone', 'tel'], ['email', 'Email', 'email', 0, 1], ['plan', 'Service package', 'select', ['Starter', 'Growth', 'Premium']], ['manager', 'Manager', 'select', P.manager], ['scope', 'Service scope', 'select', ['Full ad management', 'Ads + social posting', 'Social posting only']], ['status', 'Status', 'select', ['Active', 'Inactive']], ['website', 'Website', 'text']] },
    invite: { t: 'Invite client', ok: 'Send invite', f: [['client', 'Client', 'select', '$c', 1], ['email', 'Invite email', 'email', 0, 1], ['role', 'Access', 'select', ['Client admin', 'Client viewer']], ['msg', 'Message', 'textarea', 0, 0, 1]] },
    team: { t: 'Assign team', ok: 'Save team', f: [['client', 'Client', 'select', '$c', 1], ['manager', 'Manager', 'select', P.manager], ['ads', 'Ads manager', 'select', P.ads], ['designer', 'Designer', 'select', P.designer]] },
    campaignEdit: { t: 'Edit campaign', ok: 'Save changes', f: [['name', 'Campaign name', 'text', 0, 1, 1], ['client', 'Client', 'select', '$c', 1], ['platform', 'Platform', 'select', ['Meta', 'Google Ads', 'Meta + Google', 'WhatsApp', 'LinkedIn']], ['objective', 'Objective', 'select', ['Leads', 'Traffic', 'Sales', 'Awareness']], ['budget', 'Budget (₹)', 'number', 0, 1], ['start', 'Start date', 'date'], ['end', 'End date', 'date'], ['brief', 'Brief', 'textarea', 0, 0, 1]] },
    pause: { t: 'Pause campaign', ok: 'Pause campaign', f: [['campaign', 'Campaign', 'text', 0, 0, 1, 1], ['reason', 'Reason', 'select', ['Budget reached', 'Client request', 'Creative outdated', 'Ad account issue', 'Other'], 1, 1], ['note', 'Note for the change log', 'textarea', 0, 0, 1]] },
    media: { t: 'Upload media', ok: 'Upload', f: [['folder', 'Folder', 'select', '$f', 1, 1], ['files', 'Files (images, videos, documents)', 'file', 0, 1, 1], ['tags', 'Tags (comma separated)', 'text', 0, 0, 1]] },
    mediaEdit: { t: 'Edit file', ok: 'Save changes', f: [['name', 'File name', 'text', 0, 1, 1], ['folder', 'Folder', 'select', '$f', 1, 1], ['tags', 'Tags (comma separated)', 'text', 0, 0, 1]] },
    move: { t: 'Move files', ok: 'Move', f: [['label', 'Files', 'text', 0, 0, 1, 1], ['folder', 'Move to folder', 'select', '$f', 1, 1]] },
    folder: { t: 'New folder', ok: 'Create folder', f: [['name', 'Folder name', 'text', 0, 1, 1], ['note', 'Description', 'textarea', 0, 0, 1]] },
    delete: { t: 'Delete files', ok: 'Delete', f: [['label', 'Files', 'text', 0, 0, 1, 1], ['note', 'Reason (optional)', 'textarea', 0, 0, 1]] },
    product: { t: 'New product or service', ok: 'Add product', f: [['client', 'Client', 'select', '$c', 1], ['name', 'Name', 'text', 0, 1], ['type', 'Type', 'select', ['Product', 'Service', 'Package', 'Offer']], ['unit', 'Unit (per kg, per month...)', 'text'], ['price', 'Price (₹)', 'number', 0, 1], ['offer', 'Offer price (₹, optional)', 'number'], ['desc', 'Description', 'textarea', 0, 0, 1]] },
    productEdit: { t: 'Edit product', ok: 'Save changes', f: [['name', 'Name', 'text', 0, 1, 1], ['client', 'Client', 'select', '$c', 1], ['type', 'Type', 'select', ['Product', 'Service', 'Package', 'Offer']], ['unit', 'Unit', 'text', 0, 0, 1], ['desc', 'Description', 'textarea', 0, 0, 1]] },
    price: { t: 'Change price', ok: 'Update price', f: [['product', 'Product', 'text', 0, 0, 1, 1], ['current', 'Current price', 'text', 0, 0, 1, 1], ['price', 'New price (₹)', 'number', 0, 1], ['offer', 'New offer price (₹)', 'number'], ['reason', 'Reason', 'select', ['Client request', 'Festival offer', 'Cost change', 'Competitor pricing', 'Correction'], 1, 1], ['impact', 'What will happen', 'textarea', 0, 0, 1, 1], ['sync', 'Also push this price to', 'select', ['CRM only', 'CRM + Google Merchant Center', 'CRM + Merchant Center + Meta catalogue'], 0, 1], ['note', 'Note', 'textarea', 0, 0, 1]] },
    task: { t: 'New task', ok: 'Create task', f: [['title', 'Task title', 'text', 0, 1, 1], ['client', 'Client', 'select', '$c', 1], ['assignee', 'Assign to', 'select', '$t', 1], ['priority', 'Priority', 'select', ['Low', 'Medium', 'High', 'Urgent']], ['due', 'Due date', 'date', 0, 1], ['status', 'Status', 'select', ['To do', 'In progress', 'In review', 'Done']], ['related', 'Related to (campaign, creative...)', 'text', 0, 0, 1], ['desc', 'Description', 'textarea', 0, 0, 1]] },
    taskEdit: { t: 'Edit task', ok: 'Save changes', f: [['title', 'Task title', 'text', 0, 1, 1], ['client', 'Client', 'select', '$c', 1], ['assignee', 'Assign to', 'select', '$t', 1], ['priority', 'Priority', 'select', ['Low', 'Medium', 'High', 'Urgent']], ['due', 'Due date', 'date', 0, 1], ['status', 'Status', 'select', ['To do', 'In progress', 'In review', 'Done']], ['related', 'Related to (campaign, creative...)', 'text', 0, 0, 1], ['desc', 'Description', 'textarea', 0, 0, 1]] },
    taskComment: { t: 'Add comment', ok: 'Post comment', f: [['label', 'Task', 'text', 0, 0, 1, 1], ['comment', 'Comment', 'textarea', 0, 1, 1]] },
    taskDelete: { t: 'Delete task', ok: 'Delete task', f: [['label', 'Task', 'text', 0, 0, 1, 1], ['note', 'Reason (optional)', 'textarea', 0, 0, 1]] },
    report: { t: 'Generate report', ok: 'Generate', f: [['type', 'Report type', 'select', ['Performance summary', 'Lead report', 'Campaign report', 'Client monthly report'], 1], ['client', 'Client', 'select', '$ca', 1], ['period', 'Period', 'select', ['Last 3 months', 'Last 6 months', 'Last 12 months', 'This year'], 1], ['format', 'Format', 'select', ['PDF', 'Excel (CSV)']], ['email', 'Email a copy to (optional)', 'email', 0, 0, 1]] },
    schedule: { t: 'Schedule report', ok: 'Save schedule', f: [['type', 'Report type', 'select', ['Performance summary', 'Lead report', 'Campaign report', 'Client monthly report'], 1], ['client', 'Client', 'select', '$ca', 1], ['freq', 'Frequency', 'select', ['Weekly (Monday)', 'Monthly (1st)'], 1], ['format', 'Format', 'select', ['PDF', 'Excel (CSV)']], ['email', 'Send to', 'email', 0, 1, 1]] },
    reportDelete: { t: 'Delete report', ok: 'Delete', f: [['label', 'Report', 'text', 0, 0, 1, 1], ['note', 'Reason (optional)', 'textarea', 0, 0, 1]] },
    plan: { t: 'New plan', ok: 'Create plan', f: [['name', 'Plan name', 'text', 0, 1, 1], ['price', 'Price (₹, excl. GST)', 'number', 0, 1], ['billing', 'Billing cycle', 'select', ['Monthly', 'Quarterly', 'Yearly']], ['campaigns', 'Active campaigns included', 'number', 0, 1], ['creatives', 'Creatives per month', 'number', 0, 1], ['platforms', 'Platforms', 'select', ['Meta', 'Google Ads', 'Meta + Google']], ['reports', 'Reports', 'select', ['Monthly', 'Weekly + monthly']], ['extra', 'Extra benefit (optional)', 'text', 0, 0, 1], ['desc', 'Description', 'textarea', 0, 0, 1]] },
    planEdit: { t: 'Edit plan', ok: 'Save changes', f: [['name', 'Plan name', 'text', 0, 1, 1], ['billing', 'Billing cycle', 'select', ['Monthly', 'Quarterly', 'Yearly']], ['campaigns', 'Active campaigns included', 'number', 0, 1], ['creatives', 'Creatives per month', 'number', 0, 1], ['platforms', 'Platforms', 'select', ['Meta', 'Google Ads', 'Meta + Google']], ['reports', 'Reports', 'select', ['Monthly', 'Weekly + monthly']], ['extra', 'Extra benefit (optional)', 'text', 0, 0, 1], ['desc', 'Description', 'textarea', 0, 0, 1]] },
    planPrice: { t: 'Change plan price', ok: 'Update price', f: [['plan', 'Plan', 'text', 0, 0, 1, 1], ['current', 'Current price', 'text', 0, 0, 1, 1], ['price', 'New price (₹, excl. GST)', 'number', 0, 1], ['from', 'Effective from', 'date', 0, 1], ['reason', 'Reason', 'select', ['Annual revision', 'Cost increase', 'Competitive pricing', 'Promotion', 'Correction'], 1, 1], ['impact', 'What will happen', 'textarea', 0, 0, 1, 1]] },
    addon: { t: 'New add-on', ok: 'Add add-on', f: [['name', 'Add-on name', 'text', 0, 1, 1], ['price', 'Price (₹, excl. GST)', 'number', 0, 1], ['unit', 'Billed', 'select', ['One-time', 'Per month', 'Per creative', 'Per campaign'], 1], ['desc', 'Description', 'textarea', 0, 0, 1]] },
    addonEdit: { t: 'Edit add-on', ok: 'Save changes', f: [['name', 'Add-on name', 'text', 0, 1, 1], ['price', 'Price (₹, excl. GST)', 'number', 0, 1], ['unit', 'Billed', 'select', ['One-time', 'Per month', 'Per creative', 'Per campaign'], 1], ['desc', 'Description', 'textarea', 0, 0, 1]] },
    clientPrice: { t: 'Client pricing', ok: 'Save pricing', f: [['client', 'Client', 'text', 0, 0, 1, 1], ['plan', 'Plan', 'select', '$p', 1, 1], ['custom', 'Custom price (₹, optional)', 'number'], ['discount', 'Discount % (optional)', 'number'], ['from', 'Effective from', 'date', 0, 1], ['reason', 'Reason', 'select', ['Standard pricing', 'Long-term contract', 'Loyalty', 'Referral', 'Special deal'], 1]] },
    lead: { t: 'Add lead', ok: 'Add lead', f: [['name', 'Name', 'text', 0, 1], ['phone', 'Phone', 'tel', 0, 1], ['email', 'Email', 'email'], ['client', 'Client', 'select', '$c', 1], ['source', 'Source', 'select', ['Meta Lead Ad', 'Google Ads', 'Website', 'Manual']], ['rating', 'Interest', 'select', ['Hot', 'Warm', 'Cold']], ['owner', 'Assign to', 'select', '$o'], ['value', 'Potential value (₹)', 'number'], ['followup', 'Follow-up date', 'date'], ['campaign', 'Campaign', 'text'], ['note', 'Notes', 'textarea', 0, 0, 1]] },
    leadEdit: { t: 'Edit lead', ok: 'Save changes', f: [['name', 'Name', 'text', 0, 1], ['phone', 'Phone', 'tel', 0, 1], ['email', 'Email', 'email'], ['client', 'Client', 'select', '$c', 1], ['source', 'Source', 'select', ['Meta Lead Ad', 'Google Ads', 'Website', 'Manual']], ['rating', 'Interest', 'select', ['Hot', 'Warm', 'Cold']], ['owner', 'Assign to', 'select', '$o'], ['value', 'Potential value (₹)', 'number'], ['followup', 'Follow-up date', 'date'], ['campaign', 'Campaign', 'text'], ['note', 'Notes', 'textarea', 0, 0, 1]] },
    followup: { t: 'Schedule follow-up', ok: 'Save follow-up', f: [['label', 'Lead', 'text', 0, 0, 1, 1], ['followup', 'Next follow-up', 'date', 0, 1, 1], ['note', 'Note', 'textarea', 0, 0, 1]] },
    leadNote: { t: 'Add note', ok: 'Save note', f: [['label', 'Lead', 'text', 0, 0, 1, 1], ['comment', 'Note', 'textarea', 0, 1, 1]] },
    leadLost: { t: 'Mark lead as lost', ok: 'Mark as lost', f: [['label', 'Lead', 'text', 0, 0, 1, 1], ['reason', 'Reason', 'select', ['Not interested', 'Price too high', 'No response', 'Outside service area', 'Chose a competitor', 'Duplicate or fake'], 1, 1], ['note', 'Note', 'textarea', 0, 0, 1]] },
    leadDelete: { t: 'Delete lead', ok: 'Delete lead', f: [['label', 'Lead', 'text', 0, 0, 1, 1], ['note', 'Reason (optional)', 'textarea', 0, 0, 1]] },
    invoice: { t: 'Create invoice', ok: 'Create invoice', f: [['client', 'Client', 'select', '$c', 1], ['due', 'Due date', 'date', 0, 1], ['desc', 'Description', 'text', 0, 1, 1], ['qty', 'Quantity', 'number', 0, 1], ['rate', 'Rate (₹)', 'number', 0, 1], ['gst', 'GST', 'select', ['18%', '12%', '5%', 'No GST']], ['action', 'After saving', 'select', ['Save as draft', 'Create and send']], ['note', 'Note on invoice', 'textarea', 0, 0, 1]] },
    invoiceEdit: { t: 'Edit draft invoice', ok: 'Save changes', f: [['client', 'Client', 'select', '$c', 1], ['due', 'Due date', 'date', 0, 1], ['desc', 'Description', 'text', 0, 1, 1], ['qty', 'Quantity', 'number', 0, 1], ['rate', 'Rate (₹)', 'number', 0, 1], ['gst', 'GST', 'select', ['18%', '12%', '5%', 'No GST']], ['note', 'Note on invoice', 'textarea', 0, 0, 1]] },
    payment: { t: 'Record payment', ok: 'Save payment', f: [['invoice', 'Invoice', 'text', 0, 0, 1, 1], ['balance', 'Balance due', 'text', 0, 0, 1, 1], ['amount', 'Amount received (₹)', 'number', 0, 1], ['date', 'Payment date', 'date', 0, 1], ['mode', 'Mode', 'select', ['UPI', 'Bank transfer', 'Cheque', 'Cash', 'Card'], 1], ['ref', 'Reference or UTR (optional)', 'text'], ['note', 'Note', 'textarea', 0, 0, 1]] },
    invoiceCancel: { t: 'Cancel invoice', ok: 'Cancel invoice', f: [['invoice', 'Invoice', 'text', 0, 0, 1, 1], ['reason', 'Reason', 'select', ['Created by mistake', 'Client left', 'Replaced by a new invoice', 'Other'], 1, 1], ['note', 'Note', 'textarea', 0, 0, 1]] },
    googleAd: { t: 'Run Google ad', ok: 'Save Google ad', f: [['client', 'Client', 'select', '$c', 1], ['name', 'Campaign name', 'text', 0, 1], ['type', 'Ad type', 'select', ['Search', 'Performance Max', 'Shopping (Merchant Center products)', 'Display', 'YouTube']], ['objective', 'Objective', 'select', ['Leads', 'Sales', 'Traffic', 'Awareness']], ['budget', 'Total budget (₹)', 'number', 0, 1], ['start', 'Start date', 'date'], ['end', 'End date', 'date'], ['locations', 'Locations', 'text', 0, 0, 1], ['keywords', 'Keywords (one per line)', 'textarea', 0, 0, 1], ['headlines', 'Headlines and description', 'textarea', 0, 0, 1], ['brief', 'Landing page URL', 'url', 0, 0, 1]] },
    waCampaign: { t: 'Run WhatsApp campaign', ok: 'Save WhatsApp campaign', f: [['client', 'Client', 'select', '$c', 1], ['name', 'Campaign name', 'text', 0, 1], ['type', 'Type', 'select', ['Template broadcast (approved template)', 'Click-to-WhatsApp ad (via Meta)']], ['template', 'Template name', 'text'], ['audience', 'Audience', 'select', ['All leads', 'Hot leads only', 'Contacted, no reply', 'Uploaded customer list (opted in)']], ['budget', 'Message budget (₹)', 'number'], ['start', 'Send on', 'date'], ['message', 'Message', 'textarea', 0, 1, 1]] },
    connectMeta: { t: 'Connect Meta account', ok: 'Save connection', f: [['client', 'Client', 'select', '$c', 1], ['method', 'How access is given', 'select', ['Client logs in with Facebook (recommended)', 'Client adds our Business Manager as partner', 'System user token (our Business Manager)'], 1, 1], ['acct', 'Ad account ID (act_...)', 'text', 0, 1], ['page', 'Facebook Page ID', 'text'], ['ig', 'Instagram business account ID', 'text'], ['bm', 'Client Business Manager ID (optional)', 'text']] },
    connectGoogle: { t: 'Connect Google Ads', ok: 'Save connection', f: [['client', 'Client', 'select', '$c', 1], ['cid', 'Google Ads customer ID', 'text', 0, 1], ['link', 'Access', 'select', ['Client linked to our manager account (MCC)', 'Client signs in with Google (OAuth)']], ['mc', 'Merchant Center ID (optional)', 'text'], ['ga4', 'GA4 property ID (optional)', 'text']] },
    connectWA: { t: 'Connect WhatsApp Business', ok: 'Save connection', f: [['client', 'Client', 'select', '$c', 1], ['waba', 'WhatsApp Business Account ID', 'text', 0, 1], ['pid', 'Phone number ID', 'text', 0, 1], ['num', 'Display phone number', 'tel', 0, 1]] },
    connectSocial: { t: 'Connect social profile', ok: 'Save profile', f: [['client', 'Client', 'select', '$c', 1], ['platform', 'Platform', 'select', ['LinkedIn', 'Instagram'], 1], ['url', 'Profile or page link', 'url', 0, 1, 1], ['scope', 'What we handle', 'select', ['Posting only', 'Posting + ads']]] },
    connectMerchant: { t: 'Connect Google Merchant Center', ok: 'Save connection', f: [['client', 'Client', 'select', '$c', 1], ['mc', 'Merchant Center ID', 'text', 0, 1], ['src', 'Where products come from', 'select', ['Pushed from this CRM (Merchant API)', 'Shopify', 'WooCommerce', 'Existing feed file']], ['site', 'Website (must match feed prices)', 'url', 0, 0, 1]] },
    payLink: { t: 'Send payment link', ok: 'Send link', f: [['client', 'Client', 'select', '$c', 1], ['amount', 'Amount (₹, excl. GST)', 'number', 0, 1], ['mode', 'Collect by', 'select', ['One-time payment link', 'Monthly UPI AutoPay', 'Bank transfer details']], ['msg', 'Message', 'textarea', 0, 0, 1]] },
    userInvite: { t: 'Invite user', ok: 'Send invite', f: [['name', 'Full name', 'text', 0, 1], ['email', 'Email', 'email', 0, 1], ['phone', 'Phone', 'tel'], ['role', 'Role', 'select', ['Agency owner', 'Agency manager', 'Ads manager', 'Designer', 'Client admin', 'Client viewer'], 1], ['client', 'Client (client roles only)', 'select', '$c0'], ['access', 'Agency staff can open', 'select', ['Selected clients', 'All clients']], ['msg', 'Message', 'textarea', 0, 0, 1]] },
    userEdit: { t: 'Edit user', ok: 'Save changes', f: [['name', 'Full name', 'text', 0, 1, 1], ['phone', 'Phone', 'tel'], ['role', 'Role', 'select', ['Agency owner', 'Agency manager', 'Ads manager', 'Designer', 'Client admin', 'Client viewer'], 1]] },
    remind: { t: 'Send reminder', ok: 'Send reminder', f: [['client', 'Client', 'select', '$c', 1], ['msg', 'Message', 'textarea', 0, 1, 1]] },
  };

  const inp = 'w-full min-w-0 rounded-lg border border-line bg-card px-3 text-sm text-ink outline-none focus:border-brand';
  const field = ([n, l, t, o, r, full, ro], v) => {
    const req = r ? 'required' : '';
    if (o === '$c') o = A.clients;
    if (o === '$c0') o = ['Not applicable', ...A.clients];
    if (o === '$f') o = A.folders;
    if (o === '$t') o = A.team;
    if (o === '$o') o = A.owners;
    if (o === '$ca') o = ['All clients', ...A.clients];
    if (o === '$p') o = A.plans;
    let c;
    if (t === 'select') c = `<select name="${n}" ${req} class="${inp} h-9">${o.map((y) => `<option ${v[n] === y ? 'selected' : ''}>${y}</option>`).join('')}</select>`;
    else if (t === 'textarea') c = `<textarea name="${n}" rows="3" ${req} ${ro ? 'readonly' : ''} class="${inp} resize-none py-2">${v[n] || ''}</textarea>`;
    else c = `<input name="${n}" type="${t}" ${req} ${ro ? 'readonly' : ''} ${n === 'files' ? 'multiple' : ''} ${t !== 'file' && v[n] != null ? `value="${String(v[n]).replace(/"/g, '&quot;')}"` : ''} class="${inp} ${t === 'file' ? 'py-1.5' : 'h-9'}">`;
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
      const fi = e.target.querySelector('input[type=file]');
      if (fi) data.files = [...fi.files].map((f) => ({ name: f.name, size: f.size, type: f.type }));
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