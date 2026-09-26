import Job from '../Job/Job.tsx';
import styles from './Work.module.scss';

const jobs = [
	{ period: '[2023] — now', role: '[Role]', company: '[Company]', summary: '[One line on what you did and what you’re proud of.]' },
	{ period: '[2020] — [2023]', role: '[Role]', company: '[Company]', summary: '[One line on what you did and what you’re proud of.]' },
	{ period: '[2018] — [2020]', role: '[Role]', company: '[Company]', summary: '[One line on what you did and what you’re proud of.]' },
];

export default function Work() {
	return (
		<div className={styles.timeline}>
			{jobs.map((job) => (
				<Job key={job.period} {...job} />
			))}
		</div>
	);
}
