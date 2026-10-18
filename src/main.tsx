import Page from './components/Page/Page.tsx';
import Section from './components/Section/Section.tsx';
import Contacts from './components/Contacts/Contacts.tsx';
import CvLink from './components/CvLink/CvLink.tsx';
import Stats from './components/Stats/Stats.tsx';
import ScrollHint from './components/ScrollHint/ScrollHint.tsx';
import Work from './components/Work/Work.tsx';
import WhereAmI from './components/WhereAmI/WhereAmI.tsx';
import Layout from './components/Layout/Layout.tsx';
import PageMeta from './components/PageMeta/PageMeta.tsx';
import Privacy from './pages/Privacy/Privacy.tsx';
import { ViteReactSSG } from 'vite-react-ssg';

import './styles/index.scss';

const HOME_DIR = 'zykov';

const home = (
	<Page homeDir={HOME_DIR}>
		<Section
			name="whoami"
			title="Hi, I’m Misha."
			subtitle={(
				<>
					I’m a frontend engineer. The best part of my job is simple: somewhere, someone clicks a button I made and their day gets a little easier.
					<br />
					This isn’t a <CvLink /> — just me, telling you about myself.
				</>
			)}
		>
			<ScrollHint />
		</Section>
		<Section
			name="about"
			description="about me"
			title="A bit about me"
			subtitle="Where it started, and what keeps me busy now."
		>
			<Section.Text>It started back in school, when I built a weather station with an Arduino. Seeing something I’d made actually work hooked me for good. At university I fell for the web: no soldering required, and anything I build is just one link away from anyone. I’ve been at it ever since.</Section.Text>
			<Section.Text className="muted-text">Honestly, most of my hobbies come with a screen: microcontrollers, video games, anime. Then there’s JDM. I love the car culture, even if I couldn’t explain what’s going on under the hood, so Forza Horizon is my garage for now. Someday, I hope, I’ll see it all in Japan — the cars, the anime, all of it, off the screen for once.</Section.Text>
			<Stats />
		</Section>
		<Section
			name="work"
			description="about work"
			title="A bit about work"
			subtitle="The parts of the job I actually enjoy, and a few stories behind them."
		>
			<Work />
		</Section>
		<Section
			name="whereami"
			description="where am I"
			title={<>Where am I<mark>…</mark></>}
			subtitle="Depends on what you’re asking."
		>
			<WhereAmI />
		</Section>
		<Section
			name="contact"
			description="say hi"
			title="Say hi"
			subtitle="Questions, ideas or just a hello."
		>
			<Contacts />
		</Section>
	</Page>
);

export const createRoot = ViteReactSSG({
	routes: [
		{
			path: '/',
			element: <Layout />,
			children: [
				{
					index: true,
					element: (
						<>
							<PageMeta
								title="Misha Zykov — Frontend Engineer"
								description="Frontend engineer from Almaty. Not a CV — just me: what I enjoy in the job, a few stories from work, and what keeps me busy outside it."
								path="/"
								type="profile"
							>
								<meta property="profile:first_name" content="Misha" />
								<meta property="profile:last_name" content="Zykov" />
							</PageMeta>
							{home}
						</>
					),
				},
				{
					path: 'privacy',
					element: <Privacy homeDir={HOME_DIR} />,
				},
			],
		},
	],
});
