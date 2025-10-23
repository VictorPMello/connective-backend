import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  const account = await prisma.account.create({
    data: {
      name: "Conta Principal",
      email: "teste@connective.com",
      password: "$2a$10$xQZ.vQZ.vQZ.vQZ.vQZ.vQZ.vQZ.vQZ.vQZ.vQZ.vQ", // hash fake
      plan: "PROFESSIONAL",
      maxProjects: 10,
      maxClients: 50,
    },
  });

  console.log("✅ Conta criada:");

  const project1 = await prisma.project.create({
    data: {
      accountId: account.id,
      title: "Sistema CRM Connective",
      description: "Desenvolvimento do sistema de gestão de clientes",
    },
  });

  const project2 = await prisma.project.create({
    data: {
      accountId: account.id,
      title: "Marketing Digital",
      description: "Campanhas de marketing para novos clientes",
    },
  });

  console.log("✅ Projetos criados");

  await prisma.task.createMany({
    data: [
      {
        projectId: project1.id,
        title: "Configurar banco de dados",
        description: "Setup inicial do Prisma e PostgreSQL",
        status: "DONE",
        priority: "HIGH",
      },
      {
        projectId: project1.id,
        title: "Criar endpoints REST",
        description: "Desenvolver API REST para o CRM",
        status: "DOING",
        priority: "HIGH",
      },
      {
        projectId: project1.id,
        title: "Implementar autenticação",
        description: "JWT e refresh tokens",
        status: "TODO",
        priority: "MEDIUM",
      },
      {
        projectId: project2.id,
        title: "Criar landing page",
        description: "Design e desenvolvimento da página inicial",
        status: "DOING",
        priority: "MEDIUM",
      },
      {
        projectId: project2.id,
        title: "Configurar Google Ads",
        description: "Setup de campanhas pagas",
        status: "TODO",
        priority: "LOW",
      },
    ],
  });

  console.log("✅ Tarefas criadas");

  await prisma.client.createMany({
    data: [
      {
        accountId: account.id,
        name: "Empresa ABC Ltda",
        contactPerson: "João Silva",
        email: "joao@empresaabc.com",
        phone: "71999999999",
        status: "ACTIVE",
        category: "PREMIUM",
        manager: "Maria Santos",
        hiringDate: new Date("2024-01-15"),
        cnpj: "12.345.678/0001-90",
        monthlyAmount: "R$ 2.500,00",
        address: {
          street: "Rua das Flores",
          number: "123",
          neighborhood: "Centro",
          city: "Feira de Santana",
          state: "BA",
          zipCode: "44000-000",
          country: "Brasil",
        },
        paymentMethod: "PIX",
        notes: "Cliente prioritário, sempre solicita relatórios mensais",
      },
      {
        accountId: account.id,
        name: "Tech Solutions LTDA",
        contactPerson: "Pedro Oliveira",
        email: "pedro@techsolutions.com",
        phone: "71988888888",
        status: "ACTIVE",
        category: "ENTERPRISE",
        manager: "Maria Santos",
        hiringDate: new Date("2023-06-20"),
        cnpj: "98.765.432/0001-10",
        monthlyAmount: "R$ 5.000,00",
        paymentMethod: "BOLETO",
        website: "https://techsolutions.com",
        notes: "Grande cliente, renovação do contrato em dezembro",
      },
      {
        accountId: account.id,
        name: "Startup XYZ",
        contactPerson: "Ana Costa",
        email: "ana@startupxyz.com",
        phone: "71977777777",
        secundaryEmail: "contato@startupxyz.com",
        status: "NEGOTIATION",
        category: "BASIC",
        manager: "Carlos Mendes",
        hiringDate: new Date("2025-10-01"),
        monthlyAmount: "R$ 800,00",
        paymentMethod: "CREDIT_CARD",
        linkedin: "https://linkedin.com/company/startupxyz",
      },
      {
        accountId: account.id,
        name: "Consultoria BR",
        contactPerson: "Roberto Lima",
        email: "roberto@consultoriabr.com",
        phone: "71966666666",
        status: "PROSPECTUS",
        category: "PREMIUM",
        manager: "Carlos Mendes",
        hiringDate: new Date("2025-11-01"),
        notes: "Em negociação, aguardando proposta comercial",
      },
      {
        accountId: account.id,
        name: "Comércio Local",
        contactPerson: "Fernanda Souza",
        email: "fernanda@comerciolocal.com",
        phone: "71955555555",
        status: "INACTIVE",
        category: "BASIC",
        manager: "Maria Santos",
        hiringDate: new Date("2023-03-10"),
        lastContact: new Date("2024-08-15"),
        notes: "Cliente inativo desde agosto, tentar reativar",
      },
    ],
  });

  console.log("✅ Clientes criados");

  console.log("🎉 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
