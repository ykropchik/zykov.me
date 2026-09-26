import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Page from './components/Page/Page.tsx';
import Section from './components/Section/Section.tsx';

import './styles/index.scss';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Page>
			<Section
				name="whoami"
				title="Hi, I’m Misha."
				subtitle="[Your role] in [City]. I like [one line about what you enjoy building]. This page is the relaxed version of my résumé — pull up a chair."
			/>
			</Section>
			<Section />
		</Page>
	</StrictMode>,
);
