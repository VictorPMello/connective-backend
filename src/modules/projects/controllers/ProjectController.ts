import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { CreateProjectService } from "../services/CreateProjectService.ts";
import { GetProjectService } from "../services/GetProjectService.ts";
import { UpdateProjectService } from "../services/UpdateProjectService.ts";
import { DeleteProjectService } from "../services/DeleteProjectService.ts";

export class ProjectController {
  private createProjectService: CreateProjectService;
  private getProjectService: GetProjectService;
  private updateProjectService: UpdateProjectService;
  private deleteProjectService: DeleteProjectService;

  constructor(
    createProjectService: CreateProjectService,
    getProjectService: GetProjectService,
    updateProjectService: UpdateProjectService,
    deleteProjectService: DeleteProjectService,
  ) {
    this.createProjectService = createProjectService;
    this.getProjectService = getProjectService;
    this.updateProjectService = updateProjectService;
    this.deleteProjectService = deleteProjectService;
  }

  // CREATE

  async create(request: FastifyRequest, reply: FastifyReply) {
    const createProjectSchema = z.object({
      title: z.string(),
      description: z.string(),
      accountId: z.string(),
    });

    const data = createProjectSchema.parse(request.body);
    const newProject = await this.createProjectService.createProject(data);

    return reply.status(201).send({
      success: true,
      message: "Project created successfully",
      data: newProject,
    });
  }

  // GET

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);

    const project = await this.getProjectService.getProjectById(id);

    if (!project) {
      return reply.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    return reply.status(200).send({
      success: true,
      data: project,
    });
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ accountId: z.string().uuid() });
    const { accountId } = paramsSchema.parse(request.params);

    const projects = await this.getProjectService.getAllProjects(accountId);

    if (projects.length === 0)
      return reply.status(404).send({
        success: false,
        message: "Projects not found",
      });

    return reply.status(200).send({
      success: true,
      data: projects,
    });
  }

  // UPDATE

  async update(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);

    const updateProjectSchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    });

    const data = updateProjectSchema.parse(request.body);

    const project = await this.updateProjectService.updateProject(id, {
      ...data,
      updatedAt: new Date(),
    });

    return reply.status(200).send({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  }

  // DELETE

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);

    await this.deleteProjectService.deleteProject(id);

    return reply.status(200).send({
      success: true,
      message: "Project deleted successfully",
    });
  }
}
