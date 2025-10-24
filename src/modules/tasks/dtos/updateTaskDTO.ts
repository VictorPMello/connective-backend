import type { Priority, Status } from "./task.types.ts";

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  updatedAt: Date;
}
