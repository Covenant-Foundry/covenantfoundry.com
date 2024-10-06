import { type MetaFunction } from "@remix-run/node";
import { CTAButton } from "~/components/cta-button";
import { DiscordLink } from "~/components/discord-link";
import { Prose } from "~/components/prose";

export const meta: MetaFunction = () => [{ title: "Covenant Foundry" }];

export default function Index() {
  return (
    <Prose>
      <p className="text-center md:mb-12">
        A community of Christians pursuing faithful stewardship of our time,
        talents, and treasures via entrepreneurship.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <DiscordLink />
        <CTAButton to="/find-a-cofounder">Find a Co-founder</CTAButton>
      </div>

      <p className="text-center md:my-12">
        We are curating a collection of helpful third-party resources, including
        books, courses, and other communities:
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <CTAButton to="/resources">Resources</CTAButton>
      </div>
    </Prose>
  );
}
