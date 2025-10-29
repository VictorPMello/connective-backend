import type { Project } from "../dtos/project.types";
import type { CreateProjectDTO } from "../dtos/createProjectDTO";
import type { IProjectRepository } from "../repositories/IProjectRepository";

export class CreateProjectService {
  private projectRepository: IProjectRepository;
  constructor(projectRepository: IProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async createProject(data: CreateProjectDTO): Promise<Project> {
    const response = await this.projectRepository.create({
      title: data.title,
      description: data.description ?? "",
      accountId: data.accountId,
    });

    return response;
  }
}
