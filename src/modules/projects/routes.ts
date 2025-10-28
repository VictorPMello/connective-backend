import type { FastifyInstance } from "fastify";
import { prisma } from "../../config/database.ts";

import { PrismaProjectRepository } from "./repositories/PrismaProjectRepository.ts";
import { ProjectController } from "./controllers/ProjectController.ts";
import { CreateProjectService } from "./services/CreateProjectService.ts";
import { GetProjectService } from "./services/GetProjectService.ts";
import { UpdateProjectService } from "./services/UpdateProjectService.ts";
import { DeleteProjectService } from "./services/DeleteProjectService.ts";

import { authMiddleware } from "../../middlewares/authMiddleware.ts";

export async function projectRoutes(app: FastifyInstance) {
  const projectRepository = new PrismaProjectRepository(prisma);

  const createProjectService = new CreateProjectService(projectRepository);
  const getProjectService = new GetProjectService(projectRepository);
  const updateProjectService = new UpdateProjectService(projectRepository);
  const deleteProjectService = new DeleteProjectService(projectRepository);

  const projectController = new ProjectController(
    createProjectService,
    getProjectService,
    updateProjectService,
    deleteProjectService,
  );

  app.post("/project", { preHandler: [authMiddleware] }, (request, reply) =>
    projectController.create(request, reply),
  );

  app.get("/project/:id", { preHandler: [authMiddleware] }, (request, reply) =>
    projectController.getById(request, reply),
  );

  app.get(
    "/projects/:accountId",
    { preHandler: [authMiddleware] },
    (request, reply) => projectController.getAll(request, reply),
  );

  app.put("/project/:id", { preHandler: [authMiddleware] }, (request, reply) =>
    projectController.update(request, reply),
  );

  app.delete(
    "/project/:id",
    { preHandler: [authMiddleware] },
    (request, reply) => projectController.delete(request, reply),
  );
}
