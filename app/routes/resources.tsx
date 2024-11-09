import { Outlet } from "@remix-run/react";
import { Prose } from "~/components/prose";

export default function Resources() {
  return (
    <div className="container mx-auto pb-5">
      <Prose className="max-w-full">
        <Outlet />
      </Prose>
    </div>
  );
}
