/**
 * 展示用艺人 / 专辑名（标题大小写、官方拼写等）。键为 `public/album` 下文件名，须与磁盘及 `albumReleases` 一致。
 */
export const ALBUM_DISPLAY_BY_FILE: Readonly<
  Record<string, { artist?: string; album?: string }>
> = {
  " LINKIN PARK-One More Light.webp": { artist: "Linkin Park" },
  " The Beatles-Sgt. Pepper's Lonely Hearts Club Band.webp": { artist: "The Beatles" },
  "ACDC-back in black.webp": { artist: "AC/DC", album: "Back in Black" },
  "Bark Psychosis-hex.webp": { album: "Hex" },
  "LINKIN PARK-HYBRID THEORY.webm": { artist: "Linkin Park", album: "Hybrid Theory" },
  "LINKIN PARK-METEORA.webm": { artist: "Linkin Park", album: "Meteora" },
  "Pink floyd-the wall.webm": { artist: "Pink Floyd", album: "The Wall" },
  "Yndi Halda-Enjoy Eternal Bliss .webp": { album: "Enjoy Eternal Bliss" },
  "pink floyd-the dark side of the moon.webm": {
    artist: "Pink Floyd",
    album: "The Dark Side of the Moon",
  },
  "pinkfloyd-wish you were here.webp": { artist: "Pink Floyd", album: "Wish You Were Here" },
  "radio head-kid a.webp": { artist: "Radiohead", album: "Kid A" },
  "radio head-ok computer.webp": { artist: "Radiohead", album: "OK Computer" },
  "radio head-the bends.webp": { artist: "Radiohead", album: "The Bends" },
  "sleep dealer-imminence.webp": { artist: "Sleep Dealer", album: "Imminence" },
  "the beatles-abbey road.webp": { artist: "The Beatles", album: "Abbey Road" },
  "zard-ZARD Forever Best ~25th Anniversary~.webp": { artist: "ZARD" },
  "zard-today is another day.webp": { artist: "ZARD", album: "Today Is Another Day" },
  "zard-もう探さない.webp": { artist: "ZARD" },
  "zard-永远.webp": { artist: "ZARD" },
};

export function albumDisplayForFile(
  file: string,
  parsed: { artist: string; album: string }
): { artist: string; album: string } {
  const o = ALBUM_DISPLAY_BY_FILE[file] ?? ALBUM_DISPLAY_BY_FILE[file.trim()];
  if (!o) return parsed;
  return {
    artist: o.artist ?? parsed.artist,
    album: o.album ?? parsed.album,
  };
}
