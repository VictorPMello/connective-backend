import { PrismaClient } from "@prisma/client";

import type {
  Project,
  CreateProjectData,
  UpdateProjectData,
  IProjectRepository,
} from "./IProjectRepository";

export class PrismaProjectRepository implements IProjectRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: CreateProjectData): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        accountId: data.accountId,
      },
    });

    return project;
  }

  async findById(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({ where: { id } });
    return project;
  }

  async findAll(accountId: string): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: { accountId },
      include: { tasks: true },
    });
    return projects;
  }

  async update(id: string, data: UpdateProjectData): Promise<Project> {
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return project;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({ where: { id } });
  }
}
