DROP TABLE IF EXISTS zest_data.user_has_meal;
DROP TABLE IF EXISTS zest_data.meal_has_ingredient;
DROP TABLE IF EXISTS zest_data.user_has_tag;
DROP TABLE IF EXISTS zest_data.meal_has_tag;
DROP TABLE IF EXISTS zest_data.planned_meal;
DROP TABLE IF EXISTS zest_data.user_data;
DROP TABLE IF EXISTS zest_data.meal;
DROP TABLE IF EXISTS zest_data.ingredient;
DROP TABLE IF EXISTS zest_data.tag;

DROP SCHEMA IF EXISTS zest_data;

CREATE SCHEMA zest_data;

CREATE TABLE zest_data.user_data (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    username VARCHAR(45) NOT NULL UNIQUE,
    password VARCHAR(45) NOT NULL,
    first_name VARCHAR(45),
    last_name varchar(45),
    about_me varchar(280),
    user_image bytea
);

CREATE TABLE zest_data.meal (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    servings INT NOT NULL,
    meal_name VARCHAR(45) NOT NULL,
    short_description VARCHAR(280),
    instructions VARCHAR(5600),
    blog VARCHAR(5600),
    meal_image bytea
);

CREATE TABLE zest_data.user_has_meal (
    user_id INT NOT NULL,
    meal_id INT NOT NULL,
    rating INT,
    PRIMARY KEY (user_id, meal_id),
    CONSTRAINT fk_user_has_meal_user
        FOREIGN KEY(user_id)
        REFERENCES zest_data.user_data(id),
    CONSTRAINT fk_user_has_meal_meal
        FOREIGN KEY(meal_id)
        REFERENCES zest_data.meal(id)
);

CREATE TABLE zest_data.ingredient (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    ingredient_name VARCHAR(45) NOT NULL
);

CREATE TABLE zest_data.meal_has_ingredient (
    meal_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    amount INT NOT NULL,
    measurement VARCHAR(45) NOT NULL,
    CONSTRAINT fk_meal_has_ingredient_meal
        FOREIGN KEY(meal_id)
        REFERENCES zest_data.meal(id),
    CONSTRAINT fk_meal_has_ingredient_ingredient
        FOREIGN KEY(ingredient_id)
        REFERENCES zest_data.ingredient(id)
);

CREATE TABLE zest_data.tag (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    id_name VARCHAR(45)
);

CREATE TABLE zest_data.user_has_tag (
    user_id INT NOT NULL ,
    tag_id INT NOT NULL ,
    PRIMARY KEY (user_id, tag_id),
    CONSTRAINT fk_user_has_tag_user
        FOREIGN KEY(user_id)
        REFERENCES zest_data.user_data(id),
    CONSTRAINT fk_user_has_tag_tag
        FOREIGN KEY(tag_id)
        REFERENCES zest_data.tag(id)
);

CREATE TABLE zest_data.meal_has_tag (
    meal_id INT NOT NULL ,
    tag_id INT NOT NULL ,
    PRIMARY KEY (meal_id, tag_id),
    CONSTRAINT fk_user_has_tag_user
        FOREIGN KEY(meal_id)
        REFERENCES zest_data.meal(id),
    CONSTRAINT fk_user_has_tag_tag
        FOREIGN KEY(tag_id)
        REFERENCES zest_data.tag(id)
);

CREATE TABLE zest_data.planned_meal (
    date DATE NOT NULL,
    meal_type VARCHAR(45) NOT NULL,
    meal_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (date, meal_type, user_id),
    CONSTRAINT fk_planned_meal_user
        FOREIGN KEY(user_id)
        REFERENCES zest_data.user_data(id),
    CONSTRAINT fk_planned_meal_meal
        FOREIGN KEY(meal_id)
        REFERENCES zest_data.meal(id)
)