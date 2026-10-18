import React, { useCallback, useMemo, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar.tsx';
import SidebarContext from './SidebarContext.ts';
import { analytics } from '../../misc/Analytics.ts';

export default function SidebarContextProvider({ children }: React.PropsWithChildren) {
	const [isOpen, setIsOpen] = useState(false);

	const open = useCallback(() => {
		analytics.track('sidebar', 'open');
		setIsOpen(true);
	}, []);
	const close = useCallback(() => {
		analytics.track('sidebar', 'close');
		setIsOpen(false);
	}, []);

	const value = useMemo(() => ({ open, close }), [open, close]);

	return (
		<SidebarContext value={value}>
			{children}
			<Sidebar isOpen={isOpen} onClose={close} />
		</SidebarContext>
	);
}
