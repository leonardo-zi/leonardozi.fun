import { startTransition, useCallback, useState } from "react";

export function useMusicLoadCursor(albumLength: number) {
  const [musicLoadCursor, setMusicLoadCursor] = useState(0);

  const advanceMusicSlot = useCallback(() => {
    const advance = () => {
      startTransition(() => {
        setMusicLoadCursor((c) => Math.min(c + 1, albumLength));
      });
    };

    // 避免在滚动/合成关键路径上“图片解码 + React 更新”叠加造成卡顿
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      (
        window as unknown as {
          requestIdleCallback: (cb: () => void, opts?: { timeout?: number }) => number;
        }
      ).requestIdleCallback(advance, { timeout: 800 });
      return;
    }

    setTimeout(advance, 120);
  }, [albumLength]);

  return { musicLoadCursor, advanceMusicSlot };
}
