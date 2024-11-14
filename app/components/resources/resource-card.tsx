import { Link } from "@remix-run/react";
import { Tags } from "../ui/tags";

export type Resource = {
  title: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl?: string;
} & (
  | {
      link: string;
    }
  | {
      slug: string;
    }
);

export function ResourceCard({
  resource,
  root,
  showCategory = false,
}: {
  resource: Resource;
  root: string;
  showCategory?: boolean;
}) {
  const link = "slug" in resource ? `${root}/${resource.slug}` : resource.link;
  return (
    <div className="flex flex-row gap-2 max-w-sm bg-white/10">
      <div className="flex-1 flex flex-col justify-center items-center">
        <Link to={link}>
          <img
            src={resource.imageUrl}
            alt={resource.title}
            className="m-0 object-cover"
          />
        </Link>
      </div>
      <div className="flex-1 flex flex-col gap-2 justify-between p-2">
        <Link to={link} className="no-underline hover:underline">
          <div className="text-2xl font-bold">{resource.title}</div>
        </Link>
        {showCategory && <div className="text-sm">{resource.category}</div>}
        <Tags tags={resource.tags} />
        <div className="text-sm flex-grow">{resource.description}</div>
      </div>
    </div>
  );
}
