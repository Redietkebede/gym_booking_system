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
    workoutIncludes: [
      "Movement prep and mobility warm-up",
      "Barbell technique and strength blocks",
      "Accessory strength finisher",
      "Coach-led cooldown and recovery notes",
    ],
    testimonials: [
      {
        name: "Leah K.",
        rating: 5,
        quote: "Every session feels measured and intentional. I finally track progress.",
      },
    ],
  },
  {
    name: "Athletic Conditioning",
    description: "Intervals, sleds, and core work for total engine building.",
    durationMinutes: 45,
    price: 2000,
    workoutIncludes: [
      "Dynamic warm-up and sprint prep",
      "Conditioning intervals tailored to your pace",
      "Core stability and breath work",
      "Post-session mobility reset",
    ],
    testimonials: [
      {
        name: "Darnell R.",
        rating: 5,
        quote: "The pacing is perfect. I leave exhausted but energized.",
      },
    ],
  },
  {
    name: "Mobility Reset",
    description: "Guided mobility flow to unlock hips, shoulders, and spine.",
    durationMinutes: 40,
    price: 1800,
    workoutIncludes: [
      "Breath-led mobility assessment",
      "Guided joint-by-joint flow",
      "Targeted release work",
      "Take-home mobility plan",
    ],
    testimonials: [
      {
        name: "Hana M.",
        rating: 5,
        quote: "My shoulders feel brand new after every reset session.",
      },
    ],
  },
  {
    name: "Power Circuit",
    description: "Kettlebell-driven circuit to boost power and endurance.",
    durationMinutes: 50,
    price: 2200,
    workoutIncludes: [
      "Explosive prep and primer sets",
      "Kettlebell power circuit",
      "Conditioning finisher",
      "Recovery and form feedback",
    ],
    testimonials: [
      {
        name: "Mateo V.",
        rating: 5,
        quote: "It’s the most efficient 50 minutes of training I’ve ever done.",
      },
      {
        name: "Zuri A.",
        rating: 5,
        quote: "The coaching cues keep me focused and confident.",
      },
    ],
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
