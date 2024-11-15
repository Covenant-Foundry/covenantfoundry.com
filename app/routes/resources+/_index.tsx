import { type MetaFunction } from "@remix-run/node";
import { Resources } from "../../components/resources";
import { Prose } from "~/components/prose";

export const meta: MetaFunction = () => {
  return [
    { title: "Resources" },
    { name: "description", content: "Resources for Christian entrepreneurs." },
  ];
};

export default function ResourcesPage() {
  return (
    <Prose className="mx-8 max-w-full pb-5">
      <h1>Resources</h1>
      <Resources />
    </Prose>
  );
}
