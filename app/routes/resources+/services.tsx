import { type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Services for Christian Entrepreneurs" },
    { description: "Services for Christian Entrepreneurs." },
  ];
};

export default function ServicesPage() {
  return (
    <div>
      <h1>Services for Christian Entrepreneurs</h1>
      <p>Under Construction - come back soon!</p>
    </div>
  );
}
