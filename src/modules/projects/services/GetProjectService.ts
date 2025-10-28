import type { Project } from "../dtos/project.types.ts";
import type { IProjectRepository } from "../repositories/IProjectRepository.ts";

export class GetProjectService {
  private projectRepository: IProjectRepository;
  constructor(projectRepository: IProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async getProjectById(id: string): Promise<Project | null> {
    const project = await this.projectRepository.findById(id);
    return project;
  }

  async getAllProjects(accountId: string): Promise<Project[]> {
    const projects = await this.projectRepository.findAll(accountId);
    return projects;
  }
}
