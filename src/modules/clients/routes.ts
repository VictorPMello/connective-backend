import type { FastifyInstance } from "fastify";
import { prisma } from "../../config/database.ts";

import { PrismaClientRepository } from "./repositories/PrismaClientRepository.ts";
import { ClientController } from "./controllers/ClientController.ts";
import { CreateClientService } from "./services/CreateClientService.ts";
import { GetClientService } from "./services/GetClientService.ts";
import { UpdateClientService } from "./services/UpdateClientService.ts";
import { DeleteClientService } from "./services/DeleteClientService.ts";

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

  app.post("/client", (request, reply) =>
    clientController.create(request, reply),
  );

  app.get("/client/:id", (request, reply) =>
    clientController.getById(request, reply),
  );

  app.get("/clients/:accountId", (request, reply) =>
    clientController.getAllClients(request, reply),
  );

  app.put("/client/:id", (request, reply) =>
    clientController.update(request, reply),
  );

  app.delete("/client/:id", (request, reply) =>
    clientController.delete(request, reply),
  );
}
