import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.section
      className="min-h-[85vh] flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 pt-24 pb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <p className="text-sm sm:text-base text-stone-500 mb-2 tracking-wide" style={{ fontFamily: "var(--font-serif)" }}>
        About
      </p>
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-stone-900"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        Leonardo Zi
      </motion.h1>
      <motion.p
        className="text-xl sm:text-2xl md:text-3xl text-stone-600 mt-2 font-serif"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        视觉与界面设计
      </motion.p>
      <motion.p
        className="mt-6 max-w-xl text-stone-500 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
      >
        用视觉与代码思考和制作。大部分时间在做设计、原型、写作，以及思考图表。
      </motion.p>
      <motion.a
        href="#contact"
        className="mt-8 inline-block text-sm text-stone-500 hover:text-stone-700 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Contact
      </motion.a>
    </motion.section>
  );
}
