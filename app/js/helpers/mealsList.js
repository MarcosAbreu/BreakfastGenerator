export default class mealsList{
    constructor(){
        this.list = [
            {
                "name": "Lemon Juice",
                "category": "Group 1"
            },
            {
                "name": "Papaya Yogurt",
                "category": "Group 1"
            },
            {
                "name": "Mussarela Cheese",
                "category": "Group 4"
            },
            {
                "name": "French Bread",
                "category": "Group 2"
            },
            {
                "name": "Cream Cheese",
                "category": "Group 3"
            }];
    };
    getMealsList(){
        return this.list;
    }
    addMealToList(item){
        let obj = {
            "name": item[0],
            "category": item[1]
        };
        this.list.push(obj);
        
    }
    removeMealFromList(item){
        let index;
        for (let ind = 0; ind < this.list.length; ind++) {
            if(this.list[ind].name == item){
                index = ind;
            }
        }        
        this.list.splice(index, 1);
    }
    checkInList(item){
        for (let index = 0; index < this.list.length; index++) {
            if(this.list[index].name == item){
                return false;
            }
        }
        return true;
    }
} 