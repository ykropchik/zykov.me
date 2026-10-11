import { useReducedMotionConfig, type Variants } from 'motion/react';
import { blockFadeVariants, blockSlideVariants } from '../animations.ts';

export default function useBlockVariants(): Variants {
	return useReducedMotionConfig() ? blockFadeVariants : blockSlideVariants;
}
