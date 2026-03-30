import { useMemo } from "react";
import { works } from "../../../works";
import type { Work } from "../../../works/types";

/** 桌面端右栏作品：与 `works` 数组顺序无关 */
const WORK_IDS_LEFT_COLUMN = ["1", "3", "5"] as const;
const WORK_IDS_RIGHT_COLUMN = ["2", "4"] as const;

function worksInIdsOrder(all: Work[], ids: readonly string[]): Work[] {
  return ids.map((id) => all.find((w) => w.id === id)).filter((w): w is Work => Boolean(w));
}

function interleaveByIndex<T>(left: T[], right: T[]): T[] {
  const out: T[] = [];
  const max = Math.max(left.length, right.length);
  for (let i = 0; i < max; i += 1) {
    if (left[i]) out.push(left[i]);
    if (right[i]) out.push(right[i]);
  }
  return out;
}

export function useWorksColumns() {
  const worksLeftColumn = useMemo(() => worksInIdsOrder(works, WORK_IDS_LEFT_COLUMN), []);
  const worksRightColumn = useMemo(() => worksInIdsOrder(works, WORK_IDS_RIGHT_COLUMN), []);
  const worksInterleaved = useMemo(
    () => interleaveByIndex(worksLeftColumn, worksRightColumn),
    [worksLeftColumn, worksRightColumn]
  );

  return { worksLeftColumn, worksRightColumn, worksInterleaved };
}
