<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SweepVault</title>
  <link rel="stylesheet" href="css/style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet">
</head>
<body>

  <!-- AUTH SCREEN -->
  <div id="auth-screen" class="screen active">
    <div class="auth-bg"></div>
    <div class="auth-container">
      <div class="logo">
        <span class="logo-icon">◈</span>
        <span class="logo-text">SweepVault</span>
      </div>
      <p class="auth-tagline">Your sweepstakes command center</p>

      <div class="tab-switcher">
        <button class="tab-btn active" id="login-tab">Sign In</button>
        <button class="tab-btn" id="register-tab">Register</button>
      </div>

      <div id="auth-form">
        <input type="email" id="auth-email" placeholder="Email address" autocomplete="email" />
        <input type="password" id="auth-password" placeholder="Password" autocomplete="current-password" />
        <div id="confirm-password-wrap" style="display:none">
          <input type="password" id="auth-confirm" placeholder="Confirm password" />
        </div>
        <button class="btn-primary" id="auth-submit">Sign In</button>
        <p id="auth-error" class="error-msg"></p>
      </div>
    </div>
  </div>

  <!-- MAIN APP -->
  <div id="app-screen" class="screen">

    <!-- HEADER -->
    <header class="app-header">
      <div class="header-left">
        <span class="logo-icon small">◈</span>
        <span class="app-title">SweepVault</span>
      </div>
      <div class="header-right">
        <button class="icon-btn" id="bookmarklet-btn" title="Get Bookmarklet">⚡</button>
        <button class="icon-btn" id="add-casino-btn" title="Add Casino">＋</button>
        <button class="icon-btn" id="signout-btn" title="Sign Out">⏻</button>
      </div>
    </header>

    <!-- TOTAL BALANCE BAR -->
    <div class="total-bar">
      <div class="total-label">Total SC Balance</div>
      <div class="total-amount" id="total-balance">0.00</div>
      <div class="total-sub" id="casino-count">0 casinos tracked</div>
    </div>

    <!-- CASINO GRID -->
    <main class="casino-grid" id="casino-grid">
      <div class="empty-state" id="empty-state">
        <div class="empty-icon">🎰</div>
        <p>No casinos added yet</p>
        <button class="btn-primary small" id="empty-add-btn">Add Your First Casino</button>
      </div>
    </main>

  </div>

  <!-- ADD CASINO MODAL -->
  <div class="modal-overlay" id="add-modal">
    <div class="modal">
      <div class="modal-header">
        <h2>Add Casino</h2>
        <button class="modal-close" id="close-add-modal">✕</button>
      </div>
      <div class="modal-body">
        <label>Select Casino</label>
        <select id="casino-select">
          <option value="">-- Choose a casino --</option>
        </select>
        <label>Starting Balance (SC)</label>
        <input type="number" id="casino-balance" placeholder="0.00" step="0.01" min="0" />
        <button class="btn-primary" id="confirm-add-casino">Add Casino</button>
      </div>
    </div>
  </div>

  <!-- EDIT BALANCE MODAL -->
  <div class="modal-overlay" id="edit-modal">
    <div class="modal">
      <div class="modal-header">
        <h2 id="edit-modal-title">Update Balance</h2>
        <button class="modal-close" id="close-edit-modal">✕</button>
      </div>
      <div class="modal-body">
        <label>Current SC Balance</label>
        <input type="number" id="edit-balance" placeholder="0.00" step="0.01" min="0" />
        <button class="btn-primary" id="confirm-edit-balance">Update</button>
        <button class="btn-danger" id="remove-casino-btn">Remove Casino</button>
      </div>
    </div>
  </div>

  <!-- BOOKMARKLET MODAL -->
  <div class="modal-overlay" id="bookmarklet-modal">
    <div class="modal">
      <div class="modal-header">
        <h2>⚡ Sync Bookmarklet</h2>
        <button class="modal-close" id="close-bookmarklet-modal">✕</button>
      </div>
      <div class="modal-body">
        <p class="modal-info">Tap the button below to copy the bookmarklet. Then add a new bookmark in your browser and paste this as the URL.</p>
        <div class="bookmarklet-steps">
          <div class="step"><span class="step-num">1</span> Copy the bookmarklet code below</div>
          <div class="step"><span class="step-num">2</span> Create a new bookmark in your browser</div>
          <div class="step"><span class="step-num">3</span> Name it "Sync Balance" or similar</div>
          <div class="step"><span class="step-num">4</span> Paste the code as the bookmark URL</div>
          <div class="step"><span class="step-num">5</span> Visit any supported casino and tap the bookmark</div>
        </div>
        <button class="btn-primary" id="copy-bookmarklet-btn">📋 Copy Bookmarklet Code</button>
        <p id="copy-confirm" class="success-msg" style="display:none">✓ Copied to clipboard!</p>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/config.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
