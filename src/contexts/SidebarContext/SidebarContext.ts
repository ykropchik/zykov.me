import { createContext } from 'react';

type SidebarContextValue = {
	open: () => void;
	close: () => void;
};

const SidebarContext = createContext<SidebarContextValue>({
	open: () => {},
	close: () => {},
});

export default SidebarContext;
