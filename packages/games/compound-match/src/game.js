// Compound Match — SUMMIT mini-game (Phase 1).
// Plain ES module. Runs inside an iframe (web) or RN WebView (mobile).
// Uses the @summit/game-sdk protocol via a tiny inline shim so we ship with
// zero bundler in Phase 0.

const SDK_VERSION = 1;
const isRN = typeof window !== 'undefined' && !!window.ReactNativeWebView;

function send(msg) {
  const payload = { v: SDK_VERSION, id: crypto.randomUUID(), ...msg };
  if (isRN) {
    window.ReactNativeWebView.postMessage(JSON.stringify(payload));
  } else {
    window.parent?.postMessage(payload, '*');
  }
}

const ROUNDS = [
  { principal: 1000, rate: 0.06, years: 10 },
  { principal: 500, rate: 0.08, years: 20 },
  { principal: 2500, rate: 0.05, years: 15 },
  { principal: 100, rate: 0.07, years: 30 },
];

function fv(p, r, n) {
  return p * Math.pow(1 + r, n);
}

function fmt(n) {
  return n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
}

function buildChoices(correct) {
  // 3 plausible distractors: linear instead of compound, half compound, double compound.
  const distractors = new Set([
    Math.round(correct * 0.75),
    Math.round(correct * 1.25),
    Math.round(correct * 0.55),
  ]);
  distractors.delete(Math.round(correct));
  const arr = [Math.round(correct), ...Array.from(distractors).slice(0, 3)];
  while (arr.length < 4) arr.push(Math.round(correct * (1 + Math.random())));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const state = {
  index: 0,
  score: 0,
  correctCount: 0,
  startedAt: 0,
  locale: 'en-CA',
  reducedMotion: false,
};

const els = {
  round: document.getElementById('round'),
  score: document.getElementById('score'),
  principal: document.getElementById('principal'),
  rate: document.getElementById('rate'),
  years: document.getElementById('years'),
  prompt: document.getElementById('prompt'),
  choices: document.getElementById('choices'),
  feedback: document.getElementById('feedback'),
  feedbackIcon: document.getElementById('feedback-icon'),
  feedbackText: document.getElementById('feedback-text'),
  next: document.getElementById('next'),
  results: document.getElementById('results'),
  resultsCorrect: document.getElementById('results-correct'),
  resultsTotal: document.getElementById('results-total'),
  resultsMessage: document.getElementById('results-message'),
  playAgain: document.getElementById('play-again'),
};

function renderRound() {
  const r = ROUNDS[state.index];
  els.round.textContent = `${state.index + 1} / ${ROUNDS.length}`;
  els.score.textContent = String(state.score);
  els.principal.textContent = fmt(r.principal);
  els.rate.textContent = `${(r.rate * 100).toFixed(0)}%`;
  els.years.textContent = String(r.years);
  els.feedback.hidden = true;
  els.prompt.hidden = false;
  els.choices.hidden = false;
  els.choices.innerHTML = '';
  const correct = fv(r.principal, r.rate, r.years);
  const options = buildChoices(correct);
  for (const opt of options) {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.type = 'button';
    btn.textContent = fmt(opt);
    btn.addEventListener('click', () => onAnswer(btn, opt, Math.round(correct)));
    els.choices.appendChild(btn);
  }
}

function onAnswer(btn, picked, correct) {
  const isCorrect = picked === correct;
  for (const c of els.choices.querySelectorAll('.choice')) {
    c.disabled = true;
    if (Number(c.textContent.replace(/[^0-9.-]/g, '')) === correct) c.classList.add('correct');
  }
  if (!isCorrect) btn.classList.add('wrong');

  if (isCorrect) {
    state.score += 25;
    state.correctCount += 1;
    els.feedback.setAttribute('data-correct', 'true');
    els.feedbackIcon.textContent = '✓';
    els.feedbackText.textContent = 'Right. Compounding is doing real work.';
  } else {
    els.feedback.setAttribute('data-correct', 'false');
    els.feedbackIcon.textContent = '·';
    els.feedbackText.textContent = `Not quite. The compound formula gives ${fmt(correct)}.`;
  }

  els.score.textContent = String(state.score);
  els.feedback.hidden = false;

  send({ kind: 'summit:score', score: state.score });
}

els.next.addEventListener('click', () => {
  state.index += 1;
  if (state.index >= ROUNDS.length) {
    finish();
  } else {
    renderRound();
  }
});

els.playAgain.addEventListener('click', () => {
  state.index = 0;
  state.score = 0;
  state.correctCount = 0;
  state.startedAt = performance.now();
  els.results.hidden = true;
  renderRound();
});

function finish() {
  const durationMs = Math.round(performance.now() - state.startedAt);
  els.prompt.hidden = true;
  els.choices.hidden = true;
  els.feedback.hidden = true;
  els.results.hidden = false;
  els.resultsCorrect.textContent = String(state.correctCount);
  els.resultsTotal.textContent = String(ROUNDS.length);
  els.resultsMessage.textContent =
    state.correctCount === ROUNDS.length
      ? 'Perfect run. Your XP just bumped up.'
      : 'Compounding rewards patience. Try again to earn more XP.';

  send({
    kind: 'summit:complete',
    score: state.score,
    correctCount: state.correctCount,
    totalCount: ROUNDS.length,
    durationMs,
    metrics: { roundsPlayed: ROUNDS.length },
  });
}

// Listen for host messages.
window.addEventListener('message', (event) => {
  const data = typeof event.data === 'string' ? safeJson(event.data) : event.data;
  if (!data || typeof data !== 'object' || data.v !== SDK_VERSION) return;
  if (data.kind === 'summit:init') {
    state.locale = data.locale ?? 'en-CA';
    state.reducedMotion = !!data.reducedMotion;
    state.startedAt = performance.now();
    renderRound();
  } else if (data.kind === 'summit:pause') {
    // future: pause timer
  } else if (data.kind === 'summit:resume') {
    // future: resume
  } else if (data.kind === 'summit:end') {
    finish();
  }
});

function safeJson(s) {
  try { return JSON.parse(s); } catch { return null; }
}

// Announce readiness; the host will reply with summit:init.
send({ kind: 'summit:ready', sdkVersion: SDK_VERSION, capabilities: ['score', 'xp'] });

// If the host never sends init (e.g. during direct dev open), start anyway after 250 ms.
setTimeout(() => {
  if (state.startedAt === 0) {
    state.startedAt = performance.now();
    renderRound();
  }
}, 250);
