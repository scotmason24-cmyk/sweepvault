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

  let total = 0;
  userCasinos.forEach(casino => {
    total += parseFloat(casino.balance) || 0;
    const card = document.createElement('div');
    card.className = 'casino-card';
    card.dataset.id = casino.id;

    const updated = casino.updated_at
      ? timeAgo(new Date(casino.updated_at))
      : 'never';

    card.innerHTML = `
      <div class="casino-name">${casino.name}</div>
      <div class="casino-balance">${formatBalance(casino.balance)}</div>
      <div class="casino-updated">${updated}</div>
    `;

    card.addEventListener('click', () => openEditModal(casino));
    grid.appendChild(card);
  });

  totalEl.textContent = formatBalance(total);
  countEl.textContent = `${userCasinos.length} casino${userCasinos.length !== 1 ? 's' : ''} tracked`;
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
  await updateBalance(editingCasinoId, balance);
  const casino = userCasinos.find(c => c.id === editingCasinoId);
  if (casino) {
    casino.balance = parseFloat(balance) || 0;
    casino.updated_at = new Date().toISOString();
  }
  renderCasinos();
  closeEditModal();
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
  const code = `javascript:(function(){var SITE_CONFIG=${JSON.stringify(SITE_CONFIG)};var appUrl="${appUrl}";var h=window.location.hostname;var domain=Object.keys(SITE_CONFIG).find(function(d){return h.includes(d)});if(!domain){alert('SweepVault: This site is not supported.');return;}var cfg=SITE_CONFIG[domain];var el=null;var selectors=document.querySelectorAll(cfg.selector);if(selectors.length>1){el=Array.from(selectors).find(function(e){var t=String(e.textContent||'');return t.toUpperCase().includes('SC')&&/\\d/.test(t);})||Array.from(selectors).find(function(e){return/\\d/.test(String(e.textContent||''));});}else if(selectors.length===1){el=selectors[0];}if(!el&&cfg.selector.includes('aria-label')){var ae=document.querySelector(cfg.selector);if(ae){var av=ae.getAttribute('aria-label');if(av&&/\\d/.test(av))el={textContent:av};}}if(!el){alert('SweepVault: Could not find balance on '+cfg.name+'. Make sure you are logged in.');return;}var raw=String(el.textContent||'').trim().replace(/[kM]/g,'');var clean=raw.replace(/,/g,'');var matches=clean.match(/\\d+(\\.\\d+)?/g);var bal='0';if(matches){var dec=matches.find(function(m){return m.includes('.');});bal=dec||matches[0];}if(h.includes('fortunecoins.com')){bal=(parseFloat(bal)/100).toFixed(2);}function doSync(accessToken){fetch('https://wqkihxadcxmxgicixlww.supabase.co/rest/v1/rpc/sync_balance',{method:'POST',headers:{'Content-Type':'application/json','apikey':'sb_publishable_vgt7oNKoGwJyDsCvVmYMXw_Y3APibq4','Authorization':'Bearer '+accessToken},body:JSON.stringify({p_domain:domain,p_balance:parseFloat(bal)})}).then(function(r){if(r.ok){var d=document.createElement('div');d.style.cssText='position:fixed;top:20px;right:20px;background:#1a1a2e;border:2px solid #FFD700;color:#FFD700;padding:12px 20px;border-radius:10px;font-family:monospace;font-size:14px;z-index:999999;';d.textContent='\\u2713 SweepVault: '+cfg.name+' synced ('+bal+' SC)';document.body.appendChild(d);setTimeout(function(){d.remove();},3000);}else{alert('SweepVault: Sync failed ('+r.status+'). Please try again.');}}).catch(function(){alert('SweepVault: Network error.');});}var svWin=window.open(appUrl,'sweepvault_token','width=1,height=1,top=-100,left=-100');var timeout=setTimeout(function(){if(svWin)svWin.close();alert('SweepVault: Could not get token. Make sure you are signed in at '+appUrl);},8000);window.addEventListener('message',function handler(ev){if(ev.data&&ev.data.type==='SWEEPVAULT_TOKEN_RESPONSE'){clearTimeout(timeout);if(svWin)svWin.close();window.removeEventListener('message',handler);doSync(ev.data.access_token);}});var pollCount=0;var poll=setInterval(function(){pollCount++;if(pollCount>40){clearInterval(poll);return;}try{if(svWin&&svWin.document&&svWin.document.readyState==='complete'){clearInterval(poll);svWin.postMessage({type:'SWEEPVAULT_TOKEN_REQUEST'},appUrl);}}catch(e){}},100);})();`;
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