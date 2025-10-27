import { test, expect, beforeAll, afterAll } from "vitest";
import { build } from "../helper.ts";

describe("SQL Injection Tests", () => {
  let app: any;
  let authToken: string;

  beforeAll(async () => {
    app = await build();

    // Criar usuário de teste e pegar token
    const response = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email: "test@example.com",
        password: "Test123!@#",
      },
    });

    const data = response.json();
    authToken = data.token;
  });

  afterAll(async () => {
    await app.close();
  });

  test("Deve bloquear SQL injection básico no login", async () => {
    const maliciousPayloads = [
      "' OR '1'='1",
      "admin'--",
      "' OR 1=1--",
      "admin' OR '1'='1'/*",
      "'; DROP TABLE users;--",
    ];

    for (const payload of maliciousPayloads) {
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          email: payload,
          password: payload,
        },
      });

      // Não deve retornar 200 com payloads maliciosos
      expect(response.statusCode).not.toBe(200);
      expect(response.statusCode).toBeGreaterThanOrEqual(400);
    }
  });

  test("Deve bloquear SQL injection em params", async () => {
    const maliciousIds = [
      "1 OR 1=1",
      "1'; DROP TABLE projects;--",
      "1 UNION SELECT * FROM users--",
    ];

    for (const id of maliciousIds) {
      const response = await app.inject({
        method: "GET",
        url: `/projects/${encodeURIComponent(id)}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      // Deve retornar erro de validação ou não encontrado
      expect([400, 404]).toContain(response.statusCode);
    }
  });

  test("Deve escapar caracteres especiais em JSON body", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/projects",
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        name: "Projeto' OR '1'='1",
        description: "'; DROP TABLE tasks;--",
      },
    });

    // Se aceitar, deve salvar o texto literalmente (escaped)
    if (response.statusCode === 201) {
      const project = response.json();
      expect(project.name).toBe("Projeto' OR '1'='1");
    }
  });

  test("Deve bloquear queries maliciosas em search/filter", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/projects?search=" + encodeURIComponent("' OR 1=1--"),
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });

    // Deve retornar lista vazia ou erro de validação, nunca todos os dados
    expect([200, 404]).toContain(response.statusCode);

    if (response.statusCode === 200) {
      const data = response.json();
      // Não deve retornar dados sensíveis
      expect(data.length).toBeLessThan(100);
    }
  });
});
