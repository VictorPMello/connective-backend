import type { FastifyInstance } from "fastify";
import { prisma } from "../../config/database";

import { PrismaClientRepository } from "./repositories/PrismaClientRepository";
import { ClientController } from "./controllers/ClientController";
import { CreateClientService } from "./services/CreateClientService";
import { GetClientService } from "./services/GetClientService";
import { UpdateClientService } from "./services/UpdateClientService";
import { DeleteClientService } from "./services/DeleteClientService";

import { authMiddleware } from "../../middlewares/authMiddleware";

export async function clientRoutes(app: FastifyInstance) {
  const clientRepository = new PrismaClientRepository(prisma);

  const createClientService = new CreateClientService(clientRepository);
  const getClientService = new GetClientService(clientRepository);
  const updateClientService = new UpdateClientService(clientRepository);
  const deleteClientService = new DeleteClientService(clientRepository);

  const clientController = new ClientController(
    createClientService,
    getClientService,
    updateClientService,
    deleteClientService,
  );

  app.post("/client", { preHandler: [authMiddleware] }, (request, reply) =>
    clientController.create(request, reply),
  );

  app.get("/client/:id", { preHandler: [authMiddleware] }, (request, reply) =>
    clientController.getById(request, reply),
  );

  app.get(
    "/clients/:accountId",
    { preHandler: [authMiddleware] },
    (request, reply) => clientController.getAllClients(request, reply),
  );

  app.put("/client/:id", { preHandler: [authMiddleware] }, (request, reply) =>
    clientController.update(request, reply),
  );

  app.delete(
    "/client/:id",
    { preHandler: [authMiddleware] },
    (request, reply) => clientController.delete(request, reply),
  );
}
