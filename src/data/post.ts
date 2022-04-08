type MarkdownInstance = import('astro').MarkdownInstance<any>;
// Which mode is the environment running in? https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
const { MODE } = import.meta.env;

export type Post = {
	title: string,
	slug: string,
	desc: string,
	author: string,
	timestamp: number,
	draft: boolean,
	date: string,
	file: URL,
	img: URL,
}

export function single(post: MarkdownInstance): Post {
	const slug = post.file.split('/').reverse()[0].replace('.md', '');
	return {
		...post.frontmatter,
		Content: post.Content,
		slug: slug,
		draft: post.file.split('/').reverse()[1] === 'drafts',
		timestamp: (new Date(post.frontmatter.date)).valueOf()
	}
}

export function published(posts: MarkdownInstance[]): Post[] {
	return posts
		.filter(post => post.frontmatter.title)
		.map(post => single(post))
		.filter(post => MODE === 'development' || !post.draft)
		.sort((a, b) => b.timestamp - a.timestamp)
}

export function getRSS(posts: MarkdownInstance[]) {
	return {
		title: 'Astro Blog',
		description: 'Astro Blog Feed',
		stylesheet: true,
		customData: `<language>en-us</language>`,
		items: published(posts).map((post: Post) => ({
			title: post.title,
			description: post.desc,
			link: post.slug,
			pubDate: post.date,
		})),
	}
}

