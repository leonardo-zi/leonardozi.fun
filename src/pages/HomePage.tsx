import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import WorkCard from "../components/WorkCard";
import WorkModal from "../components/WorkModal";
import { works } from "../works";
import type { Work } from "../works/types";

interface ModalOrigin {
  dx: number;
  dy: number;
}

const CURRENT_YEAR = new Date().getFullYear();
const SITE_ICON_SRC = "/works/icon/leonardozi_icon.png";

type Lang = "cn" | "en";

function formatEditedDate(date: Date): string {
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

/** 桌面端右栏作品：与 `works` 数组顺序无关，固定左列为 Poppy / Bob Music / Wisdom Horse，右列为 Aro / Others */
const WORK_IDS_LEFT_COLUMN = ["1", "3", "5"] as const;
const WORK_IDS_RIGHT_COLUMN = ["2", "4"] as const;

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
    <div className="flex items-center gap-[10px] text-[12px]">
      <div className="text-[#000000]">©{year} leonardozi</div>
      <div className="h-[10px] w-[0.5px] bg-[#aaa]" aria-hidden />
      <div className="text-[#aaa]">{editedText}</div>
    </div>
  );
}

/** 移动端全屏侧栏：点击顶部菜单后显示 */
function SidebarContent({ onClose, lang }: { onClose: () => void; lang: Lang }) {
  const desc1 =
    lang === "en"
      ? "Small things made with code and design. This is a collection of personal works and notes—sometimes I write about UI, prototypes, and ideas."
      : "用代码和设计做点小东西。这里是个人作品与笔记的集合，偶尔写写界面、原型和想法。";
  const desc2 =
    lang === "en" ? "Vibe Coding is a great invention" : "Vibe Coding 真是伟大的发明";

  const tocTitle = lang === "en" ? "Contents" : "目录";
  const tocPhotos = lang === "en" ? "Photos" : "照片";
  const tocReading = lang === "en" ? "Reading" : "阅读";
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
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-0">
        <div className="flex flex-col gap-[32px]">
          <div className="flex flex-col gap-3 text-[12px] leading-relaxed text-[#000000]">
            <div>{desc1}</div>
            <div>{desc2}</div>
          </div>

          {/* 目录区：纯展示，不做功能 */}
          <div className="flex flex-col">
            <div className="mt-[28px] flex flex-col gap-[24px]">
              {/* 目录块：标题div + 条目列表div */}
              <div className="flex flex-col">
                <div className="text-[12px] font-semibold leading-none text-[#000000]">{tocTitle}</div>
                <div className="mt-[12px] flex flex-col gap-[6px]">
                  <div className="group flex items-center justify-between text-[12px] text-[#000000]">
                    <span className="relative inline-block">
                      {tocPhotos}
                      <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
                    </span>
                    <Icon icon="material-symbols-light:arrow-forward-rounded" width={18} height={18} color="#000000" aria-hidden />
                  </div>
                  <div className="group flex items-center justify-between text-[12px] text-[#000000]">
                    <span className="relative inline-block">
                      {tocReading}
                      <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
                    </span>
                    <Icon icon="material-symbols-light:arrow-forward-rounded" width={18} height={18} color="#000000" aria-hidden />
                  </div>
                </div>
              </div>

              {/* 联络块：标题div + 条目列表div */}
              <div className="flex flex-col">
                <div className="text-[12px] font-semibold leading-none text-[#000000]">{tocContact}</div>
                <div className="mt-[12px] flex flex-col gap-[6px]">
                  <div className="group flex items-center justify-between text-[12px] text-[#000000]">
                    <span className="relative inline-block">
                      {tocResume}
                      <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
                    </span>
                    <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
                  </div>
                  <div className="group flex items-center justify-between text-[12px] text-[#000000]">
                    <span className="relative inline-block">
                      Email
                      <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
                    </span>
                    <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
                  </div>
                  <div className="group flex items-center justify-between text-[12px] text-[#000000]">
                    <span className="relative inline-block">
                      WeChat
                      <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
                    </span>
                    <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarToc({ lang }: { lang: Lang }) {
  const tocTitle = lang === "en" ? "Contents" : "目录";
  const tocPhotos = lang === "en" ? "Photos" : "照片";
  const tocReading = lang === "en" ? "Reading" : "阅读";
  const tocContact = lang === "en" ? "Contact" : "联络";
  const tocResume = lang === "en" ? "Resume" : "简历";

  return (
    <>
      <div className="flex flex-col gap-[32px]">
        <div className="h-[0.5px] w-full bg-[#aaa]" />
        {/* 目录块：标题div + 条目列表div */}
        <div className="flex flex-col">
          <div className="text-[12px] font-semibold leading-none text-[#000000]">{tocTitle}</div>
          <div className="mt-[12px] flex flex-col gap-[6px]">
            <div className="group flex items-center justify-between text-[12px] text-[#000000]">
              <span className="relative inline-block">
                {tocPhotos}
                <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
              </span>
              <Icon icon="material-symbols-light:arrow-forward-rounded" width={18} height={18} color="#000000" aria-hidden />
            </div>
            <div className="group flex items-center justify-between text-[12px] text-[#000000]">
              <span className="relative inline-block">
                {tocReading}
                <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
              </span>
              <Icon icon="material-symbols-light:arrow-forward-rounded" width={18} height={18} color="#000000" aria-hidden />
            </div>
          </div>
        </div>

        {/* 联络块：标题div + 条目列表div */}
        <div className="flex flex-col">
          <div className="text-[12px] font-semibold leading-none text-[#000000]">{tocContact}</div>
          <div className="mt-[12px] flex flex-col gap-[6px]">
            <div className="group flex items-center justify-between text-[12px] text-[#000000]">
              <span className="relative inline-block">
                {tocResume}
                <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
              </span>
              <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
            </div>
            <div className="group flex items-center justify-between text-[12px] text-[#000000]">
              <span className="relative inline-block">
                Email
                <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
              </span>
              <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
            </div>
            <div className="group flex items-center justify-between text-[12px] text-[#000000]">
              <span className="relative inline-block">
                WeChat
                <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
              </span>
              <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </>
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
    onChange();

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
        className={`group relative flex h-[28px] w-[20px] items-center justify-center text-[12px] leading-none ${cnSelected ? "text-[#000000]" : "text-[#aaa]"}`}
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
        className={`group relative flex h-[28px] w-[20px] items-center justify-center text-[12px] leading-none ${enSelected ? "text-[#000000]" : "text-[#aaa]"}`}
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

const SCROLL_THRESHOLD = 8;
const SIDEBAR_DURATION_MS = 240;

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

  const worksLeftColumn = worksInIdsOrder(works, WORK_IDS_LEFT_COLUMN);
  const worksRightColumn = worksInIdsOrder(works, WORK_IDS_RIGHT_COLUMN);
  const worksInterleaved = interleaveByIndex(worksLeftColumn, worksRightColumn);

  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [modalOrigin, setModalOrigin] = useState<ModalOrigin | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarClosing, setSidebarClosing] = useState(false);
  const [sidebarJustOpened, setSidebarJustOpened] = useState(false);
  const [mobileHeaderOpacity, setMobileHeaderOpacity] = useState(1);
  const mainRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

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

  const handleOpen = useCallback((work: Work, origin: { x: number; y: number }) => {
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    setModalOrigin({
      dx: origin.x - viewportCenterX,
      dy: origin.y - viewportCenterY,
    });
    setSelectedWork(work);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedWork(null);
    setModalOrigin(null);
  }, []);

  const onMobileScroll = useCallback(() => {
    const el = mainRef.current;
    if (!el) return;
    const y = el.scrollTop;
    const delta = y - lastScrollTop.current;
    if (Math.abs(delta) >= SCROLL_THRESHOLD) {
      setMobileHeaderOpacity(delta > 0 ? 0 : 1);
    }
    lastScrollTop.current = y;
  }, []);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    el.addEventListener("scroll", onMobileScroll, { passive: true });
    return () => el.removeEventListener("scroll", onMobileScroll);
  }, [onMobileScroll]);

  return (
    <div className="intro-fade-in flex h-screen flex-col overflow-hidden md:flex-row">
      {/* 移动端：顶部栏 = 菜单按钮 + 标题，滚动时消失；仅 < 768px */}
      <header
        className="sidebar-top-bar fixed left-0 right-0 top-0 z-40 flex shrink-0 items-center justify-between bg-white px-4 py-4 md:hidden max-[800px]:hidden"
        style={{
          opacity: mobileHeaderOpacity,
          transition: "opacity 150ms cubic-bezier(0.33, 1, 0.68, 1)",
        }}
      >
        <SiteMark />
        <button
          type="button"
          onClick={() => {
            setSidebarOpen(true);
            setSidebarClosing(false);
            setSidebarJustOpened(true);
          }}
          className="flex h-10 w-10 items-center justify-center rounded-[6px] text-[rgba(162,157,150,1)] hover:bg-[rgba(162,157,150,0.2)]"
          aria-label="打开菜单"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </header>

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
            <SidebarContent onClose={requestCloseSidebar} lang={lang} />
          </div>
        </div>
      )}

      {/* 桌面端：左侧边栏（手机模式下移入 main，随作品一起滚动） */}
      {!isMobileLayout && (
        <aside className="hidden w-full max-w-[360px] shrink-0 flex-col overflow-hidden bg-[#ffffff] md:flex md:h-screen">
          <div className="flex h-[76px] shrink-0 items-center justify-start p-6">
            <SiteMark />
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-0">
            <div className="flex flex-col gap-[32px]">
              <div className="flex flex-col gap-3 text-[12px] leading-relaxed text-[#000000]">
                <div>
                  {lang === "en"
                    ? "Small things made with code and design. This is a collection of personal works and notes—sometimes I write about UI, prototypes, and ideas."
                    : "用代码和设计做点小东西。这里是个人作品与笔记的集合，偶尔写写界面、原型和想法。"}
                </div>
                <div>{lang === "en" ? "Enjoying Vibe Coding—what a great invention." : "正在享受 Vibe Coding ，这真是个伟大的发明。"}</div>
              </div>

              <SidebarToc lang={lang} />
            </div>
          </div>
          <div className="h-[60px] shrink-0 flex items-center px-6">
            <Copyright lang={lang} />
          </div>
        </aside>
      )}

      {/* 主区：移动端仅作品单列 + 底部页脚，桌面端仅作品两列；侧栏内容仅通过顶部菜单打开 */}
      <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto bg-[#ffffff] md:min-w-0 md:h-screen">
        {/* 手机模式：把左侧边栏内容放在作品上方，随 main 一起滚动 */}
        {isMobileLayout && (
          <aside className="w-full shrink-0 flex-col bg-[#ffffff]">
            <div className="flex h-[76px] shrink-0 items-center justify-start p-6">
              <SiteMark />
            </div>
            <div className="px-6 py-0 pb-[50px]">
              <div className="flex flex-col gap-[32px]">
                <div className="flex flex-col gap-3 text-[12px] leading-relaxed text-[#000000]">
                  <div>
                    {lang === "en"
                      ? "Small things made with code and design. This is a collection of personal works and notes—sometimes I write about UI, prototypes, and ideas."
                      : "用代码和设计做点小东西。这里是个人作品与笔记的集合，偶尔写写界面、原型和想法。"}
                  </div>
                  <div>{lang === "en" ? "Enjoying Vibe Coding—what a great invention." : "正在享受 Vibe Coding ，这真是个伟大的发明。"}</div>
                </div>

                <SidebarToc lang={lang} />
              </div>
            </div>
          </aside>
        )}

        {/* 作品区：语言栏/作品列 */}
        <div className="flex w-full flex-col items-stretch gap-0 p-4 pt-0 pb-0 md:px-4">
          {/* 桌面端语言切换展示：在 <=800px 时合并到版权条里 */}
          {!isMobileLayout && (
            <div className="hidden h-[67px] w-full items-center justify-end gap-[6px] px-[9px] md:flex">
              <div className="flex items-center gap-[6px]">
                <LanguageToggleButtons lang={lang} onChange={setLang} />
              </div>
            </div>
          )}

          {/* 作品列：<=1230px 时单列（穿插另一列）；>1230px 时两列 */}
          <div
            className={
              isSingleColumn
                ? "flex w-full flex-col gap-0 max-[800px]:pb-[32px] min-[801px]:pb-[150px]"
                : "flex w-full flex-col gap-0 md:flex-row md:items-start md:gap-0 max-[800px]:pb-[32px] min-[801px]:pb-[150px]"
            }
          >
            {isSingleColumn ? (
              <motion.div
                className="flex min-w-0 flex-1 flex-col gap-2"
              >
                {worksInterleaved.map((work, i) => (
                  <WorkCard
                    key={`${work.id}-${pageLoadNonce}`}
                    work={work}
                    onClick={handleOpen}
                    isFirst={i === 0}
                    lang={lang}
                    animationIndex={i}
                  />
                ))}
              </motion.div>
            ) : (
              <>
                <motion.div
                  className="flex min-w-0 flex-1 flex-col gap-2"
                >
                  {worksLeftColumn.map((work, i) => (
                    <WorkCard
                      key={`${work.id}-${pageLoadNonce}`}
                      work={work}
                      onClick={handleOpen}
                      isFirst={i === 0}
                      lang={lang}
                      animationIndex={i}
                    />
                  ))}
                </motion.div>

                <motion.div
                  className="flex min-w-0 flex-1 flex-col gap-2"
                >
                  {worksRightColumn.map((work, i) => (
                    <WorkCard
                      key={`${work.id}-${pageLoadNonce}`}
                      work={work}
                      onClick={handleOpen}
                      isFirst={false}
                      lang={lang}
                      animationIndex={i + worksLeftColumn.length}
                    />
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* <=800px：把左侧底部版权条移到作品栏下面，并把语言按钮合并到右侧 */}
        {isMobileLayout && (
          <div className="flex h-[60px] items-center justify-between px-6">
            <div className="text-[12px] text-[#000000]">©{CURRENT_YEAR} leonardozi</div>
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
      </main>

      {selectedWork && <WorkModal work={selectedWork} origin={modalOrigin ?? undefined} onClose={handleClose} lang={lang} />}
    </div>
  );
}

