export type Status = "TODO" | "DOING" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: string;
  title: string;
  projectId: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
}
