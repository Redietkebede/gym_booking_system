require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const sampleServices = [
  {
    name: "Strength Foundations",
    description: "Full-body barbell session focused on clean form and control.",
    durationMinutes: 60,
    price: 2500,
  },
  {
    name: "Athletic Conditioning",
    description: "Intervals, sleds, and core work for total engine building.",
    durationMinutes: 45,
    price: 2000,
  },
  {
    name: "Mobility Reset",
    description: "Guided mobility flow to unlock hips, shoulders, and spine.",
    durationMinutes: 40,
    price: 1800,
  },
  {
    name: "Power Circuit",
    description: "Kettlebell-driven circuit to boost power and endurance.",
    durationMinutes: 50,
    price: 2200,
  },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin123";
  const adminName = process.env.SEED_ADMIN_NAME || "Admin";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash,
      role: "ADMIN",
    },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });

  for (const service of sampleServices) {
    const existing = await prisma.service.findFirst({
      where: { name: service.name },
    });

    if (!existing) {
      await prisma.service.create({ data: service });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
