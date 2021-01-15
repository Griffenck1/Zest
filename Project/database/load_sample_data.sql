INSERT INTO zest_data.user_data(username, password, first_name, last_name, about_me)
    VALUES('YeetLord', 'YeetMe#64', 'Sir', 'Yeet', 'I am the lord of yeet, my food will yeet your taste buds'),
    ('Overlord', 'AmazonRules!74', 'Jeff', 'Bezos', 'I am not Jeff Bezos'),
    ('Griffenck1', 'BigOof#22', 'Griffen', 'Cook', 'The name is Cook the game is cook');

INSERT INTO zest_data.meal(servings, meal_name, short_description, instructions)
    VALUES (3, 'Chili', 'It is chili, it tastes good.', '1. Cut veggies \n 2. Cook'),
    (4, 'Spaghetti', 'Do you need an explanation?', '1. Cook pasta \n 2.Add Sauce'),
    (2, 'Eggs Benedict', 'Over easy eggs smothered in hollandaise sauce', '1.Cook eggs over easy \n 2.Add hollandaise');

INSERT INTO zest_data.user_has_meal(user_id, meal_id, rating)
    VALUES (1, 1, 5),
    (1, 3, 4),
    (2, 2, 2),
    (3, 1, 4),
    (3, 2, 3),
    (3, 3, 4);

INSERT INTO zest_data.ingredient(ingredient_name)
    VALUES ('Jalapeno'),
    ('Red Bell Pepper'),
    ('Onion'),
    ('Chili Powder'),
    ('Tomato Sauce'),
    ('Spaghetti'),
    ('Marinara'),
    ('Egg'),
    ('Butter'),
    ('Hollandaise mix'),
    ('English Muffin'),
    ('Ham');

INSERT INTO zest_data.meal_has_ingredient(meal_id, ingredient_id, amount, measurement)
    VALUES (1, 1, 2, ''),
    (1, 2, 1, ''),
    (1, 3, 1, ''),
    (1, 4, 2, 'Tbsp'),
    (1, 5, 8, 'oz'),
    (2, 6, 1, 'lb'),
    (2, 7, 12, 'oz'),
    (3, 8, 2, ''),
    (3, 9, 4, 'tbsp'),
    (3, 10, 1, 'package'),
    (3, 11, 2, ''),
    (3, 12, 2, 'slices');

INSERT INTO zest_data.tag(id_name)
    VALUES('Vegetarian'),
    ('Vegan'),
    ('Gluten Free');

INSERT INTO zest_data.user_has_tag(user_id, tag_id)
    VALUES (1, 1),
    (1,2),
    (2, 3);

INSERT INTO zest_data.meal_has_tag(meal_id, tag_id)
    VALUES (1, 3),
    (2, 1),
    (2, 2);

INSERT INTO zest_data.planned_meal(date, meal_type, user_id, meal_id)
    VALUES (CURRENT_DATE, 'Breakfast', 3, 3),
    (CURRENT_DATE+1, 'Lunch', 3, 2),
    (CURRENT_DATE+5, 'Dinner', 3, 2);