import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { DiscordLink } from "~/components/discord-link";
import { Icon, type IconName } from "~/components/ui/icon";

export const meta: MetaFunction = () => [{ title: "Covenant Foundry" }];

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

export default function Index() {
  return (
    <div className="flex flex-row flex-wrap gap-20 flex-1 justify-center">
      <div className="flex flex-col items-center justify-center gap-10 mt-20 lg:my-20">
        <div className="text-center text-2xl md:text-3xl mx-10 md:mx-20 max-w-[600px]">
          A community of Christians pursuing faithful stewardship of our time,
          talents, and treasures via entrepreneurship.
        </div>
        <DiscordLink className="text-2xl" />
      </div>
      <div className="flex flex-col items-center justify-center mb-20 lg:my-20">
        <h2 className="text-3xl font-bold">Resources for</h2>
        <h2 className="text-3xl font-bold">Christian Entrepreneurs</h2>
        <nav className="flex flex-col items-stretch justify-stretch gap-10 mt-10">
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
      </div>
    </div>
  );
}
