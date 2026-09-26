import styles from './TerminalLine.module.scss';

type TerminalLineProps = {
	path: string[];
	command?: string;
};

export default function TerminalLine({ path, command }: TerminalLineProps) {
	return (
		<div className={styles.terminalLine}>
			<mark>~/</mark>
			{path.map((dir) => (
				<>
					<span>{dir}</span><mark>/</mark>
				</>
			))}
			<span className={styles.promptSign}>$</span>
			{
				command
					? <span>{command}</span>
					: <span className={styles.caret}></span>
			}
		</div>
	);
}
