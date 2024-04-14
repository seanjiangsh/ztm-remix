import {
  ActionFunction,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { z } from "zod";

import {
  createIngredient,
  deleteIngredient,
  deleteRecipe,
  getRecipe,
  getRecipeWithIngredients,
  saveRecipe,
} from "~/models/recipes/recipes.server";
import { FieldErrors, validateForm } from "~/utils/prisma/validation";
import { requireLoggedInUser } from "~/utils/auth/auth.server";

import RecipeName from "~/components/recipes/recipe-detail/recipe-name";
import RecipeTime from "~/components/recipes/recipe-detail/recipe-time";
import IngredientsDetail from "~/components/recipes/recipe-detail/ingredients-detail";
import Instructions from "~/components/recipes/recipe-detail/instructions";
import RecipeFooter from "~/components/recipes/recipe-detail/recipe-footer";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await requireLoggedInUser(request);
  const recipeId = params.recipeId || "";
  const recipe = await getRecipeWithIngredients(recipeId);
  const headers = { "Cache-Control": "max-age=10" };
  if (!recipe) {
    throw json({ message: "Recipe not found" }, { status: 404 });
  }
  if (recipe.userId !== user.id) {
    const message = "You are not authorized to view this recipe";
    throw json({ message }, { status: 401 });
  }
  return json({ recipe }, { headers });
};

const saveRecipeSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    totalTime: z.string().min(1, "Total time is required"),
    instructions: z.string().min(1, "Instructions is required"),
    ingredientIds: z
      .array(z.string().min(1, "Ingredient ID is missing"))
      .optional(),
    ingredientNames: z
      .array(z.string().min(1, "Ingredient name is required"))
      .optional(),
    ingredientAmounts: z.array(z.string().nullable()).optional(),
  })
  .refine(
    (data) => {
      const { ingredientIds, ingredientNames, ingredientAmounts } = data;
      return (
        ingredientIds?.length === ingredientNames?.length &&
        ingredientIds?.length === ingredientAmounts?.length
      );
    },
    { message: "Ingredient arrays must all be the same length" }
  );
const createIngredientSchema = z.object({
  newIngredientName: z.string().min(1, "Ingredient name is required"),
  newIngredientAmount: z.string().nullable(),
});

const errorFn = (errors: FieldErrors) => json({ errors }, { status: 400 });

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireLoggedInUser(request);
  const recipeId = params.recipeId as string; // * from the route
  const recipe = await getRecipe(recipeId);
  if (!recipe) {
    throw json({ message: "Recipe not found" }, { status: 404 });
  }
  if (recipe.userId !== user.id) {
    const message = "You are not authorized to make changes this recipe";
    throw json({ message }, { status: 401 });
  }

  const formData = await request.formData();
  const action = formData.get("_action") as string;

  if (typeof action === "string" && action.startsWith("deleteIngredient")) {
    const [, ingredientId] = action.split(".");
    return deleteIngredient(ingredientId);
  }

  switch (action) {
    case "saveRecipe": {
      return validateForm(
        formData,
        saveRecipeSchema,
        (data) => saveRecipe(recipeId, data),
        errorFn
      );
    }
    case "createIngredient": {
      return validateForm(
        formData,
        createIngredientSchema,
        (data) => createIngredient(recipeId, data),
        errorFn
      );
    }
    case "deleteRecipe": {
      await deleteRecipe(recipeId);
      return redirect("/app/recipes");
    }
    default: {
      return null;
    }
  }
};

export default function RecipeDetail() {
  const { recipe } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  if (!recipe) return null;

  const { id, name, totalTime, ingredients, instructions } = recipe;
  const { errors } = actionData || {};

  return (
    <Form method="post">
      <RecipeName id={id} name={name} errors={errors} />
      <RecipeTime totalTime={totalTime} id={id} errors={errors} />
      <IngredientsDetail ingredients={ingredients} errors={errors} />
      <Instructions id={id} instructions={instructions} errors={errors} />
      <RecipeFooter />
    </Form>
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
