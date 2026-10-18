import type { PropsWithChildren } from 'react';
import { Head } from 'vite-react-ssg';

type PageMetaProps = PropsWithChildren<{
	title: string;
	description: string;
	/** From the site root, with the leading slash. */
	path: string;
	type?: 'website' | 'profile';
}>;

// Tags shared by every page stay in index.html; these are the ones a page has to
// state for itself — kept out of index.html, since Head adds its tags next to
// whatever is already there rather than replacing it.
export default function PageMeta({ title, description, path, type = 'website', children }: PageMetaProps) {
	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta property="og:type" content={type} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:url" content={`https://zykov.me${path}`} />
			{children}
		</Head>
	);
}
