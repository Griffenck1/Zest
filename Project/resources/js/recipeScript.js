var recipes = [{'name': 'Mac & Cheese', 'ingredients': ['Pasta', 'Cheese', 'Butter', 'Milk']},
               {'name': 'Chicken Parmesan', 'ingredients': ['Chicken', 'Pasta', 'Parmesan Cheese']},
            ];

var temp = [];

function loadRecipes(id) {
    var name;
    var len = recipes.length;

    for(var i = 0; i < len; i++) {
        name = recipes[i].name;
        document.getElementById(id).innerHTML += "<a href='#' class='list-group-item list-group-item-action' data-toggle='modal' data-target='#recipeModal' onclick='editRecipe(this, " + i + ")'>" + name + "</a>";
    }
}

function saveRecipe(id, name, x) {
    var recipe = document.getElementById(name);
    var len = recipes.length;
    
    if(recipe.value == "") {
        x.removeAttribute('data-dismiss')
        alert('You must enter a name for your new recipe.');
        recipe.style.borderColor = 'red';
        return;
    }

    x.setAttribute('data-dismiss', 'modal')
 
    recipes.push({'name': recipe.value, 'ingredients': temp});
    
    document.getElementById(id).innerHTML += "<a href='#' class='list-group-item list-group-item-action' data-toggle='modal' data-target='#recipeModal' onclick='editRecipe(this, " + len + ")'>" + recipe.value + "</a>";
    recipe.value = "";
    recipe.style.borderColor = 'lightgrey';
    temp = [];
}

function addIngredient(formID, rowID) {
    var row = document.getElementById(rowID);
    var clone = row.cloneNode(true);

    clone.style.display = "flex";

    document.getElementById(formID).append(clone);    
}

function saveIng(val) {
    temp.push(val);
}

function editRecipe(id, index) {
    var name = id.text;

    document.getElementById('recipeModalTitle').innerHTML = name;
    
    var ing = document.getElementById('recipeModalContent');
    var len = recipes[index].ingredients.length;
    
    ing.innerHTML = '';

    for(var i = 0; i < len; i++) {
        ing.innerHTML += "<li>" + recipes[index].ingredients[i] + "</li>";
    }
}

function del(x) {
    x.remove();
}

function update(x) {
    var name = x.childNodes[1].childNodes[3].value;
    var len = temp.length;
    var updatedArr = [];

    for(var i = 0; i < len; i++) {
        if(temp[i] == name) {
            delete temp[i];
        }
    }

    for(var i = 0; i < len; i++) {
        if(temp[i] != undefined) {
            updatedArr.push(temp[i]);
        }
    }    

    temp = updatedArr;
    
    del(x);
}