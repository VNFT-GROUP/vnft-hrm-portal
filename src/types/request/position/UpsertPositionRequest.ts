export interface UpsertPositionRequest {
  name: string;
  description?: string;
  active?: boolean;
  manager?: boolean;
}
