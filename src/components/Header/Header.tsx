import { MenuIcon } from '../Icons/Icons.tsx';
import styles from './Header.module.scss';

export default function Header() {
	return (
		<header className={styles.header}>
			<span className={styles.dots} aria-hidden="true">
				<span />
				<span />
				<span />
			</span>
			<div className={styles.content}>
				<a className={styles.path} href="#whoami" aria-label="Back to top">
					anonym@www: <mark>~/</mark><span className={styles.user}>zykov</span>
				</a>
			</div>
			<button className={styles.menu} type="button" aria-label="Open menu">
				<MenuIcon />
			</button>
		</header>
	);
}
