const INTERVALS = [
  { id: 'P4', label: 'Perfect 4th', ratio: 4 / 3 },
  { id: 'P5', label: 'Perfect 5th', ratio: 3 / 2 }
];

const earState = {
  length: 10, sequence: [], baseFreqs: [],
  index: 0, score: 0, locked: false, startTime: null
};

function buildEarSequence(len) {
  const ids = INTERVALS.map(i => i.id);
  const seq = [], freqs = [];
  for (let i = 0; i < len; i++) {
    let id;
    do { id = ids[Math.floor(Math.random() * ids.length)]; }
    while (i > 0 && id === seq[i - 1]);
    seq.push(id);
    // Random base in E2–E3 range (82–165 Hz)
    freqs.push(82.41 * Math.pow(2, Math.random()));
  }
  return { seq, freqs };
}

function playCurrentInterval() {
  const ctx = getCtx();
  const interval = INTERVALS.find(i => i.id === earState.sequence[earState.index]);
  const base = earState.baseFreqs[earState.index];
  const now = ctx.currentTime;
  playTone(base, now, 0.75);
  playTone(base * interval.ratio, now + 0.9, 0.75);
}

function updateEarProgress() {
  document.getElementById('ear-progress-text').textContent =
    `${earState.index + 1} / ${earState.length}`;
}

function renderIntervalButtons() {
  const grid = document.getElementById('interval-grid');
  grid.innerHTML = '';
  INTERVALS.forEach(interval => {
    const btn = document.createElement('button');
    btn.className = 'interval-btn';
    btn.dataset.interval = interval.id;
    btn.textContent = interval.label;
    btn.addEventListener('click', () => handleIntervalAnswer(interval.id));
    grid.appendChild(btn);
  });
}

function handleIntervalAnswer(choice) {
  if (earState.locked) return;
  earState.locked = true;
  if (!earState.startTime) earState.startTime = Date.now();

  const expected = earState.sequence[earState.index];
  if (choice === expected) {
    earState.score++;
    flashIntervalBtn(choice, 'flash-correct', 300);
  } else {
    flashIntervalBtn(choice, 'flash-wrong', 300);
    flashIntervalBtn(expected, 'flash-hint', 300);
  }

  setTimeout(() => {
    earState.locked = false;
    earState.index++;
    if (earState.index >= earState.length) {
      const elapsed = ((Date.now() - earState.startTime) / 1000).toFixed(1);
      document.getElementById('ear-score-text').textContent = `${earState.score} / ${earState.length}`;
      document.getElementById('ear-time-text').textContent = `${elapsed}s`;
      showView('ear-results-view');
    } else {
      updateEarProgress();
      playCurrentInterval();
    }
  }, 350);
}

function startEarTraining() {
  earState.length = Math.max(1, Math.min(50,
    parseInt(document.getElementById('ear-length-input').value, 10) || 10));
  const { seq, freqs } = buildEarSequence(earState.length);
  earState.sequence = seq;
  earState.baseFreqs = freqs;
  earState.index = 0;
  earState.score = 0;
  earState.locked = false;
  earState.startTime = null;
  renderIntervalButtons();
  updateEarProgress();
  showView('ear-playing-view');
  playCurrentInterval();
}
