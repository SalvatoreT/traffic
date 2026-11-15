import { createContext, useContext, useEffect, useRef, useState, type ElementType, type MouseEvent, type ReactNode } from 'react';
import { pathOfView, type View } from '../lib/route';

export interface Nav {
  view: View;
  hrefFor(view: View, anchor?: string | null): string;
  go(view: View, anchor?: string | null): void;
  copyAnchor(anchor: string): void;
}

const FALLBACK: Nav = { view: 'map', hrefFor: (v, a) => `${pathOfView(v)}${a ? `#${encodeURIComponent(a)}` : ''}`, go() {}, copyAnchor() {} };
export const NavContext = createContext<Nav>(FALLBACK);
export const useNav = () => useContext(NavContext);

/** True for a click the browser should handle itself: another button, a modifier key, or a link that opens elsewhere. */
export const plainClick = (e: MouseEvent<HTMLAnchorElement>) => !(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.currentTarget.target && e.currentTarget.target !== '_self'));

/** A real link to a tab, or to a section of one. A plain click stays in the page. */
export function NavLink({ view, anchor, className, children, onClick, ...rest }: {
  view: View; anchor?: string | null; className?: string; children: ReactNode; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void; 'aria-current'?: 'page';
}) {
  const nav = useNav();
  return (
    <a {...rest} className={className} href={nav.hrefFor(view, anchor)} onClick={(e) => {
      if (!plainClick(e)) return;
      e.preventDefault();
      nav.go(view, anchor);
      onClick?.(e);
    }}>{children}</a>
  );
}

/** The link control beside a heading: copies the address of the section and says so. Hidden until hover or focus, except on touch screens. */
export function AnchorLink({ id, label }: { id: string; label: string }) {
  const nav = useNav();
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <span className="anchor-wrap">
      <a className="anchor-link" href={nav.hrefFor(nav.view, id)} aria-label={`Link to this section: ${label}`} onClick={(e) => {
        if (!plainClick(e)) return;
        e.preventDefault();
        nav.copyAnchor(id);
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 2000);
      }}>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M6.5 9.5a3 3 0 0 0 4.2 0l2.3-2.3a3 3 0 0 0-4.2-4.2l-.8.8M9.5 6.5a3 3 0 0 0-4.2 0L3 8.8A3 3 0 0 0 7.2 13l.8-.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      </a>
      {copied && <span className="anchor-copied" aria-hidden="true">Link copied</span>}
    </span>
  );
}

/** A heading with a stable id and its link control. `label` is the heading text for the control's name. */
export function AnchorHeading({ as: Tag = 'h3', id, label, className, children }: { as?: ElementType; id: string; label: string; className?: string; children: ReactNode }) {
  return <Tag id={id} tabIndex={-1} className={`anchored${className ? ` ${className}` : ''}`}><span className="anchored-text">{children}</span>{' '}<AnchorLink id={id} label={label} /></Tag>;
}
