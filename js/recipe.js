const recipeStatus = document.querySelector("#recipeStatus");
const recipeData = document.querySelector("#recipeData");

const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

async function loadRecipe() {
  if (!recipeId) {
    recipeStatus.textContent = "ID рецепта отсутствует...";
    return;
  }

  try {
    recipeStatus.textContent = "Загружаем данные...";

    const recipeUrl = `${API_URL}/recipes/${recipeId}`;
    const recipeResponse = await fetch(recipeUrl);
    if (!recipeResponse.ok) {
      throw new Error("Ошибка при загрузке данных...");
    }
    const recipeData = await recipeResponse.json();

    const userUrl = `${API_URL}/user/${recipeData.userId}`;
    const userResponse = await fetch(userUrl);
    if (!userResponse.ok) {
      throw new Error("Ошибка при загрузке данных...");
    }
    const userData = await userResponse.json();

    renderRecipe(recipeData, userData);

    recipeStatus.textContent = "";

    document.title = `${recipeData.name} | Recipe details`;
  } catch (error) {
    console.error(error);
    authtorDataStatus.textContent =
      "Упс.. не получилось загрузить данные рецепта...";
  }
}

function renderRecipe(recipe, author) {
  recipeData.replaceChildren();

  const recipeCard = document.createElement("div");
  const img = document.createElement("img");
  img.src = recipe.image;

  const name = document.createElement("h2");
  name.textContent = recipe.name;

  const recipeInfo = document.createElement("div");

  const prepTime = document.createElement("p");
  prepTime.textContent = `Время подготовки: ${recipe.prepTimeMinutes} мин.`;

  const cookTime = document.createElement("p");
  cookTime.textContent = `Время приготовления: ${recipe.cookTimeMinutes} мин.`;

  const servings = document.createElement("p");
  servings.textContent = `Кол-во порций: ${recipe.servings} мин.`;

  const calories = document.createElement("p");
  calories.textContent = `Калорийность: ${recipe.caloriesPerServing} ккал.`;

  const difficulty = document.createElement("p");
  difficulty.textContent = `Сложность: ${recipe.difficulty}`;

  const cuisine = document.createElement("p");
  cuisine.textContent = `Кухня: ${recipe.cuisine}`;

  const rating = document.createElement("p");
  rating.textContent = `Рейтинг: ${recipe.rating}`;

  const reviewCount = document.createElement("p");
  reviewCount.textContent = `Кол-во отзывов: ${recipe.reviewCount}`;

  const ingredientsBlock = document.createElement("ul");
  const ingredientsTitle = document.createElement("h3");
  ingredientsTitle.textContent = "Ингредиенты";
  ingredientsBlock.append(ingredientsTitle);
  recipe.ingredients.forEach((item) => {
    const ingredient = document.createElement("li"); //<li></li>
    ingredient.textContent = item;
    ingredientsBlock.append(ingredient);
  });

  const instructionsBlock = document.createElement("ol");
  const instructionsTitle = document.createElement("h3");
  instructionsTitle.textContent = "Инструкция к приготовлению";
  instructionsBlock.append(instructionsTitle);
  recipe.instructions.forEach((item) => {
    const instruction = document.createElement("li"); //<li></li>
    instruction.textContent = item;
    instructionsBlock.append(instruction);
  });

  const tagsBlock = document.createElement("div");
  recipe.tags.forEach((item) => {
    const tag = document.createElement("p");
    tag.textContent = item;
    tagsBlock.append(tag);
  });

  const mealTypeBlock = document.createElement("div");
  const typeTitle = document.createElement("h3");
  typeTitle.textContent = "Тип блюда";
  mealTypeBlock.append(typeTitle);
  recipe.mealType.forEach((item) => {
    const type = document.createElement("span");
    type.textContent = item;
    mealTypeBlock.append(type);
  });

  const authorBlock = document.createElement("a");
  if (author) {
    authorBlock.href = `user.html?id=${author.id}`;
    authorBlock.target = "_blank";
    authorBlock.textContent = `Автор: ${author.firstName} ${author.lastName}`;
  } else {
    authorBlock.textContent = "Автор не найден...";
  }
  recipeInfo.append(
    prepTime,
    cookTime,
    servings,
    calories,
    difficulty,
    cuisine,
    mealTypeBlock,
    rating,
    authorBlock,
    ingredientsBlock,
    instructionsBlock,
    tagsBlock,
    reviewCount,
  );

  const recipeLink = document.createElement("a");
  recipeLink.href = `recipe.html?id=${recipe.id}`;
  recipeLink.target = "_blank";
  recipeLink.textContent = "Подробнее";
  recipeCard.append(img, name, recipeInfo, recipeLink);

  recipeData.append(recipeCard);
}
loadRecipe();
