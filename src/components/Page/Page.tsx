import * as React from 'react';
import styles from './Page.module.scss';

export default function Page({ children }: React.PropsWithChildren): React.ReactElement {
	return (
		<div className={styles.page}>
			{children}
		</div>
	);
}
