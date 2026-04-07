import { useCallback, useEffect, useRef, useState } from "react";
import { motion, type Variants, useReducedMotion } from "framer-motion";
import { Icon, addCollection } from "@iconify/react";
import { icons as materialSymbolsLight } from "@iconify-json/material-symbols-light";
import { NavLink, Outlet } from "react-router-dom";
import LenisPreventScrollArea from "../components/LenisPreventScrollArea";
import { SIDEBAR_SECTION_NAV } from "../config/sidebarNav";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useSitePreferences, type Lang } from "./SitePreferencesContext";
import { publicAssetUrl } from "../utils/publicAssetUrl";

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
  const wechatCaption =
    lang === "en" ? "Scan the QR code to add me on WeChat" : "扫描二维码，添加我的微信";

  const resumePdfUrl = publicAssetUrl("./contact/resume/简历_李智_2026.pdf");
  const resumeTooltipAriaLabel =
    lang === "en" ? "Download resume, a modest snapshot" : "获取简历，一览薄才";

  const [resumePopupPlacement, setResumePopupPlacement] = useState<"below" | "above">("above");
  const [resumeOpenByClick, setResumeOpenByClick] = useState(false);
  const [resumeHovered, setResumeHovered] = useState(false);
  const [resumeFocused, setResumeFocused] = useState(false);
  const [resumeDismissed, setResumeDismissed] = useState(false);
  const resumeAnchorRef = useRef<HTMLButtonElement | null>(null);
  const resumeTooltipRef = useRef<HTMLDivElement | null>(null);
  const resumeCloseTimerRef = useRef<number | null>(null);

  const [wechatPopupPlacement, setWechatPopupPlacement] = useState<"below" | "above">("above");
  const [wechatOpenByClick, setWechatOpenByClick] = useState(false);
  const [wechatHovered, setWechatHovered] = useState(false);
  const [wechatFocused, setWechatFocused] = useState(false);
  // 点击关闭后：在鼠标离开前，忽略 hover/focus 触发，确保“点关闭立刻消失”
  const [wechatDismissed, setWechatDismissed] = useState(false);
  const wechatAnchorRef = useRef<HTMLButtonElement | null>(null);
  const wechatTooltipRef = useRef<HTMLDivElement | null>(null);
  const wechatCloseTimerRef = useRef<number | null>(null);

  const emailAddress = "ml44142@163.com";
  const emailCaption = lang === "en" ? "Copy email, contact me" : "复制邮箱，与我联络";

  const [emailPopupPlacement, setEmailPopupPlacement] = useState<"below" | "above">("above");
  const [emailOpenByClick, setEmailOpenByClick] = useState(false);
  const [emailWrapperHovered, setEmailWrapperHovered] = useState(false);
  // 点击关闭后：在鼠标离开前，忽略 hover/focus 触发，确保“点关闭立刻消失”
  const [emailDismissed, setEmailDismissed] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const emailAnchorRef = useRef<HTMLButtonElement | null>(null);
  const emailTooltipRef = useRef<HTMLDivElement | null>(null);
  const emailCloseTimerRef = useRef<number | null>(null);
  const HOVER_CLOSE_DELAY_MS = 100;

  const computeEmailPlacement = useCallback(() => {
    const anchor = emailAnchorRef.current;
    const tooltip = emailTooltipRef.current;
    if (!anchor || !tooltip) return;
    if (typeof window === "undefined") return;

    const margin = 2;
    const rect = anchor.getBoundingClientRect();
    const tooltipHeight = tooltip.offsetHeight ?? 0;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // 默认尽量显示在上方；只有上方空间不够时才翻到下方。
    const canShowBelow = spaceBelow >= tooltipHeight + margin;
    const canShowAbove = spaceAbove >= tooltipHeight + margin;
    if (canShowAbove) {
      setEmailPopupPlacement("above");
    } else if (canShowBelow) {
      setEmailPopupPlacement("below");
    } else {
      // 都不够时，选择上方以保持与 WeChat 一致
      setEmailPopupPlacement("above");
    }
  }, []);

  useEffect(() => {
    const onResize = () => computeEmailPlacement();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computeEmailPlacement]);

  useEffect(() => {
    if (!emailOpenByClick) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEmailOpenByClick(false);
        setEmailDismissed(true);
        setEmailCopied(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [emailOpenByClick]);

  useEffect(() => {
    if (!wechatOpenByClick && !emailOpenByClick && !resumeOpenByClick) return;

    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) return;

      const insideWechat =
        wechatAnchorRef.current?.contains(target) || wechatTooltipRef.current?.contains(target);
      const insideEmail =
        emailAnchorRef.current?.contains(target) || emailTooltipRef.current?.contains(target);
      const insideResume =
        resumeAnchorRef.current?.contains(target) || resumeTooltipRef.current?.contains(target);

      if (insideWechat || insideEmail || insideResume) return;

      setWechatOpenByClick(false);
      setWechatDismissed(true);
      setWechatHovered(false);
      setWechatFocused(false);

      setEmailOpenByClick(false);
      setEmailDismissed(true);
      setEmailCopied(false);

      setResumeOpenByClick(false);
      setResumeDismissed(true);
      setResumeHovered(false);
      setResumeFocused(false);
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("mousedown", onPointerDown, true);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("mousedown", onPointerDown, true);
    };
  }, [wechatOpenByClick, emailOpenByClick, resumeOpenByClick]);

  const reduceMotion = useReducedMotion();

  // 联系卡片 tooltip 滑入动画：与首页/音乐页一致（y 位移减半为 8px）
  const contactTooltipVariants: Variants = reduceMotion
    ? {
      hidden: { opacity: 0, y: 0 },
      show: { opacity: 1, y: 0, transition: { duration: 0 } },
    }
    : {
      hidden: { opacity: 0, y: 8 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
      },
    };

  const computeWechatPlacement = useCallback(() => {
    const anchor = wechatAnchorRef.current;
    const tooltip = wechatTooltipRef.current;
    if (!anchor || !tooltip) return;
    if (typeof window === "undefined") return;

    const margin = 2;
    const rect = anchor.getBoundingClientRect();
    const tooltipHeight = tooltip.offsetHeight ?? 0;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // 默认尽量在上方；只有上方空间不够时才翻到下方。
    const shouldShowBelow = spaceAbove < tooltipHeight + margin && spaceBelow >= tooltipHeight + margin;
    setWechatPopupPlacement(shouldShowBelow ? "below" : "above");
  }, []);

  useEffect(() => {
    const onResize = () => computeWechatPlacement();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computeWechatPlacement]);

  const computeResumePlacement = useCallback(() => {
    const anchor = resumeAnchorRef.current;
    const tooltip = resumeTooltipRef.current;
    if (!anchor || !tooltip) return;
    if (typeof window === "undefined") return;

    const margin = 2;
    const rect = anchor.getBoundingClientRect();
    const tooltipHeight = tooltip.offsetHeight ?? 0;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const shouldShowBelow = spaceAbove < tooltipHeight + margin && spaceBelow >= tooltipHeight + margin;
    setResumePopupPlacement(shouldShowBelow ? "below" : "above");
  }, []);

  useEffect(() => {
    const onResize = () => computeResumePlacement();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computeResumePlacement]);

  useEffect(() => {
    if (!wechatOpenByClick) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setWechatOpenByClick(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [wechatOpenByClick]);

  useEffect(() => {
    if (!resumeOpenByClick) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setResumeOpenByClick(false);
        setResumeDismissed(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [resumeOpenByClick]);

  const wechatTooltipVisible = wechatOpenByClick || (!wechatDismissed && (wechatHovered || wechatFocused));
  const emailTooltipVisible = emailOpenByClick || (!emailDismissed && emailWrapperHovered);
  const resumeTooltipVisible =
    resumeOpenByClick || (!resumeDismissed && (resumeHovered || resumeFocused));

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
            <div
              className="relative"
              onMouseEnter={() => {
                if (resumeCloseTimerRef.current) {
                  window.clearTimeout(resumeCloseTimerRef.current);
                  resumeCloseTimerRef.current = null;
                }
                setResumeHovered(true);
                setResumeDismissed(false);
              }}
              onMouseLeave={(e) => {
                const nextTarget = e.relatedTarget as Node | null;
                if (resumeTooltipRef.current?.contains(nextTarget)) return;
                if (resumeCloseTimerRef.current) window.clearTimeout(resumeCloseTimerRef.current);
                resumeCloseTimerRef.current = window.setTimeout(() => {
                  setResumeHovered(false);
                  setResumeDismissed(false);
                  resumeCloseTimerRef.current = null;
                }, HOVER_CLOSE_DELAY_MS);
              }}
            >
              <button
                ref={resumeAnchorRef}
                type="button"
                className={TOC_BUTTON_CLASS}
                onMouseEnter={() => {
                  if (resumeCloseTimerRef.current) {
                    window.clearTimeout(resumeCloseTimerRef.current);
                    resumeCloseTimerRef.current = null;
                  }
                  setResumeHovered(true);
                  computeResumePlacement();
                }}
                onFocus={() => {
                  setResumeFocused(true);
                  computeResumePlacement();
                }}
                onBlur={() => setResumeFocused(false)}
                aria-expanded={resumeOpenByClick}
                onClick={() => {
                  setResumeOpenByClick((v) => {
                    const next = !v;
                    if (next) {
                      setResumeDismissed(false);
                      setEmailOpenByClick(false);
                      setEmailDismissed(true);
                      setEmailCopied(false);
                      setWechatOpenByClick(false);
                      setWechatDismissed(true);
                      setWechatHovered(false);
                      setWechatFocused(false);
                    } else {
                      setResumeDismissed(true);
                    }
                    if (next) requestAnimationFrame(() => computeResumePlacement());
                    return next;
                  });
                }}
              >
                <span className="relative inline-block">
                  {tocResume}
                  <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
                </span>
                <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
              </button>

              <motion.div
                ref={resumeTooltipRef}
                role="tooltip"
                aria-label={resumeTooltipAriaLabel}
                variants={contactTooltipVariants}
                initial="hidden"
                animate={resumeTooltipVisible ? "show" : "hidden"}
                style={{ pointerEvents: resumeTooltipVisible ? "auto" : "none" }}
                className={[
                  "absolute left-0 z-50 w-[174px] rounded-[12px] bg-[#ffffff] p-[12px] border-[0.5px] border-[#e0e0e0] shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
                  resumePopupPlacement === "below"
                    ? "top-[calc(100%+2px)]"
                    : "bottom-[calc(100%+2px)]",
                ].join(" ")}
                onMouseEnter={() => {
                  if (resumeCloseTimerRef.current) {
                    window.clearTimeout(resumeCloseTimerRef.current);
                    resumeCloseTimerRef.current = null;
                  }
                  setResumeHovered(true);
                  setResumeDismissed(false);
                }}
                onMouseLeave={() => {
                  if (resumeCloseTimerRef.current) window.clearTimeout(resumeCloseTimerRef.current);
                  resumeCloseTimerRef.current = window.setTimeout(() => {
                    setResumeHovered(false);
                    if (!resumeOpenByClick) setResumeDismissed(false);
                    resumeCloseTimerRef.current = null;
                  }, HOVER_CLOSE_DELAY_MS);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {resumeOpenByClick && (
                  <button
                    type="button"
                    aria-label={lang === "en" ? "Close" : "关闭"}
                    className="absolute right-0 top-0 inline-flex h-[22px] w-[22px] translate-x-[calc(50%-2px)] translate-y-[calc(4px-50%)] items-center justify-center text-[#A9A9A9] opacity-50 transition-opacity duration-150 ease-out hover:opacity-70 active:opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResumeOpenByClick(false);
                      setResumeDismissed(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m75.31 260.69a16 16 0 1 1-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 0 1-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0 1 22.62-22.62L256 233.37l52.69-52.68a16 16 0 0 1 22.62 22.62L278.63 256Z" />
                    </svg>
                  </button>
                )}
                <div className="flex flex-col items-center gap-[12px]">
                  <video
                    className="h-[150px] w-[150px] rounded-[6px] object-cover"
                    src={publicAssetUrl("./contact/resume/resume_bg.webm")}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls={false}
                    preload="metadata"
                    aria-hidden
                  />
                  <div className="text-center text-[11px] leading-[16px] font-normal text-[#000000]">
                    {lang === "en" ? (
                      <>
                        <a
                          href={resumePdfUrl}
                          download="简历_李智_2026.pdf"
                          className="font-normal text-[#0055E1] hover:underline"
                        >
                          Download resume
                        </a>
                        , a modest snapshot
                      </>
                    ) : (
                      <>
                        <a
                          href={resumePdfUrl}
                          download="简历_李智_2026.pdf"
                          className="font-normal text-[#0055E1] hover:underline"
                        >
                          获取简历
                        </a>
                        ，一览薄才
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
            <div
              className="relative"
              onMouseEnter={() => {
                if (wechatCloseTimerRef.current) {
                  window.clearTimeout(wechatCloseTimerRef.current);
                  wechatCloseTimerRef.current = null;
                }
                setWechatHovered(true);
                setWechatDismissed(false);
              }}
              onMouseLeave={(e) => {
                const nextTarget = e.relatedTarget as Node | null;
                if (wechatTooltipRef.current?.contains(nextTarget)) return;
                if (wechatCloseTimerRef.current) window.clearTimeout(wechatCloseTimerRef.current);
                wechatCloseTimerRef.current = window.setTimeout(() => {
                  setWechatHovered(false);
                  setWechatDismissed(false);
                  wechatCloseTimerRef.current = null;
                }, HOVER_CLOSE_DELAY_MS);
              }}
            >
              <button
                ref={wechatAnchorRef}
                type="button"
                className={TOC_BUTTON_CLASS}
                onMouseEnter={() => {
                  if (wechatCloseTimerRef.current) {
                    window.clearTimeout(wechatCloseTimerRef.current);
                    wechatCloseTimerRef.current = null;
                  }
                  setWechatHovered(true);
                  computeWechatPlacement();
                }}
                onFocus={() => {
                  setWechatFocused(true);
                  computeWechatPlacement();
                }}
                onBlur={() => setWechatFocused(false)}
                aria-expanded={wechatOpenByClick}
                onClick={() => {
                  setWechatOpenByClick((v) => {
                    const next = !v;
                    if (next) {
                      setWechatDismissed(false);
                      // 互斥：打开 WeChat 时关闭 Email（并设置 dismissed 防止 hover 立刻又弹回）
                      setEmailOpenByClick(false);
                      setEmailDismissed(true);
                      setEmailCopied(false);
                      setResumeOpenByClick(false);
                      setResumeDismissed(true);
                      setResumeHovered(false);
                      setResumeFocused(false);
                    } else {
                      setWechatDismissed(true);
                    }
                    // 打开时立即计算 placement，确保弹层出现在光标/触发项上方。
                    if (next) requestAnimationFrame(() => computeWechatPlacement());
                    return next;
                  });
                }}
              >
                <span className="relative inline-block">
                  {lang === "en" ? "WeChat" : "微信"}
                  <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
                </span>
                <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
              </button>

              <motion.div
                ref={wechatTooltipRef}
                role="tooltip"
                aria-label={wechatCaption}
                variants={contactTooltipVariants}
                initial="hidden"
                animate={wechatTooltipVisible ? "show" : "hidden"}
                style={{ pointerEvents: wechatTooltipVisible ? "auto" : "none" }}
                className={[
                  "absolute left-0 z-50 w-[174px] rounded-[12px] bg-[#ffffff] p-[12px] border-[0.5px] border-[#e0e0e0] shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
                  wechatPopupPlacement === "below"
                    ? "top-[calc(100%+2px)]"
                    : "bottom-[calc(100%+2px)]",
                ].join(" ")}
                onMouseEnter={() => {
                  if (wechatCloseTimerRef.current) {
                    window.clearTimeout(wechatCloseTimerRef.current);
                    wechatCloseTimerRef.current = null;
                  }
                  setWechatHovered(true);
                  setWechatDismissed(false);
                }}
                onMouseLeave={() => {
                  if (wechatCloseTimerRef.current) window.clearTimeout(wechatCloseTimerRef.current);
                  wechatCloseTimerRef.current = window.setTimeout(() => {
                    setWechatHovered(false);
                    if (!wechatOpenByClick) setWechatDismissed(false);
                    wechatCloseTimerRef.current = null;
                  }, HOVER_CLOSE_DELAY_MS);
                }}
                onClick={(e) => {
                  // Tooltip 内点击不应关闭。
                  e.stopPropagation();
                }}
              >
                {wechatOpenByClick && (
                  <button
                    type="button"
                    aria-label={lang === "en" ? "Close" : "关闭"}
                    className="absolute right-0 top-0 inline-flex h-[22px] w-[22px] translate-x-[calc(50%-2px)] translate-y-[calc(4px-50%)] items-center justify-center text-[#A9A9A9] opacity-50 transition-opacity duration-150 ease-out hover:opacity-70 active:opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      setWechatOpenByClick(false);
                      setWechatDismissed(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m75.31 260.69a16 16 0 1 1-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 0 1-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0 1 22.62-22.62L256 233.37l52.69-52.68a16 16 0 0 1 22.62 22.62L278.63 256Z" />
                    </svg>
                  </button>
                )}
                <div className="flex flex-col items-center gap-[12px]">
                  <img
                    src={publicAssetUrl("./contact/wechat/wechat_qr.jpg")}
                    alt=""
                    aria-hidden
                    className="h-[150px] w-[150px] rounded-[6px] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="text-center text-[11px] leading-[16px] font-normal text-[#000000]">
                    {wechatCaption}
                  </div>
                </div>
              </motion.div>
            </div>
            <div
              className="relative"
              onMouseEnter={() => {
                if (emailCloseTimerRef.current) {
                  window.clearTimeout(emailCloseTimerRef.current);
                  emailCloseTimerRef.current = null;
                }
                setEmailWrapperHovered(true);
                setEmailDismissed(false);
              }}
              onMouseLeave={(e) => {
                const nextTarget = e.relatedTarget as Node | null;
                if (emailTooltipRef.current?.contains(nextTarget)) return;
                if (emailCloseTimerRef.current) window.clearTimeout(emailCloseTimerRef.current);
                emailCloseTimerRef.current = window.setTimeout(() => {
                  setEmailWrapperHovered(false);
                  if (!emailOpenByClick) {
                    setEmailCopied(false);
                    setEmailDismissed(false);
                  }
                  emailCloseTimerRef.current = null;
                }, HOVER_CLOSE_DELAY_MS);
              }}
            >
              <button
                ref={emailAnchorRef}
                type="button"
                className={TOC_BUTTON_CLASS}
                onMouseEnter={() => {
                  if (emailCloseTimerRef.current) {
                    window.clearTimeout(emailCloseTimerRef.current);
                    emailCloseTimerRef.current = null;
                  }
                  setEmailWrapperHovered(true);
                  setEmailDismissed(false);
                  computeEmailPlacement();
                }}
                onFocus={() => {
                  setEmailWrapperHovered(true);
                  setEmailDismissed(false);
                  computeEmailPlacement();
                }}
                onBlur={() => {
                  setEmailWrapperHovered(false);
                }}
                aria-expanded={emailOpenByClick}
                onClick={() => {
                  setEmailOpenByClick((v) => {
                    const next = !v;
                    if (next) {
                      setEmailDismissed(false);
                      setEmailCopied(false);
                      setEmailWrapperHovered(true);
                      // 互斥：打开 Email 时关闭 WeChat（并设置 dismissed 防止 hover 立刻重开）
                      setWechatOpenByClick(false);
                      setWechatDismissed(true);
                      setWechatHovered(false);
                      setWechatFocused(false);
                      setResumeOpenByClick(false);
                      setResumeDismissed(true);
                      setResumeHovered(false);
                      setResumeFocused(false);
                      requestAnimationFrame(() => computeEmailPlacement());
                    } else {
                      setEmailDismissed(true);
                      setEmailCopied(false);
                    }
                    return next;
                  });
                }}
              >
                <span className="relative inline-block">
                  {lang === "en" ? "Email" : "邮箱"}
                  <span className="pointer-events-none absolute left-0 bottom-[-2px] h-[0.5px] w-full origin-left scale-x-0 bg-[#000000] transition-transform duration-150 ease-in-out group-hover:scale-x-100" />
                </span>
                <Icon icon="material-symbols-light:arrow-outward-rounded" width={18} height={18} color="#000000" aria-hidden />
              </button>

              <motion.div
                ref={emailTooltipRef}
                role="tooltip"
                aria-label={emailCaption}
                variants={contactTooltipVariants}
                initial="hidden"
                animate={emailTooltipVisible ? "show" : "hidden"}
                style={{ pointerEvents: emailTooltipVisible ? "auto" : "none" }}
                className={[
                  "absolute left-0 z-50 w-[240px] rounded-[12px] bg-[#ffffff] p-[12px] border-[0.5px] border-[#e0e0e0] shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
                  emailPopupPlacement === "below"
                    ? "top-[calc(100%+2px)]"
                    : "bottom-[calc(100%+2px)]",
                ].join(" ")}
                onMouseEnter={() => {
                  if (emailCloseTimerRef.current) {
                    window.clearTimeout(emailCloseTimerRef.current);
                    emailCloseTimerRef.current = null;
                  }
                  setEmailWrapperHovered(true);
                  setEmailDismissed(false);
                }}
                onMouseLeave={() => {
                  if (emailCloseTimerRef.current) window.clearTimeout(emailCloseTimerRef.current);
                  emailCloseTimerRef.current = window.setTimeout(() => {
                    setEmailWrapperHovered(false);
                    if (!emailOpenByClick) {
                      setEmailCopied(false);
                      setEmailDismissed(false);
                    }
                    emailCloseTimerRef.current = null;
                  }, HOVER_CLOSE_DELAY_MS);
                }}
                onClick={(e) => {
                  // tooltip 内点击不影响外部按钮状态
                  e.stopPropagation();
                }}
              >
                {emailOpenByClick && (
                  <button
                    type="button"
                    aria-label={lang === "en" ? "Close" : "关闭"}
                    className="absolute right-0 top-0 inline-flex h-[22px] w-[22px] translate-x-[calc(50%-2px)] translate-y-[calc(4px-50%)] items-center justify-center text-[#A9A9A9] opacity-50 transition-opacity duration-150 ease-out hover:opacity-70 active:opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEmailOpenByClick(false);
                      setEmailDismissed(true);
                      setEmailCopied(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m75.31 260.69a16 16 0 1 1-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 0 1-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0 1 22.62-22.62L256 233.37l52.69-52.68a16 16 0 0 1 22.62 22.62L278.63 256Z" />
                    </svg>
                  </button>
                )}

                <div className="flex flex-col items-center gap-[12px]">
                  <div className="flex w-full items-center justify-between rounded-[6px] bg-[#F3F3F3] px-[8px] py-[6px] border-[0.5px] border-[#E6E6E6]">
                    <div style={{ fontFamily: "'Andale Mono', monospace" }} className="min-w-0 truncate text-[14px] leading-[20px] font-normal text-[#3A3A3A]">
                      {emailAddress}
                    </div>

                    <div className="group shrink-0">
                      <button
                        type="button"
                        aria-label={emailCopied ? "Copied" : "Copy email"}
                        className="flex h-[20px] w-[20px] items-center justify-center rounded-[3px] bg-transparent transition-colors group-hover:bg-black/5 text-[#A9A9A9]"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await navigator.clipboard.writeText(emailAddress);
                          } catch {
                            // 忽略写入失败，仍展示完成态（避免交互卡住）
                          }
                          setEmailCopied(true);
                        }}
                      >
                        {emailCopied ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden
                            className="h-[16px] w-[16px]"
                          >
                            <path d="m9 16.2l-3.5-3.5a.984.984 0 0 0-1.4 0a.984.984 0 0 0 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7a.984.984 0 0 0 0-1.4a.984.984 0 0 0-1.4 0z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            aria-hidden
                            className="h-[16px] w-[16px]"
                          >
                            <g fill="none" fillRule="evenodd">
                              <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                              <path
                                fill="currentColor"
                                d="M9 2a2 2 0 0 0-2 2v2h2V4h11v11h-2v2h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM4 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm0 2h11v11H4z"
                              />
                            </g>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-center text-[11px] leading-[16px] font-normal text-[#000000]">{emailCaption}</div>
                </div>
              </motion.div>
            </div>
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
          ? "An early-career designer committed to structured, aesthetically considered work. I believe design can be restorative. Currently learning to code and exploring vibe coding."
          : "新手设计师，致力于创造有秩序感且赏心悦目的设计，相信设计可以抚慰人心。正尝试学习代码，正在享受氛围编程。"}
      </div>
      <div>{lang === "en" ? "Interests include games and music; I live with two cats." : "喜欢玩游戏、听音乐，拥有两只猫。"}</div>
    </>
  );

  return (
    <div className="grid min-h-screen grid-cols-1 min-[801px]:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
      {!isMobileLayout && (
        <aside className="hidden min-w-0 flex-col overflow-hidden bg-[#ffffff] min-[801px]:flex min-[801px]:sticky min-[801px]:top-0 min-[801px]:h-screen">
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

          <div className="flex w-full flex-col items-stretch gap-0 p-4 pt-0 pb-0 min-[801px]:px-4">
            {!isMobileLayout && (
              <div className="hidden h-[76px] w-full items-center justify-end gap-[6px] px-[9px] min-[801px]:flex">
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
            <div className="flex items-center justify-center px-4 py-6 min-[801px]:hidden">
              <Copyright lang={lang} />
            </div>
          )}
        </>
      </main>
    </div>
  );
}
