import {
  IconGlobe, IconEye, IconWaveform, IconMonitor, IconStar, IconCompass,
  IconNodes, IconCoins, IconLock, IconPeople, IconSpark, IconKey, IconRing,
  type IconProps,
} from "@/components/shared/Icons";

const MARKS: Record<string, (p: IconProps) => React.ReactNode> = {
  World: IconGlobe,
  Image: IconEye,
  Resonance: IconWaveform,
  Machine: IconMonitor,
  Crown: IconStar,
  Compass: IconCompass,
  Engine: IconNodes,
  Ledger: IconCoins,
  Seal: IconLock,
  Hearth: IconPeople,
  Herald: IconSpark,
  Gate: IconKey,
  Circle: IconRing,
};

/** Circular ring emblem, tinted by accent, with a per-domain mark inside. */
export function RingEmblem({ domain, accent, size = 96 }: { domain: string; accent: string; size?: number }) {
  const Mark = MARKS[domain] ?? IconRing;
  return (
    <span
      className="flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        color: accent,
        border: `1.5px solid ${accent}`,
        boxShadow: `0 0 44px -10px ${accent}, inset 0 0 24px -12px ${accent}`,
        background: `radial-gradient(circle at 50% 40%, ${accent}22, transparent 70%)`,
      }}
    >
      <Mark size={Math.round(size * 0.44)} />
    </span>
  );
}
