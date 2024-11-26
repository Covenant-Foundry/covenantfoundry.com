const DEFAULT_DESCRIPTION =
	'A community of Christians pursuing faithful stewardship of our time, talents, and treasures via entrepreneurship.'

export const formatFrontmatterToRemixMeta = (frontmatter: any) => () => {
	return [
		{ title: frontmatter.title + ' | Covenant Foundry' },
		{
			name: 'description',
			content: frontmatter.description ?? DEFAULT_DESCRIPTION,
		},
		{
			property: 'og:title',
			content: frontmatter['og:title'] ?? frontmatter.title,
		},
		{
			name: 'og:description',
			content:
				frontmatter['og:description'] ??
				frontmatter.description ??
				DEFAULT_DESCRIPTION,
		},
		{
			name: 'twitter:title',
			content: frontmatter['twitter:title'] ?? frontmatter.title,
		},
		{
			name: 'twitter:description',
			content:
				frontmatter['twitter:description'] ??
				frontmatter.description ??
				DEFAULT_DESCRIPTION,
		},
	]
}
