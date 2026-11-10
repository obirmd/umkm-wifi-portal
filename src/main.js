import './style.css';
import * as auth from './auth.js';

const app = document.querySelector('#app');
const el = (id) => document.getElementById(id);

function setError(msg) {
  const box = el('error');
  if (box) { box.textContent = msg || ''; box.hidden = !msg; }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// Christmas tree SVG illustration
const christmasSvg = `
<svg viewBox="0 0 320 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Tree -->
  <polygon points="160,20 200,90 120,90" fill="#2d7a4f" stroke="#1e5c38" stroke-width="2"/>
  <polygon points="160,55 215,135 105,135" fill="#34915d" stroke="#1e5c38" stroke-width="2"/>
  <polygon points="160,95 230,185 90,185" fill="#3aa869" stroke="#1e5c38" stroke-width="2"/>
  <!-- Trunk -->
  <rect x="145" y="185" width="30" height="35" rx="3" fill="#8b5a2b" stroke="#6b4226" stroke-width="2"/>
  <!-- Star on top -->
  <polygon points="160,8 165,20 178,20 168,28 172,40 160,33 148,40 152,28 142,20 155,20" fill="#ffd700" stroke="#e6ac00" stroke-width="1.5"/>
  <!-- Ornaments -->
  <circle cx="140" cy="75" r="8" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5"/>
  <circle cx="180" cy="110" r="9" fill="#3498db" stroke="#2980b9" stroke-width="1.5"/>
  <circle cx="130" cy="145" r="8" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5"/>
  <circle cx="190" cy="155" r="10" fill="#f1c40f" stroke="#d4ac0d" stroke-width="1.5"/>
  <circle cx="115" cy="175" r="7" fill="#9b59b6" stroke="#8e44ad" stroke-width="1.5"/>
  <circle cx="205" cy="170" r="8" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5"/>
  <!-- Gift box (floating) -->
  <rect x="240" y="60" width="40" height="35" rx="4" fill="#e74c3c" stroke="#c0392b" stroke-width="2"/>
  <rect x="255" y="55" width="10" height="45" fill="#f1c40f" stroke="#d4ac0d" stroke-width="1.5"/>
  <rect x="237" y="75" width="46" height="8" fill="#f1c40f" stroke="#d4ac0d" stroke-width="1.5"/>
  <!-- Person decorating (simplified) -->
  <circle cx="80" cy="210" r="12" fill="#fdbf6f" stroke="#e6a54a" stroke-width="1.5"/>
  <path d="M68,230 Q80,225 92,230 L95,270 L65,270 Z" fill="#3498db" stroke="#2980b9" stroke-width="1.5"/>
  <!-- Arm reaching up -->
  <path d="M92,235 Q105,220 120,205" stroke="#fdbf6f" stroke-width="6" stroke-linecap="round" fill="none"/>
  <!-- Dog -->
  <ellipse cx="235" cy="250" rx="18" ry="12" fill="#d4a574" stroke="#b8956a" stroke-width="1.5"/>
  <circle cx="248" cy="242" r="8" fill="#d4a574" stroke="#b8956a" stroke-width="1.5"/>
  <circle cx="250" cy="240" r="2" fill="#333"/>
  <ellipse cx="222" cy="260" rx="6" ry="4" fill="#d4a574" stroke="#b8956a" stroke-width="1"/>
  <!-- Ground shadow -->
  <ellipse cx="160" cy="228" rx="100" ry="8" fill="rgba(0,0,0,0.08)"/>
</svg>`;

// shared left panel (white with logo + illustration)
function panelLeft() {
  return `
  <aside class="panel-left">
    <div class="brand">
      <div class="logo">
        <div class="logo-icon">🛡</div>
        <div class="logo-text">UNIVERSITAS KRISTEN<br>MARANATHA</div>
      </div>
    </div>
    <div class="illustration">${christmasSvg}</div>
    <div class="footer-text">
      &copy; 2025-Universitas Kristen Maranatha<br>
      Powered by NOC
    </div>
  </aside>`;
}

function split(left, formHtml) {
  return `<div class="split">${left}<section class="panel-right"><main class="card">${formHtml}</main></section></div>`;
}

function dashboardView(s) {
  const users = auth.getUsers();
  const total = users.length;
  const rows = users.slice().reverse().map(u => `
    <tr>
      <td>${escapeHtml(u.username)}</td>
      <td>${new Date(u.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
      <td><span class="badge ${u.username === s.username ? 'on' : 'idle'}">${u.username === s.username ? 'Aktif' : '—'}</span></td>
    </tr>`).join('');
  const days = [40, 65, 30, 80, 55, 90, 48];
  const bars = days.map(h => `<div class="bar" style="height:${h}%"><span>${h}</span></div>`).join('');
  return `
  <div class="dash">
    <aside class="sidebar">
      <div class="sb-brand"><span class="logo">◆</span> UKM Wifi</div>
      <nav class="sb-nav">
        <a href="#dashboard">Dashboard</a>
        <a href="#profile">Profil</a>
        <a>Aktivitas</a>
        <a>Pengaturan</a>
      </nav>
      <div class="sb-user">
        <div class="avatar">${escapeHtml((s.username[0] || '?').toUpperCase())}</div>
        <div>
          <div class="uname">${escapeHtml(s.username)}</div>
          <div class="muted small">Akun terverifikasi</div>
        </div>
        <button id="logout" class="btn-ghost" title="Logout">⎋</button>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <h1>Dashboard</h1>
        <p class="muted small">Ringkasan aktivitas akun</p>
      </header>
      <section class="stats">
        <div class="stat"><div class="stat-num">${total}</div><div class="stat-label">Total Akun</div><div class="stat-trend up">+${total} terdaftar</div></div>
        <div class="stat"><div class="stat-num">1</div><div class="stat-label">Sesi Aktif</div><div class="stat-trend up">online</div></div>
        <div class="stat"><div class="stat-num">${days.length}</div><div class="stat-label">Hari Aktif</div><div class="stat-trend">7 hari</div></div>
        <div class="stat"><div class="stat-num">100%</div><div class="stat-label">Uptime</div><div class="stat-trend up">stabil</div></div>
      </section>
      <section class="chart-card">
        <div class="card-head"><h2>Aktivitas 7 Hari</h2><span class="muted small">dummy</span></div>
        <div class="chart">${bars}</div>
        <div class="chart-axis"><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span></div>
      </section>
      <section class="table-card">
        <div class="card-head"><h2>Akun Terdaftar</h2><span class="muted small">${total} akun</span></div>
        <table>
          <thead><tr><th>Username</th><th>Dibuat</th><th>Status</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="3" class="muted">Belum ada akun</td></tr>'}</tbody>
        </table>
      </section>
    </main>
  </div>`;
}

function profileView(s) {
  return `
  <div class="dash">
    <aside class="sidebar">
      <div class="sb-brand"><span class="logo">◆</span> UKM Wifi</div>
      <nav class="sb-nav">
        <a href="#dashboard">Dashboard</a>
        <a href="#profile" class="active">Profil</a>
        <a>Aktivitas</a>
        <a>Pengaturan</a>
      </nav>
      <div class="sb-user">
        <div class="avatar">${escapeHtml((s.username[0] || '?').toUpperCase())}</div>
        <div>
          <div class="uname">${escapeHtml(s.username)}</div>
          <div class="muted small">Akun terverifikasi</div>
        </div>
        <button id="logout" class="btn-ghost" title="Logout">⎋</button>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <h1>Profil</h1>
        <p class="muted small">Kelola informasi akun Anda</p>
      </header>
      <section class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar-lg">${escapeHtml((s.username[0] || '?').toUpperCase())}</div>
          <div>
            <h2>${escapeHtml(s.username)}</h2>
            <p class="muted">Member sejak ${new Date(s.at).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
          </div>
        </div>
        <form id="profile-form" autocomplete="on">
          <h3>Ubah Username</h3>
          <label>Username Saat Ini
            <input type="text" value="${escapeHtml(s.username)}" disabled>
          </label>
          <label>Username Baru
            <input id="new-username" name="new-username" autocomplete="username" placeholder="Masukkan username baru" required minlength="3">
          </label>
          <label>Konfirmasi Password
            <input id="confirm-password" type="password" name="confirm-password" autocomplete="current-password" placeholder="Masukkan password untuk konfirmasi" required>
          </label>
          <p id="error" class="error" hidden></p>
          <p id="success" class="success-msg" hidden></p>
          <button class="btn" type="submit">Simpan Perubahan</button>
        </form>
      </section>
    </main>
  </div>`;
}

function loginView() {
  const form = `
    <h1>Login</h1>
    <form id="login-form" autocomplete="on">
      <label>Username<input id="username" name="username" autocomplete="username" placeholder="Enter your username" required></label>
      <label>Password<input id="password" type="password" name="password" autocomplete="current-password" placeholder="Enter your password" required></label>
      <div class="forgot-link"><a href="#">Forgot Password?</a></div>
      <p id="error" class="error" hidden></p>
      <button class="btn" type="submit">Login to Wifi</button>
    </form>
    <div class="switch small">Don't have an account? <a href="#register">Register Here</a></div>
    <div class="bottom-links">
      <a href="#">Terms and Services</a>
      <span>Have a problem? Contact us at <strong>NOC@maranatha.edu</strong></span>
    </div>`;
  return split(panelLeft(), form);
}

function registerView() {
  const form = `
    <h1>Register</h1>
    <form id="register-form" autocomplete="on">
      <label>Username<input id="username" name="username" autocomplete="username" placeholder="Enter your username" required></label>
      <label>Password<input id="password" type="password" name="password" autocomplete="new-password" placeholder="Enter your password" required></label>
      <label>Confirm Password<input id="password2" type="password" name="password2" autocomplete="new-password" placeholder="Confirm your password" required></label>
      <p id="error" class="error" hidden></p>
      <button class="btn" type="submit">Register</button>
    </form>
    <div class="switch small">Already have an account? <a href="#login">Login Here</a></div>
    <div class="bottom-links">
      <a href="#">Terms and Services</a>
      <span>Have a problem? Contact us at <strong>NOC@maranatha.edu</strong></span>
    </div>`;
  return split(panelLeft(), form);
}

function resolveRoute() {
  const session = auth.getSession();
  let route = location.hash.replace('#', '');
  if (!route) route = session ? 'dashboard' : 'login';
  if (session && (route === 'login' || route === 'register')) route = 'dashboard';
  if (!session && (route === 'dashboard' || route === 'profile')) route = 'login';
  return { route, session };
}

function render() {
  const { route, session } = resolveRoute();
  app.innerHTML =
    route === 'register' ? registerView()
    : route === 'profile' ? profileView(session)
    : route === 'dashboard' ? dashboardView(session)
    : loginView();
  bind(route);
}

function bind(route) {
  if (route === 'login') {
    el('login-form').addEventListener('submit', onLogin);
  } else if (route === 'register') {
    el('register-form').addEventListener('submit', onRegister);
  } else if (route === 'dashboard') {
    el('logout').addEventListener('click', () => { auth.logout(); location.hash = '#login'; });
  } else if (route === 'profile') {
    el('logout').addEventListener('click', () => { auth.logout(); location.hash = '#login'; });
    el('profile-form').addEventListener('submit', onProfileUpdate);
  }
}

async function onLogin(e) {
  e.preventDefault();
  setError('');
  try {
    await auth.login(el('username').value, el('password').value);
    location.hash = '#dashboard';
  } catch (err) {
    setError(err.message);
  }
}

async function onRegister(e) {
  e.preventDefault();
  setError('');
  const p1 = el('password').value, p2 = el('password2').value;
  if (p1 !== p2) return setError('Password tidak cocok');
  try {
    await auth.register(el('username').value, p1);
    location.hash = '#login';
  } catch (err) {
    setError(err.message);
  }
}

function setSuccess(msg) {
  const box = el('success');
  if (box) { box.textContent = msg || ''; box.hidden = !msg; }
  const errBox = el('error');
  if (errBox) { errBox.hidden = true; }
}

async function onProfileUpdate(e) {
  e.preventDefault();
  setError('');
  setSuccess('');
  const session = auth.getSession();
  const newUsername = el('new-username').value;
  const password = el('confirm-password').value;

  if (!session) return setError('Sesi tidak valid, silakan login ulang');

  try {
    await auth.updateUsername(session.username, newUsername, password);
    setSuccess(`Username berhasil diubah menjadi "${newUsername}"`);
    setTimeout(() => location.hash = '#profile', 1500);
  } catch (err) {
    setError(err.message);
  }
}

window.addEventListener('hashchange', render);
render();
