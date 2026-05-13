const STRINGS = {
  E: ['E','F','F#','G','G#','A','A#','B','C','C#','D','D#'],
  A: ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#'],
  D: ['D','D#','E','F','F#','G','G#','A','A#','B','C','C#'],
  G: ['G','G#','A','A#','B','C','C#','D','D#','E','F','F#'],
  B: ['B','C','C#','D','D#','E','F','F#','G','G#','A','A#'],
  e: ['E','F','F#','G','G#','A','A#','B','C','C#','D','D#']
};

const OPEN_FREQ = { E: 82.41, A: 110.00, D: 146.83, G: 196.00, B: 246.94, e: 329.63 };

const state = {
  stringId: 'E', length: 10, sequence: [],
  index: 0, score: 0, locked: false, startTime: null
};

function buildSequence(len) {
  const seq = [];
  for (let i = 0; i < len; i++) {
    let f;
    do { f = Math.floor(Math.random() * 12); } while (i > 0 && f === seq[i - 1]);
    seq.push(f);
  }
  return seq;
}

function updatePrompt() {
  document.getElementById('current-note').textContent =
    STRINGS[state.stringId][state.sequence[state.index]];
  document.getElementById('progress-text').textContent =
    `${state.index + 1} / ${state.length}`;
}

function renderFretboard() {
  const fb = document.getElementById('fretboard');
  fb.innerHTML = '';
  STRINGS[state.stringId].forEach((_, i) => {
    const cell = document.createElement('div');
    cell.className = 'fret-cell';
    cell.dataset.fret = i;
    const lbl = document.createElement('span');
    lbl.className = 'note-label';
    lbl.textContent = i;
    cell.appendChild(lbl);
    cell.addEventListener('click', () => handleAnswer(i));
    fb.appendChild(cell);
  });
}

function handleAnswer(fret) {
  if (state.locked) return;
  state.locked = true;
  if (!state.startTime) state.startTime = Date.now();

  pluck(state.stringId, fret);

  const expected = state.sequence[state.index];
  if (fret === expected) {
    state.score++;
    flashCell(fret, 'flash-correct', 300);
  } else {
    flashCell(fret, 'flash-wrong', 300);
    flashCell(expected, 'flash-hint', 300);
  }

  setTimeout(() => {
    state.locked = false;
    state.index++;
    if (state.index >= state.length) {
      const elapsed = ((Date.now() - state.startTime) / 1000).toFixed(1);
      document.getElementById('score-text').textContent = `${state.score} / ${state.length}`;
      document.getElementById('time-text').textContent = `${elapsed}s`;
      showView('results-view');
    } else {
      updatePrompt();
    }
  }, 350);
}

function startNoteBurst() {
  state.stringId = document.getElementById('string-select').value;
  state.length = Math.max(1, Math.min(50,
    parseInt(document.getElementById('length-input').value, 10) || 10));
  state.sequence = buildSequence(state.length);
  state.index = 0;
  state.score = 0;
  state.locked = false;
  state.startTime = null;
  document.getElementById('string-label').textContent = state.stringId;
  renderFretboard();
  updatePrompt();
  showView('playing-view');
}
