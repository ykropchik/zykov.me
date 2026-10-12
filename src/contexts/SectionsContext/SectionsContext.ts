import { createContext } from 'react';

export type SectionInfo = {
	name: string;
	description?: string;
};

/**
 * `type` - the command is filling in, from the moment the section arrives
 * `print` - the command is entered and its output is arriving
 * `idle` - the output has finished printing
 * `clear` - the output is all on screen, and the exit line is being typed below it
 */
export type Phase = 'type' | 'print' | 'idle' | 'clear';

type SectionsContextValue = {
	/** In the order the sections stand in the markup. */
	sections: readonly SectionInfo[];
	/** The two ends of that order, so the lookup is written once rather than in every section. */
	firstSection: SectionInfo | null;
	lastSection: SectionInfo | null;
	activeSection: SectionInfo | null;
	phase: Phase;
	go: (name: string) => void;
	/** Only the section itself knows how many blocks it has, so it is the one that reports. */
	settle: (name: string) => void;
	/**
	 * Returns whether it moved — false at the edges of the running order, and while
	 * a transition is still running. The pager has to know, because a gesture that
	 * was refused has not spent itself on anything.
	 */
	turn: (direction: 1 | -1) => boolean;
	pathFor: (name: string) => string[];
	/** Undefined for every section but the one on its way out. */
	exitCommandFor: (name: string) => string | undefined;
	/**
	 * Asked for as a pair because both answer from where the reader stood when the
	 * command ran, which only the machine knows.
	 */
	promptFor: (name: string) => { promptPath: string[]; command: string };
};

const SectionsContext = createContext<SectionsContextValue>({
	sections: [],
	firstSection: null,
	lastSection: null,
	activeSection: null,
	phase: 'idle',
	go: () => {},
	settle: () => {},
	turn: () => false,
	pathFor: () => [],
	exitCommandFor: () => undefined,
	promptFor: () => ({ promptPath: [], command: '' }),
});

export default SectionsContext;
