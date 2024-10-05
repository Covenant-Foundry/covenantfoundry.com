import { Outlet } from "@remix-run/react";

export default function Resources() {
  return (
    <main className="mx-auto max-w-3xl prose dark:prose-invert">
      <Outlet />
    </main>
  );
}
