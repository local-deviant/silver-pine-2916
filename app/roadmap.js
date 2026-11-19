// The five-stage roadmap to the platinum, built from the official trophy descriptions:
// which story chapters and missions, which stranger strands, which activities, which collectibles and counts.
// Stage membership is by trophy id, so the planner and the checklist always agree.
export const ROADMAP_STAGES = [
  {
    id: 1,
    title: 'Story first',
    blurb: 'Chapters 1–4, the named missions and the finale. Play the story straight through.',
    trophyIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    id: 2,
    title: 'Stranger strands',
    blurb: 'All 8 stranger strands, the 5 named finals, Bret’s hunt. Do these before the finale.',
    trophyIds: [22, 23, 24, 25, 26, 27, 29],
  },
  {
    id: 3,
    title: 'Activities',
    blurb: 'Stunts, shooting range, drone races, races, fishing, arcade, meditation. Skill grinds.',
    trophyIds: [15, 16, 17, 18, 19, 20, 21, 28],
  },
  {
    id: 4,
    title: 'Collectibles & counts',
    blurb: 'Cards, WAiNK spots, vehicles, challenges, all 52 areas of Leonida. Explore everything.',
    trophyIds: [30, 31, 32, 35, 42],
  },
  {
    id: 5,
    title: 'Cleanup & platinum',
    blurb: 'Robberies, wanted level, money, properties — then 100% and the platinum itself.',
    trophyIds: [1, 14, 33, 34, 36, 37, 38, 39, 40, 41, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55],
  },
];

// Stage of a trophy, by id.
export function stageOf(trophy) {
  for (const stage of ROADMAP_STAGES) {
    if (stage.trophyIds.includes(trophy.id)) return stage;
  }
  return null;
}

// How many of a stage's trophies are earned.
export function stageProgress(stage, trophies, earned) {
  const total = stage.trophyIds.length;
  const done = stage.trophyIds.filter((id) => {
    const t = trophies.find((x) => x.id === id);
    return t && earned.has(t.name);
  }).length;
  return { done, total };
}

// Next Up: the earliest-stage trophy not yet earned, preferring a missable one in that stage
// so a trophy that can close is never left for last.
export function nextUp(trophies, earned) {
  const remaining = trophies.filter((t) => !earned.has(t.name));
  if (remaining.length === 0) return null;
  remaining.sort((a, b) => {
    const stageDiff = a.roadmap_stage - b.roadmap_stage;
    if (stageDiff !== 0) return stageDiff;
    if (a.missable !== b.missable) return a.missable ? -1 : 1;
    return a.id - b.id;
  });
  const pick = remaining[0];
  const stage = stageOf(pick);
  const why = pick.missable
    ? `Stage ${pick.roadmap_stage} · ${stage ? stage.title : ''} — missable, do it while the moment is open.`
    : `Stage ${pick.roadmap_stage} · ${stage ? stage.title : ''} — the earliest unfinished stage.`;
  return { trophy: pick, why };
}
