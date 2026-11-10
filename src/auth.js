// auth.js — client-side auth, Web Crypto SHA-256 + per-user salt.
// ponytail: localStorage store = client-only, bukan server auth.
//   Upgrade: ganti getUsers/saveUsers + login ke fetch() ke API + httpOnly cookie.
const USERS_KEY = 'vc_users';
const SESSION_KEY = 'vc_session';

function toHex(buf) {
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hash(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return toHex(buf);
}

function genSalt() {
  return toHex(crypto.getRandomValues(new Uint8Array(16)));
}

export function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}

export async function register(username, password) {
  username = String(username || '').trim();
  if (username.length < 3) throw new Error('Username minimal 3 karakter');
  if (password.length < 6) throw new Error('Password minimal 6 karakter');
  const users = getUsers();
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase()))
    throw new Error('Username sudah terdaftar');
  const salt = genSalt();
  users.push({ username, salt, hash: await hash(password, salt), createdAt: Date.now() });
  saveUsers(users);
  return { username };
}

export async function login(username, password) {
  username = String(username || '').trim();
  const users = getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  // pesan disamarin biar gak bocor user ada/tidak
  const errNotFound = 'Username atau password salah';
  if (!user) throw new Error(errNotFound);
  if (await hash(password, user.salt) !== user.hash) throw new Error(errNotFound);
  const token = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username: user.username, token, at: Date.now() }));
  return { username: user.username, token };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

// export hash for password verification from outside
export { hash };

export async function updateUsername(oldUsername, newUsername, password) {
  newUsername = String(newUsername || '').trim();
  if (newUsername.length < 3) throw new Error('Username baru minimal 3 karakter');
  
  const users = getUsers();
  if (users.some(u => u.username.toLowerCase() === newUsername.toLowerCase()))
    throw new Error('Username sudah digunakan');

  const idx = users.findIndex(u => u.username === oldUsername);
  if (idx === -1) throw new Error('User tidak ditemukan');
  
  // verify password
  if (await hash(password, users[idx].salt) !== users[idx].hash)
    throw new Error('Password salah');

  users[idx].username = newUsername;
  saveUsers(users);

  // update session
  const session = getSession();
  if (session && session.username === oldUsername) {
    session.username = newUsername;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  return { username: newUsername };
}
