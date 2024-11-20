import { type MetaFunction } from "@remix-run/node";
import { DiscordLink } from "#app/components/discord-link";
import { Resources } from "#app/components/resources";

export const meta: MetaFunction = () => [{ title: "Covenant Foundry" }];

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
        <Resources />
      </div>
    </div>
  );
}
