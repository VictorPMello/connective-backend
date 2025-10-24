import type { Task, Status, Priority } from "@prisma/client";

export type { Task, Status, Priority };

export interface CreateTaskData {
  title: string;
  description?: string;

  status: Status;
  priority: Priority;

  projectId: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;

  status?: Status;
  priority?: Priority;

  updatedAt: Date;
}

export interface ITaskRepository {
  create(data: CreateTaskData): Promise<Task>;

  findById(id: string): Promise<Task | null>;
  findAll(projectId: string): Promise<Task[]>;

  update(id: string, data: UpdateTaskData): Promise<Task>;

  delete(id: string): Promise<void>;
}
