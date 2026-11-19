// Leonida Platinum Planner — boot, checklist render, roadmap render, trophy detail panel.
// Vanilla ES module, no libraries. The trophy data is loaded from data/trophies.json, a local file;
// the app makes no network request at run time.
import { loadEarned, saveEarned, downloadExport, parseImportDoc } from './storage.js';
import { ROADMAP_STAGES, stageProgress, nextUp } from './roadmap.js';
import { readFilters, trophyMatches, isSpoilerHidden } from './filters.js';

const rowsEl = document.getElementById('rows');
const detailBody = document.getElementById('detailBody');
const detailHint = document.getElementById('detailHint');

let trophies = [];
let earned = loadEarned();
let selectedId = null;
let activeStage = null;

const GRADE_LABELS = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };

function formatCount(trophy) {
  if (trophy.count === null || trophy.count === undefined) return '—';
  if (trophy.count >= 1000) return `0 / ${trophy.count.toLocaleString('en-US')}`;
  return `0 / ${trophy.count}`;
}

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderProgress() {
  const total = trophies.length;
  const done = trophies.filter((t) => earned.has(t.name)).length;
  document.getElementById('progressText').textContent = `${done} of ${total} earned`;
  document.getElementById('progressPct').textContent = total ? `${Math.round((done / total) * 100)}%` : '0%';
  document.getElementById('progressFill').style.width = total ? `${(done / total) * 100}%` : '0%';
  const counts = document.getElementById('gradeCounts');
  counts.replaceChildren();
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const ofGrade = trophies.filter((t) => t.grade === grade);
    const got = ofGrade.filter((t) => earned.has(t.name)).length;
    const span = el('span', null, `${GRADE_LABELS[grade]} `);
    span.append(el('b', null, `${got}/${ofGrade.length}`));
    counts.append(span);
  }
}

function renderNextUp() {
  const pick = nextUp(trophies, earned);
  const nameEl = document.getElementById('nextUpName');
  const whyEl = document.getElementById('nextUpWhy');
  const goBtn = document.getElementById('nextUpGo');
  if (!pick) {
    nameEl.textContent = 'Platinum earned — every trophy is ticked off.';
    whyEl.textContent = '';
    goBtn.hidden = true;
    return;
  }
  goBtn.hidden = false;
  nameEl.textContent = pick.trophy.name;
  whyEl.textContent = pick.why;
  goBtn.onclick = () => showDetail(pick.trophy.id);
}

function renderRoadmap() {
  const wrap = document.getElementById('stages');
  wrap.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const { done, total } = stageProgress(stage, trophies, earned);
    const card = el('button', 'stage' + (activeStage === stage.id ? ' active' : ''));
    card.type = 'button';
    card.addEventListener('click', () => {
      activeStage = activeStage === stage.id ? null : stage.id;
      document.getElementById('stageFilter').value = activeStage === null ? 'all' : String(activeStage);
      renderAll();
    });
    const title = el('h3');
    title.append(el('span', 'num', `${stage.id}.`));
    title.append(document.createTextNode(stage.title));
    card.append(title);
    card.append(el('p', null, stage.blurb));
    card.append(el('div', 'stage-prog', `${done}/${total} earned`));
    const missable = stage.trophyIds
      .map((id) => trophies.find((x) => x.id === id))
      .filter((t) => t && t.missable);
    card.append(el('div', 'stage-meta', `${total} trophies · ${missable.length} missable`));
    card.append(el('div', 'stage-miss', missable.length
      ? `⚑ ${missable.map((t) => t.name).join(', ')}`
      : 'No missable trophies in this stage.'));
    wrap.append(card);
  }
}

function renderList() {
  const filters = readFilters(document);
  const shown = trophies.filter((t) => trophyMatches(t, filters, earned));
  rowsEl.replaceChildren();
  for (const t of shown) {
    const tr = document.createElement('tr');
    if (selectedId === t.id) tr.classList.add('selected');
    if (earned.has(t.name)) tr.classList.add('earned-row');
    tr.addEventListener('click', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'BUTTON') return;
      showDetail(t.id);
    });

    const checkCell = el('td', 'col-check');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', () => {
      toggleEarned(t);
    });
    checkCell.append(box);
    tr.append(checkCell);

    const nameCell = el('td');
    const hidden = isSpoilerHidden(t, filters, earned);
    const nameDiv = el('div', 't-name', hidden ? '??? — story trophy (hidden)' : t.name);
    const descDiv = el('div', 't-desc', hidden ? 'Hidden until earned — turn off “Hide story spoilers” to reveal it.' : t.description);
    nameCell.append(nameDiv, descDiv);
    if (t.missable) nameCell.append(el('div', 'miss-flag', '⚑ Missable — do it while the moment is open'));
    tr.append(nameCell);

    const gradeCell = el('td');
    gradeCell.append(el('span', `badge ${t.grade}`, t.grade));
    tr.append(gradeCell);

    tr.append(el('td', 'kind', t.kind));
    tr.append(el('td', 'target', formatCount(t)));

    const btnCell = el('td');
    const guideBtn = el('button', 'guide-btn', 'Guide');
    guideBtn.type = 'button';
    guideBtn.addEventListener('click', () => showDetail(t.id));
    btnCell.append(guideBtn);
    tr.append(btnCell);

    rowsEl.append(tr);
  }
  document.getElementById('emptyMsg').hidden = shown.length !== 0;
  document.getElementById('shownCount').textContent = `Showing ${shown.length} of ${trophies.length}`;
}

function showDetail(id) {
  const t = trophies.find((x) => x.id === id);
  if (!t) return;
  selectedId = id;
  const filters = readFilters(document);
  const hidden = isSpoilerHidden(t, filters, earned);
  detailHint.hidden = true;
  detailBody.hidden = false;
  const gradeEl = document.getElementById('detailGrade');
  gradeEl.replaceChildren(el('span', `badge ${t.grade}`, t.grade));
  document.getElementById('detailName').textContent = hidden ? '??? — story trophy (hidden)' : t.name;
  document.getElementById('detailDesc').textContent = hidden
    ? 'Hidden until earned — turn off “Hide story spoilers” to reveal it.'
    : t.description;
  document.getElementById('detailKind').textContent = t.kind;
  const stage = ROADMAP_STAGES.find((s) => s.id === t.roadmap_stage);
  document.getElementById('detailStage').textContent = stage ? `Stage ${stage.id} — ${stage.title}` : '—';
  document.getElementById('detailCount').textContent = formatCount(t);
  document.getElementById('detailMissable').textContent = t.missable
    ? `Yes — ${t.missable_reason}`
    : `No — ${t.missable_reason}`;
  document.getElementById('detailGuide').textContent = t.guide;
  const sourcesEl = document.getElementById('detailSources');
  sourcesEl.replaceChildren();
  for (const s of t.sources || []) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.textContent = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    li.append(document.createTextNode(`${s.name}: `), a);
    sourcesEl.append(li);
  }
  const check = document.getElementById('detailCheck');
  check.checked = earned.has(t.name);
  check.onchange = () => toggleEarned(t);
  renderList();
}

function toggleEarned(trophy) {
  if (earned.has(trophy.name)) earned.delete(trophy.name);
  else earned.add(trophy.name);
  saveEarned(earned);
  renderAll();
  if (selectedId === trophy.id) showDetail(trophy.id);
}

function renderAll() {
  renderProgress();
  renderNextUp();
  renderRoadmap();
  renderList();
}

async function boot() {
  const response = await fetch('data/trophies.json');
  const doc = await response.json();
  trophies = doc.trophies;
  for (const id of ['search', 'gradeFilter', 'kindFilter', 'statusFilter', 'stageFilter', 'spoilerToggle']) {
    document.getElementById(id).addEventListener('input', () => {
      if (id === 'stageFilter') activeStage = document.getElementById('stageFilter').value === 'all' ? null : Number(document.getElementById('stageFilter').value);
      renderAll();
    });
  }
  document.getElementById('exportBtn').addEventListener('click', () => downloadExport(earned, trophies.length));
  document.getElementById('importFile').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const result = parseImportDoc(await file.text(), new Set(trophies.map((t) => t.name)));
    const status = document.getElementById('importStatus');
    if (result.error) {
      status.textContent = `Import failed: ${result.error}`;
    } else {
      earned = result.earned;
      saveEarned(earned);
      renderAll();
      status.textContent = `Imported ${earned.size} earned trophies.`;
    }
    event.target.value = '';
  });
  renderAll();
}

boot();
