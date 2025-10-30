import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
const demoUserId="9204caa9-c2a2-494f-8053-5ce9fd720205";

await prisma.product.createMany({
    data: Array.from({ length: 25 }).map((_, i) => ({
        userId: demoUserId,
        name: `Product ${i + 1}`,
        price: Math.floor(Math.random() * 20),
        quantity: Math.floor(Math.random() * 20),
        lowStockAt: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i * 5)),
    })),
});
console.log("Seeding completed.");
console.log(`created 25 products userid: ${demoUserId}`);

}
main()
.catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});

