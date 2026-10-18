import React from 'react';
import { ClientOnly } from 'vite-react-ssg';

export default function withClientOnly<T extends object>(Component: React.ComponentType<T>) {
	return function WrappedComponent(props: T) {
		return (
			<ClientOnly>
				{() => <Component {...props} />}
			</ClientOnly>
		);
	};
}
