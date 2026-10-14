import * as motion from 'motion/react-m';
import useBlockVariants from '../../hooks/useBlockVariants.ts';
import Tag, { type TagVariant } from '../Tag/Tag.tsx';
import styles from './Skills.module.scss';

const stack: { label: string; variant: TagVariant; items: string[] }[] = [
	{ label: 'EVERY DAY', variant: 'solid', items: ['TypeScript', 'React', 'SCSS', 'Webpack & SWC'] },
	{ label: 'COMFORTABLE WITH', variant: 'outline', items: ['Storybook', 'Sentry', 'Core Web Vitals', 'Next.js'] },
	{ label: 'POKING AT NOW', variant: 'dashed', items: ['AI-assisted dev', 'ESP32', 'Game Modding'] },
];

export default function Skills() {
	const blockVariants = useBlockVariants();

	return (
		<motion.div className={styles.skills} variants={blockVariants}>
			{stack.map((group) => (
				<div key={group.label} className={styles.group}>
					<div className={styles.label}>{group.label}</div>
					<div className={styles.tags}>
						{group.items.map((item, index) => (
							<Tag key={`${group.label}-${index}`} variant={group.variant}>{item}</Tag>
						))}
					</div>
				</div>
			))}
		</motion.div>
	);
}
