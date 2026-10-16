import React, { useEffect, useState } from 'react';
import * as motion from 'motion/react-m';
import useBlockVariants from '../../hooks/useBlockVariants.ts';
import { ArrowUpRightIcon, CheckIcon, CopyIcon } from '../Icons/Icons.tsx';
import styles from './Contact.module.scss';

type ContactProps = {
	icon: React.ReactElement;
	label: string;
	value: string;
	href: string;
	copy?: string;
};

const COPIED_TIMEOUT = 2000;

export default function Contact({ href, copy, icon, label, value }: ContactProps) {
	const blockVariants = useBlockVariants();
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(false), COPIED_TIMEOUT);
		return () => clearTimeout(timer);
	}, [copied]);

	const content = (
		<>
			<span className={styles.badge}>
				{icon}
			</span>
			<span className={styles.text}>
				<span className={styles.label}>{copied ? 'COPIED' : label}</span>
				<span className={styles.value}>{value}</span>
			</span>
			<span className={styles.arrow}>
				{copy === undefined ? <ArrowUpRightIcon /> : copied ? <CheckIcon /> : <CopyIcon />}
			</span>
		</>
	);

	if (copy !== undefined) {
		const handleCopy = () => {
			navigator.clipboard.writeText(copy)
				.then(() => setCopied(true), () => {})
				.catch(() => window.open(href, '_blank'));
		};

		return (
			<motion.button className={styles.contact} type="button" onClick={handleCopy} variants={blockVariants}>
				{content}
			</motion.button>
		);
	}

	return (
		<motion.a className={styles.contact} href={href} target="_blank" variants={blockVariants}>
			{content}
		</motion.a>
	);
}
