import { test, expect, beforeAll, afterAll, describe } from "vitest";
import { build, cleanDatabase, seedTestData } from "../helper.ts";

import { prisma } from "../../src/config/database.ts";

describe("Testes de Proteção contra Brute Force (Fastify - app.inject)", () => {
  let app: any;

  beforeAll(async () => {
    app = await build();
    await cleanDatabase();
    await seedTestData();
  });

  afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
    await app.close();
  });

  test("Deve bloquear múltiplas tentativas de login falhas", async () => {
    const attempts = 11;
    let blockedCount = 0;

    for (let i = 0; i < attempts; i++) {
      const res = await app.inject({
        method: "POST",
        url: "/auth/login",
        headers: {
          "content-type": "application/json",
        },
        payload: {
          email: "user1@test.com",
          password: "WrongPassword123!",
        },
      });

      if (res.statusCode === 429) {
        blockedCount++;
        console.log(`✅ Bloqueado na tentativa ${i + 1}`);
      }
    }

    console.log(`Total bloqueado: ${blockedCount}`);
    expect(blockedCount).toBeGreaterThan(0);
  });

  test("Deve ter rate limiting em endpoints críticos (register)", async () => {
    // 50 requisições rápidas paralelas para /auth/register
    const promises = Array.from({ length: 50 }).map(() =>
      app.inject({
        method: "POST",
        url: "/auth/register",
        headers: {
          "x-forwarded-for": "192.168.1.100", // 👈 Mesmo IP para todas
          "content-type": "application/json",
        },
        payload: {
          email: `test${Math.random().toString(36).slice(2, 9)}@example.com`,
          password: "Test123!@#",
          name: "Test User",
        },
      }),
    );

    const responses = await Promise.all(promises);
    const rateLimited = responses.filter((r) => r.statusCode === 429);

    console.log(`Total de requisições: ${responses.length}`);
    console.log(`Total bloqueado: ${rateLimited.length}`);
    console.log(
      `Status codes:`,
      responses.map((r) => r.statusCode),
    );

    // Deve ter limitado pelo menos algumas requisições
    expect(rateLimited.length).toBeGreaterThan(0);
  });

  test("Deve ter tempos similares para emails existentes/inexistentes (prevenir user enumeration)", async () => {
    // Faz duas tentativas (uma com email existente e outra com não-existente)
    const startExisting = Date.now();
    const resExisting = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "user1@test.com", password: "wrong-password" },
    });
    const timeExisting = Date.now() - startExisting;

    const startNonExisting = Date.now();
    const resNonExisting = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "nonexistent@example.com", password: "wrong-password" },
    });
    const timeNonExisting = Date.now() - startNonExisting;

    // As respostas devem ser de erro (não 200)
    expect(resExisting.statusCode).not.toBe(200);
    expect(resNonExisting.statusCode).not.toBe(200);

    // Diferença de tempo pequena para dificultar user enumeration (threshold = 200ms)
    const timeDiff = Math.abs(timeExisting - timeNonExisting);
    expect(timeDiff).toBeLessThan(200);
  });
});
