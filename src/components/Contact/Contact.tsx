import React from 'react';
import { ArrowUpRightIcon } from '../Icons/Icons.tsx';
import styles from './Contact.module.scss';

type ContactProps = {
	href: string;
	icon: React.ReactElement;
	label: string;
	value: string;
};

export default function Contact({ href, icon, label, value }: ContactProps) {
	return (
		<a className={styles.contact} href={href}>
			<span className={styles.badge}>
				{icon}
			</span>
			<span className={styles.text}>
				<span className={styles.label}>{label}</span>
				<span className={styles.value}>{value}</span>
			</span>
			<span className={styles.arrow}>
				<ArrowUpRightIcon />
			</span>
		</a>
	);
}
