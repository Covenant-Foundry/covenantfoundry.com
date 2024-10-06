import { AILevel } from "~/components/ai-level";

export default function Index() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-5 prose dark:prose-invert">
      <h1 className="border-l-4 border-l-accent ps-4">AI Usage</h1>
      <p className="text-lg md:text-xl">
        Some of the content on this site is written with the help of AI. We use
        tags to report how much AI was used in a specific page's content. Here's
        a detailed explanation of what each level means.
      </p>
      <AILevel level={0} />
      <p className="pl-6 pb-6 text-lg md:text-xl">
        The human author wrote the content entirely by hand.
      </p>
      <AILevel level={1} />
      <p className="pl-6 pb-6 text-lg md:text-xl">
        The human author used a spelling and grammar checker or similarly
        limited tool.
      </p>
      <AILevel level={2} />
      <p className="pl-6 pb-6 text-lg md:text-xl">
        The human author used AI to generate ideas, inspiration, or an outline,
        but wrote the final content by hand.
      </p>
      <AILevel level={3} />
      <p className="pl-6 pb-6 text-lg md:text-xl">
        The human author used AI as a co-writer or copilot throughout the
        content creation process.
      </p>
      <AILevel level={4} />
      <p className="pl-6 pb-6 text-lg md:text-xl">
        The human author used AI to generate the content draft, editing the
        result by hand.
      </p>
      <AILevel level={5} />
      <p className="pl-6 pb-6 text-lg md:text-xl">
        The human author used AI to generate the entirety of the content,
        reviewing for accuracy but not substantially editing the result.
      </p>
    </main>
  );
}
