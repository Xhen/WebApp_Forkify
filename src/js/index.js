import Search from './models/search';
import Recipe from './models/recipe';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';

/* Global state of the app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/
const state = {};

/*
* SEARCH CONTROLLER
*/
const controlSearch = async () => {
  // 1. Get query from view
  const query = searchView.getInput();

  if (query) {
    // 2. new Search object and add to state
    state.search = new Search(query);

    // 3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchRes);

    try {
      // 4. Search for recipes
      await state.search.getResults();
      // 5. Render result on UI
      clearLoader();
      searchView.renderResults(state.search.result);

    } catch (error) {
      alert(`Something went wrong with the search: ${error}`);
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    // Extract from data-goto attribute
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResult();
    searchView.renderResults(state.search.result, goToPage);
  }

});

/*
* RECIPE CONTROLLER
*/

const controlRecipe = async () => {
  // Get ID from url

  // Remove hash
  const id = window.location.hash.replace('#', '');

  if (id) {
    // Prepare UI for changes

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      state.recipe.parseIngredients();

      // Render recipe
      console.log(state.recipe);

    } catch(error) {
      alert(`Error processing recipe: ${error}`);
    }

  }
}
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
