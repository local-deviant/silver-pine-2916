// Filters, search and the spoiler setting for the trophy checklist.
// Story trophies are the spoiler risk: while the setting is on, an unearned story
// trophy shows "???" instead of its name and description until it is earned.
export const STORY_KIND = 'story';

// Current filter state, read from the controls.
export function readFilters(doc) {
  return {
    query: doc.getElementById('search').value.trim().toLowerCase(),
    grade: doc.getElementById('gradeFilter').value,
    kind: doc.getElementById('kindFilter').value,
    status: doc.getElementById('statusFilter').value,
    stage: doc.getElementById('stageFilter').value,
    spoiler: doc.getElementById('spoilerToggle').checked,
  };
}

// Does one trophy pass the filters? Earned state comes from the caller.
export function trophyMatches(trophy, filters, earned) {
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.kind === 'missable' && !trophy.missable) return false;
  if (filters.kind === 'online') return false; // the official list has no online trophies
  if (filters.kind !== 'all' && filters.kind !== 'missable' && trophy.kind !== filters.kind) return false;
  if (filters.status === 'earned' && !earned.has(trophy.name)) return false;
  if (filters.status === 'todo' && earned.has(trophy.name)) return false;
  if (filters.stage !== 'all' && String(trophy.roadmap_stage) !== filters.stage) return false;
  if (filters.query && !trophy.name.toLowerCase().includes(filters.query)) return false;
  return true;
}

// Is this trophy's name and description hidden by the spoiler setting right now?
export function isSpoilerHidden(trophy, filters, earned) {
  return filters.spoiler && trophy.kind === STORY_KIND && !earned.has(trophy.name);
}
