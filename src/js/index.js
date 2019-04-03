// Global app controller

import Search from './modules/Search';
import Recipe from './modules/Recipe';
import List from './modules/List';
import Likes from './modules/Likes';
import {
     elements,
    renderLoader,
    clearLoader
} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

/** Global state of the App
* - Search opject
* - current recipe object
* - shopping list object
* - liked opject
*/

const state = {};

//TODO Focus on search Btn when page is loaded

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
        
        // Highlight the Selected recipe
        if (state.search) searchView.heightlightSelected(id);
        
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
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    }
    
};

['hashchange', 'load'].forEach((event) => window.addEventListener(event, controlRecipe));

/** 
* List Controller
*/

const controlList = () => {
    
    // Creat new list if there is no list
    if (!state.list) state.list = new List();
    
    // Add ingredients to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
    
};

elements.shoppingList.addEventListener('click', e => {
    
    // Get element Id
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    if (e.target.matches('.shopping__delete, .shopping__delete *') && id) {
        
        // Delete item from state
        state.list.deleteItem(id);
        
        // Delete item from UI
        listView.deleteItem(id);
        
    } else if (e.target.matches('.shopping__item-value') && id) {
        
        // Update the count in the state object
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
        
    }
    
});

/** 
* Likes Controller
*/
const controlLikes = () => {
    
    if (!state.likes) state.likes = new Likes;
    const currentId = state.recipe.id;
    
    if (!state.likes.isLiked(currentId)) {
        
        // Add Liked recipe to the state
        const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.img);
        
        // Toggel the Like Button
        likesView.toggleLikeBtn(true);
        
        // ADD Liked recipe to the UI
        likesView.renderLike(newLike);
        
    } else {
        
        // Remove Liked recipe from the state
        state.likes.deleteLike(currentId);
        
        // Toggel the Like Button
        likesView.toggleLikeBtn(false);
        
        // Remove Liked recipe from the UI
        likesView.deleteLike(currentId);
        
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    
};

// Restore liked recipe on page load
window.addEventListener('load', () => {
    state.likes = new Likes;
    
    // Restore likes
    state.likes.readStorage();
    
    // Toggle like BTN
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    
    // Render the likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling recipe Button clicks
elements.recipe.addEventListener('click', e => {
    
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decreace the servings
        if (state.recipe.serveings > 1) { 
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase the servings
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Controll Likes
        controlLikes();
    }
    
});

























