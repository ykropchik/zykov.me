import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import Page from './components/Page/Page.tsx';
import Section from './components/Section/Section.tsx';
import Work from './components/Work/Work.tsx';
import Skills from './components/Skills/Skills.tsx';
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
						subtitle="[Your role] in [City]. I like [one line about what you enjoy building]. This page is the relaxed version of my résumé — pull up a chair."
					>
						<ScrollHint />
					</Section>
					<Section
						name="about"
						description="the informal part"
						title="The informal part"
						subtitle="The bits that don’t fit in a CV."
					>
						<Section.Text>[A few sentences in your own voice: how you got into this, what still makes it fun, what kind of problems you like to untangle.]</Section.Text>
						<Stats />
					</Section>
					<Section
						name="work"
						description="where I’ve been"
						title="Where I’ve been"
						subtitle={<>The short version. The long one lives in my <a href="#cv">CV</a></>}
					>
						<Work />
						<Skills />
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
