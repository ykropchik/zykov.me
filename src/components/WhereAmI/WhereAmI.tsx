import * as motion from 'motion/react-m';
import useBlockVariants from '../../hooks/useBlockVariants.ts';
import Tag, { type TagVariant } from '../Tag/Tag.tsx';
import styles from './WhereAmI.module.scss';

const stack: { label: string; variant: TagVariant; items: string[] }[] = [
	{ label: 'EVERY DAY', variant: 'solid', items: ['TypeScript', 'React', 'Webpack & SWC', 'Core Web Vitals'] },
	{ label: 'COMFORTABLE WITH', variant: 'outline', items: ['Node.js & SSR', 'Storybook', 'Sentry', 'Next.js'] },
	{ label: 'POKING AT NOW', variant: 'dashed', items: ['AI-assisted dev', 'ESP32', 'Game Modding'] },
];

export default function WhereAmI() {
	const blockVariants = useBlockVariants();

	return (
		<motion.ul className={styles.rows} variants={blockVariants}>
			<li className={styles.row}>
				<h3 className={styles.rowTitle}><mark>…</mark>work-wise?</h3>
				<div className={styles.block}>
					<div className={styles.headline}>
						<span className={styles.headlineTitle}>
							Frontend Engineer <span className={styles.at}>at</span> FarPost
						</span>
						<span className={styles.meta}>Feb 2022 – now</span>
					</div>
					<div className={styles.description}>Making a marketplace for millions of users a little faster and friendlier.</div>
				</div>
			</li>
			<li className={styles.row}>
				<h3 className={styles.rowTitle}><mark>…</mark>in the stack?</h3>
				<div className={styles.stack}>
					{stack.map((group) => (
						<div key={group.label} className={styles.group}>
							<div className={styles.label}>{group.label}</div>
							<div className={styles.tags}>
								{group.items.map((item) => (
									<Tag key={item} variant={group.variant}>{item}</Tag>
								))}
							</div>
						</div>
					))}
				</div>
			</li>
			<li className={styles.row}>
				<h3 className={styles.rowTitle}><mark>…</mark>on the map?</h3>
				<div className={styles.location}>
					<div className={styles.headline}>
						<span className={styles.headlineTitle}>Almaty, Kazakhstan</span>
						<span className={styles.meta}>43.24° N, 76.89° E · UTC+5</span>
					</div>
					<dl className={styles.facts}>
						<div className={styles.fact}>
							<dt className={styles.label}>OPEN TO</dt>
							<dd className={styles.value}>remote · office · relocation</dd>
						</div>
					</dl>
				</div>
			</li>
		</motion.ul>
	);
}
