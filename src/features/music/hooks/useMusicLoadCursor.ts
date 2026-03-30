import { startTransition, useCallback, useState } from "react";

export function useMusicLoadCursor(albumLength: number) {
  const [musicLoadCursor, setMusicLoadCursor] = useState(0);

  const advanceMusicSlot = useCallback(() => {
    startTransition(() => {
      setMusicLoadCursor((c) => Math.min(c + 1, albumLength));
    });
  }, [albumLength]);

  return { musicLoadCursor, advanceMusicSlot };
}
