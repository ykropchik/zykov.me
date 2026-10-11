import { createContext } from 'react';

/** True inside a `Section`, so that `Section.Text` can refuse to render anywhere else. */
const SectionContext = createContext(false);

export default SectionContext;
