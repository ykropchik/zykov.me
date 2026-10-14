import Principles from '../Principles/Principles.tsx';
import Stories from '../Stories/Stories.tsx';
import styles from './Work.module.scss';

export default function Work() {
	return (
		<div className={styles.work}>
			<Principles className={styles.left} />
			<Stories className={styles.right} />
		</div>
	);
}
