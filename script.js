const expenses = [];
const listEl = document.getElementById('expenses-list');
const summaryEl = document.getElementById('summary');

const colorMap = {};
const colorPalette = ['#4e54c8', '#8f94fb', '#ffa07a', '#f4a261', '#2a9d8f', '#ff6b6b', '#6a4c93'];
let colorIndex = 0;

function getColor(name) {
  if (!colorMap[name]) {
    colorMap[name] = colorPalette[colorIndex % colorPalette.length];
    colorIndex++;
  }
  return colorMap[name];
}

// Add Expense
document.getElementById('add-btn').addEventListener('click', () => {
  const item = document.getElementById('item').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const payer = document.getElementById('payer').value.trim();
  const participants = document
    .getElementById('participants')
    .value.split(',')
    .map(p => p.trim())
    .filter(p => p);

  if (!item || !amount || !payer || participants.length === 0) return;

  const date = new Date().toLocaleDateString();

  expenses.push({ item, amount, payer, participants, date });
  renderList();
  renderHistoryByPerson();
  gsap.from('.expense-item:last-child', { opacity: 0, y: -20, duration: 0.5 });
});

// Calculate Split
document.getElementById('calculate-btn').addEventListener('click', () => {
  const balances = {};

  expenses.forEach(e => {
    const people = new Set([e.payer, ...e.participants]);
    people.forEach(name => balances[name] = balances[name] || 0);
  });

  expenses.forEach(e => {
    const people = new Set([e.payer, ...e.participants]);
    const share = e.amount / people.size;
    people.forEach(name => balances[name] -= share);
    balances[e.payer] += e.amount;
  });

  renderSummary(balances);
});

function renderList() {
  listEl.innerHTML = '';
  expenses.forEach(e => {
    const div = document.createElement('div');
    div.className = 'expense-item';
    div.innerHTML = `
      <div>
        <strong>${e.item}</strong> - ₹${e.amount.toFixed(2)} <small>(${e.date})</small><br>
        <span class="tag" style="background:${getColor(e.payer)}">${e.payer} paid</span>
        ${e.participants.map(p => `<span class="tag" style="background:${getColor(p)}">${p}</span>`).join(' ')}
      </div>
    `;
    listEl.appendChild(div);
  });
}

function renderSummary(balances) {
  summaryEl.innerHTML = '<h3>Summary</h3>';

  Object.entries(balances).forEach(([name, bal]) => {
    const line = document.createElement('div');
    line.innerHTML = `<span class="tag" style="background:${getColor(name)}">${name}</span>: ${bal >= 0 ? 'is owed' : 'owes'} ₹${Math.abs(bal).toFixed(2)}`;
    summaryEl.appendChild(line);
  });

  const settlements = calculateSettlements(balances);
  if (settlements.length > 0) {
    const settleHeader = document.createElement('h4');
    settleHeader.textContent = 'Who Pays Whom';
    summaryEl.appendChild(settleHeader);

    settlements.forEach(text => {
      const line = document.createElement('div');
      line.textContent = text;
      summaryEl.appendChild(line);
    });
  }

  gsap.from('#summary div', { opacity: 0, x: 20, duration: 0.4, stagger: 0.1 });
}

function calculateSettlements(balances) {
  const debtors = [], creditors = [], settlements = [];

  Object.entries(balances).forEach(([name, bal]) => {
    if (bal < -0.01) debtors.push({ name, amount: -bal });
    else if (bal > 0.01) creditors.push({ name, amount: bal });
  });

  for (let d of debtors) {
    for (let c of creditors) {
      if (d.amount === 0) break;
      if (c.amount === 0) continue;

      const paid = Math.min(d.amount, c.amount);
      d.amount -= paid;
      c.amount -= paid;
      settlements.push(`${d.name} pays ${c.name} ₹${paid.toFixed(2)}`);
    }
  }

  return settlements;
}

function renderHistoryByPerson() {
  const history = {};
  expenses.forEach(e => {
    const allPeople = new Set([e.payer, ...e.participants]);
    allPeople.forEach(name => {
      if (!history[name]) history[name] = [];
      const role = name === e.payer ? 'paid' : 'shared';
      history[name].push(`${role} ₹${(e.amount / allPeople.size).toFixed(2)} for ${e.item} (${e.date})`);
    });
  });

  const historyEl = document.getElementById('history');
  historyEl.innerHTML = '';
  Object.entries(history).forEach(([name, records]) => {
    const div = document.createElement('div');
    div.innerHTML = `<span class="tag" style="background:${getColor(name)}">${name}</span><br> ${records.join('<br>')}`;
    historyEl.appendChild(div);
  });
}

// Export CSV
document.getElementById('export-csv').addEventListener('click', () => {
  let csv = "Item,Amount,Payer,Participants,Date\n";
  expenses.forEach(e => {
    csv += `${e.item},${e.amount},${e.payer},"${e.participants.join(', ')}",${e.date}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'expenses.csv';
  a.click();
});

// Export WhatsApp
document.getElementById('export-whatsapp').addEventListener('click', () => {
  let msg = '💸 Expense Summary:\n';
  expenses.forEach(e => {
    msg += `• ${e.item}: ₹${e.amount} by ${e.payer} (for ${[e.payer, ...e.participants].join(', ')}) on ${e.date}\n`;
  });

  const balances = {};
  expenses.forEach(e => {
    const people = new Set([e.payer, ...e.participants]);
    people.forEach(p => balances[p] = balances[p] || 0);
    const share = e.amount / people.size;
    people.forEach(p => balances[p] -= share);
    balances[e.payer] += e.amount;
  });

  msg += '\n🔁 Balances:\n';
  Object.entries(balances).forEach(([name, bal]) => {
    msg += `• ${name}: ${bal >= 0 ? 'is owed' : 'owes'} ₹${Math.abs(bal).toFixed(2)}\n`;
  });

  const settlements = calculateSettlements(balances);
  msg += '\n🤝 Settlements:\n';
  settlements.forEach(s => msg += `• ${s}\n`);

  navigator.clipboard.writeText(msg).then(() => alert('WhatsApp message copied to clipboard!'));
});

// Export to PDF
document.getElementById('export-pdf').addEventListener('click', () => {
  window.print();
});
