import { DiscordLink } from "~/components/discord-link";
import { type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Covenant Foundry" }];

export default function Index() {
  return (
    <main className="mx-auto max-w-2xl items-center px-3 prose dark:prose-invert">
      <p className="text-center md:mb-12 text-xl md:text-2xl">
        A community of Christians pursuing faithful stewardship of our time,
        talents, and treasures via entrepreneurship.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <DiscordLink />
        <a
          href="/find-a-cofounder"
          className="rounded border-2 border-accent bg-transparent px-6 py-3 font-bold text-accent transition-opacity duration-300 hover:opacity-90 no-underline"
        >
          Find a Co-founder
        </a>
      </div>
    </main>
  );
}
