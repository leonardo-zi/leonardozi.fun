import { motion } from "framer-motion";
import { useState } from "react";

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const email = "hello@leonardozi.fun";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.footer
      id="contact"
      className="px-6 sm:px-10 md:px-16 lg:px-24 py-20 md:py-28 bg-stone-900 text-stone-300"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl">
        <a href="#root" className="text-sm text-stone-500 hover:text-stone-400 transition-colors block mb-12">
          top
        </a>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-white mb-4">
          Leonardo Zi
        </h2>
        <p className="text-xl text-stone-400 font-serif mb-2">视觉与界面设计</p>
        <p className="text-stone-500 mb-12 max-w-lg">
          一起做点好作品。
        </p>

        <div className="flex flex-wrap gap-6 text-sm">
          <span className="text-stone-500">通过</span>
          <button
            type="button"
            onClick={copyEmail}
            className="underline underline-offset-2 hover:text-white transition-colors"
          >
            {copied ? "已复制！" : "email"}
          </button>
          <span className="text-stone-500">或在此预约时间联系。</span>
        </div>

        <div className="mt-16 pt-10 border-t border-stone-700">
          <p className="text-xs text-stone-600 font-serif">
            Colophon — 本站使用 Noto Serif SC（思源宋体）字体。由本人设计，基于 Vite + React 构建。
          </p>
          <p className="mt-4 text-stone-600 text-sm">
            © {new Date().getFullYear()} — Leonardo Zi
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
