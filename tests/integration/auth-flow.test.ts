import { test, expect, beforeAll, afterAll } from "vitest";
import { build, cleanDatabase } from "../helper.ts";

describe("Fluxo Completo de Autenticação", () => {
  let app: any;

  beforeAll(async () => {
    app = await build();
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
    await app.close();
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  test("Fluxo completo: Registro → Login → Acesso → Logout", async () => {
    const uniqueEmail = `test${Date.now()}@example.com`;

    // 1. REGISTRO
    const registerResponse = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        email: uniqueEmail,
        password: "SecurePass123!@#",
        name: "Integration Test User",
        plan: "FREE",
        maxProjects: 3,
        maxClients: 10,
      },
    });

    expect(registerResponse.statusCode).toBe(201);
    const registerData = registerResponse.json();

    expect(registerData.data).toHaveProperty("id");
    expect(registerData.data.email).toBe(uniqueEmail);

    // 2. LOGIN
    const loginResponse = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email: uniqueEmail,
        password: "SecurePass123!@#",
      },
    });

    expect(loginResponse.statusCode).toBe(200);
    const loginData = loginResponse.json();
    expect(loginData).toHaveProperty("token");
    const token = loginData.token;

    // 3. ACESSAR ROTA PROTEGIDA
    const protectedResponse = await app.inject({
      method: "GET",
      url: `/account/${loginData.user.id}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(protectedResponse.statusCode).toBe(200);
    const accountData = protectedResponse.json();
    expect(accountData.data.email).toBe(uniqueEmail);

    // 4. CRIAR PROJETO (outra rota protegida)
    const projectResponse = await app.inject({
      method: "POST",
      url: "/project",
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        title: "Projeto de Teste",
        description: "Criado durante teste de integração",
        accountId: `${accountData.data.id}`,
      },
    });

    expect(projectResponse.statusCode).toBe(201);
    const project = projectResponse.json();
    expect(project.data.title).toBe("Projeto de Teste");

    // 5. LISTAR PROJETOS (deve aparecer o criado)
    const listResponse = await app.inject({
      method: "GET",
      url: `/projects/${accountData.data.id}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(listResponse.statusCode).toBe(200);
    const projects = listResponse.json();
    expect(projects.data.length).toBeGreaterThan(0);
    expect(projects.data.some((p: any) => p.id === project.data.id)).toBe(true);

    // 6. TENTAR ACESSAR SEM TOKEN (deve falhar)
    const unauthorizedResponse = await app.inject({
      method: "GET",
      url: `/projects/${accountData.data.id}`,
    });

    expect(unauthorizedResponse.statusCode).toBe(401);
  });

  test("Não deve permitir registro com email duplicado", async () => {
    const email = "duplicate@test.com";

    // Primeiro registro
    const first = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        email,
        password: "Test123!@#",
        name: "First User",
        maxClients: 10,
        maxProjects: 2,
        plan: "FREE",
      },
    });

    expect([201, 400]).toContain(first.statusCode);

    // Segundo registro (deve falhar)
    const second = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        email,
        password: "Test123!@#",
        name: "Second User",
        maxClients: 10,
        maxProjects: 2,
        plan: "FREE",
      },
    });

    expect(second.statusCode).toBe(400);
  });

  test("Deve validar senha fraca", async () => {
    const weakPasswords = [
      "123", // muito curta
      "password", // sem números/especiais
      "12345678", // só números
      "abcdefgh", // só letras
    ];

    for (const password of weakPasswords) {
      const response = await app.inject({
        method: "POST",
        url: "/auth/register",
        payload: {
          email: `test${Math.random()}@example.com`,
          password,
          name: "Test User",
        },
      });

      expect(response.statusCode).toBe(400);
    }
  });
});
