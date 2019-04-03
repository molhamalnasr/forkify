import axios from 'axios';
import { apiKey, corsProxy } from '../config.js';

export default class Search {
    
    constructor(query) {
        this.query = query;
    }
    
    async getRecipe() {

        try {
            const res = await axios(`${corsProxy}https://www.food2fork.com/api/search?key=${apiKey}&q=${this.query}`);
            this.result = res.data.recipes;
        } catch (error) {
            console.log(error);
        }

    }
    
}