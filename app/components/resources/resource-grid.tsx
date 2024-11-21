export function ResourceGrid({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-1 justify-items-stretch gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{children}
		</div>
	)
}
