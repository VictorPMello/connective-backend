import type { Task } from "../dtos/task.types.ts";
import type { CreateTaskDTO } from "../dtos/createTaskDTO.ts";
import type { ITaskRepository } from "../repositories/ITaskRepository.ts";

export class CreateTaskService {
  private taskRepository: ITaskRepository;
  constructor(taskRepository: ITaskRepository) {
    this.taskRepository = taskRepository;
  }

  async CreateTask(data: CreateTaskDTO): Promise<Task> {
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
