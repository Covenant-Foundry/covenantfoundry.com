import { MetaFunction } from "@remix-run/node";
import { AILevel } from "#app/components/ai-level";
import { Prose } from "#app/components/prose";

export const meta: MetaFunction = () => {
  return [
    {
      title: "AI Disclosures",
    },
    {
      name: "description",
      content: "How we use AI on Covenant Foundry.",
    },
  ];
};

export default function Index() {
  return (
    <Prose className="mx-auto max-w-4xl py-10">
      <h1>AI Disclosures</h1>
      <p>
        Some of the content on this site is written with the help of AI, though
        always with a "human in the loop." We use tags to show how much AI was
        used in a specific page's content. Here's a detailed explanation of what
        each level means.
      </p>
      <AILevel level={0} />
      <p className="pl-6 pb-6">
        The human author wrote the content entirely by hand.
      </p>
      <AILevel level={1} />
      <p className="pl-6 pb-6">
        The human author used a spelling and grammar checker or similarly
        limited tool.
      </p>
      <AILevel level={2} />
      <p className="pl-6 pb-6">
        The human author used AI to generate ideas, inspiration, or an outline,
        but wrote the final content by hand.
      </p>
      <AILevel level={3} />
      <p className="pl-6 pb-6">
        The human author used AI as a co-writer or copilot throughout the
        content creation process.
      </p>
      <AILevel level={4} />
      <p className="pl-6 pb-6">
        The human author used AI to generate the content draft, editing the
        result by hand.
      </p>
      <AILevel level={5} />
      <p className="pl-6 pb-6">
        The human author used AI to generate the entirety of the content,
        reviewing for accuracy but not substantially editing the result.
      </p>
    </Prose>
  );
}
