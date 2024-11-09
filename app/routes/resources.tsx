import { Outlet } from "@remix-run/react";
import { Prose } from "~/components/prose";

export default function Resources() {
  return (
    <div className="container mx-auto">
      <Prose>
        <Outlet />
      </Prose>
    </div>
  );
}
