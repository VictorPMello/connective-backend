import type { FastifyInstance } from "fastify";
import { prisma } from "../../config/database.ts";

import { PrismaTaskRepository } from "./repositories/PrismaTaskRepository.ts";
import { TaskController } from "./controllers/TaskController.ts";
import { CreateTaskService } from "./services/CreateTaskService.ts";
import { GetTaskService } from "./services/GetTaskService.ts";
import { UpdateTaskService } from "./services/UpdateTaskService.ts";
import { DeleteTaskService } from "./services/DeleteTaskService.ts";

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

  app.post("/task", (request, reply) => {
    taskController.create(request, reply);
  });

  app.get("/task/:id", (request, reply) =>
    taskController.getById(request, reply),
  );

  app.get("/project/tasks/:projectId", (request, reply) => {
    taskController.getAllTasks(request, reply);
  });

  app.put("/task/:id", (request, reply) =>
    taskController.update(request, reply),
  );

  app.delete("/task/:id", (request, reply) =>
    taskController.delete(request, reply),
  );
}
