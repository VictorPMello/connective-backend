import type { Task } from "../dtos/task.types.ts";
import type { ITaskRepository } from "../repositories/ITaskRepository.ts";

export class GetTaskService {
  private taskRepository: ITaskRepository;
  constructor(taskRepository: ITaskRepository) {
    this.taskRepository = taskRepository;
  }

  async getTaskById(id: string): Promise<Task | null> {
    const response = await this.taskRepository.findById(id);
    return response;
  }

  async getAllTasks(projectId: string): Promise<Task[]> {
    const response = await this.taskRepository.findAll(projectId);
    return response;
  }
}
