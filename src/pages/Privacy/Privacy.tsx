import { useEffect, useState, type PropsWithChildren, type ReactNode } from 'react';
import Header from '../../components/Header/Header.tsx';
import { StaticFooter } from '../../components/Footer/Footer.tsx';
import PageMeta from '../../components/PageMeta/PageMeta.tsx';
import { CheckIcon, CopyIcon } from '../../components/Icons/Icons.tsx';
import { analytics } from '../../misc/Analytics.ts';
import styles from './Privacy.module.scss';
import { ClientOnly } from 'vite-react-ssg';

const EMAIL = 'zykov.mg@gmail.com';
const COPIED_TIMEOUT = 2000;

type PrivacyProps = {
	homeDir: string;
};

export default function Privacy({ homeDir }: PrivacyProps) {
	return (
		<>
			<PageMeta
				title="Privacy — Misha Zykov"
				description="What zykov.me records about visits, why, how long it is kept, and how to opt out."
				path="/privacy"
			/>
			<Header homeDir={homeDir} />
			<main className={styles.main}>
				<div className={styles.intro}>
					<h1 className={styles.title}>Privacy</h1>
					<div className={styles.updated}>Last updated: <time dateTime="2026-10-18">October 18, 2026</time></div>
					<p className={styles.lead}>This is my personal website. I want to know which parts of it are useful, so I collect a small amount of usage statistics, linked to a random ID rather than to your name or contact details. I don’t use cookies, ads or third-party trackers, and I never sell this data or share it with anyone other than my hosting provider. The only thing stored on your device is a random ID in your browser’s localStorage (<a href="#collect">see below</a>).</p>
				</div>
				<div className={styles.document}>
					<Chapter id="responsible" title="Who is responsible">
						<p>Mikhail Zykov, <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. I run this site myself, and I’m the only person who has access to the collected data.</p>
					</Chapter>

					<Chapter id="collect" title="What I collect">
						<p>When you visit the site, I record:</p>
						<ul className={styles.list}>
							<Item term="A random visitor ID:">a randomly generated identifier stored in your browser’s localStorage. It lets me tell repeat visits apart from new ones. It contains no information about you and is automatically replaced every 90 days.</Item>
							<Item term="A random session ID:">generated a new on every page load, including reloads, and kept only in memory.</Item>
							<Item term="Interactions:">how you use the page, for example which sections came into view, which buttons and links were clicked and which stories were opened. Each event records what happened and, where relevant, which section, link or item it concerns. I record the fact of an action, not anything you type or send afterwards.</Item>
							<Item term="Time of each event:">two timestamps, one from your browser’s clock when the event happened and one from my server when it was received. After about 6 months, these are reduced to the date only (see <a href="#retention">“How long I keep it”</a>).</Item>
							<Item term="Country:">determined from your request by my hosting provider. I don’t store your IP address in my statistics.</Item>
						</ul>
						<p>I do not collect your name, email, precise location or browser fingerprint, and I don’t keep your IP address beyond the short-lived hosting logs described under <a href="#hosting">“Hosting”</a>. I do not try to find out who you are.</p>
					</Chapter>

					<Chapter id="why" title="Why">
						<p>Only to understand, in aggregate, how the site is used: which sections people read and which contact options they use, so I can improve the site. The data is not used for advertising, profiling or any automated decisions about you.</p>
						<p>The legal basis is my legitimate interest in understanding how my website is used and improving it (Art. 6(1)(f) GDPR). You can object to this processing at any time (see <a href="#opt-out">“Opting out”</a>).</p>
					</Chapter>

					<Chapter id="retention" title="How long I keep it">
						<p>The visitor ID in your browser is automatically replaced every 90 days, and you can delete it at any time (see <a href="#opt-out">below</a>).</p>
						<p>Usage events linked to visitor and session IDs are kept for about 6 months: a weekly cleanup processes every event older than 180 days, so no event keeps its IDs for more than 187 days. During that cleanup, the IDs are removed and only anonymous statistics (the event and its details, such as which section or link, country and date) are kept. These can no longer be linked to you or your device.</p>
					</Chapter>

					<Chapter id="hosting" title="Hosting">
						<p>The site is hosted on Cloudflare. Like any web server, Cloudflare processes technical request data, including IP addresses, to deliver the site and protect it from attacks. Cloudflare acts as my data processor under its Data Processing Addendum and keeps these logs only for a limited time. My own statistics described above are also stored on Cloudflare’s infrastructure. Requests to the analytics endpoint, including technical details such as your IP address, also appear in Cloudflare’s logs, which are kept for a few days (no more than 7) for debugging and abuse protection. Cloudflare is a US company and may process data outside your country, including in the United States, under the safeguards set out in its Data Processing Addendum (such as the EU-U.S. Data Privacy Framework).</p>
					</Chapter>

					<Chapter id="opt-out" title="Opting out">
						<p>If you don’t want to be included in the statistics:</p>
						<ul className={styles.list}>
							<Item term="Block the analytics requests.">Usage events are sent to <code className={styles.code}>/analytics</code>. Blocking this address with a content blocker, or disabling JavaScript for this site, stops all tracking.</Item>
							<Item term="Remove the stored visitor ID">by clearing this site’s data in your browser settings. Note that a new random ID will be created on your next visit (unless JavaScript is disabled); while analytics requests are blocked, it is never sent to me.</Item>
							<Item term={<a href={`mailto:${EMAIL}`}>Email me</a>}>to object to the processing of your data, and I’ll delete the records linked to your visitor ID (see <a href="#rights">below</a>).</Item>
						</ul>
					</Chapter>

					<Chapter id="rights" title="Your rights">
						<p>Depending on where you live (for example under the GDPR or UK GDPR), you have the right to access, delete or object to the processing of your data. Because the data is not linked to your identity, I usually can’t find “your” records on my own. If you send me the visitor ID shown below, I’ll delete everything associated with it. In practice this covers only your current ID, which means visits from roughly the last 90 days. Once an ID is replaced, neither you nor I can link the old one to you, and after about 6 months all records are anonymized and no longer linked to any ID.</p>
						<ClientOnly>
							{() => <VisitorId />}
						</ClientOnly>
						<p>You also have the right to lodge a complaint with your local data protection authority.</p>
					</Chapter>

					<Chapter id="changes" title="Changes">
						<p>If I change how the site collects data, I’ll update this page and the date at the top.</p>
					</Chapter>

					<p className={styles.questions}>Questions? Write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
				</div>
			</main>
			<StaticFooter isPrivacy />
		</>
	);
}

type ChapterProps = PropsWithChildren<{
	id: string;
	title: string;
}>;

function Chapter({ id, title, children }: ChapterProps) {
	const titleId = `${id}-title`;

	return (
		<section className={styles.chapter} id={id} aria-labelledby={titleId}>
			<h2 className={styles.heading} id={titleId}>
				<span className={styles.hashes} aria-hidden="true">## </span>
				{title}
			</h2>
			{children}
		</section>
	);
}

type ItemProps = PropsWithChildren<{
	term: ReactNode;
}>;

function Item({ term, children }: ItemProps) {
	return (
		<li className={styles.item}>
			<span className={styles.bullet} aria-hidden="true">-</span>
			<span><strong className={styles.term}>{term}</strong> {children}</span>
		</li>
	);
}

function VisitorId() {
	const id = analytics.storedVisitorId();

	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(false), COPIED_TIMEOUT);
		return () => clearTimeout(timer);
	}, [copied]);

	const copy = () => {
		if (id) {
			navigator.clipboard.writeText(id).then(() => setCopied(true), () => {});
		}
	};

	return (
		<div className={styles.visitor}>
			<div className={styles.visitorText}>
				<span className={styles.visitorLabel}>YOUR VISITOR ID</span>
				<code className={styles.visitorValue}>
					{id === undefined ? '…' : id ?? 'none — this browser hasn’t been given one'}
				</code>
			</div>
			<button
				className={styles.copy}
				type="button"
				aria-label={copied ? 'Visitor ID copied' : 'Copy visitor ID'}
				disabled={!id}
				onClick={copy}
			>
				{copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
				{copied ? 'copied' : 'copy'}
			</button>
		</div>
	);
}
