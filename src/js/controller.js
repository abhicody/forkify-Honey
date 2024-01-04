import { async } from 'regenerator-runtime';
import 'core-js/stable';
import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); //Application logic ,nothing to do with
    //business logic
    // console.log(id);

    if (!id) return;
    recipeView.renderspinner(); //presentation logic nothing to do with
    //business logic and it goes to View

    // 0) update resultsview to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1)Loading recipe
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);

    // console.log(recipeView);
  } catch (err) {
    recipeView.renderError();
    err;
    // alert(err);
  }
};

const controlSerachResults = async function () {
  try {
    resultsView.renderspinner();
    // console.log(resultsView);
    //1 ) get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2 ) Load Results
    await model.loadSearchResults(query);

    //3 ) Render results
    // console.log(model.state.serach.results);
    // resultsView.render(model.state.serach.results);

    resultsView.render(model.getSearchResultsPage());
    // console.log(model.getSearchResultsPage());

    //4 Render initials pagination Buttons
    paginationView.render(model.state.serach);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination Buttons
  paginationView.render(model.state.serach);

  console.log(goToPage);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);

  //update the recipe View
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

  //the differnce b/w render and update method is that update
  //method will basically only update 'test'and 'attributes'
  //in the DOM so without having to re-render the entire view
};

const controlAddBookmark = function () {
  // 1) Add/Remove Bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // console.log(model.state.recipe);
  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderspinner();

    //upload new recipe data
    // console.log(newRecipe);
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render Recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //Render Bookmark View
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🤬', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('welcome to the application');
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSerachResults);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();

// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('laod', showRecipe);
