'use client';

/* WHICH VIEW THIS VISITOR IS READING: Console or Simple.
 *
 * Console is the clean-visitor default. A valid `?view=simple|console` wins over the saved
 * choice, and a valid explicit choice is saved. Only the preference goes to localStorage. The
 * picked workflow on the Simple card lives in the in-memory map below, so a view switch
 * remounts the markup without losing what the reader picked.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { usePathname } from 'next/navigation';
import Welcome from './Welcome';
import './simple.css';

export type SiteView = 'console' | 'simple';
export const VIEW_KEY = 'leakless:view';
export const WELCOME_OFF_KEY = 'leakless:welcome-off';
export const WELCOME_EVENT = 'leakless:welcome';

interface ViewContext {
  /** What the page shows: Simple only when the reader chose Simple AND this route has a Simple body. */
  view: SiteView;
  /** The saved choice, kept so the next route with a Simple body opens in Simple. */
  chosen: SiteView;
  hasSimple: boolean;
  choose: (view: SiteView) => void;
  welcome: () => void;
  claimSimple: (path: string) => () => void;
}

const Context = createContext<ViewContext | null>(null);
const Memory = createContext<Map<string, unknown> | null>(null);

export function useSiteView() {
  return useContext(Context);
}

/** A component that renders a Simple body for this route calls this. A route that never claims
 * Simple stays in Console whatever was chosen, so the chrome always matches the body. */
export function useClaimSimple(active = true) {
  const claim = useContext(Context)?.claimSimple;
  const path = usePathname();
  useEffect(() => (active && claim ? claim(path) : undefined), [active, claim, path]);
}

/** State that survives a view switch and a route change, and never reaches browser storage. */
export function useViewState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const memory = useContext(Memory);
  const [value, setValue] = useState<T>(() => (memory?.has(key) ? (memory.get(key) as T) : initial));
  const update: Dispatch<SetStateAction<T>> = useCallback(
    (next) => {
      setValue((previous) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(previous) : next;
        memory?.set(key, resolved);
        return resolved;
      });
    },
    [key, memory],
  );
  return [value, update];
}

function readSaved(): SiteView {
  try {
    return localStorage.getItem(VIEW_KEY) === 'simple' ? 'simple' : 'console';
  } catch {
    return 'console';
  }
}

export default function SiteViewProvider({ children }: { children: ReactNode }) {
  const [chosen, setView] = useState<SiteView>('console');
  const [memory] = useState(() => new Map<string, unknown>());
  const [claims, setClaims] = useState<Record<string, number>>({});
  const path = usePathname();

  const claimSimple = useCallback((claimed: string) => {
    setClaims((c) => ({ ...c, [claimed]: (c[claimed] || 0) + 1 }));
    return () =>
      setClaims((c) => {
        const next = { ...c, [claimed]: (c[claimed] || 1) - 1 };
        if (next[claimed] <= 0) delete next[claimed];
        return next;
      });
  }, []);
  const hasSimple = (claims[path] || 0) > 0;
  const view: SiteView = chosen === 'simple' && hasSimple ? 'simple' : 'console';

  const choose = useCallback((next: SiteView) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* a blocked store never breaks the switch */
    }
    const url = new URL(window.location.href);
    if (url.searchParams.has('view')) {
      url.searchParams.set('view', next);
      window.history.replaceState(window.history.state, '', url.href);
    }
  }, []);

  useEffect(() => {
    const explicit = new URLSearchParams(window.location.search).get('view');
    /* The URL and localStorage are unknown during the server render, so the view is read
     * after mount. Console renders until then. */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (explicit === 'simple' || explicit === 'console') choose(explicit);
    else setView(readSaved());
  }, [path, choose]);

  useEffect(() => {
    document.documentElement.dataset.view = view;
  }, [view]);

  const welcome = useCallback(() => window.dispatchEvent(new Event(WELCOME_EVENT)), []);

  return (
    <Context.Provider value={{ view, chosen, hasSimple, choose, welcome, claimSimple }}>
      <Memory.Provider value={memory}>
        <div className="site-surface" data-view={view}>
          {children}
        </div>
        <Welcome />
      </Memory.Provider>
    </Context.Provider>
  );
}
