import { Outlet } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.js'

export default function Admin() {
	return (
		<div className="container mx-auto max-w-6xl py-10">
			<Outlet />
		</div>
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				403: ({ error }) => (
					<div>
						<p>You are not allowed to do that</p>
						<p>{error?.data.message}</p>
					</div>
				),
			}}
		/>
	)
}
