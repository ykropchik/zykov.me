import { StrictMode } from 'react';
import { Outlet } from 'react-router-dom';
import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import { Head } from 'vite-react-ssg';

const OG_IMAGE_ALT = 'Terminal-style card: ~/zykov $ whoami — Hi, I’m Misha.';

export default function Layout() {
	return (
		<StrictMode>
			{/*
				Meta tags live here rather than in index.html: vite-react-ssg puts whatever
				<Head> renders at the very top of <head>, so a <meta charset> left in index.html
				ends up behind every page's tags — close to the first 1024 bytes a browser
				looks through for it.
			*/}
			<Head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="theme-color" content="#0b0f0e" />
				<meta name="color-scheme" content="dark" />

				<meta property="og:site_name" content="~/zykov" />
				<meta property="og:image" content="https://zykov.me/og-image.png" />
				<meta property="og:image:type" content="image/png" />
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="630" />
				<meta property="og:image:alt" content={OG_IMAGE_ALT} />
				<meta property="og:locale" content="en_US" />

				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:image:alt" content={OG_IMAGE_ALT} />
			</Head>
			<MotionConfig reducedMotion="user">
				<LazyMotion features={domAnimation} strict>
					<Outlet />
				</LazyMotion>
			</MotionConfig>
		</StrictMode>
	);
}
