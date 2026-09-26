import React, { useRef } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar.tsx';
import SidebarContext from './SidebarContext.ts';

export default function SidebarContextProvider({ children }: React.PropsWithChildren) {
	const sideBar = useRef<HTMLDialogElement>(null);

	return (
		<SidebarContext
			value={{
				open: () => sideBar.current?.showModal(),
				close: () => sideBar.current?.close(),
			}}
		>
			{children}
			<Sidebar ref={sideBar} />
		</SidebarContext>
	);
}
