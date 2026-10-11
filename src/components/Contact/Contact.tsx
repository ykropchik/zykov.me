import React from 'react';
import * as motion from 'motion/react-m';
import useBlockVariants from '../../hooks/useBlockVariants.ts';
import { ArrowUpRightIcon } from '../Icons/Icons.tsx';
import styles from './Contact.module.scss';

type ContactProps = {
	href: string;
	icon: React.ReactElement;
	label: string;
	value: string;
};

export default function Contact({ href, icon, label, value }: ContactProps) {
	const blockVariants = useBlockVariants();

	return (
		<motion.a className={styles.contact} href={href} variants={blockVariants}>
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
		</motion.a>
	);
}
