const PROFILE_STORAGE_KEY = 'sweepvault-template-profiles';
const REQUIRED_GLYPHS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
let profileStore = {};

function createEmptyGlyphStats() {
  return REQUIRED_GLYPHS.reduce((acc, glyph) => {
    acc[glyph] = { sampleCount: 0, trustedCount: 0, lastSeenAt: null };
    return acc;
  }, {});
}

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

function showAuth() {
  document.getElementById('auth-screen').classList.add('active');
  document.getElementById('app-screen').classList.remove('active');
  document.getElementById('detail-screen').classList.remove('active');
}

function showApp() {
  document.getElementById('auth-screen').classList.remove('active');
  document.getElementById('detail-screen').classList.remove('active');
  document.getElementById('app-screen').classList.add('active');
  loadCasinos();
  startTimerLoop();
}

function createDefaultProfile(casino) {
  return {
    schemaVersion: 1,
    casinoId: casino.id,
    domain: casino.domain,
    profileName: casino.name,
    sharedFontGroup: '',
    mode: 'template',
    region: {
      ready: false,
      label: '',
      bounds: null
    },
    learnedGlyphs: [],
    glyphStats: createEmptyGlyphStats(),
    correctionBalance: '',
    correctionNote: '',
    lastConfirmedAt: null,
    completedAt: null,
    calibrationHistory: [],
    sessionStats: {
      confirmedReads: 0,
      manualCorrections: 0
    }
  };
}

function loadProfiles() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    profileStore = raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error('Failed to parse template profiles:', error);
    profileStore = {};
  }
}

function saveProfiles() {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileStore));
}

function getProfileKey(casino) {
  return casino.domain || String(casino.id);
}

function getProfile(casino) {
  const key = getProfileKey(casino);
  if (!profileStore[key]) {
    profileStore[key] = createDefaultProfile(casino);
    saveProfiles();
  }

  const profile = profileStore[key];
  if (!profile.profileName) profile.profileName = casino.name;
  if (!Array.isArray(profile.learnedGlyphs)) profile.learnedGlyphs = [];
  if (!profile.mode) profile.mode = 'template';
  if (!profile.region || typeof profile.region !== 'object') {
    profile.region = { ready: !!profile.regionReady, label: '', bounds: null };
  }
  if (typeof profile.region.ready !== 'boolean') {
    profile.region.ready = false;
  }
  if (!profile.region.label) {
    profile.region.label = '';
  }
  if (!profile.glyphStats || typeof profile.glyphStats !== 'object') {
    profile.glyphStats = createEmptyGlyphStats();
  }
  REQUIRED_GLYPHS.forEach((glyph) => {
    if (!profile.glyphStats[glyph]) {
      profile.glyphStats[glyph] = { sampleCount: 0, trustedCount: 0, lastSeenAt: null };
    }
  });
  if (!Array.isArray(profile.calibrationHistory)) {
    profile.calibrationHistory = [];
  }
  if (!profile.sessionStats || typeof profile.sessionStats !== 'object') {
    profile.sessionStats = { confirmedReads: 0, manualCorrections: 0 };
  }
  delete profile.regionReady;
  return profile;
}

function updateProfile(casino, updates) {
  const key = getProfileKey(casino);
  const current = getProfile(casino);
  profileStore[key] = { ...current, ...updates };
  saveProfiles();
  return profileStore[key];
}

function normalizeGlyphInput(raw) {
  const filtered = (raw || '')
    .split('')
    .filter((glyph) => REQUIRED_GLYPHS.includes(glyph));

  return [...new Set(filtered)].sort((a, b) => REQUIRED_GLYPHS.indexOf(a) - REQUIRED_GLYPHS.indexOf(b));
}

function getProfileCoverage(profile) {
  const learned = normalizeGlyphInput((profile.learnedGlyphs || []).join(''));
  const missing = REQUIRED_GLYPHS.filter((glyph) => !learned.includes(glyph));
  const percent = Math.round((learned.length / REQUIRED_GLYPHS.length) * 100);
  return { learned, missing, percent };
}

function getProfileStatus(profile) {
  const { learned, missing } = getProfileCoverage(profile);

  if (!profile.region.ready && learned.length === 0) {
    return { label: 'Needs setup', tone: 'muted' };
  }

  if (profile.region.ready && missing.length === 0) {
    return { label: 'Ready', tone: 'ready' };
  }

  if (profile.region.ready || learned.length > 0) {
    return { label: 'Training', tone: 'progress' };
  }

  return { label: 'Manual', tone: 'muted' };
}

function getRecognitionModeLabel(profile) {
  return profile.mode === 'manual' ? 'Manual' : 'Template';
}

function getTotalSamples(profile) {
  return REQUIRED_GLYPHS.reduce((sum, glyph) => sum + (profile.glyphStats[glyph]?.sampleCount || 0), 0);
}

function getWeakGlyphs(profile) {
  return REQUIRED_GLYPHS.filter((glyph) => (profile.glyphStats[glyph]?.sampleCount || 0) < 2);
}

function getTrainingChecklist(profile) {
  const coverage = getProfileCoverage(profile);
  const weakGlyphs = getWeakGlyphs(profile);
  const tasks = [];

  if (!profile.region.ready) {
    tasks.push({
      done: false,
      title: 'Lock the capture region',
      detail: 'Save the SC balance rectangle in the scanner app, then mark the region ready here.'
    });
  } else {
    tasks.push({
      done: true,
      title: 'Capture region locked',
      detail: profile.region.label ? `Region label: ${profile.region.label}` : 'Region is marked ready.'
    });
  }

  if (coverage.missing.length) {
    tasks.push({
      done: false,
      title: 'Collect the missing glyphs',
      detail: `Still missing: ${coverage.missing.map((glyph) => (glyph === '.' ? 'dot' : glyph)).join(', ')}.`
    });
  } else {
    tasks.push({
      done: true,
      title: 'All required glyphs seen',
      detail: 'Digits 0-9 and the decimal point have all been captured.'
    });
  }

  if (weakGlyphs.length) {
    tasks.push({
      done: false,
      title: 'Strengthen weak glyphs',
      detail: `Add more confirmed reads for: ${weakGlyphs.map((glyph) => (glyph === '.' ? 'dot' : glyph)).join(', ')}.`
    });
  } else {
    tasks.push({
      done: true,
      title: 'Glyph sample counts look healthy',
      detail: 'Every glyph has at least two trusted samples.'
    });
  }

  return tasks;
}

function createCalibrationEvent(balance, note, source) {
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    balance,
    note,
    source,
    createdAt: new Date().toISOString(),
    learnedGlyphs: normalizeGlyphInput(balance)
  };
}

function applyConfirmedBalanceToProfile(profile, balance, note, source = 'manual-confirmation') {
  const glyphs = normalizeGlyphInput(balance);
  const mergedGlyphs = normalizeGlyphInput(`${profile.learnedGlyphs.join('')}${glyphs.join('')}`);
  const glyphStats = { ...profile.glyphStats };
  const timestamp = new Date().toISOString();

  glyphs.forEach((glyph) => {
    const stats = glyphStats[glyph] || { sampleCount: 0, trustedCount: 0, lastSeenAt: null };
    glyphStats[glyph] = {
      sampleCount: stats.sampleCount + 1,
      trustedCount: stats.trustedCount + 1,
      lastSeenAt: timestamp
    };
  });

  const event = createCalibrationEvent(balance, note, source);
  return {
    correctionBalance: balance,
    correctionNote: note,
    learnedGlyphs: mergedGlyphs,
    glyphStats,
    lastConfirmedAt: timestamp,
    completedAt: mergedGlyphs.length === REQUIRED_GLYPHS.length ? timestamp : profile.completedAt,
    calibrationHistory: [event, ...profile.calibrationHistory].slice(0, 20),
    sessionStats: {
      confirmedReads: (profile.sessionStats?.confirmedReads || 0) + 1,
      manualCorrections: (profile.sessionStats?.manualCorrections || 0) + (source === 'manual-correction' ? 1 : 0)
    }
  };
}

function buildScannerPayload(casino, profile) {
  const coverage = getProfileCoverage(profile);
  const status = getProfileStatus(profile);
  return {
    profileVersion: profile.schemaVersion || 1,
    casino: {
      id: casino.id,
      name: casino.name,
      domain: casino.domain
    },
    profile: {
      name: profile.profileName,
      sharedFontGroup: profile.sharedFontGroup,
      mode: profile.mode,
      status: status.label,
      region: profile.region,
      requiredGlyphs: REQUIRED_GLYPHS,
      learnedGlyphs: coverage.learned,
      missingGlyphs: coverage.missing,
      glyphStats: profile.glyphStats,
      lastConfirmedAt: profile.lastConfirmedAt,
      completedAt: profile.completedAt
    },
    training: {
      checklist: getTrainingChecklist(profile).map((item) => ({
        title: item.title,
        done: item.done,
        detail: item.detail
      })),
      history: profile.calibrationHistory.slice(0, 10),
      sessionStats: profile.sessionStats
    }
  };
}

function applyScannerTrainingUpdate(casino, balance, note = '', source = 'scanner-confirmation') {
  const profile = getProfile(casino);
  const appliedUpdate = applyConfirmedBalanceToProfile(profile, balance, note, source);
  updateProfile(casino, appliedUpdate);
  if (activeCasino && activeCasino.id === casino.id) {
    syncDetailView(activeCasino);
  }
  renderCasinos();
  return buildScannerPayload(casino, getProfile(casino));
}

function exposeTrainingBridge() {
  window.SweepVaultTrainingBridge = {
    getRequiredGlyphs() {
      return [...REQUIRED_GLYPHS];
    },
    getActiveProfilePayload() {
      if (!activeCasino) return null;
      return buildScannerPayload(activeCasino, getProfile(activeCasino));
    },
    getCasinoProfilePayloadById(casinoId) {
      const casino = userCasinos.find((item) => String(item.id) === String(casinoId));
      if (!casino) return null;
      return buildScannerPayload(casino, getProfile(casino));
    },
    confirmRead({ casinoId, balance, note = '', source = 'scanner-confirmation' }) {
      const casino = userCasinos.find((item) => String(item.id) === String(casinoId));
      if (!casino || !balance) return null;
      return applyScannerTrainingUpdate(casino, String(balance), note, source);
    }
  };
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

  if (!email || !password) {
    errorEl.textContent = 'Please fill in all fields.';
    return;
  }

  if (!isLogin) {
    const confirm = document.getElementById('auth-confirm').value;
    if (password !== confirm) {
      errorEl.textContent = 'Passwords do not match.';
      return;
    }

    const { error } = await sb.auth.signUp({ email, password });
    if (error) {
      errorEl.textContent = error.message;
      return;
    }

    errorEl.style.color = 'var(--green)';
    errorEl.textContent = 'Check your email to confirm your account.';
  } else {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) errorEl.textContent = error.message;
  }
});

document.getElementById('signout-btn').addEventListener('click', async () => {
  await sb.auth.signOut();
});

async function loadCasinos() {
  if (!currentUser) return;
  loadProfiles();

  const { data, error } = await sb
    .from('casinos')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('name');

  if (error) {
    console.error(error);
    return;
  }

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

  if (error) {
    console.error(error);
    return null;
  }

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

function renderCasinos() {
  const grid = document.getElementById('casino-grid');
  const empty = document.getElementById('empty-state');
  const totalEl = document.getElementById('total-balance');
  const countEl = document.getElementById('casino-count');
  const readyCountEl = document.getElementById('ready-count');
  const calibrationCountEl = document.getElementById('calibration-count');
  const regionCountEl = document.getElementById('region-count');
  const heroLastUpdatedEl = document.getElementById('hero-last-updated');

  Array.from(grid.querySelectorAll('.casino-card')).forEach((card) => card.remove());

  if (userCasinos.length === 0) {
    empty.style.display = 'flex';
    totalEl.textContent = '0.00';
    countEl.textContent = '0 casinos tracked';
    readyCountEl.textContent = '0';
    calibrationCountEl.textContent = '0';
    regionCountEl.textContent = '0';
    heroLastUpdatedEl.textContent = 'No recent updates yet';
    return;
  }

  empty.style.display = 'none';

  const sorted = [...userCasinos].sort((a, b) => a.name.localeCompare(b.name));

  let total = 0;
  let readyCount = 0;
  let calibrationCount = 0;
  let regionCount = 0;
  let latestUpdatedAt = null;

  sorted.forEach((casino) => {
    const profile = getProfile(casino);
    const coverage = getProfileCoverage(profile);
    const status = getProfileStatus(profile);
    const updated = casino.updated_at ? timeAgo(new Date(casino.updated_at)) : 'never';

    total += parseFloat(casino.balance) || 0;
    if (status.label === 'Ready') readyCount += 1;
    else if (status.label === 'Training') calibrationCount += 1;
    if (profile.region.ready) regionCount += 1;

    if (casino.updated_at) {
      const updatedAt = new Date(casino.updated_at);
      if (!Number.isNaN(updatedAt.getTime()) && (!latestUpdatedAt || updatedAt > latestUpdatedAt)) {
        latestUpdatedAt = updatedAt;
      }
    }

    const card = document.createElement('div');
    card.className = `casino-card status-${status.tone}`;
    card.dataset.id = casino.id;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Open ${casino.name} details`);

    card.innerHTML = `
      <div class="casino-card-top">
        <div class="casino-brand">
          <img class="casino-icon" src="${getCasinoIconUrl(casino.domain)}" alt="" loading="lazy" />
          <div>
            <div class="casino-name">${casino.name}</div>
            <div class="casino-domain">${casino.domain}</div>
          </div>
        </div>
        <button
          class="casino-launch-link"
          type="button"
          aria-label="Open ${casino.name} in app and browser"
          title="Open ${casino.name} in app and browser"
        >Go</button>
      </div>
      <div class="casino-balance">${formatBalance(casino.balance)}</div>
      <div class="casino-profile-row">
        <span class="profile-badge tone-${status.tone}">${status.label}</span>
        <span class="profile-meta">${coverage.learned.length} / ${REQUIRED_GLYPHS.length} glyphs</span>
      </div>
      <div class="casino-meta-grid">
        <div class="casino-meta-item">
          <span>Mode</span>
          <strong>${getRecognitionModeLabel(profile)}</strong>
        </div>
        <div class="casino-meta-item">
          <span>Region</span>
          <strong>${profile.region.ready ? 'Locked' : 'Pending'}</strong>
        </div>
      </div>
      <div class="casino-updated">${updated}</div>
    `;

    const launchLink = card.querySelector('.casino-launch-link');
    launchLink.addEventListener('click', (event) => {
      event.stopPropagation();
      launchCasinoWorkspace(casino);
    });

    card.addEventListener('click', () => openDetailPage(casino));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDetailPage(casino);
      }
    });

    grid.appendChild(card);
  });

  totalEl.textContent = formatBalance(total);
  countEl.textContent = `${userCasinos.length} casino${userCasinos.length !== 1 ? 's' : ''} tracked`;
  readyCountEl.textContent = String(readyCount);
  calibrationCountEl.textContent = String(calibrationCount);
  regionCountEl.textContent = String(regionCount);
  heroLastUpdatedEl.textContent = latestUpdatedAt
    ? `Latest balance update ${timeAgo(latestUpdatedAt)}`
    : 'No recent updates yet';
}

function getTimerInfo(casino) {
  const resetVal = parseInt(casino.reset_hours, 10) || 24;

  if (resetVal >= 10000) {
    const minsFromMidnight = resetVal - 10000;
    const resetHour = Math.floor(minsFromMidnight / 60);
    const resetMin = minsFromMidnight % 60;

    const now = new Date();
    const nextReset = new Date();
    nextReset.setHours(resetHour, resetMin, 0, 0);
    if (nextReset <= now) nextReset.setDate(nextReset.getDate() + 1);

    const resetTimeStr = nextReset.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (casino.last_claimed_at) {
      const prevReset = new Date(nextReset);
      prevReset.setDate(prevReset.getDate() - 1);
      if (new Date(casino.last_claimed_at) >= prevReset) {
        const remaining = nextReset - now;
        const h = Math.floor(remaining / 3600000);
        const m = Math.floor((remaining % 3600000) / 60000);
        return { ready: false, text: h > 0 ? `${h}h ${m}m` : `${m}m`, resetTime: resetTimeStr };
      }
    }

    return { ready: true, text: 'Ready', resetTime: resetTimeStr };
  }

  if (!casino.last_claimed_at) return { ready: true, text: 'Ready', resetTime: null };

  const claimedAt = new Date(casino.last_claimed_at).getTime();
  const resetAt = claimedAt + resetVal * 3600 * 1000;
  const remaining = resetAt - Date.now();
  if (remaining <= 0) return { ready: true, text: 'Ready', resetTime: null };

  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const resetTimeStr = new Date(resetAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return { ready: false, text: h > 0 ? `${h}h ${m}m` : `${m}m`, resetTime: resetTimeStr };
}

function startTimerLoop() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (activeCasino) updateDetailBonusStatus(activeCasino);
  }, 30000);
}

function updateDetailBonusStatus(casino) {
  const { ready, text, resetTime } = getTimerInfo(casino);
  const statusEl = document.getElementById('detail-bonus-status');
  const resetTimeEl = document.getElementById('detail-reset-time-display');
  const claimBtn = document.getElementById('detail-claim-btn');

  statusEl.textContent = ready ? 'Ready' : text;
  statusEl.className = `detail-bonus-status${ready ? ' ready' : ''}`;

  if (!ready && resetTime) {
    resetTimeEl.textContent = `Resets at ${resetTime}`;
    resetTimeEl.style.display = 'block';
  } else if (ready && resetTime) {
    resetTimeEl.textContent = `Window resets at ${resetTime}`;
    resetTimeEl.style.display = 'block';
  } else {
    resetTimeEl.style.display = 'none';
  }

  claimBtn.disabled = !ready;
}

function formatBalance(val) {
  const n = parseFloat(val) || 0;
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getCasinoIconUrl(domain) {
  return `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(domain)}`;
}

function triggerCasinoOverlay(casinoId) {
  const iframe = document.createElement('iframe');
  iframe.src = `casinotracker://open?casinoId=${casinoId}`;
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  setTimeout(() => iframe.remove(), 1000);
}

function launchCasinoWorkspace(casino) {
  triggerCasinoOverlay(casino.id);
  const customUrl = typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG[casino.domain]?.launch_url;
  window.open(customUrl || `https://${casino.domain}`, '_blank', 'noopener,noreferrer');
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function renderGlyphList(containerId, glyphs, emptyText) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!glyphs.length) {
    container.innerHTML = `<span class="glyph-empty">${emptyText}</span>`;
    return;
  }

  container.innerHTML = glyphs
    .map((glyph) => `<span class="glyph-chip">${glyph === '.' ? 'dot' : glyph}</span>`)
    .join('');
}

function renderTrainingChecklist(profile) {
  const container = document.getElementById('training-checklist');
  if (!container) return;

  const items = getTrainingChecklist(profile);
  container.innerHTML = items.map((item) => `
    <div class="checklist-item ${item.done ? 'done' : ''}">
      <span class="checklist-mark">${item.done ? '&#10003;' : '&#9675;'}</span>
      <div class="checklist-copy">
        <strong>${item.title}</strong>
        <p>${item.detail}</p>
      </div>
    </div>
  `).join('');
}

function renderSampleGrid(profile) {
  const container = document.getElementById('sample-grid');
  const totalEl = document.getElementById('sample-strength-value');
  if (!container || !totalEl) return;

  const totalSamples = getTotalSamples(profile);
  totalEl.textContent = `${totalSamples} samples logged`;
  container.innerHTML = REQUIRED_GLYPHS.map((glyph) => {
    const stats = profile.glyphStats[glyph];
    const tone = stats.sampleCount >= 2 ? 'strong' : stats.sampleCount === 1 ? 'medium' : 'weak';
    return `
      <div class="sample-card tone-${tone}">
        <div class="sample-glyph">${glyph === '.' ? 'dot' : glyph}</div>
        <div class="sample-count">${stats.sampleCount}</div>
        <div class="sample-meta">${stats.sampleCount >= 2 ? 'healthy' : stats.sampleCount === 1 ? 'seen once' : 'missing'}</div>
      </div>
    `;
  }).join('');
}

function renderTrainingHistory(profile) {
  const container = document.getElementById('training-history-list');
  if (!container) return;

  if (!profile.calibrationHistory.length) {
    container.innerHTML = '<div class="history-empty">No confirmed reads logged yet.</div>';
    return;
  }

  container.innerHTML = profile.calibrationHistory.map((event) => `
    <div class="history-item">
      <div class="history-main">
        <strong>${event.balance || 'Unknown'}</strong>
        <span>${timeAgo(new Date(event.createdAt))}</span>
      </div>
      <div class="history-sub">Source: ${event.source}</div>
      <div class="history-sub">Glyphs: ${event.learnedGlyphs.map((glyph) => glyph === '.' ? 'dot' : glyph).join(', ') || 'none'}</div>
      ${event.note ? `<div class="history-note">${event.note}</div>` : ''}
    </div>
  `).join('');
}

function renderPayloadPreview(casino, profile) {
  const payloadEl = document.getElementById('payload-preview');
  if (!payloadEl) return;
  payloadEl.textContent = JSON.stringify(buildScannerPayload(casino, profile), null, 2);
}

function populateTrainingForm(casino, profile) {
  const coverage = getProfileCoverage(profile);
  const status = getProfileStatus(profile);

  document.getElementById('profile-name-input').value = profile.profileName || casino.name;
  document.getElementById('profile-font-group-input').value = profile.sharedFontGroup || '';
  document.getElementById('profile-mode-select').value = profile.mode || 'template';
  document.getElementById('region-label-input').value = profile.region.label || '';
  document.getElementById('learned-glyphs-input').value = coverage.learned.join('');
  document.getElementById('confirmed-balance-input').value = profile.correctionBalance || '';
  document.getElementById('profile-note-input').value = profile.correctionNote || '';
  document.getElementById('coverage-value').textContent = `${coverage.learned.length} / ${REQUIRED_GLYPHS.length} learned`;
  document.getElementById('coverage-bar-fill').style.width = `${coverage.percent}%`;
  document.getElementById('training-status-pill').textContent = status.label;
  document.getElementById('training-status-pill').className = `training-status-pill tone-${status.tone}`;

  renderGlyphList('learned-glyphs-list', coverage.learned, 'No glyphs saved yet');
  renderGlyphList('missing-glyphs-list', coverage.missing, 'Nothing missing');
  renderTrainingChecklist(profile);
  renderSampleGrid(profile);
  renderTrainingHistory(profile);
  renderPayloadPreview(casino, profile);
  document.getElementById('toggle-region-btn').textContent = profile.region.ready ? 'Region Locked' : 'Mark Region Ready';
  document.getElementById('profile-note-status').textContent = profile.lastConfirmedAt
    ? `Last correction saved ${timeAgo(new Date(profile.lastConfirmedAt))}.`
    : 'Corrections and profile notes are saved locally in this browser for now.';
}

function syncDetailView(casino) {
  const profile = getProfile(casino);
  const coverage = getProfileCoverage(profile);
  const status = getProfileStatus(profile);
  const updatedText = casino.updated_at ? `Updated ${timeAgo(new Date(casino.updated_at))}` : 'never updated';
  const customUrl = typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG[casino.domain]?.launch_url;
  const siteUrl = customUrl || `https://${casino.domain}`;

  document.getElementById('detail-casino-name').textContent = casino.name;
  document.getElementById('detail-open-site').href = siteUrl;
  document.getElementById('detail-open-site-btn').href = siteUrl;
  document.getElementById('detail-hero-icon').src = getCasinoIconUrl(casino.domain);
  document.getElementById('detail-hero-icon').alt = `${casino.name} icon`;
  document.getElementById('detail-hero-name').textContent = casino.name;
  document.getElementById('detail-hero-domain').textContent = casino.domain;
  document.getElementById('detail-open-overlay-btn').onclick = () => triggerCasinoOverlay(casino.id);

  document.getElementById('detail-hero-balance').textContent = `${formatBalance(casino.balance)} SC`;
  document.getElementById('detail-hero-mode').textContent = getRecognitionModeLabel(profile);
  document.getElementById('detail-hero-updated').textContent = updatedText;
  document.getElementById('detail-balance-amount').textContent = formatBalance(casino.balance);
  document.getElementById('detail-balance-updated').textContent = updatedText;

  document.getElementById('detail-region-badge').textContent = profile.region.ready ? 'Locked' : 'Unconfigured';
  document.getElementById('detail-coverage-badge').textContent = `${coverage.learned.length} / ${REQUIRED_GLYPHS.length}`;
  document.getElementById('detail-profile-status-badge').textContent = status.label;

  const resetSelect = document.getElementById('detail-reset-hours');
  const dailyWrap = document.getElementById('daily-reset-time-wrap');
  const dailyInput = document.getElementById('daily-reset-time');
  const resetVal = parseInt(casino.reset_hours, 10) || 24;

  if (resetVal >= 10000) {
    resetSelect.value = 'daily';
    dailyWrap.style.display = 'flex';
    const mins = resetVal - 10000;
    const hh = String(Math.floor(mins / 60)).padStart(2, '0');
    const mm = String(mins % 60).padStart(2, '0');
    dailyInput.value = `${hh}:${mm}`;
  } else {
    resetSelect.value = String(resetVal === 6 ? 6 : 24);
    dailyWrap.style.display = 'none';
    dailyInput.value = '';
  }

  updateDetailBonusStatus(casino);
  populateTrainingForm(casino, profile);
}

function openDetailPage(casino) {
  activeCasino = casino;
  syncDetailView(casino);

  document.querySelectorAll('.detail-tab').forEach((tab) => tab.classList.remove('active'));
  document.querySelector('.detail-tab[data-tab="overview"]').classList.add('active');
  document.getElementById('tab-overview').style.display = 'block';
  document.getElementById('tab-training').style.display = 'none';
  document.getElementById('tab-records').style.display = 'none';

  document.getElementById('casino-notes').value = casino.notes || '';
  const bonusCountEl = document.getElementById('detail-bonus-count');
  if (bonusCountEl) bonusCountEl.textContent = '0';

  document.getElementById('app-screen').classList.remove('active');
  document.getElementById('detail-screen').classList.add('active');
}

function closeDetailPage() {
  document.getElementById('detail-screen').classList.remove('active');
  document.getElementById('app-screen').classList.add('active');
  activeCasino = null;
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
    resetHours = parseInt(val, 10) || 24;
  }

  const now = new Date().toISOString();
  const casino = userCasinos.find((item) => item.id === activeCasino.id);
  if (casino) {
    casino.last_claimed_at = now;
    casino.reset_hours = resetHours;
  }
  activeCasino.last_claimed_at = now;
  activeCasino.reset_hours = resetHours;
  updateDetailBonusStatus(activeCasino);

  const { error } = await sb.from('casinos').update({
    last_claimed_at: now,
    reset_hours: resetHours
  }).eq('id', activeCasino.id).eq('user_id', currentUser.id);

  if (error) {
    console.error('Claim update failed:', error);
  }

  renderCasinos();
});

document.getElementById('detail-reset-hours').addEventListener('change', async () => {
  if (!activeCasino) return;

  const val = document.getElementById('detail-reset-hours').value;
  const dailyWrap = document.getElementById('daily-reset-time-wrap');

  if (val === 'daily') {
    dailyWrap.style.display = 'flex';
    return;
  }

  dailyWrap.style.display = 'none';
  const resetHours = parseInt(val, 10) || 24;
  await sb.from('casinos').update({ reset_hours: resetHours })
    .eq('id', activeCasino.id)
    .eq('user_id', currentUser.id);

  const casino = userCasinos.find((item) => item.id === activeCasino.id);
  if (casino) casino.reset_hours = resetHours;
  activeCasino.reset_hours = resetHours;
  updateDetailBonusStatus(activeCasino);
});

document.getElementById('daily-reset-time').addEventListener('change', async () => {
  if (!activeCasino) return;

  const timeVal = document.getElementById('daily-reset-time').value;
  if (!timeVal) return;

  const [hh, mm] = timeVal.split(':').map(Number);
  const resetHours = 10000 + hh * 60 + mm;
  await sb.from('casinos').update({ reset_hours: resetHours })
    .eq('id', activeCasino.id)
    .eq('user_id', currentUser.id);

  const casino = userCasinos.find((item) => item.id === activeCasino.id);
  if (casino) casino.reset_hours = resetHours;
  activeCasino.reset_hours = resetHours;
  updateDetailBonusStatus(activeCasino);
});

document.getElementById('detail-edit-balance-btn').addEventListener('click', () => {
  if (activeCasino) openEditModal(activeCasino);
});

document.getElementById('detail-remove-btn').addEventListener('click', async () => {
  if (!activeCasino) return;
  if (!confirm(`Remove ${activeCasino.name}?`)) return;

  const key = getProfileKey(activeCasino);
  delete profileStore[key];
  saveProfiles();

  await removeCasino(activeCasino.id);
  userCasinos = userCasinos.filter((casino) => casino.id !== activeCasino.id);
  renderCasinos();
  closeDetailPage();
});

document.getElementById('save-profile-btn').addEventListener('click', () => {
  if (!activeCasino) return;

  const profile = updateProfile(activeCasino, {
    profileName: document.getElementById('profile-name-input').value.trim() || activeCasino.name,
    sharedFontGroup: document.getElementById('profile-font-group-input').value.trim(),
    mode: document.getElementById('profile-mode-select').value,
    region: {
      ...getProfile(activeCasino).region,
      label: document.getElementById('region-label-input').value.trim()
    }
  });

  syncDetailView(activeCasino);
  renderCasinos();
  document.getElementById('profile-note-status').textContent = `Profile settings saved for ${profile.profileName}.`;
});

document.getElementById('toggle-region-btn').addEventListener('click', () => {
  if (!activeCasino) return;
  const profile = getProfile(activeCasino);
  updateProfile(activeCasino, {
    region: {
      ...profile.region,
      ready: !profile.region.ready,
      label: document.getElementById('region-label-input').value.trim() || profile.region.label
    }
  });
  syncDetailView(activeCasino);
  renderCasinos();
});

document.getElementById('reset-profile-btn').addEventListener('click', () => {
  if (!activeCasino) return;
  if (!confirm('Reset this local template profile?')) return;

  updateProfile(activeCasino, createDefaultProfile(activeCasino));
  syncDetailView(activeCasino);
  renderCasinos();
});

document.getElementById('save-glyphs-btn').addEventListener('click', () => {
  if (!activeCasino) return;
  const learnedGlyphs = normalizeGlyphInput(document.getElementById('learned-glyphs-input').value);
  updateProfile(activeCasino, {
    learnedGlyphs,
    completedAt: learnedGlyphs.length === REQUIRED_GLYPHS.length ? new Date().toISOString() : null
  });
  syncDetailView(activeCasino);
  renderCasinos();
});

document.getElementById('mark-complete-btn').addEventListener('click', () => {
  if (!activeCasino) return;
  updateProfile(activeCasino, {
    region: {
      ...getProfile(activeCasino).region,
      ready: true,
      label: document.getElementById('region-label-input').value.trim() || getProfile(activeCasino).region.label
    },
    learnedGlyphs: [...REQUIRED_GLYPHS],
    glyphStats: REQUIRED_GLYPHS.reduce((acc, glyph) => {
      acc[glyph] = {
        sampleCount: Math.max(getProfile(activeCasino).glyphStats[glyph]?.sampleCount || 0, 2),
        trustedCount: Math.max(getProfile(activeCasino).glyphStats[glyph]?.trustedCount || 0, 2),
        lastSeenAt: new Date().toISOString()
      };
      return acc;
    }, {}),
    completedAt: new Date().toISOString()
  });
  syncDetailView(activeCasino);
  renderCasinos();
});

document.getElementById('save-correction-btn').addEventListener('click', () => {
  if (!activeCasino) return;

  const correctionBalance = document.getElementById('confirmed-balance-input').value.trim();
  const correctionNote = document.getElementById('profile-note-input').value.trim();
  if (!correctionBalance) {
    document.getElementById('profile-note-status').textContent = 'Enter the confirmed balance before saving a correction.';
    return;
  }
  const currentProfile = getProfile(activeCasino);
  const appliedUpdate = applyConfirmedBalanceToProfile(
    currentProfile,
    correctionBalance,
    correctionNote,
    'manual-correction'
  );

  updateProfile(activeCasino, appliedUpdate);

  syncDetailView(activeCasino);
  renderCasinos();
});

document.getElementById('copy-payload-btn').addEventListener('click', async () => {
  if (!activeCasino) return;
  const payload = JSON.stringify(buildScannerPayload(activeCasino, getProfile(activeCasino)), null, 2);
  if (!navigator.clipboard) {
    document.getElementById('profile-note-status').textContent = 'Clipboard access is not available in this browser.';
    return;
  }
  await navigator.clipboard.writeText(payload);
  document.getElementById('profile-note-status').textContent = 'Scanner payload copied to clipboard.';
});

function populateCasinoSelect() {
  const select = document.getElementById('casino-select');
  select.innerHTML = '<option value="">-- Choose a casino --</option>';
  const addedDomains = new Set(userCasinos.map((casino) => casino.domain));

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
document.getElementById('add-modal').addEventListener('click', (event) => {
  if (event.target === event.currentTarget) closeAddModal();
});

document.getElementById('confirm-add-casino').addEventListener('click', async () => {
  const domain = document.getElementById('casino-select').value;
  const balance = document.getElementById('casino-balance').value;
  if (!domain) return;

  const config = SITE_CONFIG[domain];
  const casino = await addCasinoToDB(domain, config.name, balance || 0);
  if (casino) {
    userCasinos.push(casino);
    getProfile(casino);
    renderCasinos();
  }

  closeAddModal();
});

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
document.getElementById('edit-modal').addEventListener('click', (event) => {
  if (event.target === event.currentTarget) closeEditModal();
});

document.getElementById('confirm-edit-balance').addEventListener('click', async () => {
  const balance = document.getElementById('edit-balance').value;
  if (editingCasinoId === null) return;

  const savedId = editingCasinoId;
  await updateBalance(savedId, balance);

  const casino = userCasinos.find((item) => item.id === savedId);
  if (casino) {
    casino.balance = parseFloat(balance) || 0;
    casino.updated_at = new Date().toISOString();
  }

  renderCasinos();
  closeEditModal();

  if (activeCasino && activeCasino.id === savedId && casino) {
    activeCasino.balance = casino.balance;
    activeCasino.updated_at = casino.updated_at;
    syncDetailView(activeCasino);
  }
});

document.getElementById('remove-casino-btn').addEventListener('click', async () => {
  if (editingCasinoId === null) return;
  if (!confirm('Remove this casino?')) return;

  const casino = userCasinos.find((item) => item.id === editingCasinoId);
  if (casino) {
    delete profileStore[getProfileKey(casino)];
    saveProfiles();
  }

  await removeCasino(editingCasinoId);
  userCasinos = userCasinos.filter((item) => item.id !== editingCasinoId);
  renderCasinos();
  closeEditModal();
});

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

window.addEventListener('sweepvault:confirm-read', (event) => {
  const detail = event.detail || {};
  if (!detail.casinoId || !detail.balance) return;
  const casino = userCasinos.find((item) => String(item.id) === String(detail.casinoId));
  if (!casino) return;
  applyScannerTrainingUpdate(casino, String(detail.balance), detail.note || '', detail.source || 'scanner-confirmation');
});

exposeTrainingBridge();
init();
