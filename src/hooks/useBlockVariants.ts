import { useReducedMotionConfig, type Variants } from 'motion/react';
import { blockFadeVariants, blockSlideVariants } from '../misc/animations.ts';

export default function useBlockVariants(): Variants {
	return useReducedMotionConfig() ? blockFadeVariants : blockSlideVariants;
}
