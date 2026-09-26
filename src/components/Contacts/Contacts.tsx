import Contact from '../Contact/Contact.tsx';
import { EmailIcon, GitHubIcon, LinkedinIcon, TelegramIcon } from '../Icons/Icons.tsx';
import styles from './Contacts.module.scss';

export default function Contacts() {
	return (
		<div className={styles.contacts}>
			<div className={styles.contactsGroup}>
				<Contact href="#telegram" label="TELEGRAM" value="[@handle]" icon={<TelegramIcon />} />
				<Contact href="mailto:you@example.com" label="EMAIL" value="[you@example.com]" icon={<EmailIcon />} />
			</div>
			<div className={styles.contactsGroup}>
				<Contact href="#linkedin" label="LINKEDIN" value="[linkedin.com/in/handle]" icon={<LinkedinIcon />} />
				<Contact href="#github" label="GITHUB" value="[github.com/handle]" icon={<GitHubIcon />} />
			</div>
		</div>
	);
}
