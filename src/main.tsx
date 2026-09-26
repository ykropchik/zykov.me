import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Page from './components/Page/Page.tsx';
import Section from './components/Section/Section.tsx';
import Stats from './components/Stats/Stats.tsx';

import './styles/index.scss';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Page>
			<Section
				name="whoami"
				title="Hi, I’m Misha."
				subtitle="[Your role] in [City]. I like [one line about what you enjoy building]. This page is the relaxed version of my résumé — pull up a chair."
			/>
			<Section
				name="about"
				title="The informal part"
				subtitle="The bits that don’t fit in a CV."
			>
				<div>
					<p>[A few sentences in your own voice: how you got into this, what still makes it fun, what kind of problems you like to untangle.]</p>
					<p className="muted-text">[Something human: what you do when the laptop is closed, a small obsession, the thing friends always ask you about.]</p>
				</div>

				<Stats />
			</Section>
		</Page>
	</StrictMode>,
);
