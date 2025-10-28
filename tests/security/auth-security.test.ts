import { test, expect, beforeAll, afterAll, describe } from "vitest";
import {
  build,
  cleanDatabase,
  seedTestData,
  generateTestToken,
} from "../helper.ts";

import { prisma } from "../../src/config/database.ts";

describe("Testes de Segurança de Autenticação", () => {
  let app: any;
  let tokenUser1: string;
  let tokenUser2: string;
  let projectId: string;
  let taskId: string;
  let clientId: string;
  let userId: string;

  beforeAll(async () => {
    app = await build();
    await cleanDatabase();

    const { user1, user2, project, task, client } = await seedTestData();

    tokenUser1 = await generateTestToken(user1.id);
    tokenUser2 = await generateTestToken(user2.id);
    projectId = project.id;
    taskId = task.id;
    clientId = client.id;
    userId = user1.id;
  });

  afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
    await app.close();
  });

  // ----------------------
  //  TESTES
  // ----------------------

  test("Deve bloquear acesso sem token", async () => {
    const protectedEndpoints = [
      `/project/${projectId}`,
      `/task/${taskId}`,
      `/client/${clientId}`,
      `/account/${userId}`,
    ];

    for (const endpoint of protectedEndpoints) {
      const response = await app.inject({
        method: "GET",
        url: endpoint,
      });

      expect(response.statusCode).toBe(401);
    }
  });

  test("Deve rejeitar tokens inválidos", async () => {
    const invalidTokens = [
      "Bearer invalid-token",
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid",
      "Bearer " + "a".repeat(500), // token muito longo
      "InvalidFormat",
      "Bearer ",
    ];

    for (const token of invalidTokens) {
      const response = await app.inject({
        method: "GET",
        url: `/project/${projectId}`,
        headers: { authorization: token },
      });

      expect(response.statusCode).toBe(401);
    }
  });

  test("Não deve permitir acesso a recursos de outros usuários", async () => {
    // User 1 cria projeto (já criado via seed)
    // User 2 tenta acessar
    const unauthorizedAccess = await app.inject({
      method: "GET",
      url: `/projects/${projectId}`,
      headers: { authorization: `Bearer ${tokenUser2}` },
    });

    expect([403, 404]).toContain(unauthorizedAccess.statusCode);
  });

  test("Token expirado deve ser rejeitado", async () => {
    // Token expirado hardcoded (exp = 2021)
    const expiredToken =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoxNjA5NDU5MjAwfQ.4Adcj0vTH1Yq_4PBNZcRNfUXvYBz0S-0rz5qY3-6qE0";

    const response = await app.inject({
      method: "GET",
      url: `/project/${projectId}`,
      headers: { authorization: expiredToken },
    });

    expect(response.statusCode).toBe(401);
  });
});
