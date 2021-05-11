const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { Pool } = require("pg");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// GET METHOD TEMPLATE

app.get('/AntiverosGulayan_2.1.1', async (req,res) => {
    try {
        const query = await pool.query(`SELECT COUNT (*) FROM film;`);
        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
    }
})

app.get('/AntiverosGulayan_2.1.3', async (req,res) => {
    try {
        const query = await pool.query(`
        SELECT film_id,title, ROUND(MAX(replacement_cost),0) AS "Max" 
        FROM film
        GROUP BY film_id
        ORDER BY film_id ASC;`);
        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
    }
})

app.get('/AntiverosGulayan_2.1.2', async (req,res) => {
    try {
        const query = await pool.query(`
        SELECT rating, SUM( rental_duration )
        FROM film
        GROUP BY rating
        ORDER BY rating;`);
        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
    }
})

app.get('/AntiverosGulayan_2.2.1', async (req,res) => {
    try {
        const query = await pool.query(`SELECT * FROM midterm_list_of_films limit 10;`);
        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
    }
})

app.get('/AntiverosGulayan_2.2.2', async (req,res) => {
    try {
        const query = await pool.query(`SELECT * FROM midterm_list_of_films_per_category limit 10;`);
        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
    }
})

app.get('/AntiverosGulayan_2.3.1', async (req,res) => {
    try {
        const query = await pool.query(`SELECT film_id, title
        FROM film
        UNION
        SELECT category_id, name
        FROM category limit 10;`);
        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
    }
})

app.get('/AntiverosGulayan_2.3.2', async (req,res) => {
    try {
        const query = await pool.query(`
        SELECT CONCAT (a.first_name,'',a.last_name) AS "Actor", title AS "Film" 
        FROM film AS "f"
        JOIN actor AS "a"
        ON a.actor_id = f.film_id
        WHERE first_name LIKE '%a%';`);
        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
    }
})

// POST METHOD template

app.post('/get_film_category_count', async (req, res) => {
    try {
        const data = req.body;
        const query = await pool.query(`
        SELECT public.get_film_category_count_proced(
            id_from => $1,
            id_to => $2
        )
        `,[data.id_from,data.id_to]);
        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
    }
});

app.post('/count_rating', async (req, res) => {
    try {
        const data = req.body;
        const query = await pool.query(`
            SELECT public.count_rating(
                dur => $1
            )
        `,[data.dur]);
        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
    }
});


app.listen(5000, ()=> {
    console.log(`connected to the server`);
});