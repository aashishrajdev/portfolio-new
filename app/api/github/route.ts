import { NextResponse } from "next/server";

/**
 * Revalidate the contribution data at most once per hour. The upstream public
 * API is best-effort; on any failure we fall back to deterministic placeholder
 * data so the route NEVER throws and the build/runtime never breaks.
 */
export const revalidate = 3600;

const GITHUB_USER = "aashishrajdev";
const UPSTREAM = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`;

/** Contribution levels mirror GitHub's 0–4 intensity scale. */
export type ContribLevel = 0 | 1 | 2 | 3 | 4;

export interface ContribDay {
  date: string;
  count: number;
  level: ContribLevel;
}

export interface ContribResponse {
  total: number;
  days: ContribDay[];
  /** True when the payload is generated placeholder data (upstream failed). */
  fallback: boolean;
}

interface JogruberDay {
  date: string;
  count: number;
  level: number;
}

interface JogruberPayload {
  total: Record<string, number>;
  contributions: JogruberDay[];
}

function clampLevel(level: number): ContribLevel {
  if (level <= 0) return 0;
  if (level >= 4) return 4;
  return Math.round(level) as ContribLevel;
}

/**
 * Deterministic placeholder: 53 weeks * 7 days ending today. Uses a stable
 * hash so SSR and any re-render agree, and so the build is reproducible.
 */
function buildFallback(): ContribResponse {
  const days: ContribDay[] = [];
  let total = 0;

  const today = new Date();
  // Anchor to the most recent Saturday so the last column is full-ish.
  const end = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );

  const SPAN = 53 * 7;
  for (let i = SPAN - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCDate(end.getUTCDate() - i);

    const seed = (d.getUTCFullYear() * 372 + (d.getUTCMonth() + 1) * 31 + d.getUTCDate()) * 2654435761;
    const v = (seed >>> 0) % 100; // 0..99
    let level: ContribLevel = 0;
    let count = 0;
    if (v >= 45 && v < 68) {
      level = 1;
      count = 1 + (v % 2);
    } else if (v >= 68 && v < 84) {
      level = 2;
      count = 3 + (v % 3);
    } else if (v >= 84 && v < 95) {
      level = 3;
      count = 6 + (v % 4);
    } else if (v >= 95) {
      level = 4;
      count = 10 + (v % 6);
    }

    total += count;
    days.push({
      date: d.toISOString().slice(0, 10),
      count,
      level,
    });
  }

  return { total, days, fallback: true };
}

export async function GET() {
  try {
    const res = await fetch(UPSTREAM, {
      // Let Next cache + revalidate the upstream fetch.
      next: { revalidate },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(buildFallback());
    }

    const data = (await res.json()) as JogruberPayload;

    if (!Array.isArray(data?.contributions) || data.contributions.length === 0) {
      return NextResponse.json(buildFallback());
    }

    // Keep the trailing 53 weeks (371 days) so the grid is bounded.
    const SPAN = 53 * 7;
    const slice = data.contributions.slice(-SPAN);

    const days: ContribDay[] = slice.map((d) => ({
      date: d.date,
      count: Number.isFinite(d.count) ? d.count : 0,
      level: clampLevel(d.level),
    }));

    const total = days.reduce((sum, d) => sum + d.count, 0);

    return NextResponse.json({ total, days, fallback: false } satisfies ContribResponse);
  } catch {
    return NextResponse.json(buildFallback());
  }
}
