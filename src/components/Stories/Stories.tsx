import { useId, useState } from 'react';
import * as motion from 'motion/react-m';
import classNames from 'classnames';
import useBlockVariants from '../../hooks/useBlockVariants.ts';
import styles from './Stories.module.scss';
import { analytics } from '../../misc/Analytics.ts';

type Story = {
	file: string;
	label: string;
	metric: { value: string; caption: string };
	problem: string;
	fix: string;
	result: string;
};

const stories: Story[] = [
	{
		file: 'verification.md',
		label: 'FARPOST · VERIFICATION PAGE',
		metric: { value: '×2', caption: 'completed seller verifications' },
		problem: 'One scary form for everyone — sellers couldn’t tell which fields were meant for them.',
		fix: 'Split the fields into tabs by seller status, so everyone sees only what’s theirs. Plus a fresh look and hints along the way.',
		result: 'Twice as many sellers made it through, and verified accounts grew by 10%.',
	},
	{
		file: 'bundle.md',
		label: 'FARPOST · BUILD',
		metric: { value: '−47%', caption: 'JS bundle size' },
		problem: 'We split code by hand in RequireJS, so the same module often shipped twice — copied into several bundles, or inlined into one even though it already had its own entry point.',
		fix: 'Moved to Webpack and let it own the splitting. Adding a module got simpler, and Webpack could optimize the bundle on its own.',
		result: 'The JS bundle shrank to about half its old size.',
	},
	{
		file: 'storybook.md',
		label: 'FARPOST · STORYBOOK',
		metric: { value: '1 place', caption: 'for every component and its states' },
		problem: 'Designers couldn’t easily see how components really looked in production — so the same button ended up with several versions.',
		fix: 'Set up Storybook: every component and all its states, plus a fresh build for every branch.',
		result: 'Design and code finally looked at the same thing.',
	},
];

const NOTES = ['problem', 'fix', 'result'] as const;

type StoriesProps = {
	className?: string;
};

export default function Stories({ className }: StoriesProps) {
	const blockVariants = useBlockVariants();
	const id = useId();
	const [active, setActive] = useState(0);

	const tabId = (index: number) => `${id}-tab-${index}`;
	const panelId = (index: number) => `${id}-panel-${index}`;

	const select = (index: number) => {
		const newActive = (index + stories.length) % stories.length;

		analytics.track('story', 'select', { name: stories[newActive].file });

		setActive(newActive);
	};

	return (
		<motion.article className={classNames(styles.stories, className)} variants={blockVariants}>
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
