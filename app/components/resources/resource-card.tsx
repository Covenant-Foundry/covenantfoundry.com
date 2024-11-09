import { Link } from "@remix-run/react";

export type Resource = {
  title: string;
  description: string;
  category: string;
  tags: string[];
  link?: string;
  imageUrl?: string;
};

export function ResourceCard({
  resource,
  showCategory = false,
}: {
  resource: Resource;
  showCategory?: boolean;
}) {
  const image = (
    <img
      src={resource.imageUrl}
      alt={resource.title}
      className="m-0 object-cover"
    />
  );
  return (
    <div className="flex flex-row gap-2 max-w-sm bg-white/10">
      <div className="flex-1 flex flex-col justify-center">
        {resource.link ? <Link to={resource.link}>{image}</Link> : image}
      </div>
      <div className="flex-1 flex flex-col gap-2 justify-between p-2">
        {resource.link ? (
          <Link to={resource.link} className="no-underline hover:underline">
            <div className="text-2xl font-bold">{resource.title}</div>
          </Link>
        ) : (
          <div className="text-2xl font-bold">{resource.title}</div>
        )}
        {showCategory && <div className="text-sm">{resource.category}</div>}
        <div className="flex flex-row flex-wrap gap-2">
          {resource.tags.map((tag) => (
            <div
              key={tag}
              className="text-sm rounded-full border-2 border-accent font-bold text-accent px-3"
            >
              {tag}
            </div>
          ))}
        </div>
        <div className="text-sm flex-grow">{resource.description}</div>
      </div>
    </div>
  );
}
