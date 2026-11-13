const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const filterSelect = document.querySelector("#filterSelect");

const queryStatus = document.querySelector("#queryStatus");
const recipesList = document.querySelector("#recipesList");
const pagination = document.querySelector("#pagination");

let recipes = [];
let users = [];

let currentPage = 1;
let querySearch = "";
let totalRecipes = 0;

async function loadData() {
  try {
    queryStatus.textContent = "Загружаем рецепты...";
    recipesList.replaceChildren();
    pagination.replaceChildren();

    // [1; 10] skip=0 page=1 -> [11; 20] skip=10 page=2 -> [21; 30] skip=20 page=3
    const skip = (currentPage - 1) * RECIPES_LIMIT;

    const recipesUrl = querySearch
      ? `${API_URL}/recipes/search?q=${querySearch}&limit=${RECIPES_LIMIT}&skip=${skip}`
      : `${API_URL}/recipes?limit=${RECIPES_LIMIT}&skip=${skip}`;

    const usersUrl = `${API_URL}/users?limit=0&select=id,firstName,lastName,image`;

    const [recipesResponse, usersResponse] = await Promise.all([
      fetch(recipesUrl),
      fetch(usersUrl),
    ]);

    if (!recipesResponse.ok || !usersResponse.ok) {
      throw new Error("Ошибка при загрузке данных...");
    }

    const recipesData = await recipesResponse.json();
    const usersData = await usersResponse.json();

    recipes = recipesData.recipes;
    users = usersData.users;
    totalRecipes = recipesData.total;

    renderRecipes();
  } catch (error) {
    console.error(error);
    queryStatus.textContent = "Упс.. что-то пошло не так...";
  }
}

function getRecipeAuthor(userId) {
  return users.find((user) => user.id === userId);
}

function createRecipeItem(recipe) {
  const recipeCard = document.createElement("div");
  const img = document.createElement("img");
  img.src = recipe.image;

  const name = document.createElement("h2");
  name.textContent = recipe.name;

  const recipeInfo = document.createElement("div");

  const cookTime = document.createElement("p");
  cookTime.textContent = `${recipe.cookTimeMinutes} мин.`;

  const calories = document.createElement("p");
  calories.textContent = `${recipe.caloriesPerServing} ккал.`;

  const difficulty = document.createElement("p");
  difficulty.textContent = recipe.difficulty;

  const cuisine = document.createElement("p");
  cuisine.textContent = recipe.cuisine;

  const rating = document.createElement("p");
  rating.textContent = recipe.rating;

  const authorBlock = document.createElement("a");
  const author = getRecipeAuthor(recipe.userId);
  if (author) {
    authorBlock.href = `user.html?id=${author.id}`;
    authorBlock.target = "_blank";
    authorBlock.textContent = `${author.firstName} ${author.lastName}`;
  } else {
    authorBlock.textContent = "Автор не найден...";
  }
  recipeInfo.append(
    cookTime,
    calories,
    difficulty,
    cuisine,
    rating,
    authorBlock,
  );

  const recipeLink = document.createElement("a");
  recipeLink.href = `recipe.html?id=${recipe.id}`;
  recipeLink.textContent = "Подробнее";

  recipeCard.append(img, name, recipeInfo, recipeLink);
  return recipeCard;
}

function renderPagination() {
  const totalPages = Math.ceil(totalRecipes / RECIPES_LIMIT); // 5.1 pages ~ 6

  if (totalPages <= 1) {
    return;
  }

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Назад";
  prevBtn.disabled = currentPage === 1;

  prevBtn.addEventListener("click", () => {
    currentPage--; // -1
    loadData();
  });
  pagination.append(prevBtn);

  for (let page = 1; page <= totalPages; page++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = page;
    pageBtn.disabled = page === currentPage;

    pageBtn.addEventListener("click", () => {
      currentPage = page;
      // current page = 1 -> click 5 -> current page = 5
      loadData();
    });
    pagination.append(pageBtn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Вперед";
  nextBtn.disabled = currentPage === totalPages;

  nextBtn.addEventListener("click", () => {
    currentPage++; // +1
    loadData();
  });
  pagination.append(nextBtn);
}

function renderRecipes() {
  recipesList.replaceChildren();
  pagination.replaceChildren();

  let visibleRecipies = recipes;

  if (visibleRecipies.length === 0) {
    queryStatus.textContent = "В данный момент рецепты отсутствуют...";
    return;
  }

  queryStatus.textContent = `Найдено ${visibleRecipies.length} рецептов...`;
  visibleRecipies.forEach((item) => {
    const recipeCard = createRecipeItem(item);
    recipesList.append(recipeCard);
  });
  renderPagination();
}

// Поиск рецептов
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  querySearch = searchInput.value.trim();
  currentPage = 1;
  loadData();
});

loadData();
