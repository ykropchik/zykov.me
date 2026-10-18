import { useContext } from 'react';
import { AnimatePresence, useReducedMotionConfig, type Transition } from 'motion/react';
import * as motion from 'motion/react-m';
import { timing } from '../../misc/animations.ts';
import { MenuIcon } from '../Icons/Icons.tsx';
import SectionsContext from '../../contexts/SectionsContext/SectionsContext.ts';
import SidebarContext from '../../contexts/SidebarContext/SidebarContext.ts';
import styles from './Header.module.scss';
import classNames from 'classnames';
import { analytics } from '../../misc/Analytics.ts';

const ARRIVE: Transition = { duration: timing.blockIn.seconds, ease: 'easeOut' };
const DEPART: Transition = { duration: timing.clearPause.seconds, ease: 'easeIn' };

const BELOW = { transform: 'translateY(100%)', opacity: 0 };
const ABOVE = { transform: 'translateY(-100%)', opacity: 0 };
const IN_PLACE = { transform: 'translateY(0%)', opacity: 1 };
const FADED = { opacity: 0 };
const OPAQUE = { opacity: 1 };

type HeaderProps = {
	homeDir: string;
};

export default function Header({ homeDir }: HeaderProps) {
	const sideBar = useContext(SidebarContext);
	const { firstSection } = useContext(SectionsContext);

	return (
		<header className={styles.header}>
			<span className={styles.dots} aria-hidden="true">
				<span />
				<span />
				<span />
			</span>
			<div className={styles.content}>
				{firstSection ? <SectionPath /> : <HomePath homeDir={homeDir} />}
			</div>
			{firstSection && (
				<button className={styles.menu} type="button" aria-label="Open menu" onClick={() => sideBar.open()}>
					<MenuIcon />
				</button>
			)}
		</header>
	);
}

/** The home page's path: follows the section on screen, and takes the reader back to the first one. */
function SectionPath() {
	const { go, firstSection, activeSection, phase, pathFor, promptFor } = useContext(SectionsContext);
	const reduced = useReducedMotionConfig();
	const enterFrom = reduced ? FADED : BELOW;
	const leaveTo = reduced ? FADED : ABOVE;
	const here = reduced ? OPAQUE : IN_PLACE;

	// Section name should change after typing is complete
	const path = !activeSection
		? []
		: phase === 'type'
			? promptFor(activeSection.name).promptPath
			: pathFor(activeSection.name);
	const [home, section] = path;

	return (
		<button
			className={styles.path}
			type="button"
			aria-label="Back to top"
			onClick={() => {
				analytics.track('header', 'click');

				if (firstSection) {
					go(firstSection.name);
				}
			}}
		>
			<span className={styles.host}>anonym@www: </span><mark>~/</mark><span className={styles.pathSegment}>{home}</span>
			{/* The slash moves only on the way to and from home; between sections just the name changes. */}
			<AnimatePresence initial={false}>
				{section && (
					<motion.span
						key="section"
						className={styles.pathAnimate}
						initial={enterFrom}
						animate={{ ...here, transition: ARRIVE }}
						exit={{ ...leaveTo, transition: DEPART }}
					>
						<mark>/</mark>
						<AnimatePresence mode="popLayout" initial={false}>
							<motion.span
								key={section}
								className={classNames(styles.pathSegment, styles.pathAnimate)}
								initial={enterFrom}
								animate={{ ...here, transition: ARRIVE }}
								exit={{ ...leaveTo, transition: DEPART }}
							>
								{section}
							</motion.span>
						</AnimatePresence>
					</motion.span>
				)}
			</AnimatePresence>
		</button>
	);
}

/** Every other page's path: just home, one link away. */
function HomePath({ homeDir }: { homeDir: string }) {
	return (
		<a className={styles.path} href="/" aria-label="Home">
			<span className={styles.host}>anonym@www: </span><mark>~/</mark><span className={styles.pathSegment}>{homeDir}</span>
		</a>
	);
}
