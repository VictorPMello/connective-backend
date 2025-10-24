import type { Priority, Status } from "./task.types.ts";

export interface CreateTaskDTO {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
}
