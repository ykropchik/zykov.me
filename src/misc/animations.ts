import { steps, type Transition, type Variants } from 'motion/react';
import Duration from './Duration.ts';

export const timing = {
	/** Per character of a command, not the whole of one. */
	char: Duration.create(30),
	/** Pause before prompt typing */
	promptPause: Duration.create(100),
	/** Pause between prompt typed and content shown */
	enterPause: Duration.create(260),
	/** Pause between clear command typed and new section shown */
	clearPause: Duration.create(240),
	/** Between two blocks of output arriving. */
	blockGap: Duration.create(60),
	/** One block of output arriving. */
	blockIn: Duration.create(320),
	/** The sidebar sliding in. */
	sidebarInOut: Duration.create(180),
} as const;

export function keystrokes(command: string): Duration {
	return timing.char.times(command.length);
}

export function typing(command: string, delay = Duration.create(0)): Transition {
	return {
		duration: keystrokes(command).seconds,
		delay: delay.seconds,
		ease: steps(command.length, 'start'),
	};
}

/** Empty `hidden`: the wrapper has no look of its own, only the order its blocks arrive in. */
export const outputVariants: Variants = {
	hidden: {},
	printing: {
		transition: { delayChildren: timing.blockGap.seconds, staggerChildren: timing.blockGap.seconds },
	},
	printed: { transition: { duration: 0 } },
};

const blockInTransition: Transition = { duration: timing.blockIn.seconds, ease: 'easeOut' };

/** `transform` rather than `x` keeps the animation on WAAPI, off the main thread. */
export const blockSlideVariants: Variants = {
	hidden: { opacity: 0, transform: 'translateX(-8px)' },
	printing: { opacity: 1, transform: 'translateX(0px)', transition: blockInTransition },
	printed: { opacity: 1, transform: 'translateX(0px)', transition: { duration: 0 } },
};

/**
 * `useBlockVariants` picks this under reduced motion, because Motion cannot make
 * the swap itself: `reducedMotion="user"` only rewrites the independent transform props
 * (`x`, `y`, `scale`…) and the positional ones (`width`, `top`…), and the
 * `transform` string that keeps `blockSlideVariants` on WAAPI is neither.
 */
export const blockFadeVariants: Variants = {
	hidden: { opacity: 0 },
	printing: { opacity: 1, transition: blockInTransition },
	printed: { opacity: 1, transition: { duration: 0 } },
};

export const blockInstantVariants: Variants = {
	hidden: { opacity: 0 },
	printing: { opacity: 1, transition: { duration: 0 } },
	printed: { opacity: 1, transition: { duration: 0 } },
};
