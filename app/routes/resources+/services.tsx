import { type MetaFunction } from "@remix-run/node";
import { Prose } from "~/components/prose";

export const meta: MetaFunction = () => {
  return [
    { title: "Services for Christian Entrepreneurs" },
    { description: "Services for Christian Entrepreneurs." },
  ];
};

export default function ServicesPage() {
  return (
    <Prose className="mx-8 max-w-full pb-5">
      <h1>Services for Christian Entrepreneurs</h1>
      <p>Under Construction - come back soon!</p>
    </Prose>
  );
}
