import { async } from 'regenerator-runtime';
import { API_URL, KEY, RES_PER_PAGE, KEY } from './config';
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  serach: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //only executed and retured the object key property for those have keys
    //this is very nice trick to conditionally add properties to an object
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmarks => bookmarks.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    console.log(state.recipe);
  } catch (err) {
    //temporary error handling
    console.error(`${err}🥶🤬🤮 Gaand Mara BhosdiKe`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.serach.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);

    state.serach.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.serach.page = 1;
    // console.log(state.serach.results);
  } catch (err) {
    console.error(`(${err}🥶🤬🤮 Loda-leshan)`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.serach.page) {
  state.serach.page = page;

  const start = (page - 1) * state.serach.resultsPerPage; //0
  const end = page * state.serach.resultsPerPage; //9

  return state.serach.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newQT =oldQT * newServings / oldServings //2 * 8 /4
  });
  state.recipe.servings = newServings; //we need to save this value in new
  // servings otherwise and we doing that in end of function otherwise we
  // cant preserve the old value of state.recipe.servings i.e original value
  console.log(newServings);
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  //Add Bookmarks
  state.bookmarks.push(recipe);

  //Mark Current Recipe As Bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete Bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //Mark Current Recipe As NOT Bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// console.log(state.bookmarks);

// const clearBookmarks = function () {
//   localStorage.clear('bookmarks');
// };
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'wrong ingredient format! sahi data daal laude kahi ke!🤬🤣🎃'
          );
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    // console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    // console.log(data);
    // console.log(ingredients);
  } catch (err) {
    // console.log(err);
    throw err;
  }
};
