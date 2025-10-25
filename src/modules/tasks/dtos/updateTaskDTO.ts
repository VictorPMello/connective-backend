import type { Priority, Status } from "./task.types.ts";

export interface UpdateTaskDTO {
  title?: string | undefined;
  description?: string | undefined;
  status?: Status | undefined;
  priority?: Priority | undefined;
  updatedAt: Date;
}
