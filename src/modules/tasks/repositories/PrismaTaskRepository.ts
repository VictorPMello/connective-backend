import { PrismaClient } from "@prisma/client";

import type {
  ITaskRepository,
  Task,
  CreateTaskData,
  UpdateTaskData,
} from "./ITaskRepository.ts";

export class PrismaTaskRepository implements ITaskRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: CreateTaskData): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
      },
    });

    return task;
  }

  async findById(id: string): Promise<Task | null> {
    const task = this.prisma.task.findUnique({ where: { id } });

    return task || null;
  }

  async findAll(projectId: string): Promise<Task[]> {
    const tasks = this.prisma.task.findMany({ where: { projectId } });
    return tasks;
  }

  async update(id: string, data: UpdateTaskData): Promise<Task> {
    const task = this.prisma.task.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return task;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }
}
