import styles from './Footer.module.scss';

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.content}>
				<span className={styles.path}>
					<mark>~/</mark>
					zykov
				</span>
				<span>© 2026 Misha Zykov</span>
			</div>
		</footer>
	);
}
