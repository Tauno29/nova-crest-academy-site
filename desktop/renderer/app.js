const desktop = window.novaCrestDesktop;
const loginForm = document.getElementById('login-form');
const loginButton = loginForm.querySelector('button[type="submit"]');
const loginNote = document.getElementById('login-note');

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  loginButton.disabled = true;
  loginButton.textContent = 'Signing in…';
  loginNote.textContent = 'Authenticating securely with the Nova Crest school service…';
  try {
    await desktop?.login?.({
      email: document.getElementById('login-email').value,
      password: document.getElementById('login-password').value,
    });
    document.getElementById('login-screen').classList.add('is-hidden');
    document.querySelector('.app-shell').classList.remove('is-hidden');
    loginNote.textContent = 'Session established. Credentials are not stored in the renderer.';
  } catch (error) {
    loginNote.textContent = error?.message || 'Sign-in failed. Check the service URL and credentials.';
    loginNote.classList.add('error');
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = 'Continue to workspace';
  }
});

document.getElementById('open-web-admin').addEventListener('click', () => desktop?.openWebAdmin?.());

const views = {
  overview: { title: 'Good morning, Administrator', render: overview },
  learners: { title: 'Learners & Classes', render: () => tableView('Learners & Classes', 'Open the connected workspace to manage learner records and class assignments', ['Learner', 'Class', 'Parent link', 'Status'], [['Live workflow', 'Supabase', 'Available', 'Open connected admin']]) },
  parents: { title: 'Parent Accounts', render: () => tableView('Parent Accounts', 'Issue, reset, and suspend parent access in the connected workspace', ['Parent', 'Username', 'Children', 'Status'], [['Live workflow', 'Generated securely', 'Multi-child links', 'Open connected admin']]) },
  performance: { title: 'Performance', render: () => tableView('Performance', 'Review learner marks and export summaries', ['Learner', 'Activity', 'Marks', 'Percentage'], [['Live workflow', 'Marks and totals', 'Protected', 'Open connected admin']]) },
  attendance: { title: 'Attendance', render: () => formView('Attendance register', 'Record daily attendance and review learner history', ['Learner name', 'Date', 'Status', 'Note']) },
  updates: { title: 'Urgent Updates', render: () => formView('Publish an urgent update', 'Communicate time-sensitive notices to parents', ['Title', 'Message', 'Expiry date', 'Visible to parents']) },
  documents: { title: 'Class-list Files', render: () => uploadView() },
  content: { title: 'Site Content', render: () => formView('Edit public content', 'Update the copy shown across the Nova Crest website', ['Content key', 'Title', 'Body', 'Image URL']) }
};

const view = document.getElementById('view');
document.getElementById('current-date').textContent = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date());
document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const entry = views[button.dataset.view];
  document.getElementById('page-title').textContent = entry.title;
  view.innerHTML = entry.render();
  bindForms();
}));

function overview() {
  return `<div class="stats"><div class="card"><span class="stat-label">TOTAL LEARNERS</span><div class="stat-value">Live</div><span class="stat-note">Supabase-backed workflow</span></div><div class="card"><span class="stat-label">PARENT ACCOUNTS</span><div class="stat-value">Live</div><span class="stat-note">Access management</span></div><div class="card"><span class="stat-label">ATTENDANCE TODAY</span><div class="stat-value">Live</div><span class="stat-note">Daily register</span></div><div class="card"><span class="stat-label">OPEN UPDATES</span><div class="stat-value">Live</div><span class="stat-note">Parent notices</span></div></div><div class="panel-grid"><section class="card panel"><h2>School overview</h2><p class="panel-sub">Your secure session is ready. Continue into the connected management workspace for live records.</p><div class="bar-row"><div class="bar-meta"><span>Authenticated session</span><strong>Ready</strong></div><div class="bar-track"><div class="bar-fill" style="width:100%"></div></div></div><div class="bar-row"><div class="bar-meta"><span>Supabase data access</span><strong>Protected</strong></div><div class="bar-track"><div class="bar-fill" style="width:100%"></div></div></div><button class="button" data-action="connect" data-route="/admin">Open live school workspace</button></section><section class="card panel"><h2>Recent activity</h2><p class="panel-sub">Desktop connection status</p><div class="activity"><div class="activity-icon">✓</div><div><strong>Desktop session authenticated</strong><span>Short-lived admin cookie established</span></div></div><div class="activity"><div class="activity-icon">↗</div><div><strong>Supabase connection</strong><span>Reuses the protected server workflow</span></div></div><div class="activity"><div class="activity-icon">!</div><div><strong>Management modules</strong><span>Learners, parents, marks, attendance, updates, documents, and content</span></div></div></section></div>`;
}
function tableView(title, sub, headers, rows) { const route = title.includes('Learners') ? '/admin/learners' : title.includes('Parent') ? '/admin/parents' : '/admin/marks'; return `<div class="section-title"><div><p class="eyebrow">ADMINISTRATION</p><h2>${title}</h2><p class="panel-sub">${sub}</p></div><button class="button" data-action="connect" data-route="${route}">Open live workflow</button></div><section class="card"><table class="table"><thead><tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((cell, index) => `<td>${index === row.length - 1 ? `<span class="badge">${cell || 'Ready'}</span>` : cell}</td>`).join('')}</tr>`).join('')}</tbody></table></section>`; }
function formView(title, sub, fields) { const route = title.includes('Attendance') ? '/admin/attendance' : title.includes('urgent') ? '/admin/updates' : '/admin/content'; return `<div class="section-title"><div><p class="eyebrow">MANAGEMENT</p><h2>${title}</h2><p class="panel-sub">${sub}</p></div><button class="button" data-action="connect" data-route="${route}">Open live workflow</button></div><section class="card"><form class="form-grid" data-form data-route="${route}">${fields.map((field, index) => `<div class="field ${index === 1 ? 'full' : ''}"><label>${field}</label>${field === 'Message' || field === 'Body' ? '<textarea></textarea>' : field === 'Status' ? '<select><option>Present</option><option>Absent</option><option>Late</option></select>' : `<input type="text" placeholder="Enter ${field.toLowerCase()}" />`}</div>`).join('')}<div class="field full"><button class="button" type="submit">Save changes</button></div></form></section>`; }
function uploadView() { return `<div class="section-title"><div><p class="eyebrow">DOCUMENT INTAKE</p><h2>Class-list Files</h2><p class="panel-sub">Upload PDF, DOCX, or CSV class lists and import learners securely.</p></div><button class="button" data-action="connect" data-route="/admin/documents">Open live workflow</button></div><section class="card"><div class="empty">The connected workspace supports class-list upload and import.<br /><small>Imports reconcile existing learners and retain an auditable row count.</small></div></section>`; }
function bindForms() { document.querySelectorAll('[data-form]').forEach(form => form.addEventListener('submit', event => { event.preventDefault(); desktop?.openWebAdmin?.(event.target.dataset.route || '/admin'); })); document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => desktop?.openWebAdmin?.(button.dataset.route || '/admin'))); }
view.innerHTML = overview();
bindForms();
