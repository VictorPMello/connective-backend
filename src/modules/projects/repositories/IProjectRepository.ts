import type { Project } from "@prisma/client";

export type { Project };

export interface CreateProjectData {
  title: string;
  description: string;
  accountId: string;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  updatedAt: Date;
}

export interface IProjectRepository {
  create(data: CreateProjectData): Promise<Project>;

  findById(id: string): Promise<Project | null>;

  update(id: string, data: UpdateProjectData): Promise<Project>;

  delete(id: string): Promise<void>;
}
