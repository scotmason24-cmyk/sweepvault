async function loadCasinoLog(casinoId) {
  const { data, error } = await sb
    .from('casino_log')
    .select('*')
    .eq('casino_id', casinoId)
    .eq('user_id', currentUser.id)
    .order('entry_date', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  casinoLogEntries = data || [];
  renderLogEntries();
}

function renderLogEntries() {
  renderSnapshots(casinoLogEntries.filter((entry) => entry.entry_type === 'snapshot'));
  renderDailyBonuses(casinoLogEntries.filter((entry) => entry.entry_type === 'daily_bonus'));
  renderRedemptions(casinoLogEntries.filter((entry) => entry.entry_type === 'redemption'));
  renderPurchases(casinoLogEntries.filter((entry) => entry.entry_type === 'purchase'));
}

function formatEntryDate(dateStr) {
  if (!dateStr) return '';

  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function renderSnapshots(entries) {
  const list = document.getElementById('snapshots-list');
  if (!list) return;

  if (entries.length === 0) {
    list.innerHTML = '<div class="entries-empty">No scanner snapshots yet</div>';
    return;
  }

  list.innerHTML = `
    ${entries.map((entry) => `
      <div class="entry-item">
        <div class="entry-main">
          <span class="entry-amount">$${parseFloat(entry.amount || 0).toFixed(2)}</span>
          <span class="entry-date">${formatEntryDate(entry.entry_date)}</span>
        </div>
        <button class="entry-delete" data-id="${entry.id}">&times;</button>
      </div>
    `).join('')}
  `;

  list.querySelectorAll('.entry-delete').forEach((button) => {
    button.addEventListener('click', () => deleteLogEntry(button.dataset.id));
  });
}

function renderDailyBonuses(entries) {
  const list = document.getElementById('daily-bonuses-list');
  const countBadge = document.getElementById('detail-bonus-count');
  if (!list) return;

  if (countBadge) {
    countBadge.textContent = String(entries.length);
  }

  if (entries.length === 0) {
    list.innerHTML = '<div class="entries-empty">No daily bonuses logged</div>';
    return;
  }

  const total = entries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
  list.innerHTML = `
    <div class="entries-total">Total Collected: $${total.toFixed(2)}</div>
    ${entries.map((entry) => `
      <div class="entry-item">
        <div class="entry-main">
          <span class="entry-amount" style="color:var(--accent)">$${parseFloat(entry.amount || 0).toFixed(2)}</span>
          <span class="entry-date">${formatEntryDate(entry.entry_date)}</span>
        </div>
        <button class="entry-delete" data-id="${entry.id}">&times;</button>
      </div>
    `).join('')}
  `;

  list.querySelectorAll('.entry-delete').forEach((button) => {
    button.addEventListener('click', () => deleteLogEntry(button.dataset.id));
  });
}

function renderRedemptions(entries) {
  const list = document.getElementById('redemptions-list');
  if (!list) return;

  if (entries.length === 0) {
    list.innerHTML = '<div class="entries-empty">No redemptions logged yet</div>';
    return;
  }

  const total = entries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
  list.innerHTML = `
    <div class="entries-total">Total paid out: $${total.toFixed(2)}</div>
    ${entries.map((entry) => `
      <div class="entry-item">
        <div class="entry-main">
          <span class="entry-amount">$${parseFloat(entry.amount || 0).toFixed(2)}</span>
          <span class="entry-date">${formatEntryDate(entry.entry_date)}</span>
        </div>
        ${entry.notes ? `<div class="entry-notes">${entry.notes}</div>` : ''}
        <button class="entry-delete" data-id="${entry.id}">&times;</button>
      </div>
    `).join('')}
  `;

  list.querySelectorAll('.entry-delete').forEach((button) => {
    button.addEventListener('click', () => deleteLogEntry(button.dataset.id));
  });
}

function renderPurchases(entries) {
  const list = document.getElementById('purchases-list');
  if (!list) return;

  if (entries.length === 0) {
    list.innerHTML = '<div class="entries-empty">No purchases logged yet</div>';
    return;
  }

  const totalSC = entries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
  const totalSpent = entries.reduce((sum, entry) => sum + (parseFloat(entry.money_spent) || 0), 0);
  list.innerHTML = `
    <div class="entries-total">${totalSC.toFixed(2)} SC acquired &middot; $${totalSpent.toFixed(2)} spent</div>
    ${entries.map((entry) => `
      <div class="entry-item">
        <div class="entry-main">
          <span class="entry-amount">${parseFloat(entry.amount || 0).toFixed(2)} SC</span>
          <span class="entry-cost">$${parseFloat(entry.money_spent || 0).toFixed(2)}</span>
          <span class="entry-date">${formatEntryDate(entry.entry_date)}</span>
        </div>
        <button class="entry-delete" data-id="${entry.id}">&times;</button>
      </div>
    `).join('')}
  `;

  list.querySelectorAll('.entry-delete').forEach((button) => {
    button.addEventListener('click', () => deleteLogEntry(button.dataset.id));
  });
}

async function deleteLogEntry(id) {
  if (!confirm('Delete this entry?')) return;

  const { error } = await sb.from('casino_log').delete().eq('id', id).eq('user_id', currentUser.id);
  if (error) {
    console.error(error);
    return;
  }

  casinoLogEntries = casinoLogEntries.filter((entry) => entry.id !== id);
  renderLogEntries();
}

document.querySelectorAll('.detail-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.detail-tab').forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');

    const tabName = tab.dataset.tab;
    document.getElementById('tab-overview').style.display = tabName === 'overview' ? 'block' : 'none';
    document.getElementById('tab-training').style.display = tabName === 'training' ? 'block' : 'none';
    document.getElementById('tab-records').style.display = tabName === 'records' ? 'block' : 'none';

    if (tabName === 'records' && activeCasino) {
      loadCasinoLog(activeCasino.id);
    }
  });
});

document.getElementById('casino-notes').addEventListener('input', () => {
  clearTimeout(notesDebounceTimer);

  notesDebounceTimer = setTimeout(async () => {
    if (!activeCasino) return;

    const notes = document.getElementById('casino-notes').value;
    await sb.from('casinos').update({ notes }).eq('id', activeCasino.id).eq('user_id', currentUser.id);

    const casino = userCasinos.find((item) => item.id === activeCasino.id);
    if (casino) {
      casino.notes = notes;
    }

    activeCasino.notes = notes;
  }, 800);
});

document.getElementById('add-redemption-btn').addEventListener('click', () => {
  document.getElementById('redemption-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('redemption-amount').value = '';
  document.getElementById('redemption-notes').value = '';
  document.getElementById('add-redemption-modal').classList.add('open');
});

document.getElementById('close-redemption-modal').addEventListener('click', () => {
  document.getElementById('add-redemption-modal').classList.remove('open');
});

document.getElementById('add-redemption-modal').addEventListener('click', (event) => {
  if (event.target === event.currentTarget) {
    document.getElementById('add-redemption-modal').classList.remove('open');
  }
});

document.getElementById('confirm-add-redemption').addEventListener('click', async () => {
  if (!activeCasino) return;

  const date = document.getElementById('redemption-date').value;
  const amount = document.getElementById('redemption-amount').value;
  const notes = document.getElementById('redemption-notes').value.trim();
  if (!date || !amount) return;

  const { data, error } = await sb.from('casino_log').insert({
    user_id: currentUser.id,
    casino_id: activeCasino.id,
    entry_type: 'redemption',
    amount: parseFloat(amount),
    notes: notes || null,
    entry_date: date
  }).select().single();

  if (error) {
    console.error(error);
    return;
  }

  casinoLogEntries.unshift(data);
  renderLogEntries();
  document.getElementById('add-redemption-modal').classList.remove('open');
});

document.getElementById('add-purchase-btn').addEventListener('click', () => {
  document.getElementById('purchase-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('purchase-sc').value = '';
  document.getElementById('purchase-money').value = '';
  document.getElementById('add-purchase-modal').classList.add('open');
});

document.getElementById('close-purchase-modal').addEventListener('click', () => {
  document.getElementById('add-purchase-modal').classList.remove('open');
});

document.getElementById('add-purchase-modal').addEventListener('click', (event) => {
  if (event.target === event.currentTarget) {
    document.getElementById('add-purchase-modal').classList.remove('open');
  }
});

document.getElementById('confirm-add-purchase').addEventListener('click', async () => {
  if (!activeCasino) return;

  const date = document.getElementById('purchase-date').value;
  const sc = document.getElementById('purchase-sc').value;
  const money = document.getElementById('purchase-money').value;
  if (!date || !sc || !money) return;

  const { data, error } = await sb.from('casino_log').insert({
    user_id: currentUser.id,
    casino_id: activeCasino.id,
    entry_type: 'purchase',
    amount: parseFloat(sc),
    money_spent: parseFloat(money),
    entry_date: date
  }).select().single();

  if (error) {
    console.error(error);
    return;
  }

  casinoLogEntries.unshift(data);
  renderLogEntries();
  document.getElementById('add-purchase-modal').classList.remove('open');
});
