import suggestions from "../helpers/suggestions.js";
import mealsList from "../helpers/mealsList.js";

const prepCheckboxes = [
  document.getElementById("fstCheckItem"),
  document.getElementById("scnCheckItem"),
  document.getElementById("thdCheckItem"),
];
const searchContainer = document.querySelector(".search-container");
const searchField = searchContainer.querySelector(".search-field");
const suggestionBox = searchContainer.querySelector(".autocom-box");
const avalMealList = document.getElementById("id-available-meals-list");
const resultsSection = document.getElementById("id-results-section");
const resultGrid = document.getElementById("id-result-grid");
const divListContainer = document.querySelector(".form-list-container");
const divIngCont = document.querySelector(".form-recipe-ing-grid");
const divStepsCont = document.querySelector(".form-recipe-step-container");
const stList = document.getElementById("id-form-recipe-steps");
const ingrList = document.getElementById("id-form-recipe-list");
const formNewMeal = document.querySelector(".form-element");
const btnToggleNewMeal = document.getElementById("id-btn-toggle-new-meal");
const btnAddIngredient = document.getElementById("id-btn-add-ing");
const btnAddStep = document.getElementById("id-btn-add-step");
const btnAddNewMeal = document.getElementById("id-btn-new-meal");

let suggestionObj = new suggestions();
let suggest = suggestionObj.getSuggestions();
let mList = new mealsList();
let ingredientsList = [];
let stepList = [];
let toggleNewMeal = true;

document.getElementById("id-generate-button").addEventListener("click", generateBreakfast);

updateAvailableMealsList();

btnToggleNewMeal.addEventListener("click", (btn) => {
  if (toggleNewMeal == false) {
    toggleNewMeal = true;
  } else {
    toggleNewMeal = false;
  }
  configureNewMealWindow();
  configureNewMealElements();
});
btnAddIngredient.addEventListener("click", (btn) => {
  addToIngredients(btnAddIngredient.parentElement.children[0].value);
});
btnAddStep.addEventListener("click", (btn) => {
  addToSteps(btnAddStep.parentElement.children[0].value);
});
btnAddNewMeal.addEventListener("click", () => {
  let meal = {
    name: formNewMeal.elements["id-meal-name-field"].value,
    type: formNewMeal.elements["id-meal-type-field"].value,
    category: formNewMeal.elements["id-meal-category-field"].value,
    src: "../assets/images/" + formNewMeal.elements["id-meal-src-field"].value.slice(12),
    recipe: {
      ingredients: ingredientsList,
      steps: stepList,
    },
    amount: formNewMeal.elements["id-servings-field"].value,
    measurement:
      formNewMeal.elements["id-meal-measurement-field"].options[
        formNewMeal.elements["id-meal-measurement-field"].selectedIndex
      ].value,
    preparation: formNewMeal.elements["id-preparation-field"].value,
  };
  suggestionObj.addMeal(meal);
});
searchField.addEventListener("input", (e) => {
  let userData = e.target.value;
  let emptyArray = [];
  if (userData) {
    emptyArray = suggest.filter((data) => {
      return data.name.toLocaleLowerCase().includes(userData.toLocaleLowerCase());
    });
    emptyArray = emptyArray.map((data) => {
      return (data =
        ` <li> 
                                <label>` +
        data.name +
        `</label>
                                <p>- ` +
        data.category +
        `</p>
                                <button class="btn btn-outline-primary""><i class="bi bi-plus"></i></button>
                            </li>`);
    });
    searchContainer.classList.add("active");
  } else {
    searchContainer.classList.remove("active");
  }
  showSuggestions(emptyArray);
  let allItensButtons = suggestionBox.querySelectorAll("button");
  allItensButtons.forEach((btn) => {
    btn.addEventListener("click", function handleClick(event) {
      addToList(btn);
    });
  });
});

function configureNewMealWindow() {
  if (toggleNewMeal == true) {
    formNewMeal.style.width = "0px";
    formNewMeal.style.padding = "0px";
    formNewMeal.children[0].innerHTML = `<i class="bi bi-caret-right-fill"></i>`;
    formNewMeal.children[1].style.display = "none";
    formNewMeal.children[2].style.display = "none";
  } else if (ingredientsList.length == 0 && stepList.length == 0) {
    formNewMeal.style.width = "500px";
    formNewMeal.style.padding = "40px";
    formNewMeal.children[0].innerHTML = `<i class="bi bi-caret-left-fill"></i>`;
    formNewMeal.children[1].style.display = "block";
    formNewMeal.style.display = "block";
    formNewMeal.children[2].style.display = "none";
  } else {
    formNewMeal.style.width = "1000px";
    formNewMeal.style.padding = "40px";
    formNewMeal.children[0].innerHTML = `<i class="bi bi-caret-left-fill"></i>`;
    formNewMeal.children[1].style.display = "block";
    formNewMeal.style.display = "grid";
    formNewMeal.children[2].style.display = "block";
  }
}
function configureNewMealElements() {
  if (divIngCont.clientHeight + 26 >= divListContainer.clientHeight / 2) {
    let tempValue = divListContainer.clientHeight / 2 - 69;
    ingrList.style.maxHeight = tempValue.toString() + "px";
    stList.style.maxHeight = tempValue.toString() + "px";
    stList.style.overflowY = "scroll";
    if (stList.clientHeight > tempValue) {
      stList.style.maxHeight = tempValue.toString() + "px";
      stList.style.overflowY = "scroll";
    } else {
      stList.style.maxHeight = tempValue.toString() + "px";
      stList.style.overflowY = "auto";
    }
  } else {
    ingrList.style.overflowY = "auto";
    let tempValue =
      divListContainer.clientHeight -
      divIngCont.clientHeight -
      divStepsCont.children[0].clientHeight -
      72;
    if (stList.clientHeight > tempValue) {
      stList.style.maxHeight = tempValue.toString() + "px";
      stList.style.overflowY = "scroll";
    } else {
      stList.style.maxHeight = tempValue.toString() + "px";
      stList.style.overflowY = "auto";
    }
  }
}
function addToIngredients(element) {
  ingredientsList.push(element);
  updateIngredients();
  configureNewMealElements();
  configureNewMealWindow();
}
function removeFromIngredients(element) {
  let index = 0;
  for (let ind = 0; ind < ingredientsList.length; ind++) {
    if (ingredientsList[ind] == element) {
      index = ind;
    }
  }
  ingredientsList.splice(index, 1);
  updateIngredients();
  configureNewMealElements();
  configureNewMealWindow();
}
function updateIngredients() {
  ingrList.innerHTML = "";
  ingredientsList.forEach((ing) => {
    ingrList.innerHTML +=
      `
            <li class="list-group-item">
                <p>` +
      ing +
      `</p>
                <button class="btn btn-outline-danger" type="button"><i class="bi bi-x-lg"></i></button>
            </li>`;
  });

  let allDeleteButtons = ingrList.querySelectorAll("button");
  allDeleteButtons.forEach((dBtn) => {
    dBtn.addEventListener("click", function handleClick(event) {
      removeFromIngredients(dBtn);
    });
  });
}
function addToSteps(element) {
  stepList.push(element);
  updateSteps();
  configureNewMealElements();
  configureNewMealWindow();
}
function removeFromSteps(element) {
  let index = 0;
  for (let ind = 0; ind < stepList.length; ind++) {
    if (stepList[ind] == element) {
      index = ind;
    }
  }
  stepList.splice(index, 1);
  updateSteps();
  configureNewMealElements();
  configureNewMealWindow();
}
function updateSteps() {
  stList.innerHTML = "";
  stepList.forEach((step) => {
    stList.innerHTML +=
      `
            <li class="list-group-item">
                <p>` +
      step +
      `</p>
                <button class="btn btn-outline-danger" type="button"><i class="bi bi-x-lg"></i></button>
            </li>`;
  });

  let allDeleteButtons = stList.querySelectorAll("button");
  allDeleteButtons.forEach((dBtn) => {
    dBtn.addEventListener("click", function handleClick(event) {
      removeFromSteps(dBtn);
    });
  });
}
function showSuggestions(list) {
  let listData;

  if (!list.length) {
    listData = `<li>The meal '` + searchField.value + `' is not registered.</li>`;
  } else {
    listData = list.join("");
  }

  suggestionBox.innerHTML = listData;
}
function addToList(element) {
  let parentElement = element.parentElement;
  let labelChildElement = parentElement.children[0];

  if (mList.checkInList(labelChildElement.textContent)) {
    let category = suggestionObj.getMealGroup(labelChildElement.textContent);
    mList.addMealToList([labelChildElement.textContent, category]);
    updateAvailableMealsList();
  }
}
function removeFromList(element) {
  let parentElement = element.parentElement;
  let labelChildElement = parentElement.children[0];

  mList.removeMealFromList(labelChildElement.textContent);
  updateAvailableMealsList();
}
function updateAvailableMealsList() {
  let list = mList.getMealsList();
  avalMealList.innerHTML = `
                
                <li class="list-group-item sub-list-item">
                    <label>Group 1</label>
                </li>
                <div id="id-group-1"></div>
                <li class="list-group-item sub-list-item">
                    <label>Group 2</label>
                </li>
                <div id="id-group-2"></div>
                <li class="list-group-item sub-list-item">
                    <label>Group 3</label>
                </li>
                <div id="id-group-3"></div>
                <li class="list-group-item sub-list-item">
                    <label>Group 4</label>
                </li>
                <div id="id-group-4"></div>
    `;
  let group1Id = document.getElementById("id-group-1");
  let group2Id = document.getElementById("id-group-2");
  let group3Id = document.getElementById("id-group-3");
  let group4Id = document.getElementById("id-group-4");

  mList.getMealsList().forEach((meal) => {
    if (meal.category == "Group 1") {
      group1Id.innerHTML +=
        `
                    <li class="list-group-item">
                        <label>` +
        meal.name +
        `</label>
                        <button class="btn btn-outline-danger"><i class="bi bi-x-lg"></i></button>
                    </li>`;
    }
    if (meal.category == "Group 2") {
      group2Id.innerHTML +=
        `
                    <li class="list-group-item">
                        <label>` +
        meal.name +
        `</label>
                        <button class="btn btn-outline-danger"><i class="bi bi-x-lg"></i></button>
                    </li>`;
    }
    if (meal.category == "Group 3") {
      group3Id.innerHTML +=
        `
                    <li class="list-group-item">
                        <label>` +
        meal.name +
        `</label>
                        <button class="btn btn-outline-danger"><i class="bi bi-x-lg"></i></button>
                    </li>`;
    }
    if (meal.category == "Group 4") {
      group4Id.innerHTML +=
        `
                    <li class="list-group-item">
                        <label>` +
        meal.name +
        `</label>
                        <button class="btn btn-outline-danger"><i class="bi bi-x-lg"></i></button>
                    </li>`;
    }
  });
  let allDeleteButtons = avalMealList.querySelectorAll("button");
  allDeleteButtons.forEach((dBtn) => {
    dBtn.addEventListener("click", function handleClick(event) {
      removeFromList(dBtn);
    });
  });
}
function getPreparationFilterCheckboxes() {
  let arr = [];
  if (prepCheckboxes[0].checked) {
    arr.push(5);
  }
  if (prepCheckboxes[1].checked) {
    arr.push(15);
  }
  if (prepCheckboxes[2].checked) {
    arr.push(30);
  }
  return arr;
}
function generateBreakfast() {
  if (
    prepCheckboxes[0].checked == false &&
    prepCheckboxes[1].checked == false &&
    prepCheckboxes[2].checked == false
  ) {
    alert("Please select one option in Preparation Time field.");
  } else {
    let arrayChBox = getPreparationFilterCheckboxes();
    resultGrid.innerHTML = "";
    let group1 = [];
    let group2 = [];
    let group3 = [];
    let group4 = [];
    for (let index = 0; index < suggest.length; index++) {
      switch (suggest[index].category) {
        case "Group 1":
          for (let ind = 0; ind < mList.list.length; ind++) {
            if (mList.list[ind].name == suggest[index].name) {
              for (let cont = 0; cont < arrayChBox.length; cont++) {
                if (suggest[index].preparation <= arrayChBox[cont]) {
                  group1.push(suggest[index]);
                }
              }
            }
          }
          break;

        case "Group 2":
          for (let ind = 0; ind < mList.list.length; ind++) {
            if (mList.list[ind].name == suggest[index].name) {
              for (let cont = 0; cont < arrayChBox.length; cont++) {
                if (suggest[index].preparation <= arrayChBox[cont]) {
                  group2.push(suggest[index]);
                }
              }
            }
          }
          break;

        case "Group 3":
          for (let ind = 0; ind < mList.list.length; ind++) {
            if (mList.list[ind].name == suggest[index].name) {
              for (let cont = 0; cont < arrayChBox.length; cont++) {
                if (suggest[index].preparation <= arrayChBox[cont]) {
                  group3.push(suggest[index]);
                }
              }
            }
          }
          break;

        case "Group 4":
          for (let ind = 0; ind < mList.list.length; ind++) {
            if (mList.list[ind].name == suggest[index].name) {
              for (let cont = 0; cont < arrayChBox.length; cont++) {
                if (suggest[index].preparation <= arrayChBox[cont]) {
                  group4.push(suggest[index]);
                }
              }
            }
          }
          break;
      }
    }
    let resultArray = [
      getRandomItem(group1),
      getRandomItem(group2),
      getRandomItem(group3),
      getRandomItem(group4),
    ];
    if (group1.length == 0 || group2.length == 0 || group3.length == 0 || group4.length == 0) {
      alert("Please check if all groups have at least one option each.");
    } else {
      showBreakfast(resultArray);
    }
  }
}
function showBreakfast(arr) {
  for (let index = 0; index < 4; index++) {
    resultGrid.innerHTML +=
      `
            <div class="result-item">
                <img src="` +
      arr[index].src +
      `" alt="` +
      arr[index].name +
      `">
                <div class="result-item-info">
                    <label>` +
      arr[index].name +
      `</label>
                    <div class="result-suggestion">
                        <i class="bi bi-layers"></i>
                        <p>` +
      arr[index].amount +
      ` ` +
      arr[index].measurement +
      `</p>
                    </div>
                    <div class="result-recipe">
                        
                        <a class="result-recipe"> 
                            <i class="fa-solid fa-receipt"></i> 
                            Recipe
                        </a>
                    </div>
                </div>
            </div>`;
  }
  let allRecipeLinks = resultGrid.querySelectorAll("a");
  allRecipeLinks.forEach((recipeObj) => {
    recipeObj.addEventListener("click", function handleClick(event) {
      loadRecipeModal(recipeObj);
    });
  });
  resultsSection.style.opacity = 1;
  resultsSection.style.pointerEvents = "auto";
}
function getRandomItem(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  const item = arr[randomIndex];
  return item;
}
function loadRecipeModal(obj) {
  const recipeModal = document.getElementById("id-recipe-modal");
  let objMeal = suggestionObj.getMeal(obj.parentElement.parentElement.children[0].textContent);

  let ingredientsHTML = "";
  objMeal.recipe.ingredients.forEach((ing) => {
    ingredientsHTML +=
      `
                        <li><p>` +
      ing +
      `</p></li>`;
  });
  let stepsHTML = "";
  objMeal.recipe.steps.forEach((step) => {
    stepsHTML +=
      `
                        <li><p>` +
      step +
      `</p></li>`;
  });
  recipeModal.innerHTML =
    `
            <div class="recipe-modal">
                <button class="btn btn-outline-danger" id="id-btn-close-modal"><i class="bi bi-x-lg"></i></button>
                <h3>` +
    objMeal.name +
    `</h3>
                <div class="recipe-grid">
                    <div class="recipe-prep-time">
                        <p>Preparation Time</p>
                        <div>
                            <i class="bi bi-clock"></i>
                            <label>` +
    objMeal.preparation +
    ` minutes</label>
                        </div>
                    </div>
                    <div class="recipe-amount">
                        <p>Servings</p>
                        <div>
                            <i class="bi bi-layers"></i>
                            <label>` +
    objMeal.amount +
    ` ` +
    objMeal.measurement +
    `</label>
                        </div>
                    </div>
                </div>
                <h4>Ingredients</h4>
                <ul class="recipe-ingredients">` +
    ingredientsHTML +
    `
                </ul>
                <h4>Steps</h4>
                <ul class="recipe-steps"> ` +
    stepsHTML +
    `
                </ul>

            </div>`;

  const modalClose = document.getElementById("id-btn-close-modal");
  recipeModal.style.opacity = 1;
  recipeModal.style.pointerEvents = "auto";
  modalClose.addEventListener("click", function handleClick(event) {
    recipeModal.style.opacity = 0;
    recipeModal.style.pointerEvents = "none";
  });
}
