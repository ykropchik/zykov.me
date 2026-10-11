import { useContext, useRef } from 'react';
import * as motion from 'motion/react-m';
import * as React from 'react';
import classNames from 'classnames';
import { outputVariants, timing } from '../../animations.ts';
import SectionsContext, { type Phase } from '../../contexts/SectionsContext/SectionsContext.ts';
import useBlockVariants from '../../hooks/useBlockVariants.ts';
import useSectionPager from '../../hooks/useSectionPager.ts';
import TerminalLine from '../TerminalLine/TerminalLine.tsx';
import SectionContext from './SectionContext.ts';
import SectionText from './SectionText.tsx';
import styles from './Section.module.scss';

export type SectionProps = React.PropsWithChildren<{
	name: string;
	title: React.ReactNode;
	subtitle: React.ReactNode;
	/** Unused here: `orderOf` in Page reads it off the element for the sidebar. */
	description?: string;
}>;

const PROMPT_MODE = {
	type: 'typing',
	print: 'entered',
	idle: 'entered',
	clear: 'entered',
} as const satisfies Record<Phase, string>;

const OUTPUT_STATE = {
	type: 'hidden',
	print: 'printing',
	// Same target as `print` on purpose: re-asserting the value it already holds
	// animates nothing.
	idle: 'printing',
	clear: 'printed',
} as const satisfies Record<Phase, string>;

function Section({ name, title, subtitle, children }: SectionProps) {
	const {
		firstSection,
		lastSection,
		activeSection,
		phase,
		pathFor,
		promptFor,
		exitCommandFor,
		settle,
		turn,
	} = useContext(SectionsContext);
	const blockVariants = useBlockVariants();
	const isActive = name === activeSection?.name;
	const titleId = `${name}-title`;
	const { promptPath, command } = promptFor(name);
	const exitCommand = exitCommandFor(name);

	const section = useRef<HTMLElement>(null);

	// Enabled only once the output has finished printing, so that neither a gesture
	// that outlived the page turn it caused nor a second one during the transition
	// can carry the reader further (see useSectionPager).
	useSectionPager(section, isActive && phase === 'idle', turn);

	// An inactive section waits at an empty prompt, so becoming active types its
	// command in from nothing.
	const promptMode = isActive ? PROMPT_MODE[phase] : 'waiting';
	const outputState = isActive ? OUTPUT_STATE[phase] : 'hidden';

	return (
		<section
			ref={section}
			className={classNames(styles.section, {
				[styles.inactive]: !isActive,
				[styles.withFooter]: name === lastSection?.name,
			})}
			// The section scrolls its own content, so it has to be reachable without
			// a pointer.
			tabIndex={0}
			aria-labelledby={titleId}
		>
			<div className={styles.inner}>
				<TerminalLine path={promptPath} command={command} mode={promptMode} delay={timing.promptPause} />
				<motion.div
					className={styles.output}
					variants={outputVariants}
					initial="hidden"
					animate={outputState}
					// The only way to know the output is fully printed: the block count
					// lives in the content, not in the machine.
					onAnimationComplete={(definition) => {
						if (definition === 'printing') {
							settle(name);
						}
					}}
				>
					{
						name === firstSection?.name
							? <motion.h1 id={titleId} className={styles.title} variants={blockVariants}>{title}</motion.h1>
							: <motion.h2 id={titleId} className={styles.display} variants={blockVariants}>{title}</motion.h2>
					}
					<motion.h3 className={styles.subtitle} variants={blockVariants}>{subtitle}</motion.h3>
					<SectionContext value={true}>
						<div className={styles.content}>
							{children}
						</div>
					</SectionContext>
					<TerminalLine
						path={pathFor(name)}
						command={exitCommand}
						mode={exitCommand ? 'typing' : 'waiting'}
					/>
				</motion.div>
			</div>
		</section>
	);
}

Section.Text = SectionText;

export default Section;
