export type IntegrationStatus = "Active" | "Disabled";

export interface Integration {
  id: string;
  companyId: string;
  name: string;
  apiKeyPrefix: string;
  status: IntegrationStatus;
  eventCount: number;
  lastEventAtUtc?: string | null;
  createdAtUtc: string;
}

export interface IntegrationCreated {
  integration: Integration;
  apiKey: string;
}
