import Stat from '../Stat/Stat.tsx';
import styles from './Stats.module.scss';

export default function Stats() {
	return (
		<div className={styles.stats}>
			<div className={styles.statsGroup}>
				<Stat value="[N]" label="[some funny stat]" />
				<Stat value="[N]" label="[some funny stat]" />
			</div>
			<div className={styles.statsGroup}>
				<Stat value="[N]" label="[some funny stat]" />
				<Stat value="[N]" label="[some funny stat]" />
			</div>
		</div>
	);
}
