import * as motion from 'motion/react-m';
import useBlockVariants from '../../hooks/useBlockVariants.ts';
import useTouch from '../../hooks/useTouch.ts';
import { ArrowDownIcon, ArrowUpIcon } from '../Icons/Icons.tsx';
import styles from './ScrollHint.module.scss';

/** Tells the reader how to turn the page: arrow keys on desktop, a swipe on touch screens. */
export default function ScrollHint() {
	const blockVariants = useBlockVariants();
	const isTouch = useTouch();

	if (isTouch) {
		return (
			<motion.p className={styles.hint} variants={blockVariants}>
				# swipe up to look around
			</motion.p>
		);
	}

	return (
		<motion.p className={styles.hint} variants={blockVariants}>
			<span># scroll or</span>
			<kbd className={styles.key} aria-label="Up arrow"><ArrowUpIcon size={12} /></kbd>
			<kbd className={styles.key} aria-label="Down arrow"><ArrowDownIcon size={12} /></kbd>
			<span>to look around</span>
		</motion.p>
	);
}
