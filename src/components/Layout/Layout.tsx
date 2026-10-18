import { StrictMode } from 'react';
import { Outlet } from 'react-router-dom';
import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';

export default function Layout() {
	return (
		<StrictMode>
			<MotionConfig reducedMotion="user">
				<LazyMotion features={domAnimation} strict>
					<Outlet />
				</LazyMotion>
			</MotionConfig>
		</StrictMode>
	);
}
