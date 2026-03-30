import { useCallback, useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";
import { Icon, addCollection } from "@iconify/react";
import { icons as materialSymbolsLight } from "@iconify-json/material-symbols-light";
import WorkCard from "../components/WorkCard";
import LenisPreventScrollArea from "../components/LenisPreventScrollArea";
import WorkDetailPage from "./WorkDetailPage";
import { works } from "../works";
import type { Work } from "../works/types";
import { ALBUM_RELEASE_ISO } from "../data/albumReleases";
import albumExistingFiles from "virtual:album-existing";

const CURRENT_YEAR = new Date().getFullYear();
const SITE_ICON_SRC = "/works/icon/leonardozi_icon.png";
addCollection(materialSymbolsLight);

type Lang = "cn" | "en";
type MainView = "works" | "music";
const TOC_BUTTON_CLASS =
  "group flex h-[18px] w-full items-center justify-between text-[14px] sm:text-[12px] leading-[16px] text-[#000000] cursor-pointer hover:opacity-80 active:opacity-60";

function formatEditedDate(date: Date): string {
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

/** 桌面端右栏作品：与 `works` 数组顺序无关，固定左列为 Poppy / Bob Music / Wisdom Horse，右列为 Aro / Others */
const WORK_IDS_LEFT_COLUMN = ["1", "3", "5"] as const;
const WORK_IDS_RIGHT_COLUMN = ["2", "4"] as const;
const ALBUM_MEDIA_EXT = /\.(webp|webm|mp4|png|jpe?g)$/i;

function isAlbumMediaFilename(name: string): boolean {
  return ALBUM_MEDIA_EXT.test(name);
}

/** `public/album` 资源 URL：带上 `import.meta.env.BASE_URL`，文件名编码以兼容空格与中文 */
function albumPublicUrl(file: string): string {
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

type AlbumMediaRow = { file: string; releaseIso: string };

/** 音乐页素材：扫描 `public/album`，文件名建议为「艺人-专辑名」 */
const ALBUM_MEDIA_ROWS: AlbumMediaRow[] = albumExistingFiles
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

type AlbumItem = {
  id: string;
  image: string;
  mediaType: "image" | "video";
  album: string;
  artist: string;
  year: string;
};

function buildAlbumItems(rows: readonly AlbumMediaRow[]): AlbumItem[] {
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
  /** 艺人名倒序 → 发行日倒序（新在前）→ 专辑名倒序 */
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

const albumItems: AlbumItem[] = buildAlbumItems(ALBUM_MEDIA_ROWS);

function worksInIdsOrder(all: Work[], ids: readonly string[]): Work[] {
  return ids.map((id) => all.find((w) => w.id === id)).filter((w): w is Work => Boolean(w));
}

function SiteMark() {
  return (
    <img
      src={SITE_ICON_SRC}
      alt="leonardozi.fun"
      width={28}
      height={28}
      className="h-[28px] w-[28px] shrink-0 object-contain"
    />
  );
}

function Copyright({ year = CURRENT_YEAR, lang }: { year?: number; lang: Lang }) {
  const editedDate = formatEditedDate(new Date());
  const editedText = lang === "en" ? `Edited in ${editedDate}` : `编辑于 ${editedDate}`;
  return (
    <div className="flex items-center gap-[10px] text-[14px] sm:text-[12px]">
      <div className="text-[#000000]">©{year} leonardozi</div>
      <div className="h-[10px] w-[0.5px] bg-[#aaa]" aria-hidden />
      <div className="text-[#aaa]">{editedText}</div>
    </div>
  );
}

/** 移动端全屏侧栏：点击顶部菜单后显示 */
function SidebarContent({
  onClose,
  lang,
  onSelectView,
}: {
  onClose: () => void;
  lang: Lang;
  onSelectView: (next: MainView) => void;
}) {
  const desc1 =
    lang === "en"
      ? "Small things made with code and design. This is a collection of personal works and notes—sometimes I write about UI, prototypes, and ideas."
      : "用代码和设计做点小东西。这里是个人作品与笔记的集合，偶尔写写界面、原型和想法。";
  const desc2 =
    lang === "en" ? "Vibe Coding is a great invention" : "Vibe Coding 真是伟大的发明";

  const tocTitle = lang === "en" ? "Sections" : "分区";
  const tocWorks = lang === "en" ? "Works" : "作品";
  const tocMusic = lang === "en" ? "Music" : "音乐";
  const tocContact = lang === "en" ? "Contact" : "联络";
  const tocResume = lang === "en" ? "Resume" : "简历";

  return (
    <div className="flex h-full flex-col bg-[#ffffff]">
      <div className="flex shrink-0 items-center justify-between px-4 py-4">
        <SiteMark />
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[rgba(162,157,150,1)] hover:bg-[rgba(162,157,150,0.2)]"
          aria-label="关闭"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
            <path d="M4 4l10 10M14 4L4 14" />
          </svg>
        </button>
      </div>
      <LenisPreventScrollArea className="flex-1 min-h-0 overflow-y-auto px-6 py-0">
        <div className="flex flex-col gap-[32px]">
          <div className="flex flex-col gap-3 text-[14px] sm:text-[12px] leading-[16px] text-[#000000]">
            <div>{desc1}</div>
            <div>{desc2}</div>
          </div>

          {/* 目录区：纯展示，不做功能 */}
          <div className="flex flex-col">
            <div className="mt-[28px] flex flex-col gap-[24px]">
              {/* 目录块：标题div + 条目列表div */}
              <div className="flex flex-col">
                <div className="text-[14px] sm:text-[12px] font-semibold leading-[16px] text-[#000000]">{tocTitle}</div>
                <div className="mt-[12px] flex flex-col gap-[6px]">
                  <button type="button" className={TOC_BUTTON_CLASS} onClick={() => onSelectView("works")}>
                    <span className="relative inline-block">
                      {tocWorks}
                      <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
                    </span>
                    <Icon icon="material-symbols-light:arrow-forward-rounded" width={18} height={18} color="#000000" aria-hidden />
                  </button>
                  <button type="button" className={TOC_BUTTON_CLASS} onClick={() => onSelectView("music")}>
                    <span className="relative inline-block">
                      {tocMusic}
                      <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
                    </span>
                    <Icon icon="material-symbols-light:arrow-forward-rounded" width={18} height={18} color="#000000" aria-hidden />
                  </button>
                </div>
              </div>

              {/* 联络块：标题div + 条目列表div */}
              <div className="flex flex-col">
                <div className="text-[14px] sm:text-[12px] font-semibold leading-[16px] text-[#000000]">{tocContact}</div>
                <div className="mt-[12px] flex flex-col gap-[6px]">
                  <button
                    type="button"
                    className={TOC_BUTTON_CLASS}
                  >
                    <span className="relative inline-block">
                      {tocResume}
                      <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
                    </span>
                    <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className={TOC_BUTTON_CLASS}
                  >
                    <span className="relative inline-block">
                      Email
                      <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
                    </span>
                    <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className={TOC_BUTTON_CLASS}
                  >
                    <span className="relative inline-block">
                      WeChat
                      <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
                    </span>
                    <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LenisPreventScrollArea>
    </div>
  );
}

function SidebarToc({ lang, onSelectView }: { lang: Lang; onSelectView: (next: MainView) => void }) {
  const tocTitle = lang === "en" ? "Sections" : "分区";
  const tocWorks = lang === "en" ? "Works" : "作品";
  const tocMusic = lang === "en" ? "Music" : "音乐";
  const tocContact = lang === "en" ? "Contact" : "联络";
  const tocResume = lang === "en" ? "Resume" : "简历";

  return (
    <>
      <div className="flex flex-col gap-[32px]">
        <div className="h-[0.5px] w-full bg-[#aaa]" />
        {/* 目录块：标题div + 条目列表div */}
        <div className="flex flex-col">
          <div className="text-[14px] sm:text-[12px] font-semibold leading-[16px] text-[#000000]">{tocTitle}</div>
          <div className="mt-[12px] flex flex-col gap-[6px]">
            <button type="button" className={TOC_BUTTON_CLASS} onClick={() => onSelectView("works")}>
              <span className="relative inline-block">
                {tocWorks}
                <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
              </span>
              <Icon icon="material-symbols-light:arrow-forward-rounded" width={18} height={18} color="#000000" aria-hidden />
            </button>
            <button type="button" className={TOC_BUTTON_CLASS} onClick={() => onSelectView("music")}>
              <span className="relative inline-block">
                {tocMusic}
                <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
              </span>
              <Icon icon="material-symbols-light:arrow-forward-rounded" width={18} height={18} color="#000000" aria-hidden />
            </button>
          </div>
        </div>

        {/* 联络块：标题div + 条目列表div */}
        <div className="flex flex-col">
          <div className="text-[14px] sm:text-[12px] font-semibold leading-[16px] text-[#000000]">{tocContact}</div>
          <div className="mt-[12px] flex flex-col gap-[6px]">
            <button
              type="button"
              className={TOC_BUTTON_CLASS}
            >
              <span className="relative inline-block">
                {tocResume}
                <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
              </span>
              <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
            </button>
            <button
              type="button"
              className={TOC_BUTTON_CLASS}
            >
              <span className="relative inline-block">
                Email
                <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
              </span>
              <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
            </button>
            <button
              type="button"
              className={TOC_BUTTON_CLASS}
            >
              <span className="relative inline-block">
                WeChat
                <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
              </span>
              <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function AlbumCard({
  item,
  index,
  loadCursor,
  onSlotReady,
}: {
  item: AlbumItem;
  index: number;
  loadCursor: number;
  onSlotReady: () => void;
}) {
  const resumeIfNotEnded = useCallback((e: SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (!v.ended && v.paused) void v.play();
  }, []);

  const reportedRef = useRef(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    reportedRef.current = false;
  }, [loadCursor, index, item.image]);

  useEffect(() => {
    if (index !== loadCursor) return;
    const t = window.setTimeout(() => {
      if (!reportedRef.current) {
        reportedRef.current = true;
        onSlotReady();
      }
    }, 14_000);
    return () => clearTimeout(t);
  }, [index, loadCursor, onSlotReady]);

  const reportSlotReady = useCallback(() => {
    if (index !== loadCursor || reportedRef.current) return;
    reportedRef.current = true;
    onSlotReady();
  }, [index, loadCursor, onSlotReady]);

  const shouldAttachMedia = index <= loadCursor;

  /** 缓存命中时可能不会触发 onLoad / onLoadedData，与 WorkCard 的 img.complete 兜底一致 */
  useEffect(() => {
    if (index !== loadCursor || !shouldAttachMedia) return;
    if (item.mediaType === "video") {
      const v = videoRef.current;
      if (v && v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) reportSlotReady();
      return;
    }
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) reportSlotReady();
  }, [index, loadCursor, shouldAttachMedia, item.mediaType, item.image, reportSlotReady]);

  return (
    <article className="min-w-0 overflow-hidden rounded-[8px]">
      <div className="aspect-square w-full rounded-superellipse border-[0.5px] border-[#e0e0e0] overflow-hidden bg-[rgba(162,157,150,0.12)] contain-layout">
        {shouldAttachMedia ? (
          item.mediaType === "video" ? (
            <video
              ref={videoRef}
              src={item.image}
              className="pointer-events-none block h-full w-full object-cover"
              autoPlay
              muted
              playsInline
              loop
              preload="auto"
              aria-label={item.album}
              onLoadedData={reportSlotReady}
              onError={reportSlotReady}
              onPause={resumeIfNotEnded}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <img
              ref={imgRef}
              src={item.image}
              alt={item.album}
              className="block h-full w-full object-cover"
              decoding="async"
              fetchPriority={index === loadCursor ? "high" : "low"}
              onLoad={reportSlotReady}
              onError={reportSlotReady}
            />
          )
        ) : null}
      </div>
      <div className="mt-2 flex flex-col gap-0.5 leading-[16px]">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="min-w-0 truncate text-[12px] font-normal text-[#000000]">{item.album}</h3>
          <div className="shrink-0 text-[12px] text-[#000000] tabular-nums">{item.year}</div>
        </div>
        <div className="text-[11px] text-[#888888] truncate">{item.artist}</div>
      </div>
    </article>
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);

    // Safari 兼容旧版 addListener
    if ("addEventListener" in mql) {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }

    const legacyMql = mql as unknown as {
      addListener?: (listener: () => void) => void;
      removeListener?: (listener: () => void) => void;
    };
    legacyMql.addListener?.(onChange);
    return () => legacyMql.removeListener?.(onChange);
  }, [query]);

  return matches;
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

function LanguageToggleButtons({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const cnSelected = lang === "cn";
  const enSelected = lang === "en";

  return (
    <>
      <button
        type="button"
        className={`group relative flex h-[28px] w-[20px] items-center justify-center text-[14px] sm:text-[12px] leading-none cursor-pointer hover:opacity-80 active:opacity-60 ${cnSelected ? "text-[#000000]" : "text-[#aaa]"}`}
        aria-current={cnSelected ? "page" : undefined}
        onClick={() => onChange("cn")}
      >
        CN
        <span
          className={`pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[0.5px] w-full origin-left bg-[#000000] transition-transform duration-150 ease-in-out ${cnSelected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
            }`}
        />
      </button>
      <div className="h-[0.5px] w-[10px] bg-[#aaa]" aria-hidden />
      <button
        type="button"
        className={`group relative flex h-[28px] w-[20px] items-center justify-center text-[14px] sm:text-[12px] leading-none cursor-pointer hover:opacity-80 active:opacity-60 ${enSelected ? "text-[#000000]" : "text-[#aaa]"}`}
        aria-current={enSelected ? "page" : undefined}
        onClick={() => onChange("en")}
      >
        EN
        <span
          className={`pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[0.5px] w-full origin-left bg-[#000000] transition-transform duration-150 ease-in-out ${enSelected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
            }`}
        />
      </button>
    </>
  );
}

const SIDEBAR_DURATION_MS = 240;
const WORK_QUERY_KEY = "work";

function getWorkIdFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const url = new URL(window.location.href);
    const id = url.searchParams.get(WORK_QUERY_KEY);
    return id && id.trim().length > 0 ? id : null;
  } catch {
    return null;
  }
}

function setWorkIdInLocation(id: string | null) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set(WORK_QUERY_KEY, id);
  else url.searchParams.delete(WORK_QUERY_KEY);
  window.history.pushState({}, "", url);
}

export default function HomePage() {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "cn";
    const saved = window.localStorage.getItem("lang");
    return saved === "en" ? "en" : "cn";
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("lang", lang);
    } catch {
      // ignore
    }
  }, [lang]);

  // 页面加载时生成一次：保证“刷新后”每次都会重新挂载 WorkCard 并播放入场动画
  const [pageLoadNonce] = useState(() => Date.now());
  const [cardsReadyForReveal, setCardsReadyForReveal] = useState(false);
  const [mainView, setMainView] = useState<MainView>("works");
  /** 从音乐切回作品时递增，强制 WorkCard 重新挂载，避免 IntersectionObserver 在错误滚动/布局时机下永远不解锁 */
  const [worksRemountKey, setWorksRemountKey] = useState(0);
  const prevMainViewRef = useRef<MainView>("works");
  /** 音乐网格：仅加载 index ≤ cursor 的媒体；从左到右、自上而下即 albumItems 顺序，逐个就绪后再加载下一格，避免首屏带宽与解码挤爆 */
  const [musicLoadCursor, setMusicLoadCursor] = useState(0);

  const worksLeftColumn = useMemo(() => worksInIdsOrder(works, WORK_IDS_LEFT_COLUMN), []);
  const worksRightColumn = useMemo(() => worksInIdsOrder(works, WORK_IDS_RIGHT_COLUMN), []);
  const worksInterleaved = useMemo(
    () => interleaveByIndex(worksLeftColumn, worksRightColumn),
    [worksLeftColumn, worksRightColumn]
  );

  useEffect(() => {
    let cancelled = false;
    setCardsReadyForReveal(false);
    const preloadAsset = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        const done = () => resolve();
        img.onload = () => {
          // 先 decode 再展示，减少首帧切换时的突兀和卡顿。
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

    // 只阻塞首屏关键卡片（避免一次性加载全量资源导致首屏卡顿）。
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
      // 给一个上限，弱网下不会长时间空白。
      const failSafe = new Promise<boolean>((resolve) => {
        window.setTimeout(() => resolve(false), 700);
      });
      Promise.race([warmup, failSafe]).then(revealNow);
    }

    // 非首屏资源放到空闲时段渐进预热，避免抢占关键渲染。
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

  useEffect(() => {
    if (mainView === "music") setMusicLoadCursor(0);
    const prev = prevMainViewRef.current;
    if (mainView === "works" && prev === "music") {
      setWorksRemountKey((k) => k + 1);
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      });
    }
    prevMainViewRef.current = mainView;
  }, [mainView]);

  const advanceMusicSlot = useCallback(() => {
    setMusicLoadCursor((c) => Math.min(c + 1, albumItems.length));
  }, []);

  useEffect(() => {
    // 预取“下一个最可能被看到”的卡片图，减少滚动后等待。
    const nextWorkImage =
      (worksInterleaved[1]?.image ?? worksLeftColumn[1]?.image ?? worksRightColumn[0]?.image) || null;

    if (!nextWorkImage) return;

    const run = () => {
      const img = new Image();
      img.decoding = "async";
      img.src = nextWorkImage;
    };

    if ("requestIdleCallback" in window) {
      const id = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout?: number }) => number }).requestIdleCallback(run, {
        timeout: 1200,
      });
      return () => {
        (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
      };
    }

    const t = setTimeout(run, 350);
    return () => clearTimeout(t);
  }, [worksInterleaved, worksLeftColumn, worksRightColumn]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarClosing, setSidebarClosing] = useState(false);
  const [sidebarJustOpened, setSidebarJustOpened] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const [activeWorkId, setActiveWorkId] = useState<string | null>(() => getWorkIdFromLocation());

  const isSingleColumn = useMediaQuery("(max-width: 1230px)");
  const isMobileLayout = useMediaQuery("(max-width: 800px)");

  const requestCloseSidebar = useCallback(() => {
    if (sidebarClosing) return;
    setSidebarClosing(true);
  }, [sidebarClosing]);

  useEffect(() => {
    if (!sidebarOpen || !sidebarJustOpened) return;
    const id = requestAnimationFrame(() => setSidebarJustOpened(false));
    return () => cancelAnimationFrame(id);
  }, [sidebarOpen, sidebarJustOpened]);

  useEffect(() => {
    if (!sidebarClosing) return;
    const t = setTimeout(() => {
      setSidebarOpen(false);
      setSidebarClosing(false);
    }, SIDEBAR_DURATION_MS);
    return () => clearTimeout(t);
  }, [sidebarClosing]);

  // 详情页：支持浏览器返回/前进（popstate）
  useEffect(() => {
    const onPopState = () => setActiveWorkId(getWorkIdFromLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const activeWork = activeWorkId ? works.find((w) => w.id === activeWorkId) ?? null : null;

  const openWorkDetails = useCallback((work: Work) => {
    setWorkIdInLocation(work.id);
    setActiveWorkId(work.id);
  }, []);

  const closeWorkDetails = useCallback(() => {
    setWorkIdInLocation(null);
    setActiveWorkId(null);
  }, []);

  // 详情页：整页覆盖主页（不保留左侧栏/作品列表布局）
  if (activeWork) {
    return <WorkDetailPage work={activeWork} lang={lang} onBack={closeWorkDetails} />;
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
      {/* 移动端：全屏侧栏遮罩，打开/关闭带 240ms 淡入淡出 */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="菜单"
          style={{
            opacity: sidebarJustOpened || sidebarClosing ? 0 : 1,
            transition: `opacity ${SIDEBAR_DURATION_MS}ms cubic-bezier(0.33, 1, 0.68, 1)`,
          }}
        >
          <div className="absolute inset-0 bg-white" onClick={requestCloseSidebar} aria-hidden />
          <div className="absolute inset-0 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <SidebarContent
              onClose={requestCloseSidebar}
              lang={lang}
              onSelectView={(next) => {
                setMainView(next);
                requestCloseSidebar();
              }}
            />
          </div>
        </div>
      )}

      {/* 桌面端：左侧边栏（手机模式下移入 main，随作品一起滚动） */}
      {!isMobileLayout && (
        <aside className="hidden min-w-0 flex-col overflow-hidden bg-[#ffffff] md:flex md:sticky md:top-0 md:h-screen">
          <div className="flex h-[76px] shrink-0 items-center justify-start p-6">
            <SiteMark />
          </div>
          <LenisPreventScrollArea className="flex-1 min-h-0 overflow-y-auto px-6 py-0">
            <div className="flex flex-col gap-[32px]">
              <div className="flex flex-col gap-3 text-[14px] sm:text-[12px] leading-[16px] text-[#000000]">
                <div>
                  {lang === "en"
                    ? "Small things made with code and design. This is a collection of personal works and notes—sometimes I write about UI, prototypes, and ideas."
                    : "用代码和设计做点小东西。这里是个人作品与笔记的集合，偶尔写写界面、原型和想法。"}
                </div>
                <div>{lang === "en" ? "Enjoying Vibe Coding—what a great invention." : "正在享受 Vibe Coding ，这真是个伟大的发明。"}</div>
              </div>

              <SidebarToc lang={lang} onSelectView={setMainView} />
            </div>
          </LenisPreventScrollArea>
          <div className="h-[60px] shrink-0 flex items-center px-6">
            <Copyright lang={lang} />
          </div>
        </aside>
      )}

      {/* 主区：移动端仅作品单列 + 底部页脚，桌面端仅作品两列；侧栏内容仅通过顶部菜单打开 */}
      <main
        ref={isMobileLayout ? undefined : mainRef}
        className="bg-[#ffffff] min-w-0"
      >
        <>
          {/* 手机模式：把左侧边栏内容放在作品上方，随 main 一起滚动 */}
          {isMobileLayout && (
            <aside className="w-full shrink-0 flex-col bg-[#ffffff]">
              <div className="flex h-[76px] shrink-0 items-center justify-start p-6">
                <SiteMark />
              </div>
              <div className="px-6 py-0 pb-[50px]">
                <div className="flex flex-col gap-[32px]">
                  <div className="flex flex-col gap-3 text-[14px] sm:text-[12px] leading-[16px] text-[#000000]">
                    <div>
                      {lang === "en"
                        ? "Small things made with code and design. This is a collection of personal works and notes—sometimes I write about UI, prototypes, and ideas."
                        : "用代码和设计做点小东西。这里是个人作品与笔记的集合，偶尔写写界面、原型和想法。"}
                    </div>
                    <div>{lang === "en" ? "Enjoying Vibe Coding—what a great invention." : "正在享受 Vibe Coding ，这真是个伟大的发明。"}</div>
                  </div>

                  <SidebarToc lang={lang} onSelectView={setMainView} />
                </div>
              </div>
            </aside>
          )}

          {/* 作品区：语言栏/作品列 */}
          <div className="flex w-full flex-col items-stretch gap-0 p-4 pt-0 pb-0 md:px-4">
            {/* 桌面端语言切换展示：在 <=800px 时合并到版权条里 */}
            {!isMobileLayout && (
              <div className="hidden h-[76px] w-full items-center justify-end gap-[6px] px-[9px] md:flex">
                <div className="flex items-center gap-[6px]">
                  <LanguageToggleButtons lang={lang} onChange={setLang} />
                </div>
              </div>
            )}

            {/* 作品列：<=1230px 时单列（穿插另一列）；>1230px 时两列 */}
            <div
              className={
                isSingleColumn
                  ? "w-full max-[800px]:pb-[32px] min-[801px]:pb-[150px]"
                  : "w-full max-[800px]:pb-[32px] min-[801px]:pb-[150px]"
              }
            >
              {mainView === "works" ? (
                isSingleColumn ? (
                  <div className="grid grid-cols-1 gap-4">
                    {worksInterleaved.map((work, i) => (
                      <WorkCard
                        key={`${work.id}-${pageLoadNonce}-${worksRemountKey}`}
                        work={work}
                        onClick={(w) => openWorkDetails(w)}
                        isFirst={i === 0}
                        lang={lang}
                        animationIndex={i}
                        loadNonce={pageLoadNonce}
                        pageReady={cardsReadyForReveal}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 items-start gap-4" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}>
                    <div className="flex min-w-0 flex-col gap-4">
                      {worksLeftColumn.map((work, i) => (
                        <WorkCard
                          key={`${work.id}-${pageLoadNonce}-${worksRemountKey}`}
                          work={work}
                          onClick={(w) => openWorkDetails(w)}
                          isFirst={i === 0}
                          lang={lang}
                          animationIndex={i * 2}
                          loadNonce={pageLoadNonce}
                          pageReady={cardsReadyForReveal}
                        />
                      ))}
                    </div>

                    <div className="flex min-w-0 flex-col gap-4">
                      {worksRightColumn.map((work, i) => (
                        <WorkCard
                          key={`${work.id}-${pageLoadNonce}-${worksRemountKey}`}
                          work={work}
                          onClick={(w) => openWorkDetails(w)}
                          isFirst={false}
                          lang={lang}
                          animationIndex={i * 2 + 1}
                          loadNonce={pageLoadNonce}
                          pageReady={cardsReadyForReveal}
                        />
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <div className="grid grid-cols-1 gap-4 min-[560px]:grid-cols-2 min-[960px]:grid-cols-3 min-[1360px]:grid-cols-4">
                  {albumItems.map((item, i) => (
                    <AlbumCard
                      key={item.id}
                      item={item}
                      index={i}
                      loadCursor={musicLoadCursor}
                      onSlotReady={advanceMusicSlot}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* <=800px：把左侧底部版权条移到作品栏下面，并把语言按钮合并到右侧 */}
          {isMobileLayout && (
            <div className="flex h-[60px] items-center justify-between px-6">
              <div className="text-[14px] sm:text-[12px] text-[#000000]">©{CURRENT_YEAR} leonardozi</div>
              <div className="flex items-center gap-[6px]">
                <LanguageToggleButtons lang={lang} onChange={setLang} />
              </div>
            </div>
          )}

          {/* 移动端：页脚放在页面最底部，仅 < 768px 且未进入 <=800px 布局 */}
          {!isMobileLayout && (
            <div className="flex items-center justify-center px-4 py-6 md:hidden">
              <Copyright lang={lang} />
            </div>
          )}
        </>
      </main>
    </div>
  );
}
