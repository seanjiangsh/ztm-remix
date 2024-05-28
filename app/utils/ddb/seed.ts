import { randomUUID } from "crypto";
import { ModelType } from "dynamoose/dist/General";
import { Item } from "dynamoose/dist/Item";

import { User, UserModel } from "./user/schema";
import {
  Recipe,
  RecipeModel,
  Ingredient,
  IngredientModel,
} from "./recipe/schema";
import {
  PantryShelf,
  PantryShelfModel,
  PantryItem,
  PantryItemModel,
} from "./pantry/schema";

const createTestUser = (): User => ({
  id: randomUUID(),
  email: "test@test.com",
  firstName: "Sean",
  lastName: "Jiang",
});

const getRecipes = (userId: string): Array<Recipe> => [
  {
    id: randomUUID(),
    userId,
    name: "Buttermilk Pancakes (demo)",
    lowercaseName: "buttermilk pancakes (demo)",
    instructions:
      "Whisk together salt, baking powder, baking soda, four and sugar. In a separate bowl, combine eggs and buttermilk and drizzle in butter. With wooden spoon, combine wet and dry ingredients until just moistened.",
    totalTime: "15 min",
    imageUrl: "https://via.placeholder.com/150?text=Remix+Recipes",
    mealPlanMultiplier: 0,
  },
  {
    id: randomUUID(),
    userId,
    name: "French Dip Sandwiches (demo)",
    lowercaseName: "french dip sandwiches (demo)",
    totalTime: "4-10 hrs (crockpot)",
    instructions:
      "Place roast in slow cooker and sprinkle onion soup mix over the roast. Add water and beef broth. Cook on high for 4-6 hours or low for 8-10. Serve on rolls with swiss cheese.",
    imageUrl: "https://via.placeholder.com/150?text=Remix+Recipes",
    mealPlanMultiplier: 0,
  },
  {
    id: randomUUID(),
    userId,
    name: "Shepherds Pie (demo)",
    lowercaseName: "shepherds pie (demo)",
    totalTime: "40 min",
    instructions:
      "Brown ground beef with onion. Add brown sugar, vinegar, tomato soup and mustard. Pour into baking dish and top with mashed potatoes. Sprinkle with grated cheese and bake at 350 for 30 minutes.",
    imageUrl: "https://via.placeholder.com/150?text=Remix+Recipes",
    mealPlanMultiplier: 0,
  },
  {
    id: randomUUID(),
    userId,
    name: "Chicken Alfredo (demo)",
    lowercaseName: "chicken alfredo (demo)",
    instructions:
      "Melt butter in large pan. Add garlic and cook for 30 seconds. Whisk in flour and stir for another 30 seconds. Add cream cheese and stir until it starts to melt down. Pour in cream and parmesan and whisk until cream cheese is incorporated. Once the sauce has thickened, season with salt and pepper.\n\nCut chicken into thin pieces. In a shallow dish combine flour, 1 tsp salt and 1 tsp pepper. In another dish beat eggs. In a third dish combine bread crumbs and parmesan. Working with one piece at a time, dredge in flour, then egg, then bread crumb/parmesan mixture. Cover and place in a baking dish and bake at 350 for 50-60 minutes.\n\n(Sausage can also be added to this alfredo for a variation)",
    totalTime: "30 min",
    imageUrl: "https://via.placeholder.com/150?text=Remix+Recipes",
    mealPlanMultiplier: 0,
  },
];
const getIngredients = (recipes: Array<Recipe>): Array<Ingredient> => [
  // Buttermilk Pancakes
  {
    id: randomUUID(),
    recipeId: recipes[0].id,
    name: "salt",
    amount: "1 tsp",
  },
  {
    id: randomUUID(),
    recipeId: recipes[0].id,
    name: "baking powder",
    amount: "2 tsp",
  },
  {
    id: randomUUID(),
    recipeId: recipes[0].id,
    name: "baking soda",
    amount: "1 tsp",
  },
  {
    id: randomUUID(),
    recipeId: recipes[0].id,
    name: "flour",
    amount: "2 cups",
  },
  {
    id: randomUUID(),
    recipeId: recipes[0].id,
    name: "sugar",
    amount: "2 tbsp",
  },
  {
    id: randomUUID(),
    recipeId: recipes[0].id,
    name: "eggs",
    amount: "2",
  },
  {
    id: randomUUID(),
    recipeId: recipes[0].id,
    name: "buttermilk",
    amount: "2 cups",
  },
  {
    id: randomUUID(),
    recipeId: recipes[0].id,
    name: "butter, melted",
    amount: "2 tbsp",
  },
  // French Dip Sandwiches
  {
    id: randomUUID(),
    recipeId: recipes[1].id,
    name: "beef roast",
    amount: "",
  },
  {
    id: randomUUID(),
    recipeId: recipes[1].id,
    name: "dry onion soup mix",
    amount: "1 pkg",
  },
  {
    id: randomUUID(),
    recipeId: recipes[1].id,
    name: "beef broth",
    amount: "2 cans",
  },
  {
    id: randomUUID(),
    recipeId: recipes[1].id,
    name: "water",
    amount: "2 cans",
  },
  {
    id: randomUUID(),
    recipeId: recipes[1].id,
    name: "sliced swiss cheese",
    amount: "",
  },
  {
    id: randomUUID(),
    recipeId: recipes[1].id,
    name: "hoagie buns",
    amount: "",
  },
  // Shepherds Pie
  {
    id: randomUUID(),
    recipeId: recipes[2].id,
    name: "chopped onion",
    amount: "1/4 cup",
  },
  {
    id: randomUUID(),
    recipeId: recipes[2].id,
    name: "ground beef",
    amount: "1 lb",
  },
  {
    id: randomUUID(),
    recipeId: recipes[2].id,
    name: "brown sugar",
    amount: "1/3 cup",
  },
  {
    id: randomUUID(),
    recipeId: recipes[2].id,
    name: "vinegar",
    amount: "1 tbsp",
  },
  {
    id: randomUUID(),
    recipeId: recipes[2].id,
    name: "tomato soup",
    amount: "1 can",
  },
  {
    id: randomUUID(),
    recipeId: recipes[2].id,
    name: "mustard",
    amount: "1 tsp",
  },
  {
    id: randomUUID(),
    recipeId: recipes[2].id,
    name: "mashed potatoes",
    amount: "",
  },
  {
    id: randomUUID(),
    recipeId: recipes[2].id,
    name: "grated cheese",
    amount: "",
  },
  // Chicken Alfredo
  {
    id: randomUUID(),
    recipeId: recipes[3].id,
    name: "butter",
    amount: "1 stick",
  },
  {
    id: randomUUID(),
    recipeId: recipes[3].id,
    name: "garlic cloves, minced",
    amount: "4",
  },
  {
    id: randomUUID(),
    recipeId: recipes[3].id,
    name: "flour",
    amount: "2 tbsp",
  },
  {
    id: randomUUID(),
    recipeId: recipes[3].id,
    name: "cream cheese",
    amount: "8 oz",
  },
  {
    id: randomUUID(),
    recipeId: recipes[3].id,
    name: "heavy cream",
    amount: "2 cups",
  },
  {
    id: randomUUID(),
    recipeId: recipes[3].id,
    name: "grated parmesan cheese",
    amount: "1 1/3 cup",
  },
  {
    id: randomUUID(),
    recipeId: recipes[3].id,
    name: "salt and pepper to taste",
    amount: "",
  },
  {
    id: randomUUID(),
    recipeId: recipes[3].id,
    name: "desired pasta",
    amount: "1 pkg",
  },
  {
    id: randomUUID(),
    recipeId: recipes[3].id,
    name: "chicken breasts",
    amount: "2-3",
  },
  {
    id: randomUUID(),
    recipeId: recipes[3].id,
    name: "flour",
    amount: "1 cup",
  },
  {
    id: randomUUID(),
    recipeId: recipes[3].id,
    name: "eggs",
    amount: "3",
  },
  {
    id: randomUUID(),
    recipeId: recipes[3].id,
    name: "bread crumbs",
    amount: "1 1/2 cup",
  },
  {
    id: randomUUID(),
    recipeId: recipes[3].id,
    name: "parmesan cheese",
    amount: "1 1/2 cup",
  },
];

const getPantryShelves = (userId: string): Array<PantryShelf> => [
  {
    id: randomUUID(),
    userId,
    name: "Dairy (demo)",
    lowercaseName: "dairy (demo)",
  },
  {
    id: randomUUID(),
    userId,
    name: "Fruits (demo)",
    lowercaseName: "fruits (demo)",
  },
  {
    id: randomUUID(),
    userId,
    name: "Meat (demo)",
    lowercaseName: "meat (demo)",
  },
];
const getPantryItems = (shelves: Array<PantryShelf>): Array<PantryItem> => [
  {
    id: randomUUID(),
    name: "Milk",
    shelfId: shelves[0].id,
    userId: shelves[0].userId,
  },
  {
    id: randomUUID(),
    name: "Eggs",
    shelfId: shelves[0].id,
    userId: shelves[0].userId,
  },
  {
    id: randomUUID(),
    name: "Cheese",
    shelfId: shelves[0].id,
    userId: shelves[0].userId,
  },
  {
    id: randomUUID(),
    name: "Apples",
    shelfId: shelves[1].id,
    userId: shelves[1].userId,
  },
  {
    id: randomUUID(),
    name: "Bananas",
    shelfId: shelves[1].id,
    userId: shelves[1].userId,
  },
  {
    id: randomUUID(),
    name: "Oranges",
    shelfId: shelves[1].id,
    userId: shelves[1].userId,
  },
  {
    id: randomUUID(),
    name: "Chicken",
    shelfId: shelves[2].id,
    userId: shelves[2].userId,
  },
  {
    id: randomUUID(),
    name: "Beef",
    shelfId: shelves[2].id,
    userId: shelves[2].userId,
  },
];

const BATCH_LIMIT = 25;

const putData = async (model: ModelType<Item & any>, data: Array<any>) => {
  const groupedData = [];
  for (let i = 0; i < data.length; i += BATCH_LIMIT) {
    groupedData.push(data.slice(i, i + BATCH_LIMIT));
  }
  for (const data of groupedData) {
    await model.batchPut(data);
  }
};

const deleteData = async (model: ModelType<Item & { id: string }>) => {
  const data = await model.scan().all().exec();
  if (!data.length) return;
  const ids = data.map(({ id }) => id);
  const groupedIds = [];
  for (let i = 0; i < ids.length; i += BATCH_LIMIT) {
    groupedIds.push(ids.slice(i, i + BATCH_LIMIT));
  }
  for (const group of groupedIds) {
    await model.batchDelete(group);
  }
};

export const seedData = async (newUser?: User) => {
  // * users
  const user = newUser || createTestUser();
  await deleteData(UserModel);
  await putData(UserModel, [user]);
  // * recipes
  const recipes = getRecipes(user.id);
  await deleteData(RecipeModel);
  await putData(RecipeModel, recipes);
  // * ingredients
  const ingredients = getIngredients(recipes);
  await deleteData(IngredientModel);
  await putData(IngredientModel, ingredients);
  // * pantry shelves
  const shelves = getPantryShelves(user.id);
  await deleteData(PantryShelfModel);
  await putData(PantryShelfModel, shelves);
  // * pantry items
  const items = getPantryItems(shelves);
  await deleteData(PantryItemModel);
  await putData(PantryItemModel, items);

  console.log("Data seeded successfully");
};

seedData();
