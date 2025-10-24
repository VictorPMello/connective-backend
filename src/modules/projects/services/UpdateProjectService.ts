import type { Project } from "../dtos/project.types.ts";
import type { UpdateProjectDTO } from "../dtos/updateProjectDTO.ts";
import type { IProjectRepository } from "../repositories/IProjectRepository.ts";

export class UpdateProjectService {
  private projectRepository: IProjectRepository;
  constructor(projectRepository: IProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async updateProject(id: string, data: UpdateProjectDTO): Promise<Project> {
    const project = await this.projectRepository.update(id, data);
    return project;
  }
}
