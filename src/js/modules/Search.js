import axios from 'axios';

export default class Search {
    
    constructor(query) {
        this.query = query;
    }
    
    async getRecipe() {

        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        const apiKey = '1469b8ad9c6f546dffaaac901805a9bf';
        try {
            const res = await axios(`${corsProxy}https://www.food2fork.com/api/search?key=${apiKey}&q=${this.query}`);
            this.result = res.data.recipes;
            //TODO delete console log from the module file
            // console.log(this.result);
        } catch (error) {
            console.log(error);
        }

    }
    
}