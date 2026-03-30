import { useEffect, useState } from "react";
import type { Work } from "../../../works/types";

function preloadAsset(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    const done = () => resolve();
    img.onload = () => {
      if (typeof img.decode === "function") {
        img.decode().then(done).catch(done);
        return;
      }
      done();
    };
    img.onerror = done;
    img.src = src;
    if (img.complete) {
      if (typeof img.decode === "function") {
        img.decode().then(done).catch(done);
      } else {
        done();
      }
    }
  });
}

/**
 * 首屏关键图预加载 + 空闲渐进预热；用于 Works 列表闸门。
 */
export function useWorksImagePreload(worksInterleaved: Work[]) {
  const [pageLoadNonce] = useState(() => Date.now());
  const [cardsReadyForReveal, setCardsReadyForReveal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setCardsReadyForReveal(false);

    const criticalWorks = worksInterleaved.slice(0, 3);
    const criticalSet = new Set<string>();
    for (const work of criticalWorks) {
      if (work.image) criticalSet.add(work.image);
      if (work.overlayIcon) criticalSet.add(work.overlayIcon);
    }
    const criticalAssets = Array.from(criticalSet);

    const revealNow = () => {
      if (!cancelled) setCardsReadyForReveal(true);
    };

    if (criticalAssets.length === 0) {
      revealNow();
    } else {
      const warmup = Promise.all(criticalAssets.map(preloadAsset)).then(() => true);
      const failSafe = new Promise<boolean>((resolve) => {
        window.setTimeout(() => resolve(false), 700);
      });
      Promise.race([warmup, failSafe]).then(revealNow);
    }

    const restSet = new Set<string>();
    for (const work of worksInterleaved.slice(3)) {
      if (work.image) restSet.add(work.image);
      if (work.overlayIcon) restSet.add(work.overlayIcon);
    }
    const restAssets = Array.from(restSet);
    const warmRest = () => {
      let i = 0;
      const runNext = () => {
        if (cancelled || i >= restAssets.length) return;
        void preloadAsset(restAssets[i]).finally(() => {
          i += 1;
          window.setTimeout(runNext, 80);
        });
      };
      runNext();
    };

    if ("requestIdleCallback" in window) {
      const id = (
        window as unknown as {
          requestIdleCallback: (cb: () => void, opts?: { timeout?: number }) => number;
        }
      ).requestIdleCallback(warmRest, { timeout: 1500 });
      return () => {
        cancelled = true;
        (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
      };
    }

    const t = setTimeout(warmRest, 600);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [pageLoadNonce, worksInterleaved]);

  return { pageLoadNonce, cardsReadyForReveal };
}
