import styles from './Stat.module.scss';

type StatProps = {
	value: string;
	label: string;
};

export default function Stat({ value, label }: StatProps) {
	return (
		<div className={styles.stat}>
			<div className={styles.value}>{value}</div>
			<div className={styles.label}>{label}</div>
		</div>
	);
}
