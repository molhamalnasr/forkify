// Global app controller

import Search from './modules/Search';
import { elements } from './views/base';
import * as searchView from './views/searchView';

/** Global state of the App
* - Search opject
* - current recipe object
* - shopping list object
* - liked opject
*/

const state = {};

const searchController = async () => {
    
    // 1) Get the query from the view
    const query = searchView.getInput();
    
    if (query) {
        
        // 2) New search object and add it to the state
        state.search = new Search(query);
        
        // 3) Prepare the UI to show the result
        searchView.clearInput();
        searchView.clearResult();
        
        // 4) Search for recipes
        await state.search.getRecipe();
        
        // 5) Render the result on the UI
        searchView.renderResult(state.search.result);
        
    }
    
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    searchController();
});