import type { IProjectRepository } from "../repositories/IProjectRepository.ts";

export class DeleteProjectService {
  private projectRepository: IProjectRepository;
  constructor(projectRepository: IProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async deleteProject(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
