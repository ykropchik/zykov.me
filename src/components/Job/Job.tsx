import styles from './Job.module.scss';

type JobProps = {
	period: string;
	role: string;
	company: string;
	summary: string;
};

export default function Job({ period, role, company, summary }: JobProps) {
	return (
		<div className={styles.job}>
			<div className={styles.period}>{period}</div>
			<div className={styles.body}>
				<div className={styles.title}>
					{role} <span className={styles.at}>at</span> {company}
				</div>
				<div className={styles.summary}>{summary}</div>
			</div>
		</div>
	);
}
