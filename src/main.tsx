import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Page from './components/Page/Page.tsx';

import './styles/index.scss';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Page />
	</StrictMode>,
);
