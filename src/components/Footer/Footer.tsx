import { useContext } from 'react';
import { AnimatePresence, useReducedMotionConfig, type Transition } from 'motion/react';
import * as motion from 'motion/react-m';
import { timing } from '../../animations.ts';
import SectionsContext from '../../contexts/SectionsContext/SectionsContext.ts';
import styles from './Footer.module.scss';

// Delayed by a block gap to arrive in step with the first line of output, so the
// screen fills from one place.
const ARRIVE: Transition = { duration: timing.blockIn.seconds, ease: 'easeOut', delay: timing.blockGap.seconds };
// it leaves as part of the screen clearing.
const DEPART: Transition = { duration: timing.clearPause.seconds, ease: 'easeIn' };

// A whole footer's worth of travel is what a reader who asked for less motion
// does not want, so for them it fades in place. The swap is made here because
// `reducedMotion="user"` cannot see into a `transform` string — see `blockFadeVariants`
// in animations.ts.
const OFF_SCREEN = { transform: 'translateY(100%)' };
const ON_SCREEN = { transform: 'translateY(0%)' };
const FADED = { opacity: 0 };
const OPAQUE = { opacity: 1 };

export default function Footer() {
	const { homeDir, lastSection, activeSection, phase } = useContext(SectionsContext);
	const reduced = useReducedMotionConfig();
	const away = reduced ? FADED : OFF_SCREEN;
	const here = reduced ? OPAQUE : ON_SCREEN;

	// The page ends on the last section, so that is the only screen its footer
	// belongs to. Stated as the one phase it sits out, so a phase added after the
	// output is on screen keeps it up.
	const isShown = !!activeSection && activeSection.name === lastSection?.name && phase !== 'type';

	return (
		<AnimatePresence>
			{isShown && (
				<motion.footer
					className={styles.footer}
					initial={away}
					animate={{ ...here, transition: ARRIVE }}
					exit={{ ...away, transition: DEPART }}
				>
					<div className={styles.content}>
						<span className={styles.path}>
							<mark>~/</mark>
							{homeDir}
						</span>
						<span>© 2026 Misha Zykov</span>
					</div>
				</motion.footer>
			)}
		</AnimatePresence>
	);
}
