import { useContext } from 'react';
import * as motion from 'motion/react-m';
import * as React from 'react';
import classNames from 'classnames';
import useBlockVariants from '../../hooks/useBlockVariants.ts';
import SectionContext from './SectionContext.ts';
import styles from './Section.module.scss';

type SectionTextProps = React.PropsWithChildren<{
	className?: string;
}>;

/**
 * Throws outside a `Section` rather than rendering: the stagger a block prints in
 * lives on the section, so anywhere else this would park at `hidden` with nothing
 * to ever animate it — an invisible paragraph.
 *
 * Like every other block, it must not be wrapped in one: the stagger reaches
 * blocks in tree order, so a nested block would start a sequence of its own.
 */
export default function SectionText({ className, children }: SectionTextProps) {
	const inSection = useContext(SectionContext);
	const blockVariants = useBlockVariants();

	if (!inSection) {
		throw new Error('Section.Text can only be nested in a Section.');
	}

	return (
		<motion.p className={classNames(styles.text, className)} variants={blockVariants}>
			{children}
		</motion.p>
	);
}
