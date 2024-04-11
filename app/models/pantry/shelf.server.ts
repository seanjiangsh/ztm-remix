import { json } from "@remix-run/node";
import { Prisma } from "@prisma/client";

import db from "~/utils/prisma/server";
import { handleDelete } from "./utils";

export const getShelf = (shelfId: string) =>
  db.pantryShelf.findUnique({ where: { id: shelfId } });

export const getAllShelves = (userId: string, query: string | null) =>
  db.pantryShelf.findMany({
    where: {
      userId,
      name: { contains: query ?? "", mode: "insensitive" },
    },
    include: { items: { orderBy: { name: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

export const createShelf = (userId: string) =>
  db.pantryShelf.create({ data: { userId, name: "New Shelf" } });

export const deleteShelf = (id: string) =>
  handleDelete(() => db.pantryShelf.delete({ where: { id } }));

export const saveShelfName = async (id: string, name: string) => {
  try {
    const updated = await db.pantryShelf.update({
      where: { id },
      data: { name },
    });
    return updated;
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return json({ error: "Shelf not found" }, { status: 404 });
      }
    }
    throw err;
  }
};
