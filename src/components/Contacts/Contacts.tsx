import Contact from '../Contact/Contact.tsx';
import { EmailIcon, GitHubIcon, LinkedinIcon, TelegramIcon } from '../Icons/Icons.tsx';
import styles from './Contacts.module.scss';

export default function Contacts() {
	return (
		<div className={styles.contacts}>
			<div className={styles.contactsGroup}>
				<Contact href="https://t.me/zykov_mg" label="TELEGRAM" value="@zykov_mg" icon={<TelegramIcon />} />
				<Contact href="mailto:zykov.mg@gmail.com" copy="zykov.mg@gmail.com" label="EMAIL" value="zykov.mg@gmail.com" icon={<EmailIcon />} />
			</div>
			<div className={styles.contactsGroup}>
				<Contact href="https://www.linkedin.com/in/zykov-mg/" label="LINKEDIN" value="Misha Zykov" icon={<LinkedinIcon />} />
				<Contact href="https://github.com/ykropchik" label="GITHUB" value="ykropchik" icon={<GitHubIcon />} />
			</div>
		</div>
	);
}
