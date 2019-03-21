import axios from 'axios';
import { apiKey, corsProxy } from '../config.js';

export default class Recipe {
    
    constructor(id) {
        this.id = id;
    }
    
    async getRecipe () {
        
        try {
            const res = await axios(`${corsProxy}https://www.food2fork.com/api/get?key=${apiKey}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
        }
        
    }
    
    calcTime () {
        // Assuming we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const period = Math.ceil(numIng / 3);
        this.time = period * 15;
    }
    
    calcServings () {
        this.serveings = 4;
    }
    
    parseIngredients () {
        
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const newIngredients = this.ingredients.map(el => {
            
            // 1) uniform the units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            
            // 2) Get rid of the parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            
            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));
            
            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    //TODO eval(arrIng.slice(0, unitIndex).join('+'));
                    count = eval(arrCount.join('+'));
                }
                
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
                
            } else if (parseInt(ingredient[0], 10)) {
                // There is no unit but a number in the first position
                objIng = {
                    count: parseInt(ingredient[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is no Number and no unit
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            }
            
            return objIng;
            
        });
        this.ingredients = newIngredients;
        
    }
}