function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function flashCell(fret, cls, ms) {
  const el = document.querySelector(`.fret-cell[data-fret="${fret}"]`);
  if (!el) return;
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), ms);
}

function flashIntervalBtn(id, cls, ms) {
  const el = document.querySelector(`.interval-btn[data-interval="${id}"]`);
  if (!el) return;
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), ms);
}

// ─── Home ────────────────────────────────────────────────
document.getElementById('go-burst').addEventListener('click', () => showView('setup-view'));
document.getElementById('go-ear').addEventListener('click', () => showView('ear-setup-view'));

// ─── Note burst ──────────────────────────────────────────
document.getElementById('burst-back').addEventListener('click', () => showView('home-view'));
document.getElementById('start-btn').addEventListener('click', startNoteBurst);
document.getElementById('retry-btn').addEventListener('click', () => showView('setup-view'));
document.getElementById('burst-results-home').addEventListener('click', () => showView('home-view'));

// ─── Ear training ────────────────────────────────────────
document.getElementById('ear-back').addEventListener('click', () => showView('home-view'));
document.getElementById('ear-start-btn').addEventListener('click', startEarTraining);
document.getElementById('replay-btn').addEventListener('click', playCurrentInterval);
document.getElementById('ear-retry-btn').addEventListener('click', () => showView('ear-setup-view'));
document.getElementById('ear-results-home').addEventListener('click', () => showView('home-view'));

// ─── Volume ──────────────────────────────────────────────
document.getElementById('volume-slider').addEventListener('input', e => {
  if (gainNode) gainNode.gain.value = parseFloat(e.target.value);
});

document.getElementById('ear-volume-slider').addEventListener('input', e => {
  if (gainNode) gainNode.gain.value = parseFloat(e.target.value);
});
