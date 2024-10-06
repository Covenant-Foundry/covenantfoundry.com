import { Link, type LinkProps } from "@remix-run/react";

export function CTAButton(props: LinkProps) {
  return (
    <Link
      className="rounded border-2 border-accent bg-transparent px-6 py-3 font-bold text-accent transition-opacity duration-300 hover:opacity-90 no-underline"
      {...props}
    />
  );
}
