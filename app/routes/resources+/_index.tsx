import { type MetaFunction } from "@remix-run/node";
import { Resources } from "../../components/resources";

export const meta: MetaFunction = () => {
  return [
    { title: "Resources" },
    { name: "description", content: "Resources for Christian entrepreneurs." },
  ];
};

export default function ResourcesPage() {
  return (
    <main>
      <h1>Resources</h1>
      <Resources />
    </main>
  );
}
