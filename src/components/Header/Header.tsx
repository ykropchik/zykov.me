import { useContext } from 'react';
import { MenuIcon } from '../Icons/Icons.tsx';
import SectionsContext from '../../contexts/SectionsContext/SectionsContext.ts';
import SidebarContext from '../../contexts/SidebarContext/SidebarContext.ts';
import styles from './Header.module.scss';

export default function Header() {
	const sideBar = useContext(SidebarContext);
	const { go, homeDir, firstSection } = useContext(SectionsContext);

	return (
		<header className={styles.header}>
			<span className={styles.dots} aria-hidden="true">
				<span />
				<span />
				<span />
			</span>
			<div className={styles.content}>
				<button
					className={styles.path}
					type="button"
					aria-label="Back to top"
					onClick={() => firstSection && go(firstSection.name)}
				>
					anonym@www: <mark>~/</mark><span className={styles.user}>{homeDir}</span>
				</button>
			</div>
			<button className={styles.menu} type="button" aria-label="Open menu" onClick={() => sideBar.open()}>
				<MenuIcon />
			</button>
		</header>
	);
}
