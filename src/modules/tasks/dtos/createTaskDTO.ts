import type { Priority, Status } from "./task.types.ts";

export interface CreateTaskDTO {
  projectId: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
}
