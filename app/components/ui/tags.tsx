export function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {tags.map((tag) => (
        <div
          key={tag}
          className="text-sm rounded-full border-2 border-accent font-bold text-accent px-3"
        >
          {tag}
        </div>
      ))}
    </div>
  );
}
