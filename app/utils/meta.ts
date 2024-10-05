const DEFAULT_DESCRIPTION = "A community of Christians pursuing faithful stewardship of our time, talents, and treasures via entrepreneurship.";

export const formatFrontmatterToRemixMeta = (frontmatter: any) => () => {
    return [
      { title: frontmatter.meta.title + " | Covenant Foundry" },
      {
        name: 'description',
        content: frontmatter.meta.description ?? DEFAULT_DESCRIPTION,
      },
      { property: 'og:title', content: frontmatter.meta['og:title'] ?? frontmatter.meta.title },
      {
        name: 'og:description',
        content: frontmatter.meta['og:description'] ?? frontmatter.meta.description ?? DEFAULT_DESCRIPTION,
      },
      {
        name: 'twitter:title',
        content: frontmatter.meta['twitter:title'] ?? frontmatter.meta.title,
      },
      {
        name: 'twitter:description',
        content: frontmatter.meta['twitter:description'] ?? frontmatter.meta.description ?? DEFAULT_DESCRIPTION,
      },
    ]
  }
  