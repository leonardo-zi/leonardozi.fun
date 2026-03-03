import { motion } from "framer-motion";

export default function About() {
  return (
    <motion.section
      id="about"
      className="px-6 sm:px-10 md:px-16 lg:px-24 py-16 md:py-24 border-t border-stone-200"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
    >
      <p className="text-sm text-stone-500 mb-4 tracking-wide">About</p>
      <p className="max-w-2xl text-stone-700 leading-relaxed font-serif">
        视觉与界面设计师，用视觉与代码思考和制作。大部分时间在做设计、原型、写作，以及思考图表。
      </p>
    </motion.section>
  );
}
