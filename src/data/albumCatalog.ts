import { ALBUM_RELEASE_ISO } from "./albumReleases";
import albumExistingFiles from "virtual:album-existing";

const ALBUM_MEDIA_EXT = /\.(webp|webm|mp4|png|jpe?g)$/i;

export function isAlbumMediaFilename(name: string): boolean {
  return ALBUM_MEDIA_EXT.test(name);
}

/** `public/album` 资源 URL：带上 `import.meta.env.BASE_URL`，文件名编码以兼容空格与中文 */
export function albumPublicUrl(file: string): string {
  const rawBase = import.meta.env.BASE_URL;
  const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;
  return `${base}album/${encodeURIComponent(file)}`;
}

function releaseIsoForFile(file: string): string {
  return ALBUM_RELEASE_ISO[file] ?? ALBUM_RELEASE_ISO[file.trim()] ?? "1900-01-01";
}

function isoToSortKey(iso: string): number {
  const [y, m, d] = iso.split("-").map((x) => parseInt(x, 10));
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return 0;
  return y * 10000 + m * 100 + d;
}

function formatReleaseLabel(iso: string): string {
  const y = iso.split("-")[0];
  return y && /^\d{4}$/.test(y) ? y : iso.slice(0, 4);
}

export type AlbumMediaRow = { file: string; releaseIso: string };

export const ALBUM_MEDIA_ROWS: AlbumMediaRow[] = albumExistingFiles
  .filter((f) => isAlbumMediaFilename(f))
  .map((file) => ({ file, releaseIso: releaseIsoForFile(file) }));

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;
const STEM_EXTENSIONS = [...IMAGE_EXTENSIONS, ".webm", ".mp4"] as const;

function albumMediaType(file: string): "image" | "video" {
  const l = file.toLowerCase();
  return l.endsWith(".mp4") || l.endsWith(".webm") ? "video" : "image";
}

function parseArtistAlbumFromFile(file: string): { artist: string; album: string } | null {
  const trimmed = file.trim();
  if (!trimmed.includes("-")) return null;
  const lower = trimmed.toLowerCase();
  const ext = STEM_EXTENSIONS.find((e) => lower.endsWith(e));
  if (!ext) return null;
  const base = trimmed.slice(0, -ext.length);
  const dash = base.indexOf("-");
  if (dash <= 0) return null;
  const artist = base.slice(0, dash).trim();
  const album = base.slice(dash + 1).trim();
  if (!artist || !album) return null;
  return { artist, album };
}

export type AlbumItem = {
  id: string;
  image: string;
  mediaType: "image" | "video";
  album: string;
  artist: string;
  year: string;
};

export function buildAlbumItems(rows: readonly AlbumMediaRow[]): AlbumItem[] {
  const collator = "zh-Hans-CN";
  const staged = rows.map((row, sortIndex) => {
    const image = albumPublicUrl(row.file);
    const mediaType = albumMediaType(row.file);
    const parsed = parseArtistAlbumFromFile(row.file);
    const year = formatReleaseLabel(row.releaseIso);
    const releaseSortKey = isoToSortKey(row.releaseIso);
    if (parsed) {
      return {
        sortIndex,
        image,
        mediaType,
        album: parsed.album,
        artist: parsed.artist,
        year,
        releaseSortKey,
      };
    }
    const stem = row.file.replace(/\.[^.]+$/, "");
    return {
      sortIndex,
      image,
      mediaType,
      album: stem,
      artist: "Unknown Artist",
      year,
      releaseSortKey,
    };
  });
  staged.sort((a, b) => {
    const cmpArtist = b.artist.localeCompare(a.artist, collator, { sensitivity: "base" });
    if (cmpArtist !== 0) return cmpArtist;
    if (b.releaseSortKey !== a.releaseSortKey) return b.releaseSortKey - a.releaseSortKey;
    const cmpAlbum = b.album.localeCompare(a.album, collator, { sensitivity: "base" });
    if (cmpAlbum !== 0) return cmpAlbum;
    return a.sortIndex - b.sortIndex;
  });
  return staged.map((item, i) => ({
    id: `album-${i + 1}`,
    image: item.image,
    mediaType: item.mediaType,
    album: item.album,
    artist: item.artist,
    year: item.year,
  }));
}

export const albumItems: AlbumItem[] = buildAlbumItems(ALBUM_MEDIA_ROWS);
