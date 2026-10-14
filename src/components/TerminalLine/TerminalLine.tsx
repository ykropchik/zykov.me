import { Fragment } from 'react';
import classNames from 'classnames';
import { useReducedMotionConfig } from 'motion/react';
import * as motion from 'motion/react-m';
import { blockInstantVariants, typing } from '../../misc/animations.ts';
import styles from './TerminalLine.module.scss';
import Duration from '../../misc/Duration.ts';

type TerminalMode = 'waiting' | 'typing' | 'entered' | 'static';

type TerminalLineProps = {
	path: string[];
	command?: string;
	mode?: TerminalMode;
	delay?: Duration;
};

export default function TerminalLine({ path, command, mode = 'static', delay = Duration.create(0) }: TerminalLineProps) {
	const reduced = useReducedMotionConfig();
	const withAnimation = command !== undefined && mode !== 'static';
	const withTypingAnimation = mode === 'typing' && !reduced;

	return (
		<motion.div className={styles.terminalLine} variants={blockInstantVariants}>
			<mark>~/</mark>
			{path.map((dir, index) => (
				<Fragment key={`${dir}-${index}`}>
					<span>{dir}</span><mark>/</mark>
				</Fragment>
			))}
			<span className={styles.promptSign}>$</span>
			{
				withAnimation
					? (
							<motion.span
								className={classNames(styles.command, styles.measured)}
								initial={{ width: 0 }}
								animate={{ width: mode === 'waiting' ? 0 : `${command.length}ch` }}
								transition={withTypingAnimation ? typing(command, delay) : { duration: 0 }}
							>
								{command}
							</motion.span>
						)
					: <span className={styles.command}>{command}</span>
			}
			{(mode === 'waiting' || mode === 'typing') && (
				<span
					className={classNames(styles.caret, { [styles.caretBlink]: mode === 'waiting' })}
					aria-hidden="true"
				>
				</span>
			)}
		</motion.div>
	);
}
