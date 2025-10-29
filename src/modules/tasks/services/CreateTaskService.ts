import type { Task } from "../dtos/task.types";
import type { CreateTaskDTO } from "../dtos/createTaskDTO";
import type { ITaskRepository } from "../repositories/ITaskRepository";

export class CreateTaskService {
  private taskRepository: ITaskRepository;
  constructor(taskRepository: ITaskRepository) {
    this.taskRepository = taskRepository;
  }

  async createTask(data: CreateTaskDTO): Promise<Task> {
    const response = await this.taskRepository.create({
      title: data.title,
      description: data.description ?? "",
      status: data.status,
      priority: data.priority,
      projectId: data.projectId,
    });
    return response;
  }
}
