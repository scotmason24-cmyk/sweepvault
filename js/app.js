function handleSessionChange(session) {
  if (session) {
    currentUser = session.user;
    showApp();
    subscribeToUpdates();
    return;
  }

  currentUser = null;
  unsubscribeFromUpdates();
  showAuth();
}
async function init() {
  const { data: { session } } = await sb.auth.getSession();
  handleSessionChange(session);
  sb.auth.onAuthStateChange((_event, nextSession) => handleSessionChange(nextSession));
}

// ── Auth ─────────────────────────────────────────────────────────────────────
function showAuth() {
  document.getElementById('auth-screen').classList.add('active');
  document.getElementById('app-screen').classList.remove('active');
}

function showApp() {
  document.getElementById('auth-screen').classList.remove('active');
  document.getElementById('app-screen').classList.add('active');
  loadCasinos();
  startTimerLoop();
}


document.getElementById('login-tab').addEventListener('click', () => {
  isLogin = true;
  document.getElementById('login-tab').classList.add('active');
  document.getElementById('register-tab').classList.remove('active');
  document.getElementById('auth-submit').textContent = 'Sign In';
  document.getElementById('confirm-password-wrap').style.display = 'none';
  document.getElementById('auth-error').textContent = '';
});

document.getElementById('register-tab').addEventListener('click', () => {
  isLogin = false;
  document.getElementById('register-tab').classList.add('active');
  document.getElementById('login-tab').classList.remove('active');
  document.getElementById('auth-submit').textContent = 'Create Account';
  document.getElementById('confirm-password-wrap').style.display = 'block';
  document.getElementById('auth-error').textContent = '';
});

document.getElementById('auth-submit').addEventListener('click', async () => {
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const errorEl = document.getElementById('auth-error');
  errorEl.textContent = '';

  if (!email || !password) { errorEl.textContent = 'Please fill in all fields.'; return; }

  if (!isLogin) {
    const confirm = document.getElementById('auth-confirm').value;
    if (password !== confirm) { errorEl.textContent = 'Passwords do not match.'; return; }
    const { error } = await sb.auth.signUp({ email, password });
    if (error) { errorEl.textContent = error.message; return; }
    errorEl.style.color = 'var(--green)';
    errorEl.textContent = 'Check your email to confirm your account.';
  } else {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) { errorEl.textContent = error.message; }
  }
});

document.getElementById('signout-btn').addEventListener('click', async () => {
  await sb.auth.signOut();
});

// ── Database ─────────────────────────────────────────────────────────────────
async function loadCasinos() {
  if (!currentUser) return;
  const { data, error } = await sb
    .from('casinos')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('name');

  if (error) { console.error(error); return; }
  userCasinos = data || [];
  renderCasinos();
}

async function addCasinoToDB(domain, name, balance) {
  const { data, error } = await sb.from('casinos').insert({
    user_id: currentUser.id,
    domain,
    name,
    balance: parseFloat(balance) || 0,
    updated_at: new Date().toISOString()
  }).select().single();
  if (error) { console.error(error); return null; }
  return data;
}

async function updateBalance(id, balance) {
  const { error } = await sb.from('casinos').update({
    balance: parseFloat(balance) || 0,
    updated_at: new Date().toISOString()
  }).eq('id', id).eq('user_id', currentUser.id);
  if (error) console.error(error);
}

async function removeCasino(id) {
  const { error } = await sb.from('casinos').delete().eq('id', id).eq('user_id', currentUser.id);
  if (error) console.error(error);
}

// ── Render ────────────────────────────────────────────────────────────────────
function renderCasinos() {
  const grid = document.getElementById('casino-grid');
  const empty = document.getElementById('empty-state');
  const totalEl = document.getElementById('total-balance');
  const countEl = document.getElementById('casino-count');

  // Clear existing cards (keep empty state)
  Array.from(grid.querySelectorAll('.casino-card')).forEach(c => c.remove());

  if (userCasinos.length === 0) {
    empty.style.display = 'flex';
    totalEl.textContent = '0.00';
    countEl.textContent = '0 casinos tracked';
    return;
  }

  empty.style.display = 'none';

  // Sort: ready bonuses first, then by name
  const sorted = [...userCasinos].sort((a, b) => {
    const aReady = getTimerInfo(a).ready;
    const bReady = getTimerInfo(b).ready;
    if (aReady && !bReady) return -1;
    if (!aReady && bReady) return 1;
    return a.name.localeCompare(b.name);
  });

  let total = 0;
  sorted.forEach(casino => {
    total += parseFloat(casino.balance) || 0;
    const { ready, text, resetTime } = getTimerInfo(casino);
    const card = document.createElement('div');
    card.className = 'casino-card' + (ready ? ' bonus-ready' : '');
    card.dataset.id = casino.id;

    const updated = casino.updated_at
      ? timeAgo(new Date(casino.updated_at))
      : 'never';

    const timerLine = ready
      ? text
      : (resetTime ? `${text}<span class="timer-reset-time"> &middot; ${resetTime}</span>` : text);

    card.innerHTML = `
      <div class="casino-name">${casino.name}</div>
      <div class="casino-balance">${formatBalance(casino.balance)}</div>
      <div class="casino-updated">${updated}</div>
      <div class="casino-timer" style="color:${ready ? 'var(--green)' : ''}">${timerLine}</div>
    `;

    card.addEventListener('click', () => openDetailPage(casino));
    grid.appendChild(card);
  });

  totalEl.textContent = formatBalance(total);
  countEl.textContent = `${userCasinos.length} casino${userCasinos.length !== 1 ? 's' : ''} tracked`;
}

// ── Timer helpers ─────────────────────────────────────────────────────────────
function getTimerInfo(casino) {
  const resetVal = parseInt(casino.reset_hours) || 24;

  // ── Type 3: Daily reset time (encoded as 10000 + minutes-from-midnight) ──
  if (resetVal >= 10000) {
    const minsFromMidnight = resetVal - 10000;
    const resetHour = Math.floor(minsFromMidnight / 60);
    const resetMin  = minsFromMidnight % 60;

    const now = new Date();
    const nextReset = new Date();
    nextReset.setHours(resetHour, resetMin, 0, 0);
    if (nextReset <= now) nextReset.setDate(nextReset.getDate() + 1);

    const resetTimeStr = nextReset.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    if (casino.last_claimed_at) {
      const prevReset = new Date(nextReset);
      prevReset.setDate(prevReset.getDate() - 1);
      if (new Date(casino.last_claimed_at) >= prevReset) {
        // Already claimed this reset window - show countdown to next
        const remaining = nextReset - now;
        const h = Math.floor(remaining / 3600000);
        const m = Math.floor((remaining % 3600000) / 60000);
        return { ready: false, text: h > 0 ? `${h}h ${m}m` : `${m}m`, resetTime: resetTimeStr };
      }
    }
    return { ready: true, text: '✓ Ready', resetTime: resetTimeStr };
  }

  // ── Types 1 & 2: Interval reset (6 hr or 24 hr from last claim) ──
  if (!casino.last_claimed_at) return { ready: true, text: '✓ Ready', resetTime: null };
  const claimedAt = new Date(casino.last_claimed_at).getTime();
  const resetAt   = claimedAt + resetVal * 3600 * 1000;
  const remaining = resetAt - Date.now();
  if (remaining <= 0) return { ready: true, text: '✓ Ready', resetTime: null };
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const resetTimeStr = new Date(resetAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return { ready: false, text: h > 0 ? `${h}h ${m}m` : `${m}m`, resetTime: resetTimeStr };
}

function startTimerLoop() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    // Refresh card timers without full re-render
    document.querySelectorAll('.casino-card[data-id]').forEach(card => {
      const casino = userCasinos.find(c => String(c.id) === card.dataset.id);
      if (!casino) return;
      const { ready, text, resetTime } = getTimerInfo(casino);
      const timerEl = card.querySelector('.casino-timer');
      if (timerEl) {
        timerEl.innerHTML = ready
          ? text
          : (resetTime ? `${text}<span class="timer-reset-time"> &middot; ${resetTime}</span>` : text);
        timerEl.style.color = ready ? 'var(--green)' : '';
      }
      card.classList.toggle('bonus-ready', ready);
    });
    // If detail page is open, refresh its bonus status too
    if (activeCasino) updateDetailBonusStatus(activeCasino);
  }, 30000); // every 30 seconds
}

function updateDetailBonusStatus(casino) {
  const { ready, text, resetTime } = getTimerInfo(casino);
  const statusEl = document.getElementById('detail-bonus-status');
  if (statusEl) {
    statusEl.textContent = ready ? '✓ Ready' : text;
    statusEl.className = 'detail-bonus-status' + (ready ? ' ready' : '');
  }
  const resetTimeEl = document.getElementById('detail-reset-time-display');
  if (resetTimeEl) {
    if (!ready && resetTime) {
      resetTimeEl.textContent = `Resets at ${resetTime}`;
      resetTimeEl.style.display = 'block';
    } else {
      resetTimeEl.style.display = 'none';
    }
  }
  const claimBtn = document.getElementById('detail-claim-btn');
  if (claimBtn) claimBtn.disabled = !ready;
}

function formatBalance(val) {
  const n = parseFloat(val) || 0;
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

// ── Detail Page ───────────────────────────────────────────────────────────────
function openDetailPage(casino) {
  activeCasino = casino;
  const siteUrl = `https://${casino.domain}`;

  // Header
  document.getElementById('detail-casino-name').textContent = casino.name;
  document.getElementById('detail-open-site').href = siteUrl;

  // Hero
  document.getElementById('detail-hero-name').textContent = casino.name;
  document.getElementById('detail-hero-domain').textContent = casino.domain;
  document.getElementById('detail-open-site-btn').href = siteUrl;
  
  // Custom Protocol Deep Link
  const triggerOverlay = () => {
    const iframe = document.createElement('iframe');
    iframe.src = `casinotracker://open?casinoId=${casino.id}`;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    setTimeout(() => iframe.remove(), 1000);
  };
  
  document.getElementById('detail-open-site').onclick = triggerOverlay;
  document.getElementById('detail-open-site-btn').onclick = triggerOverlay;

  // Balance card
  document.getElementById('detail-balance-amount').textContent = formatBalance(casino.balance);
  document.getElementById('detail-balance-updated').textContent =
    casino.updated_at ? 'Updated ' + timeAgo(new Date(casino.updated_at)) : 'never updated';

  // Bonus section - decode stored reset_hours back to the right select/time input
  const resetSelect = document.getElementById('detail-reset-hours');
  const dailyWrap   = document.getElementById('daily-reset-time-wrap');
  const dailyInput  = document.getElementById('daily-reset-time');
  const resetVal    = parseInt(casino.reset_hours) || 24;

  if (resetVal >= 10000) {
    // Daily reset time mode
    resetSelect.value = 'daily';
    dailyWrap.style.display = 'flex';
    const mins = resetVal - 10000;
    const hh   = String(Math.floor(mins / 60)).padStart(2, '0');
    const mm   = String(mins % 60).padStart(2, '0');
    dailyInput.value = `${hh}:${mm}`;
  } else {
    resetSelect.value = String(resetVal === 6 ? 6 : 24);
    dailyWrap.style.display = 'none';
    dailyInput.value = '';
  }
  updateDetailBonusStatus(casino);

  // Reset to Overview tab
  document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.detail-tab[data-tab="overview"]').classList.add('active');
  document.getElementById('tab-overview').style.display = 'block';
  document.getElementById('tab-records').style.display  = 'none';

  // Notes field
  document.getElementById('casino-notes').value = casino.notes || '';

  // Hide app screen, show detail screen
  document.getElementById('app-screen').classList.remove('active');
  document.getElementById('detail-screen').classList.add('active');
}

function closeDetailPage() {
  document.getElementById('detail-screen').classList.remove('active');
  document.getElementById('app-screen').classList.add('active');
  activeCasino = null;
  // Always reload from DB so the main screen is never stale
  loadCasinos();
}

document.getElementById('detail-back-btn').addEventListener('click', closeDetailPage);

document.getElementById('detail-claim-btn').addEventListener('click', async () => {
  if (!activeCasino) return;
  const val = document.getElementById('detail-reset-hours').value;
  let resetHours;
  if (val === 'daily') {
    const timeVal = document.getElementById('daily-reset-time').value;
    if (timeVal) {
      const [hh, mm] = timeVal.split(':').map(Number);
      resetHours = 10000 + hh * 60 + mm;
    } else {
      resetHours = activeCasino.reset_hours || 24;
    }
  } else {
    resetHours = parseInt(val) || 24;
  }
  const now = new Date().toISOString();

  // Optimistically update UI first so the user sees instant feedback
  const casino = userCasinos.find(c => c.id === activeCasino.id);
  if (casino) { casino.last_claimed_at = now; casino.reset_hours = resetHours; }
  activeCasino.last_claimed_at = now;
  activeCasino.reset_hours = resetHours;
  updateDetailBonusStatus(activeCasino);
  renderCasinos();

  // Then persist to DB and log any errors
  const { error } = await sb.from('casinos').update({
    last_claimed_at: now,
    reset_hours: resetHours
  }).eq('id', activeCasino.id).eq('user_id', currentUser.id);

  if (error) {
    console.error('Claim update failed:', error);
    // Revert local state if save failed
    if (casino) { casino.last_claimed_at = null; casino.reset_hours = resetHours; }
    activeCasino.last_claimed_at = null;
    updateDetailBonusStatus(activeCasino);
    renderCasinos();
  }
});

document.getElementById('detail-reset-hours').addEventListener('change', async () => {
  if (!activeCasino) return;
  const val      = document.getElementById('detail-reset-hours').value;
  const dailyWrap = document.getElementById('daily-reset-time-wrap');

  if (val === 'daily') {
    // Show the time picker - don't save yet, wait for user to pick a time
    dailyWrap.style.display = 'flex';
    return;
  }

  dailyWrap.style.display = 'none';
  const resetHours = parseInt(val) || 24;
  await sb.from('casinos').update({ reset_hours: resetHours })
    .eq('id', activeCasino.id).eq('user_id', currentUser.id);
  const casino = userCasinos.find(c => c.id === activeCasino.id);
  if (casino) casino.reset_hours = resetHours;
  activeCasino.reset_hours = resetHours;
  updateDetailBonusStatus(activeCasino);
  renderCasinos();
});

document.getElementById('daily-reset-time').addEventListener('change', async () => {
  if (!activeCasino) return;
  const timeVal = document.getElementById('daily-reset-time').value; // "HH:MM"
  if (!timeVal) return;
  const [hh, mm]   = timeVal.split(':').map(Number);
  const resetHours = 10000 + hh * 60 + mm; // encoded daily reset time
  await sb.from('casinos').update({ reset_hours: resetHours })
    .eq('id', activeCasino.id).eq('user_id', currentUser.id);
  const casino = userCasinos.find(c => c.id === activeCasino.id);
  if (casino) casino.reset_hours = resetHours;
  activeCasino.reset_hours = resetHours;
  updateDetailBonusStatus(activeCasino);
  renderCasinos();
});

document.getElementById('detail-edit-balance-btn').addEventListener('click', () => {
  if (activeCasino) openEditModal(activeCasino);
});

document.getElementById('detail-remove-btn').addEventListener('click', async () => {
  if (!activeCasino) return;
  if (!confirm(`Remove ${activeCasino.name}?`)) return;
  await removeCasino(activeCasino.id);
  userCasinos = userCasinos.filter(c => c.id !== activeCasino.id);
  renderCasinos();
  closeDetailPage();
});

// ── Add Casino Modal ──────────────────────────────────────────────────────────
function populateCasinoSelect() {
  const select = document.getElementById('casino-select');
  select.innerHTML = '<option value="">-- Choose a casino --</option>';
  const addedDomains = new Set(userCasinos.map(c => c.domain));
  Object.entries(SITE_CONFIG)
    .filter(([domain]) => !addedDomains.has(domain))
    .sort((a, b) => a[1].name.localeCompare(b[1].name))
    .forEach(([domain, config]) => {
      const opt = document.createElement('option');
      opt.value = domain;
      opt.textContent = config.name;
      select.appendChild(opt);
    });
}

function openAddModal() {
  populateCasinoSelect();
  document.getElementById('casino-balance').value = '';
  document.getElementById('add-modal').classList.add('open');
}

function closeAddModal() {
  document.getElementById('add-modal').classList.remove('open');
}

document.getElementById('add-casino-btn').addEventListener('click', openAddModal);
document.getElementById('empty-add-btn').addEventListener('click', openAddModal);
document.getElementById('close-add-modal').addEventListener('click', closeAddModal);
document.getElementById('add-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeAddModal();
});

document.getElementById('confirm-add-casino').addEventListener('click', async () => {
  const domain = document.getElementById('casino-select').value;
  const balance = document.getElementById('casino-balance').value;
  if (!domain) return;
  const config = SITE_CONFIG[domain];
  const casino = await addCasinoToDB(domain, config.name, balance || 0);
  if (casino) {
    userCasinos.push(casino);
    renderCasinos();
  }
  closeAddModal();
});

// ── Edit Balance Modal ────────────────────────────────────────────────────────
function openEditModal(casino) {
  editingCasinoId = casino.id;
  document.getElementById('edit-modal-title').textContent = casino.name;
  document.getElementById('edit-balance').value = casino.balance;
  document.getElementById('edit-modal').classList.add('open');
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.remove('open');
  editingCasinoId = null;
}

document.getElementById('close-edit-modal').addEventListener('click', closeEditModal);
document.getElementById('edit-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeEditModal();
});

document.getElementById('confirm-edit-balance').addEventListener('click', async () => {
  const balance = document.getElementById('edit-balance').value;
  if (editingCasinoId === null) return;
  // Save id before closeEditModal() nulls it out
  const savedId = editingCasinoId;
  await updateBalance(savedId, balance);
  const casino = userCasinos.find(c => c.id === savedId);
  if (casino) {
    casino.balance = parseFloat(balance) || 0;
    casino.updated_at = new Date().toISOString();
  }
  renderCasinos();
  closeEditModal();
  // Refresh detail page if it's open for this casino
  if (activeCasino && activeCasino.id === savedId && casino) {
    activeCasino.balance = casino.balance;
    activeCasino.updated_at = casino.updated_at;
    document.getElementById('detail-balance-amount').textContent = formatBalance(casino.balance);
    document.getElementById('detail-balance-updated').textContent = 'Updated just now';
  }
});

document.getElementById('remove-casino-btn').addEventListener('click', async () => {
  if (editingCasinoId === null) return;
  if (!confirm('Remove this casino?')) return;
  await removeCasino(editingCasinoId);
  userCasinos = userCasinos.filter(c => c.id !== editingCasinoId);
  renderCasinos();
  closeEditModal();
});

// Realtime updates
function subscribeToUpdates() {
  if (!currentUser) return;
  unsubscribeFromUpdates();
  casinosChannel = sb.channel(`casinos-changes-${currentUser.id}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'casinos',
      filter: `user_id=eq.${currentUser.id}`
    }, () => {
      loadCasinos();
    })
    .subscribe();
}

function unsubscribeFromUpdates() {
  if (!casinosChannel) return;
  sb.removeChannel(casinosChannel);
  casinosChannel = null;
}

// ── Start ─────────────────────────────────────────────────────────────────────
init();
