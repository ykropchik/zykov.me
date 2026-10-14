import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import Page from './components/Page/Page.tsx';
import Section from './components/Section/Section.tsx';
import Contacts from './components/Contacts/Contacts.tsx';
import Stats from './components/Stats/Stats.tsx';
import ScrollHint from './components/ScrollHint/ScrollHint.tsx';

import './styles/index.scss';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<MotionConfig reducedMotion="user">
			<LazyMotion features={domAnimation} strict>
				<Page homeDir="zykov">
					<Section
						name="whoami"
						title="Hi, I’m Misha."
						subtitle={(
							<>
								I’m a frontend engineer. The best part of my job is simple: somewhere, someone clicks a button I made and their day gets a little easier.
								<br />
								This isn’t a <a>CV</a> — just me, telling you about myself.
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
						<Section.Text>It started back in school, when I decided to build a weather station on Arduino. Seeing something I’d made actually work hooked me for good. At university I fell for the web: no soldering required, and anything I build is just one link away from anyone. I’ve been here ever since.</Section.Text>
						<Section.Text className="muted-text">Honestly, most of my hobbies come with a screen: microcontrollers, video games, anime. Then there’s JDM. I love the car culture, even if I couldn’t explain what’s going on under the hood, so Forza Horizon is my garage for now. Someday, I hope, I’ll see it all in Japan — the cars, the anime, all of it, off the screen for once.</Section.Text>
						<Stats />
					</Section>
					<Section
						name="work"
						description="where I’ve been"
						title="Where I’ve been"
						subtitle={<>The short version. The long one lives in my <a href="#cv">CV</a></>}
					>
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
			</LazyMotion>
		</MotionConfig>
	</StrictMode>,
);
