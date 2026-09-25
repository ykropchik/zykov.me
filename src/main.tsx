import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Page from './components/Page/Page.tsx';

import './styles/index.scss';
import Section from './components/Section/Section.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Page>
			<Section />
			<Section />
		</Page>
	</StrictMode>,
);
