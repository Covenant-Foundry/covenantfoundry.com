import { Link } from "@remix-run/react";

const levelToLabel = {
  0: "Fully Organic",
  1: "Spellchecked",
  2: "Outlined",
  3: "Co-written",
  4: "Drafted",
  5: "Fully Synthetic",
};

export function AILevel({ level }: { level: 0 | 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="flex">
      <Link to="/ai-usage" className="no-underline">
        <span className="flex items-center bg-background border border-accent">
          <span className="bg-accent text-accent-foreground text-sm px-2 py-1 relative">
            AI
            <span className="absolute top-0 right-0 h-full w-3 bg-accent transform skew-x-[-20deg] translate-x-1/2"></span>
          </span>
          <span className="text-sm text-foreground pl-5 pr-3">
            {level}: {levelToLabel[level]}
          </span>
        </span>
      </Link>
    </div>
  );
}
