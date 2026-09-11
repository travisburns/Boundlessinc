/** Thin line icons (24×24, currentColor stroke) matching the engraved brand feel. */

export type IconProps = { size?: number; className?: string; style?: React.CSSProperties };

function Svg({ size = 24, className, style, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export const IconHourglass = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9" />
  </Svg>
);

export const IconKey = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="8" cy="8" r="4" />
    <path d="M11 11l8 8M17 17l1.5-1.5M15 19l1.5-1.5" />
  </Svg>
);

export const IconCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12.5 9 17.5 20 6.5" />
  </Svg>
);

export const IconDoc = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4M9 12h6M9 16h6" />
  </Svg>
);

export const IconClipboard = (p: IconProps) => (
  <Svg {...p}>
    <rect x="6" y="4" width="12" height="17" rx="2" />
    <path d="M9 4a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4v1H9zM9 11h6M9 15h4" />
  </Svg>
);

export const IconCheckCircle = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5 11 15.5 16 9" />
  </Svg>
);

export const IconAlert = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.2v.3" />
  </Svg>
);

export const IconCalendar = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="5" width="16" height="16" rx="2" />
    <path d="M4 9h16M8 3v4M16 3v4" />
  </Svg>
);

export const IconFolder = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
  </Svg>
);

export const IconBook = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 4h9a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H5z" />
    <path d="M17 7a3 3 0 0 1 3-3v14" />
  </Svg>
);

export const IconUpload = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 16V5M8 9l4-4 4 4M5 19h14" />
  </Svg>
);

export const IconChat = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
  </Svg>
);

export const IconWaveform = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12h2l1.5-5 2.5 12 2.5-9 2 6 1.5-4h2" />
  </Svg>
);

export const IconTools = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.5 5.5a3.5 3.5 0 0 0 4.5 4.5L21 12l-9 9-2-2 9-9M6.5 6.5 4 4l2-2 2.5 2.5M4 20l5-5" />
  </Svg>
);

export const IconEdit = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 4l6 6M4 20l1-4L16 5l3 3L8 19z" />
  </Svg>
);

export const IconFileText = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 3h7l4 4v14H7z" />
    <path d="M14 3v4h4M10 12h5M10 16h5" />
  </Svg>
);

export const IconSearch = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6" />
    <path d="M20 20l-4-4" />
  </Svg>
);

export const IconBell = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0" />
  </Svg>
);

export const IconRing = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

export const IconCompass = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5 13 13l-4.5 2.5L11 11z" />
  </Svg>
);

export const IconPeople = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="9" r="3" />
    <path d="M3 19c0-3 3-5 6-5s6 2 6 5" />
    <path d="M16 6.5a3 3 0 0 1 0 5.5M17 14c2 .5 4 2 4 5" />
  </Svg>
);

export const IconLeaf = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 4C9 4 4 9 4 18c0 0 5-1 8-4s8-10 8-10z" />
    <path d="M4 20c4-8 8-11 14-13" />
  </Svg>
);

export const IconMonitor = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="12" rx="1.5" />
    <path d="M9 20h6M12 16v4" />
  </Svg>
);

export const IconSpark = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </Svg>
);

export const IconChart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20V5M4 20h16" />
    <path d="M8 20v-6M12 20v-9M16 20v-4" />
  </Svg>
);

export const IconCoins = (p: IconProps) => (
  <Svg {...p}>
    <ellipse cx="12" cy="6" rx="7" ry="3" />
    <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
  </Svg>
);

export const IconStar = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2l1.5 8.5L22 12l-8.5 1.5L12 22l-1.5-8.5L2 12l8.5-1.5z" />
  </Svg>
);

export const IconGlobe = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
  </Svg>
);

export const IconUser = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
  </Svg>
);

export const IconCard = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18M7 15h4" />
  </Svg>
);

export const IconHandshake = (p: IconProps) => (
  <Svg {...p}>
    <path d="M11 6 8 9a2 2 0 0 0 0 3l3 3 2-2 2 2 1-1" />
    <path d="M13 6l3-1 5 4M3 9l4-4 4 1M3 9l3 5M21 9l-3 5" />
  </Svg>
);

export const IconBuilding = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="3" width="14" height="18" rx="1" />
    <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" />
  </Svg>
);

export const IconNodes = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="6" r="2.5" />
    <circle cx="6" cy="17" r="2.5" />
    <circle cx="18" cy="17" r="2.5" />
    <path d="M11 8 7.5 15M13 8l3.5 7M8.5 17h7" />
  </Svg>
);

export const IconArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Svg>
);

export const IconLock = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
);

export const IconEye = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);
