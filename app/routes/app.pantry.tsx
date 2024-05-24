import { ActionFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { z } from "zod";

import {
  createNewShelf,
  deleteShelf,
  getAllShelves,
  getShelf,
  saveShelfName,
} from "~/models/pantry/shelf.server";
import {
  createPantryItem,
  deletePantryItem,
  getPantryItem,
} from "~/models/pantry/item.server";
import { FieldErrors, validateForm } from "~/utils/validation";
import { requireLoggedInUser } from "~/utils/auth/auth.server";

import SearchBar from "~/components/form/search-bar";
import CreateShelf from "~/components/shelf/create-shelf";
import Shelves from "~/components/shelf/shelves";

// * note: When Remix server recives a non-GET request
// * 1. Call the action function
// * 2. Call the loader function
// * 3. Send the HTML response

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireLoggedInUser(request); // * redirect to /login if user is not logged in

  const { id } = user;
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const shelves = await getAllShelves(id, query);
  return json({ shelves });
};

const saveShelfNameSchema = z.object({
  shelfId: z.string(),
  shelfName: z.string().min(1, "Shelf name is required"),
});

const deleteShelfSchema = z.object({ shelfId: z.string() });

const createShelfItemSchema = z.object({
  shelfId: z.string(),
  itemName: z.string().min(1, "Item name is required"),
});

const deleteShelfItemSchema = z.object({ itemId: z.string() });

const errorFn = (errors: FieldErrors) => json({ errors }, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const user = await requireLoggedInUser(request); // * redirect to /login if user is not logged in

  const { id } = user;
  const formData = await request.formData();
  const action = formData.get("_action") as string;

  switch (action) {
    case "createNewShelf": {
      return createNewShelf(id);
    }
    case "saveShelfName": {
      const successFn = async (args: z.infer<typeof saveShelfNameSchema>) => {
        const { shelfId, shelfName } = args;
        const shelf = await getShelf(shelfId);
        if (!shelf) {
          throw json({ message: "Shelf not found" }, { status: 404 });
        }
        if (shelf.userId !== id) {
          const message =
            "This shelf does not belong to you, you can't rename it.";
          throw json({ message }, { status: 401 });
        }
        return saveShelfName(shelfId, shelfName);
      };
      return validateForm(formData, saveShelfNameSchema, successFn, errorFn);
    }
    case "deleteShelf": {
      const successFn = async (args: z.infer<typeof deleteShelfSchema>) => {
        const { shelfId } = args;
        const shelf = await getShelf(shelfId);
        if (!shelf) {
          throw json({ message: "Shelf not found" }, { status: 404 });
        }
        if (shelf.userId !== id) {
          const message =
            "This shelf does not belong to you, you can't delete it.";
          throw json({ message }, { status: 401 });
        }
        return deleteShelf(shelfId);
      };
      return validateForm(formData, deleteShelfSchema, successFn, errorFn);
    }
    case "createPantryItem": {
      return validateForm(
        formData,
        createShelfItemSchema,
        ({ shelfId, itemName }) => createPantryItem(id, shelfId, itemName),
        errorFn
      );
    }
    case "deletePantryItem": {
      const successFn = async (args: z.infer<typeof deleteShelfItemSchema>) => {
        const { itemId } = args;
        const item = await getPantryItem(itemId);
        if (!item) {
          throw json({ message: "Shelf item not found" }, { status: 404 });
        }
        if (item.userId !== id) {
          const message =
            "This shelf item does not belong to you, you can't delete it.";
          throw json({ message }, { status: 401 });
        }
        return deletePantryItem(itemId);
      };
      return validateForm(formData, deleteShelfItemSchema, successFn, errorFn);
    }
    default: {
      return null;
    }
  }
};

export default function Pantry() {
  const { shelves } = useLoaderData<typeof loader>();

  return (
    <div>
      <SearchBar placeholder="Search Shelves..." className="md:w-80" />
      <CreateShelf />
      <Shelves shelves={shelves} />
    </div>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError();

  return isRouteErrorResponse(error) ? (
    <div className="bg-red-600 text-white rounded-md p-4">
      <h1 className="mb-2">
        {error.status} - {error.statusText}
      </h1>
      <p>{error.data.message}</p>
    </div>
  ) : (
    <div className="bg-red-600 text-white rounded-md p-4">
      <h1 className="mb-2">An unexpected error occurred.</h1>
    </div>
  );
};
