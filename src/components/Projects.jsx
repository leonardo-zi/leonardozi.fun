import { motion } from "framer-motion";
import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section id="work" className="px-6 sm:px-10 md:px-16 lg:px-24 py-16 md:py-24">
      <motion.h2
        className="text-sm text-stone-500 mb-10 tracking-wide"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Work
      </motion.h2>
      <div className="max-w-4xl">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
