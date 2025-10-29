import type { Task } from "../dtos/task.types";
import type { UpdateTaskDTO } from "../dtos/updateTaskDTO";
import type { ITaskRepository } from "../repositories/ITaskRepository";

export class UpdateTaskService {
  private taskRepository: ITaskRepository;
  constructor(taskRepository: ITaskRepository) {
    this.taskRepository = taskRepository;
  }

  async updateTask(id: string, data: UpdateTaskDTO): Promise<Task> {
    const taskExists = await this.taskRepository.findById(id);
    if (!taskExists) throw new Error("Task not Exists!");

    const response = await this.taskRepository.update(id, data);
    return response;
  }
}
