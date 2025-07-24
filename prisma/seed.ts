// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define a type for your raw produce data to ensure consistency
type RawProduceItem = {
  id?: string; // Optional, as it's default(cuid()) in schema
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  // New fields required by your Product model:
  inStock: boolean;
  unit: string;
};

const produceData: RawProduceItem[] = [
  {
    name: "Organic Spinach",
    imageUrl:
      "https://images.unsplash.com/photo-1596707328639-5095d2c2c019?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Freshly harvested, tender leaves. Ready for delivery tomorrow. Perfect for healthy family meals and restaurant bulk orders. Grown using strict organic farming methods. We use natural fertilizers and pest control to ensure our vegetables are healthy, safe, and free from synthetic chemicals.",
    price: 150,
    inStock: true, // Required
    unit: "bunch", // Required
  },
  {
    name: "Sweet Carrots",
    imageUrl:
      "https://images.unsplash.com/photo-1590747124376-b9ae1188151b?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Crunchy and naturally sweet. Harvested weekly. Great for juice bars, supermarkets, and everyday cooking. Our carrots are hand-picked at their peak ripeness for optimal flavor and texture.",
    price: 120,
    inStock: true,
    unit: "kg",
  },
  {
    name: "Ripe Tomatoes",
    imageUrl:
      "https://images.unsplash.com/photo-1629828552631-b66ed6d92631?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Juicy, rich red tomatoes. Available year-round. Essential for households and an excellent choice for retailers seeking consistent supply. Grown in nutrient-rich soil to ensure a vibrant color and robust flavor.",
    price: 200,
    inStock: true,
    unit: "kg",
  },
  {
    name: "Green Bell Peppers",
    imageUrl:
      "https://images.unsplash.com/photo-1590001090333-3d0d6110f0f4?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Crisp and flavorful. Ready for harvest every other day. Ideal for salads, stir-fries, and a staple for any fresh produce section. Our peppers are known for their sweet crunch and versatility in various cuisines.",
    price: 180,
    inStock: true,
    unit: "piece",
  },
  {
    name: "Organic Kale",
    imageUrl:
      "https://images.unsplash.com/photo-1629828552631-b66ed6d92631?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Nutrient-rich and fresh. Best ordered in advance for bulk supply. Popular with health-conscious consumers and specialty grocers. We ensure optimal growing conditions to maximize their nutritional value.",
    price: 100,
    inStock: true,
    unit: "bunch",
  },
  {
    // This item will NOT be seeded as we are taking only the first 5
    name: "Purple Cabbage",
    imageUrl:
      "https://images.unsplash.com/photo-1549487771-8840742129c5?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Vibrant and nutrient-dense. Available seasonally. Excellent for salads, slaws, and adding color to any dish. Our purple cabbage is prized for its beautiful color and crisp texture.",
    price: 90,
    inStock: true,
    unit: "piece",
  },
];

// Function to deeply clean strings in an object by removing NULL bytes (0x00)
function cleanObjectStrings<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => cleanObjectStrings(item)) as T;
  }

  const newObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = (obj as any)[key];
      if (typeof value === "string") {
        newObj[key] = value.replace(/\0/g, "");
      } else if (typeof value === "object") {
        newObj[key] = cleanObjectStrings(value);
      } else {
        newObj[key] = value;
      }
    }
  }
  return newObj as T;
}

async function main() {
  console.log(`Start seeding produce items...`);

  // --- Seed Categories First (if they don't exist) ---
  // You need a categoryId for each product. Let's create a default one.
  const defaultCategoryName = "Vegetables";
  let defaultCategory = await prisma.category.findUnique({
    where: { name: defaultCategoryName },
  });

  if (!defaultCategory) {
    defaultCategory = await prisma.category.create({
      data: { name: defaultCategoryName },
    });
    console.log(
      `Created default category: ${defaultCategory.name} (ID: ${defaultCategory.id})`
    );
  } else {
    console.log(
      `Using existing category: ${defaultCategory.name} (ID: ${defaultCategory.id})`
    );
  }

  const categoryId = defaultCategory.id;
  // --- End Category Seeding ---

  const itemsToSeed = produceData.slice(0, 5); // Take only the first 5 items

  for (const item of itemsToSeed) {
    const cleanedItemData = cleanObjectStrings(item);

    // Prepare data for Prisma's Product model
    const dataForPrisma = {
      name: cleanedItemData.name,
      description: cleanedItemData.description,
      price: cleanedItemData.price,
      image: cleanedItemData.imageUrl, // Map imageUrl from your data to 'image' in schema
      inStock: cleanedItemData.inStock, // Explicitly provide 'inStock'
      unit: cleanedItemData.unit, // Explicitly provide 'unit'
      categoryId: categoryId, // Link to the created/found category
    };

    try {
      // Use 'prisma.product' as per your schema model name
      const createdItem = await prisma.product.upsert({
        where: { name: dataForPrisma.name }, // `name` is @unique in your schema
        update: dataForPrisma,
        create: dataForPrisma,
      });
      console.log(
        `Upserted product: ${createdItem.name} (ID: ${createdItem.id})`
      );
    } catch (e) {
      console.error(`Error upserting ${item.name}:`, e);
      // It's helpful to log the data that caused the error for debugging
      console.error("Data that caused error:", dataForPrisma);
    }
  }
  console.log(`Seeding of produce items finished.`);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
