import type { FastifyInstance } from "fastify";
import { prisma } from "../../config/database";

import { PrismaTaskRepository } from "./repositories/PrismaTaskRepository";
import { TaskController } from "./controllers/TaskController";
import { CreateTaskService } from "./services/CreateTaskService";
import { GetTaskService } from "./services/GetTaskService";
import { UpdateTaskService } from "./services/UpdateTaskService";
import { DeleteTaskService } from "./services/DeleteTaskService";
import { authMiddleware } from "../../middlewares/authMiddleware";

export async function taskRoutes(app: FastifyInstance) {
  const taskRepository = new PrismaTaskRepository(prisma);

  const createTaskService = new CreateTaskService(taskRepository);
  const getTaskService = new GetTaskService(taskRepository);
  const updateTaskService = new UpdateTaskService(taskRepository);
  const deleteTaskService = new DeleteTaskService(taskRepository);

  const taskController = new TaskController(
    createTaskService,
    getTaskService,
    updateTaskService,
    deleteTaskService,
  );

  app.post("/task", { preHandler: [authMiddleware] }, (request, reply) => {
    taskController.create(request, reply);
  });

  app.get("/task/:id", { preHandler: [authMiddleware] }, (request, reply) =>
    taskController.getById(request, reply),
  );

  app.get(
    "/project/tasks/:projectId",
    { preHandler: [authMiddleware] },
    (request, reply) => {
      taskController.getAllTasks(request, reply);
    },
  );

  app.put("/task/:id", { preHandler: [authMiddleware] }, (request, reply) =>
    taskController.update(request, reply),
  );

  app.delete("/task/:id", { preHandler: [authMiddleware] }, (request, reply) =>
    taskController.delete(request, reply),
  );
}
