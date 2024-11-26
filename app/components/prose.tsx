import { cn } from '#app/utils/misc'

export function Prose({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<div
			className={cn(
				'prose dark:prose-invert prose-h1:border-l-4 prose-h1:border-l-accent prose-h1:pl-4 prose-h1:text-3xl prose-p:max-w-3xl prose-p:text-lg md:prose-h1:text-5xl md:prose-p:text-xl',
				className,
			)}
		>
			{children}
		</div>
	)
}
