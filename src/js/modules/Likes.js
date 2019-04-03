export default class Likes {
    
    constructor () {
        this.likes = [];
    }
    
    addLike (id, title, author, img) {
        const like = {
            id,
            title,
            author,
            img
        };
        this.likes.push(like);
        
        // Persist Data in localStorage
        this.persistDate();
        
        return like;
    }
    
    deleteLike (id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        
        // Delete Data in localStorage
        this.persistDate();
    }
    
    isLiked (id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }
    
    getNumLikes () {
        return this.likes.length;
    }
    
    persistDate () {
        localStorage.setItem('Liks', JSON.stringify(this.likes));
    }
    
    readStorage () {
        const storage = JSON.parse(localStorage.getItem('Liks'));
        
        // Restoring likes from localStorage
        if (storage) this.likes = storage;
    }
    
}