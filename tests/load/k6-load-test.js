// tests/load/k6-load-test.js
import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const errorRate = new Rate("errors");
const API_URL = __ENV.API_URL || "http://localhost:3333";
const ACCOUNT_ID = "4bcfd16c-05dd-4b8f-81c6-d4125b20eba5";
const PROJECT_ID = "8c4331b7-4bf0-433d-8510-cf3dcb5ae3c6";

// Configuração de carga
export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 50 },
    { duration: "30s", target: 100 },
    { duration: "1m", target: 50 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.05"],
    errors: ["rate<0.1"],
  },
};

export function setup() {
  // Fazer login e pegar token
  const loginRes = http.post(
    `${API_URL}/auth/login`,
    JSON.stringify({
      email: "teste@connective.com",
      password: "testedesenha12345",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );

  check(loginRes, { "login OK": (r) => r.status === 200 });

  const token = loginRes.cookies?.token?.[0]?.value;

  if (!token) {
    console.error("❌ Login falhou ou token não retornado.");
    console.log("Resposta do login:", loginRes.body);
    throw new Error("Falha ao obter token de autenticação");
  }

  return { token };
}

export default function (data) {
  const ip = `192.168.0.${__VU}`;

  const cookieHeader = {
    headers: {
      Cookie: `token=${data.token}`,
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
  };

  // 1️⃣ Listar projetos por conta
  let res = http.get(`${API_URL}/projects/${ACCOUNT_ID}`, cookieHeader);
  const okProjects = check(res, {
    "projetos listados (200)": (r) => r.status === 200,
  });
  errorRate.add(!okProjects);

  sleep(1);

  // 2️⃣ Criar novo projeto
  res = http.post(
    `${API_URL}/project`,
    JSON.stringify({
      title: `Projeto Load Test ${Date.now()}`,
      description: "Projeto criado durante teste de carga",
      accountId: ACCOUNT_ID,
    }),
    cookieHeader,
  );

  const okCreate = check(res, {
    "projeto criado (201)": (r) => r.status === 201,
  });
  errorRate.add(!okCreate);

  sleep(1);

  // 3️⃣ Listar tasks de um projeto
  res = http.get(`${API_URL}/project/tasks/${PROJECT_ID}`, cookieHeader);
  const okTasks = check(res, {
    "tasks listadas (200)": (r) => r.status === 200,
  });
  errorRate.add(!okTasks);

  sleep(2);
}

export function teardown() {
  console.log("✅ Teste de carga finalizado com sucesso.");
}
