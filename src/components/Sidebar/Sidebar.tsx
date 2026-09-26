import React from 'react';
import { CloseIcon } from '../Icons/Icons.tsx';
import TerminalLine from '../TerminalLine/TerminalLine.tsx';
import styles from './Sidebar.module.scss';

const links = [
	{ name: 'about', description: 'the informal part' },
	{ name: 'work', description: 'where I’ve been' },
	{ name: 'contact', description: 'say hi' },
];

type SidebarProps = {
	ref: React.RefObject<HTMLDialogElement | null>;
};

export default function Sidebar({ ref }: SidebarProps) {
	return (
		<dialog
			ref={ref}
			className={styles.sidebar}
			onClick={(event) => {
				if (event.target === ref.current) {
					ref.current?.close();
				}
			}}
			aria-label="Menu"
		>
			{/* Need to fill all dialog space; then onClick means click on backdrop */}
			<div className={styles.panel}>
				<div className={styles.bar}>
					<span className={styles.title}>menu</span>
					<button className={styles.close} type="button" aria-label="Close menu" onClick={() => ref.current?.close()}>
						<CloseIcon />
					</button>
				</div>
				<div className={styles.body}>
					<TerminalLine path={['zykov']} command="ls -l" />
					<nav className={styles.nav} aria-label="Sections">
						{links.map((link) => (
							<a className={styles.row} key={link.name} href={`#${link.name}`} onClick={() => ref.current?.close()}>
								<span className={styles.permissions}>drwxr-xr-x</span>
								<span className={styles.name}>
									{link.name}
									<mark>/</mark>
								</span>
								<span className={styles.description}>{link.description}</span>
							</a>
						))}
					</nav>
					<div className={styles.hint}>
						<span className={styles.hintClick}># click a line to jump there</span>
						<span className={styles.hintTap}># tap a line to jump there</span>
					</div>
					<TerminalLine path={['zykov']} />
				</div>
			</div>
		</dialog>
	);
}
