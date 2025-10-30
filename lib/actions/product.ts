// lib/actions/product.ts
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { getCurrentUser } from "../auth";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().nonnegative("Price must be non-negative"),
  quantity: z.coerce.number().int().min(0, "Quantity must be non-negative"),
  sku: z
    .string()
    .transform((val) => (val?.trim() === "" ? null : val?.trim()))
    .optional(),
  lowStockAt: z
    .coerce.number()
    .int()
    .min(0, "Low stock must be >= 0")
    .optional()
    .transform((val) => (Number.isNaN(val) ? null : val)),
});

export async function deleteProduct(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  const productId = String(formData.get("id") || "");

  await prisma.product.deleteMany({
    where: {
      id: productId,
      userId: user.id,
    },
  });

  revalidatePath("/inventory");
}

export async function createProduct(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  // 1. Validate incoming data
  const parsed = ProductSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    sku: formData.get("sku"),
    lowStockAt: formData.get("lowStockAt"),
  });

  if (!parsed.success) {
    console.error("Validation error:", parsed.error.flatten());
    return; // stop quietly instead of throwing 500
  }

  const { name, price, quantity, sku, lowStockAt } = parsed.data;

  // 2. Try creating the row in DB
  try {
    await prisma.product.create({
      data: {
        name,
        price,
        quantity,
        sku: sku ?? null,
        lowStockAt: lowStockAt ?? null,
        userId: user.id,
      },
    });
  } catch (err) {
    console.error("Create product failed (DB error):", err);
    // e.g. duplicate SKU unique constraint
    return;
  }

  // 3. Revalidate and redirect AFTER the try/catch
  //    (so redirect() is NOT inside the try)
  revalidatePath("/inventory");
  redirect("/inventory"); // this throws NEXT_REDIRECT on purpose
}

