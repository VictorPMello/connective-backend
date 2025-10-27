import { prisma } from "../src/config/database.ts";
import { app } from "../src/server.ts";
import { PasswordHelper } from "../src/helpers/password.helper.ts";
import { env } from "../src/config/env.ts";
import jwt from "jsonwebtoken";

export async function build() {
  await app.ready();
  return app;
}

export async function cleanDatabase() {
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.account.deleteMany();
}

export async function seedTestData() {
  const hashedPassword = await PasswordHelper.hash("Test123!@#");

  // Criar usuários de teste
  const user1 = await prisma.account.create({
    data: {
      email: "user1@test.com",
      password: hashedPassword,
      name: "Test User 1",
    },
  });

  const user2 = await prisma.account.create({
    data: {
      email: "user2@test.com",
      password: hashedPassword,
      name: "Test User 2",
    },
  });

  // Criar cliente para user1
  const client = await prisma.client.create({
    data: {
      name: "Test Client",
      email: "client@test.com",
      accountId: user1.id,
      contactPerson: "teste",
      phone: "99999999999",
      manager: "Teste 2",

      status: "ACTIVE",
      category: "PREMIUM",

      hiringDate: new Date(),
    },
  });

  // Criar projeto para user1
  const project = await prisma.project.create({
    data: {
      title: "Test Project",
      description: "Test Description",
      accountId: user1.id,
    },
  });

  // Criar task para user1
  const task = await prisma.task.create({
    data: {
      title: "Test Task",
      description: "Test Description",
      projectId: project.id,
    },
  });

  return { user1, user2, client, project, task };
}

export async function generateTestToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: "1d",
  });
}
