import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResult = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

const limitRecipeTitle = function (title, limit = 17) {
    
    if (title.length > limit) {
        const newTitle = [];
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
    
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup)
};

const creatButtons = (page, type) => {
    return `
        <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
            <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
        </button>
    `;
};

const renderButtons = (page, numRes, resPerPage) => {
    const pages = Math.ceil(numRes / resPerPage);
    let button;
    
    if (page === 1 && pages > 1) {
        //TODO show only the next page Button
        button = `${creatButtons(page, 'next')}`;
    } else if (page < pages) {
        //TODO show both Buttons
        button = `${creatButtons(page, 'prev')} ${creatButtons(page, 'next')}`;
    } else if (page === pages && pages > 1) {
        //TODO show only the prve page Button
        button = `${creatButtons(page, 'prev')}`;
    }
    
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResult = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage);
};