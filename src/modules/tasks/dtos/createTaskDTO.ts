import type { Priority, Status } from "./task.types";

export interface CreateTaskDTO {
  projectId: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
}
