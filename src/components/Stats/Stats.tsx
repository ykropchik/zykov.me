import * as motion from 'motion/react-m';
import useBlockVariants from '../../hooks/useBlockVariants.ts';
import Stat from '../Stat/Stat.tsx';
import styles from './Stats.module.scss';

export default function Stats() {
	const blockVariants = useBlockVariants();

	return (
		<motion.div className={styles.stats} variants={blockVariants}>
			<div className={styles.statsGroup}>
				<Stat value="10" label="years writing code" />
				<Stat value="3,873" label="anime episodes watched" />
			</div>
			<div className={styles.statsGroup}>
				<Stat value="991+" label="hours in Forza Horizon" />
				<Stat value="0" label="Japan trips" />
			</div>
		</motion.div>
	);
}
