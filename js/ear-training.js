const ALL_INTERVALS = [
  { id: 'm2', label: 'Minor 2nd',   semitones: 1  },
  { id: 'M2', label: 'Major 2nd',   semitones: 2  },
  { id: 'm3', label: 'Minor 3rd',   semitones: 3  },
  { id: 'M3', label: 'Major 3rd',   semitones: 4  },
  { id: 'P4', label: 'Perfect 4th', semitones: 5  },
  { id: 'TT', label: 'Tritone',     semitones: 6  },
  { id: 'P5', label: 'Perfect 5th', semitones: 7  },
  { id: 'm6', label: 'Minor 6th',   semitones: 8  },
  { id: 'M6', label: 'Major 6th',   semitones: 9  },
  { id: 'm7', label: 'Minor 7th',   semitones: 10 },
  { id: 'M7', label: 'Major 7th',   semitones: 11 },
  { id: 'P8', label: 'Octave',      semitones: 12 },
];

let selectedIntervals = ['P4', 'P5'];

const earState = {
  length: 10,
  sequence: [],
  baseFreqs: [],
  index: 0,
  score: 0,
  locked: false,
  startTime: null,
  activeIntervals: []
};

// FM synthesis — piano-like pluck
function playPiano(freq, startTime, duration) {
  const ctx = getCtx();
  const out = ctx.createGain();
  const osc = ctx.createOscillator();
  const modulator = ctx.createOscillator();
  const modGain = ctx.createGain();

  osc.type = 'sine';
  modulator.type = 'sine';
  modulator.frequency.value = freq * 2;
  modGain.gain.setValueAtTime(freq * 2, startTime);
  modGain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

  out.gain.setValueAtTime(0, startTime);
  out.gain.linearRampToValueAtTime(0.5, startTime + 0.01);
  out.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  modulator.connect(modGain);
  modGain.connect(osc.frequency);
  osc.connect(out);
  out.connect(gainNode);

  osc.start(startTime);
  modulator.start(startTime);
  osc.stop(startTime + duration);
  modulator.stop(startTime + duration);
}

function playCurrentInterval() {
  const ctx = getCtx();
  const interval = ALL_INTERVALS.find(i => i.id === earState.sequence[earState.index]);
  const base = earState.baseFreqs[earState.index];
  const ratio = Math.pow(2, interval.semitones / 12);
  const now = ctx.currentTime;
  playPiano(base, now, 1.5);
  playPiano(base * ratio, now + 0.8, 1.5);
}

function renderSelectionGrid() {
  const container = document.getElementById('interval-selector');
  container.innerHTML = '';
  ALL_INTERVALS.forEach(int => {
    const btn = document.createElement('button');
    btn.className = `btn-ghost${selectedIntervals.includes(int.id) ? ' active-selection' : ''}`;
    btn.textContent = int.label;
    btn.onclick = () => {
      if (selectedIntervals.includes(int.id)) {
        if (selectedIntervals.length > 2) {
          selectedIntervals = selectedIntervals.filter(id => id !== int.id);
          renderSelectionGrid();
        } else {
          const err = document.getElementById('interval-error');
          err.textContent = 'Select at least 2 intervals';
          setTimeout(() => { err.textContent = ''; }, 2000);
        }
      } else {
        selectedIntervals.push(int.id);
        renderSelectionGrid();
      }
    };
    container.appendChild(btn);
  });
}

function updateEarProgress() {
  document.getElementById('ear-progress-text').textContent =
    `${earState.index + 1} / ${earState.length}`;
}

function renderIntervalButtons() {
  const grid = document.getElementById('interval-grid');
  grid.innerHTML = '';
  earState.activeIntervals.forEach(interval => {
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

document.getElementById('ear-start-btn').addEventListener('click', () => {
  earState.length = Math.max(1, Math.min(50,
    parseInt(document.getElementById('ear-length-input').value, 10) || 10));
  earState.activeIntervals = ALL_INTERVALS.filter(i => selectedIntervals.includes(i.id));

  const seq = [], freqs = [];
  for (let i = 0; i < earState.length; i++) {
    let id;
    do {
      id = earState.activeIntervals[Math.floor(Math.random() * earState.activeIntervals.length)].id;
    } while (i > 0 && id === seq[i - 1]);
    seq.push(id);
    freqs.push(110 * Math.pow(2, Math.random() * 1.5));
  }

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
});

renderSelectionGrid();
