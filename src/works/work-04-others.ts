import type { Work } from "./types";
import { WORK_IMAGE_WHITE_FALLBACK } from "./placeholders";

export const work04: Work = {
  id: "4",
  title: "Other Works",
  image: WORK_IMAGE_WHITE_FALLBACK,
  cardImageAspectRatio: 1 / 0.7,
  overlayIcon: "./works/leonardozi/leonardozi-icon.svg",
  tags: ["视觉", "跨媒介"],
  tagsEn: ["Visual", "Cross-media"],
  date: "2022/01/01",
  cardIntro: "涵盖早期 UI 设计、字体、品牌包装、插图排版与手绘等多维视觉探索",
  cardIntroEn: "Multi-dimensional visual explorations across type, packaging, illustration, and sketching.",
  detailTitle: "Other Works",
  detailTitleEn: "Other Works",
  typeLabel: "视觉传达 / 包装设计 / 插画艺术 / 手绘",
  typeLabelEn: "Visual Communication / Packaging / Illustration / Sketching",
  details: [
    { label: "类别", value: "视觉传达 / 包装设计 / 插画艺术 / 手绘" },
    { label: "关键词", value: "传统文化重塑、信息可视化、商业插画、手绘基本功、跨媒介设计" },
    { label: "角色", value: "独立创作者 / 视觉设计师" },
  ],
  detailsEn: [
    { label: "Category", value: "Visual Communication / Packaging / Illustration / Sketching" },
    { label: "Keywords", value: "Cultural Reframing, Infographics, Commercial Illustration, Sketching, Cross-media" },
    { label: "Role", value: "Independent Creator / Visual Designer" },
  ],
  overview:
    "本部分收录体系化 UI/UX 项目之外的跨媒介视觉探索与个人艺术创作，侧重美术功底与多元审美。内容包括：传统节日与现代图形结合的「传统节日红包」；以年轻化线框符号焕新老字号的「徐州八珍」包装；「大唐风韵」系列国风插画；以及将复杂流程转译为易读图解的「咽拭子检测示意图」「病毒结构科普图」等。另含素描、彩铅与创意手绘（如超现实头骨、人像与雕塑肌理等），体现对光影、解剖结构与色彩情绪的长期训练。",
  overviewEn:
    "A collection of cross-media visual explorations beyond structured UI/UX work, covering cultural graphics, packaging refreshes, illustration, infographic translation, and long-term drawing practice.",
  layout: "half",
  cardCover: {
    background: {
      type: "video",
      src: "./works/leonardozi/resume_bg.webm",
      autoPlay: true,
      muted: true,
      loop: true,
      playsInline: true,
      controls: false,
      preload: "metadata",
      poster: "./works/leonardozi/others_bg.webp",
    },
    foreground: {
      type: "image",
      src: "./works/leonardozi/others_up.svg",
      placement: { mode: "centerRatio", widthRatio: 0.25 },
      preserveAspectRatio: true,
    },
  },
  detailSections: [
    {
      title: "Other Works",
      details: [
        { label: "类别", value: "视觉传达 / 包装设计 / 插画艺术 / 手绘" },
        { label: "关键词", value: "传统文化重塑、信息可视化、商业插画、手绘基本功、跨媒介设计" },
        { label: "角色", value: "独立创作者 / 视觉设计师" },
      ],
      overview:
        "本部分收录体系化 UI/UX 项目之外的跨媒介视觉探索与个人艺术创作，侧重美术功底与多元审美。内容包括：传统节日与现代图形结合的「传统节日红包」；以年轻化线框符号焕新老字号的「徐州八珍」包装；「大唐风韵」系列国风插画；以及将复杂流程转译为易读图解的「咽拭子检测示意图」「病毒结构科普图」等。另含素描、彩铅与创意手绘（如超现实头骨、人像与雕塑肌理等），体现对光影、解剖结构与色彩情绪的长期训练。",
      detailMedia: [
        { type: "image", src: "./works/leonardozi/11-02.webp" },
        { type: "image", src: "./works/leonardozi/11-03.webp" },
        { type: "image", src: "./works/leonardozi/11-04.webp" },
        { type: "image", src: "./works/leonardozi/11-05.webp" },
      ],
    },
    {
      title: "简单打车（Easy Go）— 面向老年用户的适老化出行打车应用",
      details: [
        { label: "类别", value: "适老化出行 / 社会服务" },
        { label: "关键词", value: "适老化设计、轻量化视觉、高可读性、核心功能精简" },
        { label: "角色", value: "UI 设计参赛作品" },
      ],
      overview:
        "针对老年用户群体定制的出行类应用，旨在缓解数字鸿沟下的打车门槛。设计遵循「精简、清晰、易操作」：大色块布局、高对比度文字与扁平化操作逻辑，提升出行场景下的安全感与使用便利。",
      detailMedia: [
        { type: "image", src: "./works/bobmusic/08-02.webp" },
        { type: "image", src: "./works/bobmusic/08-03.webp" },
        { type: "image", src: "./works/bobmusic/08-04.webp" },
        { type: "image", src: "./works/bobmusic/08-05.webp" },
        { type: "image", src: "./works/bobmusic/08-06.webp" },
      ],
    },
    {
      title: "抱抱音乐（Bob Music）— 年轻群体低压力听歌社交与音乐陪伴产品",
      details: [
        { label: "类别", value: "情感社交 / 音乐播放器" },
        { label: "关键词", value: "低压力社交、围炉功能、音乐陪伴、情感化设计" },
        { label: "角色", value: "UI 设计练习作品" },
      ],
      overview:
        "面向年轻群体的低压力听歌社交产品。以「温暖、安全」为视觉核心，围绕「围炉」社交模式，在音乐陪伴下支持轻度社交。通过克制的交互与情感化界面，营造可放松聊天、缓解孤独的听乐空间。",
      detailMedia: [
        { type: "image", src: "./works/bobmusic/08-07.webp" },
        { type: "image", src: "./works/bobmusic/08-08.webp" },
        { type: "image", src: "./works/bobmusic/08-09.webp" },
        { type: "image", src: "./works/bobmusic/08-10.webp" },
        { type: "image", src: "./works/bobmusic/08-11.webp" },
      ],
    },
  ],
};
