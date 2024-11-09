import { Link, type LinkProps } from "@remix-run/react";

import { cn } from "~/utils/misc";

export function CTAButton({ className, ...props }: LinkProps) {
  return (
    <Link
      className={cn(
        "border-b-4 border-transparent hover:border-accent border-opacity-10 bg-transparent px-6 py-3 font-bold text-center transition-opacity duration-300 hover:opacity-90 no-underline",
        className
      )}
      {...props}
    />
  );
}
