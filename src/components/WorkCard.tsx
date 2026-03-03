import type { Work } from "../data/works";

interface WorkCardProps {
  work: Work;
}

export default function WorkCard({ work }: WorkCardProps) {
  return (
    <article className={work.layout === "full" ? "col-span-2" : ""}>
      <div className="rounded-lg p-2 -m-2 transition-opacity duration-200 ease-out hover:opacity-70">
        <div className="rounded-lg overflow-hidden bg-stone-100">
          <img
            src={work.image}
            alt={work.title}
            className="w-full h-auto block object-cover"
          />
        </div>
        <h3 className="mt-2 text-base font-medium text-stone-800">{work.title}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0 text-xs text-stone-500">
          {work.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
          <span>{work.date}</span>
        </div>
      </div>
    </article>
  );
}
