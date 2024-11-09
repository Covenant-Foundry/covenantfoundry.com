import { Link } from "@remix-run/react";
import { type IconName, Icon } from "./ui/icon";

const resources: {
  title: string;
  icon: IconName;
  to: string;
}[] = [
  {
    title: "Books",
    icon: "book",
    to: "/resources/books",
  },
  {
    title: "Communities",
    icon: "people-group",
    to: "/resources/communities",
  },
  {
    title: "Services",
    icon: "handshake",
    to: "/resources/services",
  },
];

export function Resources() {
  return (
    <nav className="flex flex-col items-stretch justify-stretch gap-10 mt-10 max-w-[65ch] mx-auto">
      {resources.map((resource) => (
        <Link
          key={resource.to}
          className="mx-10 pe-5 font-bold transition-opacity duration-300 no-underline text-3xl border-0 bg-transparent hover:bg-accent/20 flex flex-row items-center"
          to={resource.to}
        >
          <Icon
            name={resource.icon}
            className="p-5 mr-3 border-r-4 border-r-accent w-[3em] h-[3em]"
          >
            {resource.title}
          </Icon>
        </Link>
      ))}
    </nav>
  );
}
