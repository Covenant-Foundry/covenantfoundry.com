import { cn } from "~/utils/misc";

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose mx-auto dark:prose-invert prose-h1:border-l-4 prose-h1:border-l-accent prose-h1:pl-4 prose-p:text-lg md:prose-p:text-xl",
        className
      )}
    >
      {children}
    </div>
  );
}
