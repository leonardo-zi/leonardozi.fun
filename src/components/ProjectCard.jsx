import { motion } from "framer-motion";

export default function ProjectCard({ project, index }) {
  return (
    <motion.article
      className="group border-t border-stone-200 py-6 sm:py-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <a href="#" className="block">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 group-hover:text-stone-600 transition-colors">
            {project.title}
          </h3>
          <span className="text-sm text-stone-400 font-serif">{project.subtitle}</span>
        </div>
        <p className="mt-2 text-sm text-stone-500">
          {project.tags.join(" · ")}
        </p>
      </a>
    </motion.article>
  );
}
