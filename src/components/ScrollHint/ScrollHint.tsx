import * as motion from 'motion/react-m';
import useBlockVariants from '../../hooks/useBlockVariants.ts';
import { ArrowDownIcon, ArrowUpIcon } from '../Icons/Icons.tsx';
import styles from './ScrollHint.module.scss';

/** Tells the reader how to turn the page; hidden on touch screens, which have no arrow keys. */
export default function ScrollHint() {
	const blockVariants = useBlockVariants();

	return (
		<motion.p className={styles.hint} variants={blockVariants}>
			<span># scroll or</span>
			<kbd className={styles.key} aria-label="Up arrow"><ArrowUpIcon size={12} /></kbd>
			<kbd className={styles.key} aria-label="Down arrow"><ArrowDownIcon size={12} /></kbd>
			<span>to look around</span>
		</motion.p>
	);
}
