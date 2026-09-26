import * as React from 'react';
import styles from './Tag.module.scss';

export type TagVariant = 'solid' | 'outline' | 'dashed';

type TagProps = {
	variant?: TagVariant;
};

export default function Tag({ variant = 'solid', children }: React.PropsWithChildren<TagProps>) {
	return (
		<span className={`${styles.tag} ${styles[variant]}`}>{children}</span>
	);
}
