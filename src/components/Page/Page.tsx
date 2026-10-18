import { Children, isValidElement, useMemo, type PropsWithChildren, type ReactNode } from 'react';
import SectionsContextProvider from '../../contexts/SectionsContext/SectionsContextProvider.tsx';
import SidebarContextProvider from '../../contexts/SidebarContext/SidebarContextProvider.tsx';
import type { SectionInfo } from '../../contexts/SectionsContext/SectionsContext.ts';
import Footer from '../Footer/Footer.tsx';
import Header from '../Header/Header.tsx';
import Section, { type SectionProps } from '../Section/Section.tsx';
import styles from './Page.module.scss';
import { isNonEmptyArray, type NonEmptyArray } from '../../misc/nonEmptyArray.ts';

type PageProps = PropsWithChildren<{
	homeDir: string;
}>;

export default function Page({ homeDir, children }: PageProps) {
	// The markup is written once, at the root, so `children` never changes
	const sectionsOrder = useMemo(() => orderOf(children), [children]);

	return (
		<SectionsContextProvider homeDir={homeDir} sections={sectionsOrder}>
			<SidebarContextProvider>
				<div className={styles.page}>
					<Header homeDir={homeDir} />
					<main className={styles.main}>
						{children}
					</main>
					<Footer />
				</div>
			</SidebarContextProvider>
		</SectionsContextProvider>
	);
}

function orderOf(children: ReactNode): NonEmptyArray<SectionInfo> {
	const sections = Children.toArray(children).map((child) => {
		if (!isValidElement<SectionProps>(child) || child.type !== Section) {
			throw new Error('A page is written out of <Section> elements standing in it directly. Neither a fragment nor a component of their own can be read off the markup.');
		}

		return { name: child.props.name, description: child.props.description };
	});

	if (!isNonEmptyArray(sections)) {
		throw new Error('Page should contain at least 1 <Section>');
	}

	if (new Set(sections.map((section) => section.name)).size !== sections.length) {
		throw new Error('Two sections share a name. A name is how a section is reached, so it has to be its own.');
	}

	return sections;
}
