/** Per-domain workspace tailoring: what a ring uploads and how it's labelled. */
export interface RingProfile {
  accept: string;
  filesLabel: string;
  submitLabel: string;
  uploadHint: string;
}

const DEFAULT: RingProfile = {
  accept: "*",
  filesLabel: "Files",
  submitLabel: "Attach a file",
  uploadHint: "Upload a file",
};

const PROFILES: Record<string, RingProfile> = {
  Resonance: {
    accept: "audio/*,.wav,.aif,.aiff,.flac,.ogg,.m4a,.logicx,.als,.flp,.ptx,.cpr",
    filesLabel: "Sound Files",
    submitLabel: "Submit a mix",
    uploadHint: "Upload audio — WAV, stems, or a project file",
  },
  Image: {
    accept: "image/*,.psd,.ai,.tif,.tiff",
    filesLabel: "Artwork",
    submitLabel: "Submit artwork",
    uploadHint: "Upload art — PNG, PSD, or source files",
  },
  World: {
    accept: ".pdf,.doc,.docx,.txt,.md,.rtf",
    filesLabel: "Documents",
    submitLabel: "Submit a draft",
    uploadHint: "Upload lore docs, drafts, or scripts",
  },
  Machine: {
    accept: "*",
    filesLabel: "Artifacts",
    submitLabel: "Attach a build",
    uploadHint: "Attach diagrams, exports, or archives (link repos in the task)",
  },
  Crown: {
    accept: "*",
    filesLabel: "Org Files",
    submitLabel: "Attach a document",
    uploadHint: "Board docs, strategy, and reports",
  },
  Compass: {
    accept: "*",
    filesLabel: "Specs & Files",
    submitLabel: "Attach a spec",
    uploadHint: "PRDs, mockups, or research",
  },
  Ledger: {
    accept: ".xls,.xlsx,.csv,.pdf",
    filesLabel: "Financials",
    submitLabel: "Attach a report",
    uploadHint: "Spreadsheets, statements, or forecasts",
  },
  Seal: {
    accept: ".pdf,.doc,.docx",
    filesLabel: "Documents",
    submitLabel: "Attach a document",
    uploadHint: "Contracts, filings, or agreements",
  },
  Herald: {
    accept: "image/*,video/*,.pdf",
    filesLabel: "Media",
    submitLabel: "Submit a creative",
    uploadHint: "Ads, graphics, video, or copy",
  },
};

export function ringProfile(domain: string): RingProfile {
  return PROFILES[domain] ?? DEFAULT;
}
