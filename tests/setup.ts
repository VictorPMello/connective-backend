import { beforeAll, afterAll } from "vitest";
import { prisma } from "../src/config/database.ts"; // ajuste conforme o caminho real

beforeAll(async () => {
  // qualquer configuração necessária antes dos testes
  await prisma.$connect();
});

afterAll(async () => {
  // fechar conexões, limpar dados, etc
  await prisma.$disconnect();
});
