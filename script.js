//SELECTORS

//tabs
const searchTab = document.querySelector(".search-tab");
const savedTab = document.querySelector(".saved-tab");
const mealPlanTab = document.querySelector(".mealplan-tab");

//search container
const searchContainer = document.querySelector(".search-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const resultsContainer = document.getElementById("results-container");
const mealResultTitle = document.getElementById("results-title");
const resultsGrid = document.getElementById("resultsGrid");

//saved container
const savedContainer = document.querySelector(".saved-container");
const emptyStateTextSaved = document.getElementById("emptyStateTextSaved");
const savedGrid = document.getElementById("savedGrid");

//mealplan container
const mealplanContainer = document.querySelector(".mealplan-container");
const emptyStateTextMealplan = document.getElementById(
  "emptyStateTextMealplan"
);
const mealplanGrid = document.getElementById("mealplanGrid");
const totalMeals = document.querySelector(".total-meals");
const totalTime = document.querySelector(".total-time");
const totalServings = document.querySelector(".total-servings");
const ingredientsList = document.querySelector(".ingredientsList");
const ingredientShoppingList = document.getElementsByClassName(
  "ingredientShoppingList"
);

//recipe details modal
const modalBackground = document.getElementById("modal-background");
const recipeDetailsModal = document.getElementById("recipeDetails-modal");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const recipeTitle = document.querySelector(".recipe-title");
const addSaveButton = document.querySelector(".addSave-button");
const addMealPlanButton = document.querySelector(".addMealplan-button");
const plusSave = document.querySelector(".plusSave");
const checkSave = document.querySelector(".checkSave");
const plusMealplan = document.querySelector(".plusMealplan");
const checkMealplan = document.querySelector(".checkMealplan");
const recipeCategories = document.querySelector(".recipe-categories");
const recipeServings = document.querySelector(".recipe-servings");
const recipeMinutes = document.querySelector(".recipe-minutes");
const recipeIngredients = document.querySelector(".ingredient-list");
const recipeInstructions = document.querySelector(".instructions");
const recipeImage = document.querySelector(".recipe-img");

//arrays and objects
let savedRecipes = [];
let mealplanRecipes = [];
let readyInMinutesArray = [];
let servingsArray = [];

const apiKey = "d9f11cfd6a194b15946288c392907bb3";

//EVENTS
searchBtn.addEventListener("click", getSearchResults);
resultsGrid.addEventListener("click", getRecipeDetails);
savedGrid.addEventListener("click", getRecipeDetails);
mealplanGrid.addEventListener("click", getRecipeDetails);
recipeCloseBtn.addEventListener("click", closeMealDetails);
addSaveButton.addEventListener("click", saveRecipe);
addMealPlanButton.addEventListener("click", addMealplan);
searchTab.addEventListener("click", showSearchPage);
savedTab.addEventListener("click", showSavedRecipesPage);
mealPlanTab.addEventListener("click", showMealPlanPage);
searchInput.addEventListener("keypress", pressEnterToSearch);
document.addEventListener("DOMContentLoaded", getLocalSavedRecipes);
document.addEventListener("DOMContentLoaded", getLocalMealPlan);

//FUNCTIONS
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function pressEnterToSearch(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("search-btn").click();
  }
}

function closeMealDetails() {
  recipeDetailsModal.style.display = "none";
  modalBackground.style.display = "none";
  removeAllChildNodes(recipeCategories);
  removeAllChildNodes(recipeIngredients);
}

function showSearchPage() {
  searchContainer.style.display = "flex";
  savedContainer.style.display = "none";
  mealplanContainer.style.display = "none";
  searchTab.style.backgroundColor = "#49b22b";
  savedTab.style.backgroundColor = "#999999";
  mealPlanTab.style.backgroundColor = "#999999";

  savedTab.style.pointerEvents = "all";
  mealPlanTab.style.pointerEvents = "all";
}

function showSavedRecipesPage() {
  searchContainer.style.display = "none";
  savedContainer.style.display = "flex";
  mealplanContainer.style.display = "none";
  searchTab.style.backgroundColor = "#999999";
  savedTab.style.backgroundColor = "#49b22b";
  mealPlanTab.style.backgroundColor = "#999999";

  savedTab.style.pointerEvents = "none";
  mealPlanTab.style.pointerEvents = "all";
}

function showMealPlanPage() {
  searchContainer.style.display = "none";
  savedContainer.style.display = "none";
  mealplanContainer.style.display = "flex";
  searchTab.style.backgroundColor = "#999999";
  savedTab.style.backgroundColor = "#999999";
  mealPlanTab.style.backgroundColor = "#49b22b";

  savedTab.style.pointerEvents = "all";
  mealPlanTab.style.pointerEvents = "none";
}

async function getSearchResults() {
  resultsContainer.style.display = "flex";

  removeAllChildNodes(resultsGrid);

  let searchInputTxt = document.getElementById("search-input").value.trim();

  await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${searchInputTxt}&number=15`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.results) {
        data.results.forEach((meal) => {
          mealResultTitle.innerHTML = "Your Search Results:";

          const mealItemDiv = document.createElement("div");
          mealItemDiv.classList.add("meal-item");
          mealItemDiv.setAttribute("id", `${meal.id}`);
          resultsGrid.appendChild(mealItemDiv);

          const mealImgDiv = document.createElement("div");
          mealImgDiv.classList.add("meal-img");
          mealItemDiv.appendChild(mealImgDiv);
          const mealImg = document.createElement("img");
          mealImg.setAttribute("src", `${meal.image}`);
          mealImgDiv.appendChild(mealImg);

          const mealNameDiv = document.createElement("div");
          mealNameDiv.classList.add("meal-name");
          mealItemDiv.appendChild(mealNameDiv);
          const mealTitle = document.createElement("h4");
          mealTitle.innerHTML = meal.title;
          mealNameDiv.appendChild(mealTitle);

          const clickDiv = document.createElement("div");
          clickDiv.classList.add("clickDiv");
          mealItemDiv.appendChild(clickDiv);
        });

        if (data.results.length === 0) {
          mealResultTitle.innerHTML = "Sorry, there are no results.";
        }
      }
    })
    .catch((err) => console.log(err));
}

async function getRecipeDetails(e) {
  e.preventDefault();
  let targetParent = e.target.parentElement;
  if (targetParent.classList.contains("meal-item")) {
    let id = targetParent.getAttribute("id");

    await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}&includeNutrition=false`
    )
      .then((response) => {
        return response.json();
      })
      .then((recipeInfo) => {
        recipeDetailsModal.style.display = "flex";
        modalBackground.style.display = "flex";

        recipeImage.setAttribute("src", `${recipeInfo.image}`);

        recipeTitle.innerHTML = recipeInfo.title;
        recipeTitle.setAttribute("id", `${recipeInfo.id}`);

        recipeInfo.dishTypes.forEach((type) => {
          let tag = document.createElement("p");
          tag.classList.add("recipe-category");
          recipeCategories.appendChild(tag);
          tag.innerHTML = type;
        });

        recipeServings.innerHTML = recipeInfo.servings;
        recipeMinutes.innerHTML = recipeInfo.readyInMinutes + " minutes";

        recipeInfo.extendedIngredients.forEach((ingredient) => {
          let list = document.createElement("li");
          list.classList.add("ingredientsModal");
          list.innerHTML = ingredient.original;
          recipeIngredients.appendChild(list);
        });

        recipeInstructions.innerHTML = recipeInfo.instructions;

        let checkArray = savedRecipes.includes(`${recipeInfo.id}`);
        if (checkArray === false) {
          addSaveButton.classList.remove("saved");
          plusSave.style.display = "inline";
          checkSave.style.display = "none";
        } else if (checkArray === true) {
          addSaveButton.classList.add("saved");
          plusSave.style.display = "none";
          checkSave.style.display = "inline";
        }

        let checkArray2 = mealplanRecipes.includes(`${recipeInfo.id}`);
        if (checkArray2 === false) {
          addMealPlanButton.classList.remove("saved");
          plusMealplan.style.display = "inline";
          checkMealplan.style.display = "none";
        } else if (checkArray2 === true) {
          addMealPlanButton.classList.add("saved");
          plusMealplan.style.display = "none";
          checkMealplan.style.display = "inline";
        }
      })
      .catch((err) => console.log(err));
  }
}

function saveRecipe() {
  addSaveButton.classList.toggle("saved");

  if (addSaveButton.classList.contains("saved") === true) {
    plusSave.style.display = "none";
    checkSave.style.display = "inline";
    let saveID = recipeTitle.getAttribute("id");
    savedRecipes.push(saveID);
    saveLocalRecipe(saveID);
    let saveTitle = recipeTitle.textContent;
    let saveImg = recipeImage.getAttribute("src");

    savedRecipes = savedRecipes.sort(function (a, b) {
      return a - b;
    });

    const mealItemDiv = document.createElement("div");
    mealItemDiv.classList.add("meal-item");
    mealItemDiv.setAttribute("id", `${saveID}`);
    savedGrid.appendChild(mealItemDiv);

    const mealImgDiv = document.createElement("div");
    mealImgDiv.classList.add("meal-img");
    mealItemDiv.appendChild(mealImgDiv);
    const mealImg = document.createElement("img");
    mealImg.setAttribute("src", `${saveImg}`);
    mealImgDiv.appendChild(mealImg);

    const mealNameDiv = document.createElement("div");
    mealNameDiv.classList.add("meal-name");
    mealItemDiv.appendChild(mealNameDiv);
    const mealTitle = document.createElement("h4");
    mealTitle.innerHTML = saveTitle;
    mealNameDiv.appendChild(mealTitle);

    const clickDiv = document.createElement("div");
    clickDiv.classList.add("clickDiv");
    mealItemDiv.appendChild(clickDiv);
  }

  if (addSaveButton.classList.contains("saved") === false) {
    plusSave.style.display = "inline";
    checkSave.style.display = "none";
    let saveID = recipeTitle.getAttribute("id");

    const recipeIndex = savedRecipes.indexOf(saveID);

    if (recipeIndex > -1) {
      savedRecipes.splice(recipeIndex, 1);
    }

    removeLocalRecipe(saveID);

    let savedContainerChildren = savedGrid.children;

    for (var i = 0; i < savedContainerChildren.length; i++) {
      if (savedContainerChildren[i].getAttribute("id") === saveID) {
        savedContainerChildren[i].remove();
      }
    }
  }
  if (savedRecipes.length > 0) {
    emptyStateTextSaved.style.display = "none";
  } else if (savedRecipes.length === 0) {
    emptyStateTextSaved.style.display = "flex";
  }
}

function addMealplan() {
  addMealPlanButton.classList.toggle("saved");
  let saveID = recipeTitle.getAttribute("id");
  let saveTitle = recipeTitle.textContent;
  let saveImg = recipeImage.getAttribute("src");
  let saveServings = parseFloat(recipeServings.innerHTML);
  let saveMinutes = parseFloat(recipeMinutes.innerHTML);
  let saveIngredients = recipeIngredients.childNodes;

  //minutes
  function calculateMinutes() {
    const minutesSum = readyInMinutesArray.reduce(
      (partialSum, a) => partialSum + a,
      0
    );
    const hoursSum = minutesSum / 60;
    const hoursRound = Math.ceil(hoursSum * 4) / 4;
    if (hoursRound === 1) {
      totalTime.innerHTML = minutesSum + " minutes / " + hoursRound + " hour";
    } else {
      totalTime.innerHTML = minutesSum + " minutes / " + hoursRound + " hours";
    }
  }

  //servings
  function calculateServings() {
    const servingsSum = servingsArray.reduce(
      (partialSum, a) => partialSum + a,
      0
    );
    if (servingsSum === 1) {
      totalServings.innerHTML = servingsSum + " serving";
    } else {
      totalServings.innerHTML = servingsSum + " servings";
    }
  }

  //total meals
  function displayTotalMeals() {
    if (mealplanRecipes.length === 1) {
      totalMeals.innerHTML = mealplanRecipes.length + " Meal ";
    } else {
      totalMeals.innerHTML = mealplanRecipes.length + " Meals ";
    }

    mealplanRecipes = mealplanRecipes.sort(function (a, b) {
      return a - b;
    });
  }

  //empty state
  function emptyState() {
    if (mealplanRecipes.length > 0) {
      emptyStateTextMealplan.style.display = "none";
    } else if (mealplanRecipes.length === 0) {
      emptyStateTextMealplan.style.display = "flex";
    }
  }

  //ADD MEAL PLAN ++++++++++++++++++++++++++++++++++++++++++
  if (addMealPlanButton.classList.contains("saved") === true) {
    plusMealplan.style.display = "none";
    checkMealplan.style.display = "inline";
    mealplanRecipes.push(saveID);
    saveLocalMealplan(saveID);

    //build out divs in mealplan section
    const mealItemDiv = document.createElement("div");
    mealItemDiv.classList.add("meal-item");
    mealItemDiv.setAttribute("id", `${saveID}`);
    mealplanGrid.appendChild(mealItemDiv);

    const mealImgDiv = document.createElement("div");
    mealImgDiv.classList.add("meal-img");
    mealItemDiv.appendChild(mealImgDiv);
    const mealImg = document.createElement("img");
    mealImg.setAttribute("src", `${saveImg}`);
    mealImgDiv.appendChild(mealImg);

    const mealNameDiv = document.createElement("div");
    mealNameDiv.classList.add("meal-name");
    mealItemDiv.appendChild(mealNameDiv);
    const mealTitle = document.createElement("h4");
    mealTitle.innerHTML = saveTitle;
    mealNameDiv.appendChild(mealTitle);

    const clickDiv = document.createElement("div");
    clickDiv.classList.add("clickDiv");
    mealItemDiv.appendChild(clickDiv);

    readyInMinutesArray.push(saveMinutes);
    calculateMinutes();

    servingsArray.push(saveServings);
    calculateServings();

    displayTotalMeals();
    emptyState();

    saveIngredients.forEach((ingredient) => {
      let cloneIngredients = ingredient.cloneNode(true);
      cloneIngredients.classList.add("ingredientShoppingList");
      cloneIngredients.classList.remove("ingredientsModal");
      ingredientsList.appendChild(cloneIngredients);
    });
  }

  //REMOVE MEAL PLAN --------------------------------------
  if (addMealPlanButton.classList.contains("saved") === false) {
    plusMealplan.style.display = "inline";
    checkMealplan.style.display = "none";

    const mealplanIndex = mealplanRecipes.indexOf(saveID);
    if (mealplanIndex > -1) {
      mealplanRecipes.splice(mealplanIndex, 1);
    }
    removeLocalMealplan(saveID);

    let mealplanArrayChildren = mealplanGrid.children;

    //Removes div from saved list
    for (var i = 0; i < mealplanArrayChildren.length; i++) {
      if (mealplanArrayChildren[i].getAttribute("id") === saveID) {
        mealplanArrayChildren[i].remove();
      }
    }

    //remove in minutes
    const minutesIndex = readyInMinutesArray.indexOf(saveMinutes);
    if (minutesIndex > -1) {
      readyInMinutesArray.splice(minutesIndex, 1);
    }
    calculateMinutes();

    //remove servings
    const servingsIndex = servingsArray.indexOf(saveServings);
    if (servingsIndex > -1) {
      servingsArray.splice(servingsIndex, 1);
    }
    calculateServings();

    displayTotalMeals();
    emptyState();

    //remove ingredients
    //this is in recipe details
    for (let i = 0; i < saveIngredients.length; i++) {
      //element currently in shopping list
      for (let j = 0; j < ingredientShoppingList.length; j++) {
        if (
          saveIngredients[i].innerText === ingredientShoppingList[j].innerText
        ) {
          ingredientShoppingList[j].remove();
        }
      }
    }
  }
}

function saveLocalRecipe(recipe) {
  let localSavedRecipes;
  if (localStorage.getItem("localSavedRecipes") === null) {
    localSavedRecipes = [];
  } else {
    localSavedRecipes = JSON.parse(localStorage.getItem("localSavedRecipes"));
  }
  localSavedRecipes.push(recipe);
  localSavedRecipes = localSavedRecipes.sort(function (a, b) {
    return a - b;
  });
  localStorage.setItem("localSavedRecipes", JSON.stringify(localSavedRecipes));
}

function saveLocalMealplan(recipe) {
  let localSavedMealPlan;
  if (localStorage.getItem("localSavedMealPlan") === null) {
    localSavedMealPlan = [];
  } else {
    localSavedMealPlan = JSON.parse(localStorage.getItem("localSavedMealPlan"));
  }
  localSavedMealPlan.push(recipe);
  localSavedMealPlan = localSavedMealPlan.sort(function (a, b) {
    return a - b;
  });
  localStorage.setItem(
    "localSavedMealPlan",
    JSON.stringify(localSavedMealPlan)
  );
}

function removeLocalRecipe(recipe) {
  let localSavedRecipes;
  if (localStorage.getItem("localSavedRecipes") === null) {
    localSavedRecipes = [];
  } else {
    localSavedRecipes = JSON.parse(localStorage.getItem("localSavedRecipes"));
  }
  localSavedRecipes = localSavedRecipes.sort(function (a, b) {
    return a - b;
  });
  let localRecipeIndex = localSavedRecipes.indexOf(recipe);
  if (localRecipeIndex > -1) {
    localSavedRecipes.splice(localRecipeIndex, 1);
  }
  localStorage.setItem("localSavedRecipes", JSON.stringify(localSavedRecipes));
}

function removeLocalMealplan(recipe) {
  let localSavedMealPlan;
  if (localStorage.getItem("localSavedMealPlan") === null) {
    localSavedMealPlan = [];
  } else {
    localSavedMealPlan = JSON.parse(localStorage.getItem("localSavedMealPlan"));
  }
  localSavedMealPlan = localSavedMealPlan.sort(function (a, b) {
    return a - b;
  });
  let localMealPlanIndex = localSavedMealPlan.indexOf(recipe);
  if (localMealPlanIndex > -1) {
    localSavedMealPlan.splice(localMealPlanIndex, 1);
  }
  localStorage.setItem(
    "localSavedMealPlan",
    JSON.stringify(localSavedMealPlan)
  );
}

function getLocalSavedRecipes() {
  let localSavedRecipes;
  if (localStorage.getItem("localSavedRecipes") === null) {
    localSavedRecipes = [];
  } else {
    localSavedRecipes = JSON.parse(localStorage.getItem("localSavedRecipes"));
  }

  savedRecipes.push(...localSavedRecipes);

  if (savedRecipes.length > 0) {
    emptyStateTextSaved.style.display = "none";
  } else if (savedRecipes.length === 0) {
    emptyStateTextSaved.style.display = "flex";
  }

  savedRecipes = savedRecipes.sort(function (a, b) {
    return a - b;
  });

  Promise.all(
    savedRecipes.map((recipe) =>
      fetch(
        `https://api.spoonacular.com/recipes/${recipe}/information?apiKey=${apiKey}&includeNutrition=false`
      ).then((response) => response.json())
    )
  ).then((savedRecipeData) => {
    savedRecipeData.forEach((recipe) => {
      const mealItemDiv = document.createElement("div");
      mealItemDiv.classList.add("meal-item");
      mealItemDiv.setAttribute("id", `${recipe.id}`);
      savedGrid.appendChild(mealItemDiv);

      const mealImgDiv = document.createElement("div");
      mealImgDiv.classList.add("meal-img");
      mealItemDiv.appendChild(mealImgDiv);
      const mealImg = document.createElement("img");
      mealImg.setAttribute("src", `${recipe.image}`);
      mealImgDiv.appendChild(mealImg);

      const mealNameDiv = document.createElement("div");
      mealNameDiv.classList.add("meal-name");
      mealItemDiv.appendChild(mealNameDiv);
      const mealTitle = document.createElement("h4");
      mealTitle.innerHTML = recipe.title;
      mealNameDiv.appendChild(mealTitle);

      const clickDiv = document.createElement("div");
      clickDiv.classList.add("clickDiv");
      mealItemDiv.appendChild(clickDiv);
    });
  });
}

function getLocalMealPlan() {
  let localSavedMealPlan;
  if (localStorage.getItem("localSavedMealPlan") === null) {
    localSavedMealPlan = [];
  } else {
    localSavedMealPlan = JSON.parse(localStorage.getItem("localSavedMealPlan"));
  }

  mealplanRecipes.push(...localSavedMealPlan);

  mealplanRecipes = mealplanRecipes.sort(function (a, b) {
    return a - b;
  });

  if (mealplanRecipes.length > 0) {
    emptyStateTextMealplan.style.display = "none";
  } else if (mealplanRecipes.length === 0) {
    emptyStateTextMealplan.style.display = "flex";
  }

  if (mealplanRecipes.length === 1) {
    totalMeals.innerHTML = mealplanRecipes.length + " Meal ";
  } else {
    totalMeals.innerHTML = mealplanRecipes.length + " Meals ";
  }

  Promise.all(
    mealplanRecipes.map((recipe) =>
      fetch(
        `https://api.spoonacular.com/recipes/${recipe}/information?apiKey=${apiKey}&includeNutrition=false`
      ).then((response) => response.json())
    )
  ).then((mealplanRecipeData) => {
    mealplanRecipeData.forEach((recipe) => {
      const mealItemDiv = document.createElement("div");
      mealItemDiv.classList.add("meal-item");
      mealItemDiv.setAttribute("id", `${recipe.id}`);
      mealplanGrid.appendChild(mealItemDiv);

      const mealImgDiv = document.createElement("div");
      mealImgDiv.classList.add("meal-img");
      mealItemDiv.appendChild(mealImgDiv);
      const mealImg = document.createElement("img");
      mealImg.setAttribute("src", `${recipe.image}`);
      mealImgDiv.appendChild(mealImg);

      const mealNameDiv = document.createElement("div");
      mealNameDiv.classList.add("meal-name");
      mealItemDiv.appendChild(mealNameDiv);
      const mealTitle = document.createElement("h4");
      mealTitle.innerHTML = recipe.title;
      mealNameDiv.appendChild(mealTitle);

      const clickDiv = document.createElement("div");
      clickDiv.classList.add("clickDiv");
      mealItemDiv.appendChild(clickDiv);

      //ready in minutes
      readyInMinutesArray.push(recipe.readyInMinutes);
      const minutesSum = readyInMinutesArray.reduce(
        (partialSum, a) => partialSum + a,
        0
      );
      const hoursSum = minutesSum / 60;
      const hoursRound = Math.ceil(hoursSum * 4) / 4;
      if (hoursRound === 1) {
        totalTime.innerHTML = minutesSum + " minutes / " + hoursRound + " hour";
      } else {
        totalTime.innerHTML =
          minutesSum + " minutes / " + hoursRound + " hours";
      }

      //servings
      servingsArray.push(recipe.servings);
      const servingsSum = servingsArray.reduce(
        (partialSum, a) => partialSum + a,
        0
      );
      if (servingsSum === 1) {
        totalServings.innerHTML = servingsSum + " serving";
      } else {
        totalServings.innerHTML = servingsSum + " servings";
      }

      //ingredients
      recipe.extendedIngredients.forEach((ingredient) => {
        let list = document.createElement("li");
        list.classList.add("ingredientShoppingList");
        list.textContent = ingredient.original;
        ingredientsList.appendChild(list);
      });
    });
  });
}
