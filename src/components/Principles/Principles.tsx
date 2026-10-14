import * as motion from 'motion/react-m';
import useBlockVariants from '../../hooks/useBlockVariants.ts';
import styles from './Principles.module.scss';
import classNames from 'classnames';

const principles = [
	{
		title: 'Pretty and practical',
		description: 'I like interfaces that look good and feel easy to use — and I don’t think you should have to pick one.',
	},
	{
		title: 'Old code, new tricks',
		description: 'jQuery to React, RequireJS to Webpack, Babel to SWC — I like taking an old codebase and moving it forward without breaking what people rely on.',
	},
	{
		title: 'Teammates are users too',
		description: 'I like making life easier not just for the people using the product, but for the people building it with me.',
	},
];

type PrinciplesProps = {
	className?: string;
};

export default function Principles({ className }: PrinciplesProps) {
	const blockVariants = useBlockVariants();

	return (
		<motion.ol className={classNames(styles.principles, className)} variants={blockVariants}>
			{principles.map((principle) => (
				<li key={principle.title} className={styles.principle}>
					<div className={styles.body}>
						<h3 className={styles.title}>{principle.title}</h3>
						<div className={styles.description}>{principle.description}</div>
					</div>
				</li>
			))}
		</motion.ol>
	);
}
