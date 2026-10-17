import { useEffect, type RefObject } from 'react';
import { useMotionValue, useScroll, useTransform } from 'motion/react';

/** Slack for fractional scroll positions on zoomed and high-DPI screens. */
const EDGE_PX = 1;

export default function useScrollIndicator(scroller: RefObject<HTMLElement | null>) {
	const { scrollY } = useScroll({ container: scroller });
	const max = useMotionValue(0);
	const ratio = useMotionValue(1);

	useEffect(() => {
		const element = scroller.current;
		if (!element) {
			return;
		}

		const measure = () => {
			const { scrollHeight, clientHeight } = element;
			max.set(scrollHeight - clientHeight);
			ratio.set(scrollHeight > 0 ? clientHeight / scrollHeight : 1);
		};

		const observer = new ResizeObserver(measure);
		observer.observe(element);
		if (element.firstElementChild) {
			observer.observe(element.firstElementChild);
		}
		measure();

		return () => observer.disconnect();
	}, [scroller, max, ratio]);

	const overflowing = useTransform(max, (m) => m > EDGE_PX);

	const progress = useTransform([scrollY, max], ([y, m]: number[]) => {
		if (m <= EDGE_PX || y <= EDGE_PX) {
			return 0;
		}
		return y >= m - EDGE_PX ? 1 : y / m;
	});

	const fadeTop = useTransform(() => {
		const [o, p] = [overflowing.get(), progress.get()];
		return o && p > 0 ? 1 : 0;
	});

	const fadeBottom = useTransform(() => {
		const [o, p] = [overflowing.get(), progress.get()];
		return o && p < 1 ? 1 : 0;
	});

	const trackOpacity = useTransform(overflowing, (o) => o ? 1 : 0);

	const thumbHeight = useTransform(() => {
		const [o, r] = [overflowing.get(), ratio.get()];
		return `${(o ? r : 1) * 100}%`;
	});

	const thumbY = useTransform([progress, ratio], ([p, r]: number[]) => `${p * (1 / r - 1) * 100}%`);

	return {
		scrollerFade: { top: fadeTop, bottom: fadeBottom },
		trackStyle: { opacity: trackOpacity },
		thumbStyle: { height: thumbHeight, y: thumbY },
	};
}
