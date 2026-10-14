import { useId, useState } from 'react';
import * as motion from 'motion/react-m';
import classNames from 'classnames';
import useBlockVariants from '../../hooks/useBlockVariants.ts';
import styles from './Stories.module.scss';

type Story = {
	file: string;
	label: string;
	metric: { value: string; caption: string };
	problem: string;
	tried: string;
	result: string;
};

const stories: Story[] = [
	{
		file: 'verification.md',
		label: 'FARPOST · VERIFICATION',
		metric: { value: '×2', caption: 'completed seller verifications' },
		problem: 'One scary form for everyone — sellers couldn’t tell which fields were meant for them.',
		tried: 'Split the fields into tabs by seller status, so everyone sees only what’s theirs. Plus a fresh look and hints along the way.',
		result: 'Twice as many sellers made it through.',
	},
	{
		file: 'bundle.md',
		label: 'FARPOST · BUILD',
		metric: { value: '−47%', caption: 'JS bundle size' },
		problem: 'Code splitting with RequireJS was done by hand — so code got duplicated, or inlined somewhere it already had its own entry.',
		tried: 'Moved to Webpack and let it own the splitting. Adding a module got simpler, and Webpack could optimize the bundle on its own.',
		result: 'The JS bundle shrank to about half its old size.',
	},
	{
		file: 'storybook.md',
		label: 'FARPOST · STORYBOOK',
		metric: { value: '1 place', caption: 'for every component and its states' },
		problem: 'Designers couldn’t easily see how components really looked in production — so the same button ended up with several versions.',
		tried: 'Set up Storybook: every component and all its states — default, hover, disabled, loading — in one place.',
		result: 'Design and code finally looked at the same thing.',
	},
];

const NOTES = ['problem', 'tried', 'result'] as const;

export default function Stories() {
	const blockVariants = useBlockVariants();
	const id = useId();
	const [active, setActive] = useState(0);

	const tabId = (index: number) => `${id}-tab-${index}`;
	const panelId = (index: number) => `${id}-panel-${index}`;

	const select = (index: number) => {
		setActive((index + stories.length) % stories.length);
	};

	return (
		<motion.article className={styles.stories} variants={blockVariants}>
			<div className={styles.tabs} role="tablist" aria-label="Stories">
				{stories.map((story, index) => (
					<button
						key={story.file}
						className={classNames(styles.tab, { [styles.active]: index === active })}
						type="button"
						role="tab"
						id={tabId(index)}
						aria-controls={panelId(index)}
						aria-selected={index === active}
						onClick={() => select(index)}
					>
						{story.file}
					</button>
				))}
			</div>
			<div className={styles.panels}>
				{stories.map((story, index) => (
					<div
						key={story.file}
						className={classNames(styles.panel, { [styles.hidden]: index !== active })}
						role="tabpanel"
						id={panelId(index)}
						aria-labelledby={tabId(index)}
						// Nothing inside is focusable, so the panel takes focus itself.
						tabIndex={index === active ? 0 : undefined}
					>
						<div className={styles.heading}>
							<div className={styles.label}>{story.label}</div>
							<div className={styles.metric}>
								<span className={styles.value}>{story.metric.value}</span>
								<span className={styles.caption}>{story.metric.caption}</span>
							</div>
						</div>
						<dl className={styles.notes}>
							{NOTES.map((note) => (
								<div key={note} className={styles.note}>
									<dt className={styles.term}>{note}</dt>
									<dd className={styles.description}>{story[note]}</dd>
								</div>
							))}
						</dl>
					</div>
				))}
			</div>
			<div className={styles.status}>
				<span className={styles.path}>"work/{stories[active].file}"</span>
				<span className={styles.counter}>{active + 1}/{stories.length}</span>
			</div>
		</motion.article>
	);
}
