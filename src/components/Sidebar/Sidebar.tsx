import { useContext, useEffect } from 'react';
import { AnimatePresence, useReducedMotionConfig, type Transition } from 'motion/react';
import * as motion from 'motion/react-m';
import useTouch from '../../hooks/useTouch.ts';
import { timing } from '../../misc/animations.ts';
import SectionsContext from '../../contexts/SectionsContext/SectionsContext.ts';
import { CloseIcon } from '../Icons/Icons.tsx';
import TerminalLine from '../TerminalLine/TerminalLine.tsx';
import styles from './Sidebar.module.scss';

const ARRIVE: Transition = { duration: timing.sidebarInOut.seconds, ease: 'easeOut' };
const DEPART: Transition = { duration: timing.sidebarInOut.seconds, ease: 'easeIn' };

const OFF_SCREEN = { transform: 'translateX(100%)' };
const ON_SCREEN = { transform: 'translateX(0%)' };
const FADED = { opacity: 0 };
const OPAQUE = { opacity: 1 };

type SidebarProps = {
	isOpen: boolean;
	onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
	const { sections, firstSection, go, pathFor } = useContext(SectionsContext);
	const reduced = useReducedMotionConfig();
	const isTouch = useTouch();
	const [, ...links] = sections;
	const homePath = firstSection ? pathFor(firstSection.name) : [];

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', closeOnEscape);

		return () => document.removeEventListener('keydown', closeOnEscape);
	}, [isOpen, onClose]);

	const away = reduced ? FADED : OFF_SCREEN;
	const here = reduced ? OPAQUE : ON_SCREEN;

	return (
		<AnimatePresence>
			{isOpen && (
				<div
					key="menu"
					className={styles.sidebar}
					role="dialog"
					// Also what tells the pager the page behind is not to turn — see
					// useSectionPager.
					aria-modal="true"
					aria-label="Menu"
				>
					<motion.div
						className={styles.backdrop}
						initial={FADED}
						animate={{ ...OPAQUE, transition: ARRIVE }}
						exit={{ ...FADED, transition: DEPART }}
						onClick={onClose}
						aria-hidden="true"
					/>
					<motion.div
						className={styles.panel}
						initial={away}
						animate={{ ...here, transition: ARRIVE }}
						exit={{ ...away, transition: DEPART }}
					>
						<div className={styles.bar}>
							<span className={styles.title}>menu</span>
							<button className={styles.close} type="button" aria-label="Close menu" onClick={onClose}>
								<CloseIcon />
							</button>
						</div>
						<div className={styles.body}>
							<TerminalLine path={homePath} command="ls -l" />
							<nav className={styles.nav} aria-label="Sections">
								{links.map((link) => (
									<button
										className={styles.row}
										key={link.name}
										type="button"
										onClick={() => {
											go(link.name);
											onClose();
										}}
									>
										<span className={styles.permissions}>drwxr-xr-x</span>
										<span className={styles.name}>
											{link.name}
											<mark>/</mark>
										</span>
										<span className={styles.description}>{link.description}</span>
									</button>
								))}
							</nav>
							<div className={styles.hint}>
								# {isTouch ? 'tap' : 'click'} a line to jump there
							</div>
							<TerminalLine path={homePath} mode="waiting" />
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
