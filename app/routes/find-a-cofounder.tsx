import { DiscordLink } from "~/components/discord-link";
import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main className="mx-auto max-w-3xl px-4 prose dark:prose-invert">
      <h1 className="border-l-4 border-l-accent ps-4">Find a Co-founder</h1>
      <p className="text-xl md:text-2xl">
        A good co-founder can make all the difference for a successful business.
        But finding someone who has the right skills <em>and</em> is aligned
        with your Christian worldview is tough.
      </p>
      <p className="text-xl md:text-2xl">
        Join our Discord server and introduce yourself in our{" "}
        <Link
          to="https://discordapp.com/channels/1204923985498996746/1284558421047119952"
          className="text-accent underline-offset-4 hover:underline"
          target="_blank"
        >
          #find-a-cofounder
        </Link>{" "}
        channel. Get to know other founders who share your values, and find
        opportunities to collaborate!
      </p>

      <div className="my-8 flex flex-wrap justify-center gap-4">
        <DiscordLink />
      </div>
    </main>
  );
}
