import styles from './Section.module.scss';
import * as React from 'react';
import TerminalLine from '../TerminalLine/TerminalLine.tsx';

type SectionProps = React.PropsWithChildren<{
	name: string;
	title: React.ReactNode;
	subtitle: React.ReactNode;
}>;

export default function Section({ name, title, subtitle, children }: SectionProps) {
	const isTopSection = name === 'whoami';

	return (
		<section className={styles.section} id={name}>
			<TerminalLine path={['zykov']} command={isTopSection ? 'whoami' : `cd ${name}`} />
			{
				isTopSection
					? <h1 className={styles.title}>{title}</h1>
					: <h2 className={styles.display}>{title}</h2>
			}
			<h3 className={styles.subtitle}>{subtitle}</h3>
			<div className={styles.content}>
				{children}
			</div>
			<TerminalLine path={isTopSection ? ['zykov'] : ['zykov', name]} />
		</section>
	);
}
