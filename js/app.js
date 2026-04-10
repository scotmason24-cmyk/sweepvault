// ── Site config (all your casinos) ──────────────────────────────────────────
const SITE_CONFIG = {
  "fortunecoins.com":      { name: "Fortune Coins",    selector: ".FCButtonItem.FCoins div.textDecimals.mobile span" },
  "megabonanza.com":       { name: "Mega Bonanza",      selector: "span[class*='currencyValue'][style*='width']" },
  "rolla.com":             { name: "Rolla",             selector: "div.ring-sweep-400:has(img[alt='RSC coin icon']) span" },
  "rollingriches.com":     { name: "Rolling Riches",    selector: "div.sc-coin.active span:not(.coin-amount)" },
  "modo.us":               { name: "Modo",              selector: "button[data-testid='sc-button'] p span" },
  "rebet.app":             { name: "Rebet",             selector: ".MuiBox-root:has(img[src*='sc-icon']) span.MuiTypography-root" },
  "chanced.com":           { name: "Chanced",           selector: "header button:has(img[src*='cash']) span" },
  "goldenheartsgames.com": { name: "Golden Hearts",     selector: "button[data-testid='current-currency-balance-info']" },
  "shuffle.us":            { name: "Shuffle",           selector: "button#SC" },
  "globalpoker.com":       { name: "Global Poker",      selector: "div#sc-balance-display" },
  "punt.com":              { name: "Punt",              selector: ".shrink.truncate" },
  "playfame.com":          { name: "PlayFame",          selector: "span:has(> span[class*='currencyName'])" },
  "luckparty.com":         { name: "Luckparty",         selector: ".sc-part" },
  "sportzino.com":         { name: "Sportzino",         selector: ".balance-switcher-button-fc" },
  "clubs.poker":           { name: "Clubs Poker",       selector: ".SwitchCurrenciesContainer__currency_balance" },
  "high5casino.com":       { name: "High5",             selector: ".sweeps-balance.sc .sweeps-balance-label-amount" },
  "yaycasino.com":         { name: "Yay Casino",        selector: ".FCButtonItem.FCoins" },
  "americanluck.com":      { name: "American Luck",     selector: ".balance-switch__value-button--sc" },
  "zulacasino.com":        { name: "Zula",              selector: ".FCButtonItem.FCoins" },
  "moozi.com":             { name: "Moozi",             selector: "#silver-coin-trigger span" },
  "moonspin.us":           { name: "Moonspin",          selector: "button:has(img[src*='sweep-coin'])" },
  "lonestarcasino.com":    { name: "LoneStar",          selector: ".gcnum .gct" },
  "realprize.com":         { name: "RealPrize",         selector: "div.gcnum span.gct" },
  "crowncoinscasino.com":  { name: "CrownCoins",        selector: "[data-testid='lobby-balance-bar']" },
  "pulsz.com":             { name: "Pulsz",             selector: "[data-test='header-sweepstakes-value']" },
  "wowvegas.com":          { name: "WOW Vegas",         selector: "button[id^='headlessui-menu-button'] div.flex-none" },
  "chumbacasino.com":      { name: "Chumba Casino",     selector: "#top-hud__currency-bar__sweeps-currency-amount span.counter__value" },
  "sidepot.us":            { name: "Sidepot",           selector: "button:has(img[src*='sweep-coin'])" },
  "spree.com":             { name: "Spree",             selector: "number-flow-react[aria-label]" },
  "spinpals.com":          { name: "SpinPals",          selector: "div.border-deepPurple-300 p.text-white" },
  "stake.us":              { name: "Stake",             selector: "span.ds-body-md-strong[style*='max-width: 16ch']" },
  "spinquest.com":         { name: "SpinQuest",         selector: "p[data-sentry-source-file='amounts.tsx']" },
  "coinz.us":              { name: "Coinz",             selector: "#player-balance-value" },
  "legendz.com":           { name: "Legendz",           selector: "div[class*='eyrgspp0']" },
  "dogghousecasino.com":   { name: "Dogghouse",         selector: ".MuiBox-root:has(img[src*='sc-icon']) span.MuiTypography-root" },
  "chipnwin.com":          { name: "ChipnWin",          selector: ".nav-bar-header__top div.flex_center_between.background_282D44.pointer" },
  "sweetsweeps.com":       { name: "SweetSweeps",       selector: ".MuiBox-root:has(img[src*='sc-icon.png']) > span.MuiTypography-root" },
  "lunalandcasino.com":    { name: "LunaLand",          selector: "span#balance-sc-coin" },
  "myprize.us":            { name: "MyPrize",           selector: ".active-currency-section .amount" },
  "ace.com":               { name: "Ace",               selector: "[data-test='sc-balance'] span[class*='currencyValue']" },
  "goldmachine.com":       { name: "Gold Machine",      selector: "button:has(span[class*='tabular-nums'])" },
  "spindoo.us":            { name: "Spindoo",           selector: "div[data-test='sc-balance'] span" },
  "jackpota.com":          { name: "Jackpota",          selector: "div:has(img[alt='SC icon']):has(button[aria-label='Info']) span" },
  "mcluck.com":            { name: "McLuck",            selector: "span[data-test='common-header-sc-value']" },
  "hellomillions.com":     { name: "Hello Millions",    selector: "div[data-test='sc-balance'] span" },
  "spinblitz.com":         { name: "SpinBlitz",         selector: "span[data-test='sc-balance-value']" },
  "zoot.us":               { name: "Zoot",              selector: "span.chakra-text" },
  "sheeshcasino.com":      { name: "Sheesh",            selector: "div:has(img[src*='sc-icon']) span.text-lime-500" },
  "sweepjungle.com":       { name: "SweepJungle",       selector: "p.font-lilita" },
  "cashoomo.com":          { name: "Cashoomo",          selector: "span.coins__balance" },
  "vegawin.com":           { name: "Vegawin",           selector: "span.sidebar-balance:has(img[alt='Silver'])" },
  "sweepsusa.com":         { name: "Sweep USA",         selector: "div:has(img[src*='notes.svg']) span" },
  "luckyhands.com":        { name: "LuckyHands",        selector: "span[style*='--accent-acid']" },
  "epicsweep.us":          { name: "Epic Sweeps",       selector: "span.text-primary.font-bold" },
  "sixty6.com":            { name: "Sixty6",            selector: "p.font-lato.text-neutral-100" },
  "luckyone.us":           { name: "Luckyone",          selector: "span.text-shade-10.font-extrabold" },
  "luckystake.com":        { name: "Lucky Stake",       selector: "WAITING_FOR_SELECTOR" },
  "babacasino.com":        { name: "Baba Casino",       selector: "" },
  "daracasino.com":        { name: "Dara Casino",       selector: "" },
  "luckylandslots.com":    { name: "LuckyLand Slots",   selector: "" },
  "luckylandcasino.com":   { name: "LuckyLand Casino",  selector: "" },
};

// ── App state ────────────────────────────────────────────────────────────────
let currentUser = null;
let userCasinos = [];
let editingCasinoId = null;
let activeCasino = null;       // casino object currently shown in detail view

// ── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    currentUser = session.user;
    showApp();
  } else {
    showAuth();
  }

  sb.auth.onAuthStateChange((_event, session) => {
    if (session) {
      currentUser = session.user;
      showApp();
    } else {
      currentUser = null;
      showAuth();
    }
  });
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

let isLogin = true;

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
      : (resetTime ? `${text}<span class="timer-reset-time"> · ${resetTime}</span>` : text);

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
        // Already claimed this reset window — show countdown to next
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

let timerInterval = null;

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
          : (resetTime ? `${text}<span class="timer-reset-time"> · ${resetTime}</span>` : text);
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

  // Balance card
  document.getElementById('detail-balance-amount').textContent = formatBalance(casino.balance);
  document.getElementById('detail-balance-updated').textContent =
    casino.updated_at ? 'Updated ' + timeAgo(new Date(casino.updated_at)) : 'never updated';

  // Bonus section — decode stored reset_hours back to the right select/time input
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
    // Show the time picker — don't save yet, wait for user to pick a time
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

// ── Bookmarklet Modal ─────────────────────────────────────────────────────────
function buildBookmarklet() {
  const appUrl = window.location.origin + window.location.pathname;
  // Minified bookmarklet code
  const code = `javascript:(function(){var SITE_CONFIG=${JSON.stringify(SITE_CONFIG)};var appUrl="${appUrl}";var h=window.location.hostname;var domain=Object.keys(SITE_CONFIG).find(function(d){return h.includes(d)});if(!domain){alert('SweepVault: This site is not supported.');return;}var cfg=SITE_CONFIG[domain];var el=null;var selectors=document.querySelectorAll(cfg.selector);if(selectors.length>1){el=Array.from(selectors).find(function(e){var t=String(e.textContent||'');return t.toUpperCase().includes('SC')&&/\\d/.test(t);})||Array.from(selectors).find(function(e){return/\\d/.test(String(e.textContent||''));});}else if(selectors.length===1){el=selectors[0];}if(!el&&cfg.selector.includes('aria-label')){var ae=document.querySelector(cfg.selector);if(ae){var av=ae.getAttribute('aria-label');if(av&&/\\d/.test(av))el={textContent:av};}}if(!el){alert('SweepVault: Could not find balance on '+cfg.name+'. Make sure you are logged in.');return;}var raw=String(el.textContent||'').trim().replace(/[kM]/g,'');var clean=raw.replace(/,/g,'');var matches=clean.match(/\\d+(\\.\\d+)?/g);var bal='0';if(matches){var dec=matches.find(function(m){return m.includes('.');});bal=dec||matches[0];}if(h.includes('fortunecoins.com')){bal=(parseFloat(bal)/100).toFixed(2);}function doSync(accessToken){fetch('https://wqkihxadcxmxgicixlww.supabase.co/rest/v1/rpc/sync_balance',{method:'POST',headers:{'Content-Type':'application/json','apikey':'sb_publishable_vgt7oNKoGwJyDsCvVmYMXw_Y3APibq4','Authorization':'Bearer '+accessToken},body:JSON.stringify({p_domain:domain,p_balance:parseFloat(bal)})}).then(function(r){if(r.ok){var d=document.createElement('div');d.style.cssText='position:fixed;top:20px;right:20px;background:#110d1f;border:2px solid #a78bfa;color:#a78bfa;padding:12px 20px;border-radius:10px;font-family:monospace;font-size:14px;z-index:999999;';d.textContent='\\u2713 SweepVault: '+cfg.name+' synced ('+bal+' SC)';document.body.appendChild(d);setTimeout(function(){d.remove();},3000);}else{alert('SweepVault: Sync failed ('+r.status+'). Please try again.');}}).catch(function(){alert('SweepVault: Network error.');});}var svWin=window.open(appUrl,'sweepvault_token','width=1,height=1,top=-100,left=-100');var timeout=setTimeout(function(){if(svWin)svWin.close();alert('SweepVault: Could not get token. Make sure you are signed in at '+appUrl);},8000);window.addEventListener('message',function handler(ev){if(ev.data&&ev.data.type==='SWEEPVAULT_TOKEN_RESPONSE'){clearTimeout(timeout);if(svWin)svWin.close();window.removeEventListener('message',handler);doSync(ev.data.access_token);}});var pollCount=0;var poll=setInterval(function(){pollCount++;if(pollCount>40){clearInterval(poll);return;}try{if(svWin&&svWin.document&&svWin.document.readyState==='complete'){clearInterval(poll);svWin.postMessage({type:'SWEEPVAULT_TOKEN_REQUEST'},appUrl);}}catch(e){}},100);})();`;
  return code;
}

document.getElementById('bookmarklet-btn').addEventListener('click', () => {
  document.getElementById('bookmarklet-modal').classList.add('open');
});

document.getElementById('close-bookmarklet-modal').addEventListener('click', () => {
  document.getElementById('bookmarklet-modal').classList.remove('open');
});

document.getElementById('bookmarklet-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) document.getElementById('bookmarklet-modal').classList.remove('open');
});

document.getElementById('copy-bookmarklet-btn').addEventListener('click', async () => {
  const code = buildBookmarklet();
  try {
    await navigator.clipboard.writeText(code);
  } catch {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = code;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  const confirm = document.getElementById('copy-confirm');
  confirm.style.display = 'block';
  setTimeout(() => { confirm.style.display = 'none'; }, 3000);
});

// ── Cross-domain token bridge ─────────────────────────────────────────────────
// If opened by a bookmarklet, send token to opener and close immediately.
async function checkTokenBridge() {
  if (!window.opener) return false;
  const { data: { session } } = await sb.auth.getSession();
  window.opener.postMessage({
    type: 'SWEEPVAULT_TOKEN_RESPONSE',
    access_token: session ? session.access_token : null
  }, '*');
  setTimeout(() => window.close(), 200);
  return true;
}

// ── Realtime ──────────────────────────────────────────────────────────────────
function subscribeToUpdates() {
  if (!currentUser) return;
  sb.channel('casinos-changes')
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

// ── My Records Tab ───────────────────────────────────────────────────────────
let casinoLogEntries = [];
let notesDebounceTimer = null;

async function loadCasinoLog(casinoId) {
  const { data, error } = await sb
    .from('casino_log')
    .select('*')
    .eq('casino_id', casinoId)
    .eq('user_id', currentUser.id)
    .order('entry_date', { ascending: false });
  if (error) { console.error(error); return; }
  casinoLogEntries = data || [];
  renderLogEntries();
}

function renderLogEntries() {
  renderSnapshots(casinoLogEntries.filter(e => e.entry_type === 'snapshot'));
  renderDailyBonuses(casinoLogEntries.filter(e => e.entry_type === 'daily_bonus'));
  renderRedemptions(casinoLogEntries.filter(e => e.entry_type === 'redemption'));
  renderPurchases(casinoLogEntries.filter(e => e.entry_type === 'purchase'));
}

function formatEntryDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderSnapshots(entries) {
  const list = document.getElementById('snapshots-list');
  if (!list) return;
  if (entries.length === 0) {
    list.innerHTML = '<div class="entries-empty">No scanner snapshots yet</div>';
    return;
  }
  list.innerHTML = `
    ${entries.map(e => `
      <div class="entry-item">
        <div class="entry-main">
          <span class="entry-amount">$${parseFloat(e.amount || 0).toFixed(2)}</span>
          <span class="entry-date">${formatEntryDate(e.entry_date)}</span>
        </div>
        <button class="entry-delete" data-id="${e.id}">✕</button>
      </div>
    `).join('')}
  `;
  list.querySelectorAll('.entry-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteLogEntry(btn.dataset.id));
  });
}

function renderDailyBonuses(entries) {
  const list = document.getElementById('daily-bonuses-list');
  if (!list) return;
  if (entries.length === 0) {
    list.innerHTML = '<div class="entries-empty">No daily bonuses logged</div>';
    return;
  }
  const total = entries.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  list.innerHTML = `
    <div class="entries-total">Total Collected: $${total.toFixed(2)}</div>
    ${entries.map(e => `
      <div class="entry-item">
        <div class="entry-main">
          <span class="entry-amount" style="color:var(--accent)">$${parseFloat(e.amount || 0).toFixed(2)}</span>
          <span class="entry-date">${formatEntryDate(e.entry_date)}</span>
        </div>
        <button class="entry-delete" data-id="${e.id}">✕</button>
      </div>
    `).join('')}
  `;
  list.querySelectorAll('.entry-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteLogEntry(btn.dataset.id));
  });
}

function renderRedemptions(entries) {
  const list = document.getElementById('redemptions-list');
  if (!list) return;
  if (entries.length === 0) {
    list.innerHTML = '<div class="entries-empty">No redemptions logged yet</div>';
    return;
  }
  const total = entries.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  list.innerHTML = `
    <div class="entries-total">Total paid out: $${total.toFixed(2)}</div>
    ${entries.map(e => `
      <div class="entry-item">
        <div class="entry-main">
          <span class="entry-amount">$${parseFloat(e.amount || 0).toFixed(2)}</span>
          <span class="entry-date">${formatEntryDate(e.entry_date)}</span>
        </div>
        ${e.notes ? `<div class="entry-notes">${e.notes}</div>` : ''}
        <button class="entry-delete" data-id="${e.id}">✕</button>
      </div>
    `).join('')}
  `;
  list.querySelectorAll('.entry-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteLogEntry(btn.dataset.id));
  });
}

function renderPurchases(entries) {
  const list = document.getElementById('purchases-list');
  if (!list) return;
  if (entries.length === 0) {
    list.innerHTML = '<div class="entries-empty">No purchases logged yet</div>';
    return;
  }
  const totalSC    = entries.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const totalSpent = entries.reduce((sum, e) => sum + (parseFloat(e.money_spent) || 0), 0);
  list.innerHTML = `
    <div class="entries-total">${totalSC.toFixed(2)} SC acquired · $${totalSpent.toFixed(2)} spent</div>
    ${entries.map(e => `
      <div class="entry-item">
        <div class="entry-main">
          <span class="entry-amount">${parseFloat(e.amount || 0).toFixed(2)} SC</span>
          <span class="entry-cost">$${parseFloat(e.money_spent || 0).toFixed(2)}</span>
          <span class="entry-date">${formatEntryDate(e.entry_date)}</span>
        </div>
        <button class="entry-delete" data-id="${e.id}">✕</button>
      </div>
    `).join('')}
  `;
  list.querySelectorAll('.entry-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteLogEntry(btn.dataset.id));
  });
}

async function deleteLogEntry(id) {
  if (!confirm('Delete this entry?')) return;
  const { error } = await sb.from('casino_log').delete().eq('id', id).eq('user_id', currentUser.id);
  if (error) { console.error(error); return; }
  casinoLogEntries = casinoLogEntries.filter(e => e.id !== id);
  renderLogEntries();
}

// Tab switching
document.querySelectorAll('.detail-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const tabName = tab.dataset.tab;
    document.getElementById('tab-overview').style.display = tabName === 'overview' ? 'block' : 'none';
    document.getElementById('tab-records').style.display  = tabName === 'records'  ? 'block' : 'none';
    if (tabName === 'records' && activeCasino) loadCasinoLog(activeCasino.id);
  });
});

// Notes — auto-save 800ms after user stops typing
document.getElementById('casino-notes').addEventListener('input', () => {
  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(async () => {
    if (!activeCasino) return;
    const notes = document.getElementById('casino-notes').value;
    await sb.from('casinos').update({ notes }).eq('id', activeCasino.id).eq('user_id', currentUser.id);
    const casino = userCasinos.find(c => c.id === activeCasino.id);
    if (casino) casino.notes = notes;
    activeCasino.notes = notes;
  }, 800);
});

// Add Redemption
document.getElementById('add-redemption-btn').addEventListener('click', () => {
  document.getElementById('redemption-date').value   = new Date().toISOString().split('T')[0];
  document.getElementById('redemption-amount').value = '';
  document.getElementById('redemption-notes').value  = '';
  document.getElementById('add-redemption-modal').classList.add('open');
});
document.getElementById('close-redemption-modal').addEventListener('click', () => {
  document.getElementById('add-redemption-modal').classList.remove('open');
});
document.getElementById('add-redemption-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) document.getElementById('add-redemption-modal').classList.remove('open');
});
document.getElementById('confirm-add-redemption').addEventListener('click', async () => {
  if (!activeCasino) return;
  const date   = document.getElementById('redemption-date').value;
  const amount = document.getElementById('redemption-amount').value;
  const notes  = document.getElementById('redemption-notes').value.trim();
  if (!date || !amount) return;
  const { data, error } = await sb.from('casino_log').insert({
    user_id: currentUser.id, casino_id: activeCasino.id,
    entry_type: 'redemption', amount: parseFloat(amount),
    notes: notes || null, entry_date: date
  }).select().single();
  if (error) { console.error(error); return; }
  casinoLogEntries.unshift(data);
  renderLogEntries();
  document.getElementById('add-redemption-modal').classList.remove('open');
});

// Add Purchase
document.getElementById('add-purchase-btn').addEventListener('click', () => {
  document.getElementById('purchase-date').value  = new Date().toISOString().split('T')[0];
  document.getElementById('purchase-sc').value    = '';
  document.getElementById('purchase-money').value = '';
  document.getElementById('add-purchase-modal').classList.add('open');
});
document.getElementById('close-purchase-modal').addEventListener('click', () => {
  document.getElementById('add-purchase-modal').classList.remove('open');
});
document.getElementById('add-purchase-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) document.getElementById('add-purchase-modal').classList.remove('open');
});
document.getElementById('confirm-add-purchase').addEventListener('click', async () => {
  if (!activeCasino) return;
  const date  = document.getElementById('purchase-date').value;
  const sc    = document.getElementById('purchase-sc').value;
  const money = document.getElementById('purchase-money').value;
  if (!date || !sc || !money) return;
  const { data, error } = await sb.from('casino_log').insert({
    user_id: currentUser.id, casino_id: activeCasino.id,
    entry_type: 'purchase', amount: parseFloat(sc),
    money_spent: parseFloat(money), entry_date: date
  }).select().single();
  if (error) { console.error(error); return; }
  casinoLogEntries.unshift(data);
  renderLogEntries();
  document.getElementById('add-purchase-modal').classList.remove('open');
});

// ── Start ─────────────────────────────────────────────────────────────────────
checkTokenBridge().then((isBridge) => {
  if (!isBridge) {
    init().then(() => {
      if (currentUser) subscribeToUpdates();
    });
    sb.auth.onAuthStateChange((_e, session) => {
      if (session && (!currentUser || currentUser.id !== session.user.id)) {
        currentUser = session.user;
        subscribeToUpdates();
      }
    });
  }
});