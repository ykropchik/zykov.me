import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotionConfig } from 'motion/react';
import { keystrokes, timing } from '../../animations.ts';
import SectionsContext, { type Phase, type SectionInfo } from './SectionsContext.ts';
import Duration from '../../Duration.ts';
import type { NonEmptyArray } from '../../misc/nonEmptyArray.ts';

type State = {
	activeSection: SectionInfo;
	fromSection: SectionInfo;
	nextSection: SectionInfo | null;
	phase: Phase;
};

type Step = [at: Duration, state: State];

function departure(clearCommand: string): Duration {
	return keystrokes(clearCommand).plus(timing.clearPause);
}

function arrival(command: string): Duration {
	return keystrokes(command).plus(timing.promptPause, timing.enterPause);
}

type SectionsContextProviderProps = React.PropsWithChildren<{
	homeDir: string;
	sections: NonEmptyArray<SectionInfo>;
}>;

export default function SectionsContextProvider({ homeDir, sections, children }: SectionsContextProviderProps) {
	const reduced = useReducedMotionConfig();
	const firstSection = sections[0];
	const lastSection = sections[sections.length - 1];

	const [state, setState] = useState<State>({
		activeSection: firstSection,
		fromSection: firstSection,
		nextSection: null,
		// The landing types its command in, like any other arrival.
		phase: 'type',
	});

	const timers = useRef<number[]>([]);
	// Mirrors the state so `go` and `turn` stay stable across phase changes, and the
	// pager re-attaches once per section rather than on every phase. Written through
	// `apply` rather than in an effect: two wheel events in one frame would otherwise
	// both read a stale phase and start the transition twice.
	const latest = useRef(state);

	const pathFor = useCallback((name: string) => name === firstSection.name ? [homeDir] : [homeDir, name], [homeDir, firstSection.name]);
	const commandFor = useCallback((to: string, from: string) => {
		if (to === firstSection.name) {
			return 'whoami';
		}
		if (from === firstSection.name) {
			return `cd ${to}`;
		}
		// Two sections are siblings inside the home directory, so getting between
		// them steps out and back in.
		return `cd ../${to}`;
	}, [firstSection.name]);
	const clearCommandFor = useCallback((to: string) => to === firstSection.name ? `clear && cd ~/${homeDir}` : 'clear', [homeDir, firstSection.name]);
	/**
	 * The prompt belongs to where the reader stood when the command ran, not to the
	 * section it heads. An inactive section is never on screen, so the home
	 * directory stands in for it until it is reached.
	 */
	const promptFor = useCallback((name: string) => {
		const cwd = name === state.activeSection.name ? state.fromSection.name : firstSection.name;

		return {
			promptPath: pathFor(name === firstSection.name ? name : cwd),
			command: commandFor(name, cwd),
		};
	}, [commandFor, firstSection.name, pathFor, state.activeSection.name, state.fromSection.name]);
	const exitCommandFor = useCallback((name: string) => (
		state.phase === 'clear' && state.nextSection && name === state.activeSection.name
			? clearCommandFor(state.nextSection.name)
			: undefined
	), [clearCommandFor, state.activeSection.name, state.nextSection, state.phase]);

	const apply = useCallback((next: State) => {
		latest.current = next;
		setState(next);
	}, []);

	const stopTimers = useCallback(() => {
		timers.current.forEach(clearTimeout);
		timers.current = [];
	}, []);

	const schedule = useCallback((steps: Step[]) => {
		timers.current = steps.map(([at, next]) => window.setTimeout(() => apply(next), at.millis));
	}, [apply]);

	/**
	 * Under reduced motion there is nothing to watch, so nothing to wait through
	 * either — the section is simply there.
	 *
	 * Every step is scheduled, the first one included, so that the landing effect
	 * below does not change the state from inside its own body.
	 */
	const arrive = useCallback((to: SectionInfo, cameFrom: SectionInfo, startAt: Duration) => {
		const arriving = { activeSection: to, fromSection: cameFrom, nextSection: null };
		schedule(reduced
			? [[startAt, { ...arriving, phase: 'idle' }]]
			: [
					[startAt, { ...arriving, phase: 'type' }],
					[startAt.plus(arrival(commandFor(to.name, cameFrom.name))), { ...arriving, phase: 'print' }],
				]);
	}, [commandFor, reduced, schedule]);

	const go = useCallback((name: string) => {
		const cameFrom = latest.current.activeSection;
		const to = sections.find((section) => section.name === name);
		if (!to || to.name === cameFrom.name) {
			return;
		}

		stopTimers();

		if (reduced) {
			arrive(to, cameFrom, Duration.create(0));
			return;
		}

		// The outgoing screen finishes at once: its last prompt has to be there to
		// type `clear` into. It keeps its own `fromSection`, so the line it was
		// reached by stays put while it clears.
		apply({ activeSection: cameFrom, fromSection: latest.current.fromSection, nextSection: to, phase: 'clear' });
		// The outgoing screen empties and the arriving prompt takes its place in the
		// same beat, the way a terminal does: `clear` leaves nothing to look at.
		arrive(to, cameFrom, departure(clearCommandFor(to.name)));
	}, [apply, arrive, clearCommandFor, reduced, sections, stopTimers]);

	// Reaching `idle` is what re-opens the pager, so a section that is still
	// printing cannot be left yet.
	const settle = useCallback((name: string) => {
		const now = latest.current;
		if (now.activeSection.name === name && now.phase === 'print') {
			apply({ ...now, phase: 'idle' });
		}
	}, [apply]);

	const turn = useCallback((direction: 1 | -1) => {
		const { activeSection, phase } = latest.current;
		// Only a section that has finished arriving can be left, so one gesture
		// cannot carry the reader through two of them.
		if (phase !== 'idle') {
			return false;
		}

		const at = sections.findIndex((section) => section.name === activeSection.name);
		const to = at + direction;
		// A section that has left the page while the reader stood on it is not
		// somewhere there is a step from, so `at` of -1 refuses as an edge does.
		if (at < 0 || to < 0 || to >= sections.length) {
			return false;
		}

		go(sections[to].name);
		return true;
	}, [go, sections]);

	// The state the machine starts in is already that of a section part-way through
	// an arrival; this sets that arrival running.
	useEffect(() => {
		arrive(firstSection, firstSection, Duration.create(0));
		return stopTimers;
	}, [arrive, firstSection, stopTimers]);

	return (
		<SectionsContext
			value={{
				sections,
				firstSection,
				lastSection,
				pathFor,
				promptFor,
				exitCommandFor,
				activeSection: state.activeSection,
				phase: state.phase,
				go,
				settle,
				turn,
			}}
		>
			{children}
		</SectionsContext>
	);
}
