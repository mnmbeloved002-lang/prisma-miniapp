import {
  chebyshev,
  countByBody,
  countBySocialGroup,
  type District,
  type GameState,
  getDistrictByResidentId,
  getFirstVictim,
  getLastVictim,
  hasVictim,
  isCentral4x4,
  type MotiveId,
  manhattan,
  type Resident,
  type RuleDecision,
  type RuleReason,
  remainingKillsAfterThis,
  sameCoord,
  setOfAges,
} from './types';

type Ctx = Readonly<{
  state: GameState;
  victimId: string;
  victim: Resident;
  victimDistrict: District;
}>;

function deny(ruleId: RuleReason['ruleId'], message: string): RuleReason {
  return { ruleId, message };
}

function baseContext(state: GameState, victimId: string): RuleDecision | Ctx {
  const victim = state.residents[victimId];
  if (!victim) {
    return {
      ok: false,
      reasons: [deny('R_BASE_VICTIM_EXISTS', 'Victim does not exist in state.residents')],
    };
  }

  if (hasVictim(state, victimId)) {
    return {
      ok: false,
      reasons: [deny('R_BASE_VICTIM_ALIVE', 'Victim already dead (present in state.victims)')],
    };
  }

  if (victim.role === 'KILLER') {
    return {
      ok: false,
      reasons: [deny('R_BASE_NOT_KILLER', 'Killer cannot kill themselves')],
    };
  }

  const victimDistrict = getDistrictByResidentId(state, victimId);
  if (!victimDistrict) {
    return {
      ok: false,
      reasons: [
        deny('R_BASE_VICTIM_EXISTS', 'Victim has no district placement (not found in districts)'),
      ],
    };
  }

  if (sameCoord(victimDistrict.coord, state.detectiveCoord)) {
    return {
      ok: false,
      reasons: [deny('R_BASE_NOT_IN_DETECTIVE_DISTRICT', 'Cannot kill in detective district')],
    };
  }

  return { state, victimId, victim, victimDistrict };
}

function vSadist(ctx: Ctx): RuleReason[] {
  if (ctx.victim.intimidated) {
    return [deny('R_MOTIVE_SADIST_NO_INTIMIDATED', 'SADIST: cannot kill intimidated residents')];
  }
  return [];
}

function vHitman(ctx: Ctx): RuleReason[] {
  if (ctx.victimDistrict.residentIds.length !== 1) {
    return [
      deny(
        'R_MOTIVE_HITMAN_DISTRICT_MUST_HAVE_EXACTLY_ONE_RESIDENT',
        'HITMAN: district must contain exactly 1 resident',
      ),
    ];
  }
  return [];
}

function vThug(ctx: Ctx): RuleReason[] {
  if (isCentral4x4(ctx.victimDistrict.coord)) {
    return [
      deny('R_MOTIVE_THUG_NO_CENTRAL_DISTRICTS', 'THUG: cannot kill in central 2×2 districts'),
    ];
  }
  return [];
}

function vVigilante(ctx: Ctx): RuleReason[] {
  // Forbidden “around detective”: 3×3 centered at detective, excluding detective district (already forbidden by base)
  if (chebyshev(ctx.victimDistrict.coord, ctx.state.detectiveCoord) <= 1) {
    return [
      deny(
        'R_MOTIVE_VIGILANTE_NO_AROUND_DETECTIVE',
        'VIGILANTE: cannot kill in 3×3 around detective',
      ),
    ];
  }
  return [];
}

function vRobber(ctx: Ctx): RuleReason[] {
  const last = getLastVictim(ctx.state);
  if (last && manhattan(last.crimeCoord, ctx.victimDistrict.coord) === 1) {
    return [
      deny(
        'R_MOTIVE_ROBBER_NO_ADJACENT_TO_PREV_CRIME',
        'ROBBER: cannot kill adjacent to previous crime scene',
      ),
    ];
  }
  return [];
}

function vManiac(ctx: Ctx): RuleReason[] {
  const first = getFirstVictim(ctx.state);
  if (!first) {
    return [];
  }
  const firstVictim = ctx.state.residents[first.victimId];
  if (!firstVictim) {
    return [];
  }
  if (firstVictim.gender !== ctx.victim.gender) {
    return [deny('R_MOTIVE_MANIAC_SAME_GENDER', 'MANIAC: all victims must be same gender')];
  }
  return [];
}

function vTerrorist(ctx: Ctx): RuleReason[] {
  const seen = new Set<string>();
  for (const v of ctx.state.victims) {
    const r = ctx.state.residents[v.victimId];
    if (r) {
      seen.add(r.socialGroup);
    }
  }
  if (seen.has(ctx.victim.socialGroup)) {
    return [
      deny(
        'R_MOTIVE_TERRORIST_ALL_UNIQUE_SOCIAL_GROUPS',
        'TERRORIST: all victims must be from distinct groups',
      ),
    ];
  }
  return [];
}

function vPsychopath(ctx: Ctx): RuleReason[] {
  const ages = setOfAges(ctx.state);
  ages.add(ctx.victim.age);
  if (ages.size > 2) {
    return [
      deny('R_MOTIVE_PSYCHOPATH_MAX_TWO_AGES', 'PSYCHOPATH: victims must be max 2 ages total'),
    ];
  }
  return [];
}

function vCannibal(ctx: Ctx): RuleReason[] {
  // Feasibility: after this kill, missing body types must be <= remaining kills
  const bodyCounts = countByBody(ctx.state);
  bodyCounts.set(ctx.victim.body, (bodyCounts.get(ctx.victim.body) ?? 0) + 1);

  const missing = [...bodyCounts.entries()].filter(([, n]) => n === 0).length;
  const rem = remainingKillsAfterThis(ctx.state);

  if (missing > rem) {
    return [
      deny(
        'R_MOTIVE_CANNIBAL_MUST_REMAIN_FEASIBLE_FOR_ALL_BODY_TYPES',
        'CANNIBAL: move would make it impossible to cover all body types within remaining kills',
      ),
    ];
  }
  return [];
}

function vRadical(ctx: Ctx): RuleReason[] {
  // Feasibility: after this kill, must still be possible to reach 3 victims of some group
  const groupCounts = countBySocialGroup(ctx.state);
  groupCounts.set(ctx.victim.socialGroup, (groupCounts.get(ctx.victim.socialGroup) ?? 0) + 1);

  let currentMax = 0;
  for (const n of groupCounts.values()) {
    currentMax = Math.max(currentMax, n);
  }

  const rem = remainingKillsAfterThis(ctx.state);
  const maxPossible = currentMax + rem;

  if (maxPossible < 3) {
    return [
      deny(
        'R_MOTIVE_RADICAL_MUST_REMAIN_FEASIBLE_FOR_3_SAME_SOCIAL_GROUP',
        'RADICAL: move would make it impossible to reach 3 victims of one group',
      ),
    ];
  }
  return [];
}

function vSpy(ctx: Ctx): RuleReason[] {
  if (!ctx.state.suspectId) {
    return [deny('R_MOTIVE_SPY_REQUIRES_SUSPECT', 'SPY: requires suspectId')];
  }
  const suspect = ctx.state.residents[ctx.state.suspectId];
  if (!suspect) {
    return [deny('R_MOTIVE_SPY_REQUIRES_SUSPECT', 'SPY: suspectId not found in residents')];
  }

  const reasons: RuleReason[] = [];

  if (ctx.state.victims.length === 0) {
    if (ctx.victim.socialGroup === suspect.socialGroup) {
      reasons.push(
        deny(
          'R_MOTIVE_SPY_FIRST_VICTIM_DIFF_FROM_SUSPECT_GROUP',
          'SPY: first victim must differ from suspect social group',
        ),
      );
    }
  } else {
    const last = getLastVictim(ctx.state);
    const lastVictim = last ? ctx.state.residents[last.victimId] : undefined;
    if (lastVictim && ctx.victim.socialGroup === lastVictim.socialGroup) {
      reasons.push(
        deny(
          'R_MOTIVE_SPY_MUST_CHANGE_GROUP_EACH_KILL',
          'SPY: must change victim social group after each kill',
        ),
      );
    }
  }

  // Must kill suspect by end (final feasibility)
  const rem = remainingKillsAfterThis(ctx.state);
  const suspectAlive = !hasVictim(ctx.state, ctx.state.suspectId);
  if (suspectAlive && rem === 0 && ctx.victimId !== ctx.state.suspectId) {
    reasons.push(
      deny('R_MOTIVE_SPY_MUST_KILL_SUSPECT_BY_END', 'SPY: suspect must be killed by end'),
    );
  }

  return reasons;
}

function vCultist(ctx: Ctx): RuleReason[] {
  if (!ctx.state.suspectId) {
    return [deny('R_MOTIVE_CULTIST_REQUIRES_SUSPECT', 'CULTIST: requires suspectId')];
  }

  const reasons: RuleReason[] = [];
  const suspectAlive = !hasVictim(ctx.state, ctx.state.suspectId);

  if (ctx.victimId === ctx.state.suspectId && ctx.state.round === 1) {
    reasons.push(
      deny(
        'R_MOTIVE_CULTIST_CANNOT_KILL_SUSPECT_IN_ROUND_1',
        'CULTIST: cannot kill suspect in round 1',
      ),
    );
  }

  // If already 4 victims and suspect alive → 5th must be suspect
  if (ctx.state.victims.length === 4 && suspectAlive && ctx.victimId !== ctx.state.suspectId) {
    reasons.push(
      deny(
        'R_MOTIVE_CULTIST_FORCE_SUSPECT_AT_5TH_KILL',
        'CULTIST: 5th kill must be suspect if alive',
      ),
    );
  }

  // Feasibility at final kill
  const rem = remainingKillsAfterThis(ctx.state);
  if (suspectAlive && rem === 0 && ctx.victimId !== ctx.state.suspectId) {
    reasons.push(
      deny('R_MOTIVE_CULTIST_FORCE_SUSPECT_AT_5TH_KILL', 'CULTIST: suspect must be killed by end'),
    );
  }

  return reasons;
}

const validators: Partial<Record<MotiveId, (ctx: Ctx) => RuleReason[]>> = {
  SADIST: vSadist,
  HITMAN: vHitman,
  THUG: vThug,
  VIGILANTE: vVigilante,
  ROBBER: vRobber,
  MANIAC: vManiac,
  TERRORIST: vTerrorist,
  PSYCHOPATH: vPsychopath,
  CANNIBAL: vCannibal,
  RADICAL: vRadical,
  SPY: vSpy,
  CULTIST: vCultist,
};

export function canKillNow(state: GameState, victimId: string): RuleDecision {
  const ctxOrDecision = baseContext(state, victimId);
  if ('ok' in ctxOrDecision) {
    return ctxOrDecision;
  }

  const ctx = ctxOrDecision;
  const validate = validators[state.motive];
  const reasons = validate ? validate(ctx) : [];

  return { ok: reasons.length === 0, reasons };
}
