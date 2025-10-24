import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { CreateTaskService } from "../services/CreateTaskService.ts";
import type { GetTaskService } from "../services/GetTaskService.ts";
import type { UpdateTaskService } from "../services/UpdateTaskService.ts";
import type { DeleteTaskService } from "../services/DeleteTaskService.ts";

export class TaskController {
  private createTaskService: CreateTaskService;
  private getTaskService: GetTaskService;
  private updateTaskService: UpdateTaskService;
  private deleteTaskService: DeleteTaskService;

  constructor(
    createTaskService: CreateTaskService,
    getTaskService: GetTaskService,
    updateTaskService: UpdateTaskService,
    deleteTaskService: DeleteTaskService,
  ) {
    this.createTaskService = createTaskService;
    this.getTaskService = getTaskService;
    this.updateTaskService = updateTaskService;
    this.deleteTaskService = deleteTaskService;
  }

  // CREATE

  async create(request: FastifyRequest, reply: FastifyReply) {
    const createTaskSchema = z.object({
      title: z.string().min(5),
      description: z.string(),
      status: z.enum(["TODO", "DOING", "DONE"]),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
      projectId: z.string(),
    });

    const data = createTaskSchema.parse(request.body);
    const newTask = await this.createTaskService.createTask(data);

    return reply.status(201).send({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  }

  // GET

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);

    const task = await this.getTaskService.getTaskById(id);

    if (!task) {
      return reply.status(404).send({
        success: false,
        message: "Account not found",
      });
    }

    return reply.status(200).send({
      success: true,
      data: task,
    });
  }

  async getAllTasks(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ projectId: z.string().uuid() });
    const { projectId } = paramsSchema.parse(request.params);

    const tasks = await this.getTaskService.getAllTasks(projectId);

    return reply.status(200).send({
      success: true,
      data: tasks,
    });
  }

  // UPDATE

  async update(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);

    const updateTaskSchema = z.object({
      title: z.string().min(3),
      description: z.string(),
      status: z.enum(["TODO", "DOING", "DONE"]),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    });

    const data = updateTaskSchema.parse(request.body);

    const task = await this.updateTaskService.updateTask(id, {
      ...data,
      updatedAt: new Date(),
    });

    return reply.status(200).send({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  }

  // DELETE

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });

    const { id } = paramsSchema.parse(request.params);
    await this.deleteTaskService.deleteTask(id);

    return reply.status(200).send({
      success: true,
      message: "Task deleted successfully",
    });
  }
}
