//used to store what user is logged in
var user_id = '';

//To set environmental variables
require('dotenv').config();

//Create Database Connection
var pgp = require('pg-promise')();

const dbConfig = {
    user: String(process.env.DBUSER),
    host: 'localhost',
    database: 'zest_db',
    password: String(process.env.DBPASSWORD),
    port: '5432',
};

var db = pgp(dbConfig);

//dependancies for node.js server
var express = require('express');
var app = express();
var url = require('url');
var fs = require('fs');
var http = require('http');
var path = require('path');
const bodyParser = require("body-parser");
const { response } = require('express');
const router = express.Router();

//allows us to use .ejs files with a view engine
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));

/*
Login and Registration:
All functionality for the Login and Registrations pages goes here
*/
app.get('/', function(req, res) {
    res.render('login',{
        my_title: "login",
        data: ``
    })
});

app.get('/registration', function(req, res) {
    res.render('registration',{
        my_title: 'registration',
        data: ''
    });
})

app.post('/login' , function(request,response){
    //finds username and password from the body of the html
    var username = request.body.username;
    var password = request.body.password;
    //if both username and password exist
    if(username && password){
        var query = "SELECT username, password, id FROM zest_data.user_data WHERE username = '" + username + "' AND PASSWORD = '" + password + "' ;"
        db.task('get-everything', task => {
            return task.batch([
                task.any(query)
            ]);
        })
        .then(info => {
            if(info[0].length > 0){
                user_id = info[0][0].id;
                response.redirect('/homepage');
            }
            else{
                response.render('login',{
                    data: `
                    <br>
                    <div class="card">
                        <div class="card-body">
                            <h6>Warning: Invalid Username or Password</h6>
                        </div>
                    </div>`
                })
            }
        })
        .catch(err => {
                console.log('error', err);
        });
    }
});

app.post('/register', function(req, res) {
    //finds username and password from the body of the html
    var username = req.body.username;
    var password = req.body.password;
    var confirmpassword = req.body.confirmpassword;
    //if both username and password exist
    if(username && password && confirmpassword && (confirmpassword == password)){
        var query = "SELECT username, password FROM zest_data.user_data WHERE username = '" + username + "';";
        var insert = "INSERT INTO zest_data.user_data(username, password) VALUES('" + username + "', '" + password +"');";
        db.task('get-everything', task => {
            return task.batch([
                task.any(query)
            ]);
        })
        .then(info => {
            if(info[0].length == 0){
                db.task('create user', task => {
                    return task.batch([
                        task.any(insert)
                    ]);
                })
                .catch(err => {
                    console.log('error', err);
                });
                res.render('login',{
                    data: `
                    <br>
                    <div class="card">
                        <div class="card-body">
                            <h6>Registration Successfull!</h6>
                        </div>
                    </div>`
                });
            }
            else{
                res.render('registration',{
                    data: `
                    <br>
                    <div class="card">
                        <div class="card-body">
                            <h6>Warning: Username already exists</h6>
                        </div>
                    </div>`
                });
            }
        })
        .catch(err => {
                console.log('error', err);
        });
    }
    else if (confirmpassword != password) {
        res.render('registration',{
            data: `
            <br>
            <div class="card">
                <div class="card-body">
                    <h6>Warning: Passwords do not match</h6>
                </div>
            </div>`
        });
    }
})

/*
Homepage:
All functionality for homepage goes here
*/
app.get('/homepage', function(req, res) {
    res.render('homepage',{
        my_title: 'homepage',
        data: ``
    })
});

/*
Calendar:
All functionaility for the calendar goes here

Turn back now ye of faint heart
*/
app.get('/calendar', function(req, res) {
    var current_date = new Date;

    var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    var all_users_meal_ids = [];

    var relative_dates = [];
    var meal_ids = [];
    var meal_names = [];
    var meal_types = [];
    //tracks what meal slots are taken so we can accurately add and remove slots
    //0 means the slot is empty
    var meal_slots = [[], [], [], [], [], [], []];
    var query = 'SELECT date::varchar, meal_id, meal_type FROM zest_data.planned_meal WHERE user_id = ' + user_id + ';';
    var find_all_user_meal_ids = 'SELECT meal_id from zest_data.user_has_meal WHERE user_id = ' + user_id + ';';
    db.task('get-everything', task => {
        return task.batch([
            task.any(query),
            task.any(find_all_user_meal_ids)
        ]);
    })
    .then(info => {
        var firstday = current_date.getDate();
        all_users_meal_ids  = info[1];
        var i = 0;
        while(i < (info[0].length)){
            date_string = String(info[0][i].date);
            meal_ids = meal_ids.concat(info[0][i].meal_id);
            meal_types = meal_types.concat(info[0][i].meal_type);
            year = String(info[0][i].date)[0] + String(info[0][i].date)[1] + String(info[0][i].date)[2] + String(info[0][i].date)[3];
            month = String(info[0][i].date)[5] + String(info[0][i].date)[6];
            day = String(info[0][i].date)[8] + String(info[0][i].date)[9];
            if((year == current_date.getFullYear()) & ((month == current_date.getMonth()+1))){
                if(((day-firstday) >= 0) && ((day - firstday) < 8)){
                    relative_date = (day - firstday) %7;
                    relative_dates = relative_dates.concat(relative_date);
                    meal_slots[relative_date] = meal_slots[relative_date].concat(info[0][i].meal_type);
                }
                else{
                    relative_dates = relative_dates.concat(-1);
                }
            }
            i += 1;
        }
        //create list of empty meal slots
        var empty_meal_slots = [['Breakfast', 'Lunch', 'Dinner'], ['Breakfast', 'Lunch', 'Dinner'], ['Breakfast', 'Lunch', 'Dinner'], ['Breakfast', 'Lunch', 'Dinner'], ['Breakfast', 'Lunch', 'Dinner'], ['Breakfast', 'Lunch', 'Dinner'], ['Breakfast', 'Lunch', 'Dinner']];
        i = 0;
        var k;
        while(i < empty_meal_slots.length){
            j = 0;
            while(j < empty_meal_slots[i].length){
                k = 0;
                while(k < meal_slots.length){
                    if(empty_meal_slots[i][j] == meal_slots[i][k]){
                        empty_meal_slots[i][j] = '';
                    }
                    k+=1;
                }
                j+=1;
            }
            i+=1;
        }
        //query 2, yayyyy!
        var query2 = 'SELECT id, meal_name FROM zest_data.meal;';
        db.task('get-everything', task => {
            return task.batch([
                task.any(query2)
            ]);
        })
        .then(info => {
            i = 0;
            var j;
            while(i < meal_ids.length){
                j = 0;
                while(j < info[0].length){
                    if(meal_ids[i] == info[0][j].id){
                        meal_names = meal_names.concat(info[0][j].meal_name);
                    }
                    j += 1
                }
                i += 1;
            }
            //add selection to add for for every empty meal slot
            selections_to_add = '';
            i = 0;
            while(i < empty_meal_slots.length){
                if(empty_meal_slots[i].length > 0){
                    j = 0;
                    while(j < empty_meal_slots[i].length){
                        if(empty_meal_slots[i][j] != ''){
                            var thisdate = String(current_date.getFullYear()) + '-' + String(current_date.getMonth()+1) + '-';
                            if(current_date.getDate.length < 2){
                                thisdate += '0';
                            }
                            thisdate += String(current_date.getDate()+i);
                            var value_arr = empty_meal_slots[i][j] + ' ' + thisdate;
                            selections_to_add += '<option value="' + value_arr + '">' + empty_meal_slots[i][j] + ' ' + weekdays[(current_date.getDay()+i)%7] + ' ' + (current_date.getMonth()+1) +'/'+ (current_date.getDate()+i) + '</option>';
                        }
                        j += 1;
                    }
                }
                i += 1
            }

            names_to_add='';
            i=0;
            while(i < info[0].length){
                j =0;
                while(j < all_users_meal_ids.length){
                    if(info[0][i].id == all_users_meal_ids[j].meal_id){
                        names_to_add += '<option value="' + all_users_meal_ids[j].meal_id + '">' + info[0][i].meal_name + '</option>';
                    }
                    j+=1;
                }
                i+=1;
            }

            add_form_html =`<h1>Add</h1>
            <form action="addPlan" method="POST">
                <select class="form-control" name="toAddDate">`
                    + selections_to_add +
                `</select>
                <select class="form-control" name="toAddName">`
                    + names_to_add + 
                `</select>
                <button type="submit" class="btn btn-primary mb-2">Add</button>
            </form>
            `

            //add selections to delete form for every used time slot
            selections_to_delete = '';
            i = 0;
            while(i < meal_slots.length){
                if(meal_slots[i].length > 0){
                    j = 0;
                    while(j < meal_slots[i].length){
                        var thisdate = String(current_date.getFullYear()) + '-' + String(current_date.getMonth()+1) + '-';
                        if(current_date.getDate.length < 2){
                            thisdate += '0';
                        }
                        thisdate += String(current_date.getDate()+i);
                        var value_arr = meal_slots[i][j] + ' ' + thisdate;
                        selections_to_delete += '<option value="' + value_arr + '">' + meal_slots[i][j] + ' ' + weekdays[(current_date.getDay()+i)%7] + ' ' + (current_date.getMonth()+1) +'/'+ (current_date.getDate()+i) + '</option>';
                        j += 1;
                    }
                }
                i += 1
            }

            delete_form_html =`<h1>Delete</h1>
                                <form action="deletePlan" method="POST">
                                    <select class="form-control" name="toDelete">`
                                        + selections_to_delete +
                                    `</select>
                                    <button type="submit" class="btn btn-primary mb-2">Delete</button>
                                </form>
                            `

            res.render('calendar',{
                my_title: 'calendar',
                date: current_date,
                meal_types: meal_types,
                relative_dates: relative_dates,
                meal_names: meal_names,
                add_form_html: add_form_html,
                delete_form_html: delete_form_html
            })
        })
        .catch(err => {
                console.log('error', err);
        });
    })
    .catch(err => {
            console.log('error', err);
    });
});

app.post('/deletePlan' , function(req,res){
    var meal_type = '';
    var date = '';
    var i = 0;
    var next = false;
    while(i < req.body.toDelete.length){
        if(next == false && req.body.toDelete[i] == ' '){
            next = true;
        }
        else{
            if(next == false){
                meal_type += req.body.toDelete[i];
            }else{
                date += req.body.toDelete[i];
            }
        }
        i+=1;
    }
    var query = "DELETE FROM zest_data.planned_meal WHERE (date ='" + date + "') AND (meal_type ='" + meal_type + "');";
    db.task('get-everything', task => {
        return task.batch([
            task.any(query)
        ]);
    })
    .then(info => {res.redirect('/calendar');})
    .catch(err => {console.log('error', err);});
});

app.post('/addPlan' , function(req,res){
    var meal_type = '';
    var date = '';
    var i = 0;
    var next = false;
    while(i < req.body.toAddDate.length){
        if(next == false && req.body.toAddDate[i] == ' '){
            next = true;
        }
        else{
            if(next == false){
                meal_type += req.body.toAddDate[i];
            }else{
                date += req.body.toAddDate[i];
            }
        }
        i+=1;
    }
    var meal_id = req.body.toAddName;
    var query = "INSERT INTO zest_data.planned_meal(date, meal_type, user_id, meal_id) VALUES('" + date + "','" + meal_type + "'," + user_id + "," + meal_id + ");";
    db.task('get-everything', task => {
        return task.batch([
            task.any(query)
        ]);
    })
    .then(info => {res.redirect('/calendar');})
    .catch(err => {console.log('error', err);});
});

/*
Shopping List:
All functionality for the shopping list goes here
Functionality needed to be added: 
- Create a shopping list based off of the elements loaded in the sample data
- Add elements to the shopping list based off of click of a button
- Include the date on the shopping list card
Questions: 
 * No need for a post request ??? --> Make sure to ask
 * 
Notes: 
- No need for an insert because we are simply just reading information from the database and displaying it on the page
- No need for a post request because there is no information needing to be hidden from the user
*/
app.get('/shoppingList', function(req, res) {
    
    var userData = "SELECT * user_data FROM zest.data.user_data;"; 
    var date = "SELECT * zest_data.day;";
    var ingredients = "SELECT * zest_data.ingredient;";

    var meal_ids = [];
    var ingredient_amt = [];
    var ingredient_name = [];
    var ingredient_unit = [];

    var findmeals = "SELECT meal_id FROM zest_data.planned_meal WHERE user_id = " + user_id + ";";

    db.task('get-everything', task => {
        return task.batch([
            task.any(findmeals)
        ]);
    })
    .then(info => {
        meal_ids = info[0];
        var meal_id_str = "";
        var i = 0;
        while(i < meal_ids.length){
            if(i == 0){
                meal_id_str += String(meal_ids[i].meal_id);
            }
            else{
                meal_id_str += 'OR meal_id=' + String(meal_ids[i].meal_id) + ' ';
            }
            i+=1;
        }
        var findingredients;
        if(meal_id_str.length > 1){
            findingredients = "SELECT zest_data.meal_has_ingredient.amount ,zest_data.ingredient.ingredient_name, zest_data.meal_has_ingredient.meal_id, zest_data.meal_has_ingredient.measurement FROM zest_data.meal_has_ingredient INNER JOIN zest_data.ingredient ON zest_data.meal_has_ingredient.ingredient_id = zest_data.ingredient.id WHERE zest_data.meal_has_ingredient.meal_id=" + meal_id_str + " ORDER BY zest_data.meal_has_ingredient.meal_id ASC;";
        }
        else{
            findingredients = "SELECT zest_data.meal_has_ingredient.amount ,zest_data.ingredient.ingredient_name, zest_data.meal_has_ingredient.meal_id, zest_data.meal_has_ingredient.measurement FROM zest_data.meal_has_ingredient INNER JOIN zest_data.ingredient ON zest_data.meal_has_ingredient.ingredient_id = zest_data.ingredient.id WHERE zest_data.meal_has_ingredient.meal_id= -1"
        }
        db.task('get-everything', task => {
            return task.batch([
                task.any(findingredients)
            ]);
        })
        .then(info => {
            i = 0;
            //find all ingredients
            while(i < meal_ids.length){
                j = 0;
                while(j < info[0].length){
                    if(info[0][j].meal_id == meal_ids[i].meal_id){
                        ingredient_name = ingredient_name.concat(info[0][j].ingredient_name);
                        ingredient_amt = ingredient_amt.concat(info[0][j].amount);
                        ingredient_unit = ingredient_unit.concat(info[0][j].measurement);
                    }
                    j+=1;
                }
                i+=1
            }
            //look through ingredients and simplify
            i = 0;
            while(i < ingredient_name.length){
                j = 0;
                while(j < ingredient_name.length){
                    if((j != i) && ingredient_name[i] == ingredient_name[j]){
                        ingredient_amt[i] = ingredient_amt[i] + ingredient_amt[j];
                        ingredient_name.splice(j, 1);
                        ingredient_amt.splice(j, 1);
                        ingredient_unit.splice(j, 1);
                    }
                    j+=1;
                }
                i+=1;
            }
            res.render('shoppingList',{
                    my_title: 'shoppingList',
                    ingredient_amt: ingredient_amt,
                    ingredient_name: ingredient_name,
                    ingredient_unit: ingredient_unit
            })
        })
        .catch(err => { // Case if query was unsuccessful 
            console.log('error', err);
        });
    })
    .catch(err => { // Case if query was unsuccessful 
        console.log('error', err);
    });
});


/*
Recipe Book:
All functionality for the recipe book goes here
*/
app.get('/recipeBook', function(req, res) {
    res.render('recipeBook',{
        my_title: 'recipeBook',
        data: ``
    })
});

/*
Profile Page:
All functionality for the Profile page goes here
*/
app.get('/profilePage', function(req, res) {
    res.render('profilePage',{
        my_title: 'profilePage',
        data: ``
    })
})

app.post('/profilePage', function(req, res) 
//profile page updates last name, first name and password, uses same functionality as register page
{
    //finds lastname, firstname and password from the body of the html
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var password = req.body.password;
    var password2 = req.body.password2;
    //if both username and password exist
    if(firstname && lastname && password && password2 && (password2 == password)){
        var query = "SELECT first_name, password FROM zest_data.user_data WHERE first_name = '" + firstname + "';";
        var insert = "INSERT INTO zest_data.user_data(first_name, last_name, password) VALUES('" + firstname + "', '" + lastname + "','" + password + "');";
        db.task('get-everything', task => {
            return task.batch([
                task.any(query)
            ]);
        })
        .then(info => {
            if(info[0].length == 0){
                db.task('update user', task => {
                    return task.batch([
                        task.any(insert)
                    ]);
                })
                .catch(err => {
                    console.log('error', err);
                });
                res.render('login',{
                    data: `
                    <br>
                    <div class="card">
                        <div class="card-body">
                            <h6>Information Update Successfull!</h6>
                        </div>
                    </div>`
                });
            }
            else{
                res.render('profilePage',{
                    data: `
                    <br>
                    <div class="card">
                        <div class="card-body">
                            <h6>Warning: name already exists</h6>
                        </div>
                    </div>`
                });
            }
        })
        .catch(err => {
                console.log('error', err);
        });
    }
    else if (password2 != password) {
        res.render('profilePage',{
            data: `
            <br>
            <div class="card">
                <div class="card-body">
                    <h6>Warning: Passwords do not match</h6>
                </div>
            </div>`
        });
    }
})
//end of page functionality
app.listen(8082);
