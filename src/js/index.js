// Global app controller

import Search from './modules/Search';
import Recipe from './modules/Recipe';
import {
     elements,
    renderLoader,
    clearLoader
} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

/** Global state of the App
* - Search opject
* - current recipe object
* - shopping list object
* - liked opject
*/

const state = {};

/** 
* Search Controller
*/

const searchController = async () => {
    
    // 1) Get the query from the view
    const query = searchView.getInput();
    
    if (query) {
        
        // 2) New search object and add it to the state
        state.search = new Search(query);
        
        // 3) Prepare the UI to show the result
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);
        
        // 4) Search for recipes
        await state.search.getRecipe();
        
        // 5) Render the result on the UI
        clearLoader();
        searchView.renderResult(state.search.result);
        
    }
    
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    searchController();
});

elements.searchRes.addEventListener('click', el => {
    const btn = el.target.closest('.btn-inline');
    if(btn) {
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResult(state.search.result, gotoPage);
    }
});

/** 
* Recipe Controller
*/

const controlRecipe = async () => {
    
    const id = window.location.hash.replace('#', '');
    
    if (id) {
        // Prepare UI for the changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        
        // Creat new Recipe object
        state.recipe = new Recipe(id);
        
        // get the Recipe data and Parse the ingredients
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
        
        // Calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();
        
        // Render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe);
    }
    
};

['hashchange', 'load'].forEach((event) => window.addEventListener(event, controlRecipe));





























