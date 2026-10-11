import * as motion from 'motion/react-m';
import useBlockVariants from '../../hooks/useBlockVariants.ts';
import Stat from '../Stat/Stat.tsx';
import styles from './Stats.module.scss';

export default function Stats() {
	const blockVariants = useBlockVariants();

	return (
		<motion.div className={styles.stats} variants={blockVariants}>
			<div className={styles.statsGroup}>
				<Stat value="[N]" label="[some funny stat]" />
				<Stat value="[N]" label="[some funny stat]" />
			</div>
			<div className={styles.statsGroup}>
				<Stat value="[N]" label="[some funny stat]" />
				<Stat value="[N]" label="[some funny stat]" />
			</div>
		</motion.div>
	);
}
