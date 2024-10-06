export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-5 prose dark:prose-invert prose-h1:border-l-4 prose-h1:border-l-accent prose-h1:pl-4 prose-p:text-lg md:prose-p:text-xl">
      {children}
    </div>
  );
}
