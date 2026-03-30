import { useRef } from "react";
import { Icon, addCollection } from "@iconify/react";
import { icons as materialSymbolsLight } from "@iconify-json/material-symbols-light";
import { NavLink, Outlet } from "react-router-dom";
import LenisPreventScrollArea from "../components/LenisPreventScrollArea";
import { SIDEBAR_SECTION_NAV } from "../config/sidebarNav";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useSitePreferences, type Lang } from "./SitePreferencesContext";

const CURRENT_YEAR = new Date().getFullYear();
const SITE_ICON_SRC = "/works/icon/leonardozi_icon.png";
addCollection(materialSymbolsLight);

const TOC_BUTTON_CLASS =
  "group flex h-[18px] w-full items-center justify-between text-[14px] sm:text-[12px] leading-[16px] text-[#000000] cursor-pointer hover:opacity-80 active:opacity-60";

function formatEditedDate(date: Date): string {
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
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

function navSectionClassName({ isActive }: { isActive: boolean }) {
  return [
    TOC_BUTTON_CLASS,
    isActive ? "opacity-100" : "",
    isActive ? "font-medium" : "",
  ].join(" ");
}

function SidebarSectionLinks({ lang, onNavigate }: { lang: Lang; onNavigate?: () => void }) {
  return (
    <>
      {SIDEBAR_SECTION_NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={navSectionClassName}
          onClick={onNavigate}
        >
          <span className="relative inline-block">
            {lang === "en" ? item.labelEn : item.labelCn}
            <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
          </span>
          <Icon icon="material-symbols-light:arrow-forward-rounded" width={18} height={18} color="#000000" aria-hidden />
        </NavLink>
      ))}
    </>
  );
}

function SidebarToc({ lang }: { lang: Lang }) {
  const tocTitle = lang === "en" ? "Sections" : "分区";
  const tocContact = lang === "en" ? "Contact" : "联络";
  const tocResume = lang === "en" ? "Resume" : "简历";

  return (
    <>
      <div className="flex flex-col gap-[32px]">
        <div className="h-[0.5px] w-full bg-[#aaa]" />
        <div className="flex flex-col">
          <div className="text-[14px] sm:text-[12px] font-semibold leading-[16px] text-[#000000]">{tocTitle}</div>
          <div className="mt-[12px] flex flex-col gap-[6px]">
            <SidebarSectionLinks lang={lang} />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-[14px] sm:text-[12px] font-semibold leading-[16px] text-[#000000]">{tocContact}</div>
          <div className="mt-[12px] flex flex-col gap-[6px]">
            <button type="button" className={TOC_BUTTON_CLASS}>
              <span className="relative inline-block">
                {tocResume}
                <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
              </span>
              <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
            </button>
            <button type="button" className={TOC_BUTTON_CLASS}>
              <span className="relative inline-block">
                Email
                <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
              </span>
              <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
            </button>
            <button type="button" className={TOC_BUTTON_CLASS}>
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

export default function SiteLayout() {
  const { lang, setLang } = useSitePreferences();
  const mainRef = useRef<HTMLDivElement>(null);

  const isMobileLayout = useMediaQuery("(max-width: 800px)");

  const desktopBio = (
    <>
      <div>
        {lang === "en"
          ? "Small things made with code and design. This is a collection of personal works and notes—sometimes I write about UI, prototypes, and ideas."
          : "用代码和设计做点小东西。这里是个人作品与笔记的集合，偶尔写写界面、原型和想法。"}
      </div>
      <div>{lang === "en" ? "Enjoying Vibe Coding—what a great invention." : "正在享受 Vibe Coding ，这真是个伟大的发明。"}</div>
    </>
  );

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
      {!isMobileLayout && (
        <aside className="hidden min-w-0 flex-col overflow-hidden bg-[#ffffff] md:flex md:sticky md:top-0 md:h-screen">
          <div className="flex h-[76px] shrink-0 items-center justify-start p-6">
            <SiteMark />
          </div>
          <LenisPreventScrollArea className="flex-1 min-h-0 overflow-y-auto px-6 py-0">
            <div className="flex flex-col gap-[32px]">
              <div className="flex flex-col gap-3 text-[14px] sm:text-[12px] leading-[16px] text-[#000000]">{desktopBio}</div>
              <SidebarToc lang={lang} />
            </div>
          </LenisPreventScrollArea>
          <div className="h-[60px] shrink-0 flex items-center px-6">
            <Copyright lang={lang} />
          </div>
        </aside>
      )}

      <main ref={isMobileLayout ? undefined : mainRef} className="bg-[#ffffff] min-w-0">
        <>
          {isMobileLayout && (
            <aside className="w-full shrink-0 flex-col bg-[#ffffff]">
              <div className="flex h-[76px] shrink-0 items-center justify-start p-6">
                <SiteMark />
              </div>
              <div className="px-6 py-0 pb-[50px]">
                <div className="flex flex-col gap-[32px]">
                  <div className="flex flex-col gap-3 text-[14px] sm:text-[12px] leading-[16px] text-[#000000]">{desktopBio}</div>
                  <SidebarToc lang={lang} />
                </div>
              </div>
            </aside>
          )}

          <div className="flex w-full flex-col items-stretch gap-0 p-4 pt-0 pb-0 md:px-4">
            {!isMobileLayout && (
              <div className="hidden h-[76px] w-full items-center justify-end gap-[6px] px-[9px] md:flex">
                <div className="flex items-center gap-[6px]">
                  <LanguageToggleButtons lang={lang} onChange={setLang} />
                </div>
              </div>
            )}

            <div
              className={
                "w-full max-[800px]:pb-[32px] min-[801px]:pb-[150px]"
              }
            >
              <Outlet />
            </div>
          </div>

          {isMobileLayout && (
            <div className="flex h-[60px] items-center justify-between px-6">
              <div className="text-[14px] sm:text-[12px] text-[#000000]">©{CURRENT_YEAR} leonardozi</div>
              <div className="flex items-center gap-[6px]">
                <LanguageToggleButtons lang={lang} onChange={setLang} />
              </div>
            </div>
          )}

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
