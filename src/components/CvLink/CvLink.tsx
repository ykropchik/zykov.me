import classNames from 'classnames';
import { ArrowUpRightIcon } from '../Icons/Icons.tsx';
import styles from './CvLink.module.scss';

export type CvLinkVariant = 'inline' | 'button';

type CvLinkProps = {
	variant?: CvLinkVariant;
};

/** The one link to the CV PDF: inline in running text, or as a filled button. */
export default function CvLink({ variant = 'inline' }: CvLinkProps) {
	return (
		<a
			className={classNames(styles.cvLink, styles[variant])}
			href="/Mikhail_Zykov_Frontend_Engineer_CV.pdf"
			target="_blank"
			rel="noopener"
			aria-label="CV (PDF, opens in a new tab)"
		>
			CV
			<ArrowUpRightIcon size={16} />
		</a>
	);
}
