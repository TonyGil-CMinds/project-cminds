import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export const IconArrowRight = (p: IconProps) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const IconCheck = (p: IconProps) => (
  <svg {...base} strokeWidth={2.2} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
export const IconCheckCircle = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M8.2 12.4l2.6 2.6 5-5.2" /></svg>
);
export const IconSearch = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></svg>
);
export const IconMenu = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h10" /></svg>
);
export const IconClose = (p: IconProps) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const IconExternal = (p: IconProps) => (
  <svg {...base} {...p}><path d="M14 5h5v5M19 5l-8 8M10 6H6a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4" /></svg>
);
export const IconChevronDown = (p: IconProps) => (
  <svg {...base} {...p}><path d="M6 9l6 6 6-6" /></svg>
);
export const IconChevronLeft = (p: IconProps) => (
  <svg {...base} {...p}><path d="M15 6l-6 6 6 6" /></svg>
);
export const IconChevronRight = (p: IconProps) => (
  <svg {...base} {...p}><path d="M9 6l6 6-6 6" /></svg>
);
export const IconDownload = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 4v11M7 10.5l5 5 5-5M5 19h14" /></svg>
);
export const IconCopy = (p: IconProps) => (
  <svg {...base} {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h8" /></svg>
);
export const IconPin = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg>
);
export const IconCalendar = (p: IconProps) => (
  <svg {...base} {...p}><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>
);
export const IconInfo = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.5" /></svg>
);
export const IconFlask = (p: IconProps) => (
  <svg {...base} {...p}><path d="M9 3h6M10 3v6L4.8 18a1.5 1.5 0 0 0 1.3 2.2h11.8a1.5 1.5 0 0 0 1.3-2.2L14 9V3" /><path d="M7.5 14h9" /></svg>
);
export const IconAccessibility = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9.5" /><circle cx="12" cy="7.4" r="1.4" fill="currentColor" stroke="none" /><path d="M7.5 10.2l4.5 1 4.5-1M12 11.2v3.2M12 14.4l-2.4 4M12 14.4l2.4 4" /></svg>
);
export const IconSun = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" /></svg>
);
export const IconMoon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>
);
export const IconMonitor = (p: IconProps) => (
  <svg {...base} {...p}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>
);
export const IconPlay = (p: IconProps) => (
  <svg {...base} {...p}><path d="M7 5.5v13l11-6.5z" fill="currentColor" /></svg>
);
export const IconPause = (p: IconProps) => (
  <svg {...base} {...p}><path d="M8 5v14M16 5v14" strokeWidth={3} /></svg>
);
export const IconStop = (p: IconProps) => (
  <svg {...base} {...p}><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" /></svg>
);
export const IconSkip = (p: IconProps) => (
  <svg {...base} {...p}><path d="M6 5.5v13l9-6.5z" fill="currentColor" /><path d="M18 5v14" strokeWidth={2.4} /></svg>
);
export const IconShare = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="18" cy="5.5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="18.5" r="2.5" /><path d="M8.2 10.8l7.6-4M8.2 13.2l7.6 4" /></svg>
);
export const IconLock = (p: IconProps) => (
  <svg {...base} {...p}><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></svg>
);
export const IconLinkedIn = (p: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}><path fill="currentColor" d="M6.7 8.6h3v9h-3v-9Zm1.5-4.2c1 0 1.7.7 1.7 1.6s-.7 1.6-1.7 1.6S6.5 6.9 6.5 6s.7-1.6 1.7-1.6Zm3.2 4.2h2.9v1.2h.1c.4-.7 1.3-1.4 2.7-1.4 2.9 0 3.4 1.9 3.4 4.3v4.9h-3v-4.4c0-1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3v4.5h-3v-9Z" /></svg>
);
export const IconXSocial = (p: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}><path fill="currentColor" d="M17.3 4h2.9l-6.3 7.2L21.3 20h-5.8l-4.5-5.9L5.8 20H2.9l6.7-7.7L2.5 4h5.9l4.1 5.4L17.3 4Zm-1 14.3h1.6L7.6 5.6H5.9l10.4 12.7Z" /></svg>
);
export const IconFacebook = (p: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}><path fill="currentColor" d="M13.4 20v-7.3h2.4l.4-2.8h-2.8V8.1c0-.8.2-1.4 1.4-1.4h1.5V4.2C16 4.1 15.1 4 14 4c-2.2 0-3.7 1.3-3.7 3.8v2.1H7.8v2.8h2.5V20h3.1Z" /></svg>
);
export const IconWhatsApp = (p: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}><path fill="currentColor" d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2Zm0 16a7.2 7.2 0 0 1-3.7-1l-.3-.2-2.6.7.7-2.6-.2-.3A7.2 7.2 0 1 1 12 19.2Zm3.9-5.4c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1l-.7.8c-.1.2-.3.2-.5.1a5.9 5.9 0 0 1-2.9-2.5c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.4a.8.8 0 0 0-.6.3 2.5 2.5 0 0 0-.8 1.9c0 1.1.8 2.2.9 2.3.1.2 1.6 2.4 3.8 3.4 1.4.6 2 .7 2.7.6.4-.1 1.3-.5 1.5-1.1.2-.5.2-1 .1-1.1l-.5-.5Z" /></svg>
);
export const IconRoute = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" /><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" /></svg>
);
