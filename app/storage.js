// Progress storage for the Leonida Platinum Planner: localStorage plus export/import of the earned set.
// Nothing here touches the network; the file is a plain JSON download the reader owns.
export const STORAGE_KEY = 'gta6-trophy-planner-v1';

// Read the saved earned set. Unknown or malformed data is ignored so a bad save never breaks the guide.
export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((name) => typeof name === 'string'));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort()));
}

// Build the export document: the app's own format, versioned so imports can be checked.
export function buildExportDoc(earned, total) {
  return {
    app: 'leonida-platinum-planner',
    version: 1,
    exportedAt: new Date().toISOString(),
    total,
    earned: [...earned].sort(),
  };
}

export function downloadExport(earned, total) {
  const doc = buildExportDoc(earned, total);
  const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gta6-trophy-progress.json';
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Validate an imported file. Returns { earned: Set } or { error: string }.
export function parseImportDoc(text, knownNames) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { error: 'That file is not valid JSON.' };
  }
  // Accept the planner's own export format, and a bare array of trophy names as a fallback.
  let names;
  if (Array.isArray(parsed)) {
    names = parsed;
  } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.earned)) {
    if (parsed.app && parsed.app !== 'leonida-platinum-planner') {
      return { error: 'That file is from a different app.' };
    }
    names = parsed.earned;
  } else {
    return { error: 'That file does not hold a trophy progress list.' };
  }
  const unknown = names.filter((n) => typeof n !== 'string' || !knownNames.has(n));
  if (unknown.length > 0) {
    return { error: `That file names ${unknown.length} trophy${unknown.length === 1 ? '' : 'ies'} this guide does not know: ${unknown.slice(0, 3).join(', ')}${unknown.length > 3 ? '…' : ''}` };
  }
  return { earned: new Set(names) };
}
