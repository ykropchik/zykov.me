import Tag, { type TagVariant } from '../Tag/Tag.tsx';
import styles from './Skills.module.scss';

const stack: { label: string; variant: TagVariant; items: string[] }[] = [
	{ label: 'EVERY DAY', variant: 'solid', items: ['[language]', '[framework]', '[database]'] },
	{ label: 'COMFORTABLE WITH', variant: 'outline', items: ['[tool]', '[cloud]', '[tool]'] },
	{ label: 'POKING AT NOW', variant: 'dashed', items: ['[something new]', '[something new]'] },
];

export default function Skills() {
	return (
		<div className={styles.skills}>
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
		</div>
	);
}
