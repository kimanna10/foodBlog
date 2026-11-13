const authtorDataStatus = document.querySelector("#authtorDataStatus");
const authorData = document.querySelector("#authorData");
const authorRecipe = document.querySelector("#authorRecipe");

// http://127.0.0.1:5500/user.html?id=166

const params = new URLSearchParams(window.location.search);
const userId = params.get("id"); // 166

async function loadUserProfile() {
  if (!userId) {
    authtorDataStatus.textContent = "ID автора отсутствует...";
    return;
  }

  try {
    authtorDataStatus.textContent = "Загружаем данные...";

    const userRecipeUrl = `${API_URL}/recipes?limit=0`;
    const userProfileUrl = `${API_URL}/users/${userId}`;

    const [recipesResponse, userResponse] = await Promise.all([
      fetch(userRecipeUrl),
      fetch(userProfileUrl),
    ]);

    if (!recipesResponse.ok || !userResponse.ok) {
      throw new Error("Ошибка при загрузке данных...");
    }

    const recipesData = await recipesResponse.json(); // все рецепты
    const userData = await userResponse.json();

    const userRecipes = recipesData.recipes.filter((item) => {
      return item.userId === userData.id;
    });

    renderUser(userData);
    renderUserRecipe(userRecipes);

    authtorDataStatus.textContent = "";

    document.title = `${userData.firstName} ${userData.lastName} | Author's recipes`;
  } catch (error) {
    console.error(error);
    authtorDataStatus.textContent =
      "Упс.. не получилось загрузить данные автора...";
  }
}

function renderUser(user) {
  authorData.replaceChildren();

  const profile = document.createElement("div");
  const avatar = document.createElement("img");
  avatar.src = user.image;

  const authorInfo = document.createElement("div");
  const name = document.createElement("h3");
  name.textContent = `${user.firstName} ${user.lastName}`;
  const username = document.createElement("p");
  username.textContent = `@${user.username}`;

  authorInfo.append(name, username);
  profile.append(avatar, authorInfo);

  authorData.append(profile);
}

function renderUserRecipe(recipes) {
  authorRecipe.replaceChildren();

  if (recipes.length === 0) {
    authorRecipe.textContent = "Рецепты отсутствуют...";
    return;
  }

  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    const img = document.createElement("img");
    img.src = recipe.image;

    const name = document.createElement("h2");
    name.textContent = recipe.name;

    const recipeInfo = document.createElement("div");

    const cookTime = document.createElement("p");
    cookTime.textContent = `${recipe.cookTimeMinutes} мин.`;

    const difficulty = document.createElement("p");
    difficulty.textContent = recipe.difficulty;

    const cuisine = document.createElement("p");
    cuisine.textContent = recipe.cuisine;

    recipeInfo.append(cookTime, difficulty, cuisine);

    const recipeLink = document.createElement("a");
    recipeLink.href = `recipe.html?id=${recipe.id}`;
    recipeLink.textContent = "Подробнее";

    recipeCard.append(img, name, recipeInfo, recipeLink);
    authorRecipe.append(recipeCard);
  });
}

loadUserProfile();
