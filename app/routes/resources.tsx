import { Outlet } from "@remix-run/react";
import { Prose } from "~/components/prose";

export default function Resources() {
  return (
    <Prose>
      <Outlet />
    </Prose>
  );
}
