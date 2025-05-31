const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
require('dotenv').config()

console.log(process.env)

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));

const pool = new Pool({
  user: process.env.DBUSER,
  host: 'localhost',
  database: process.env.DB,
  password: process.env.PASSWORD,
  port: 5432,
});

app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/items/:id', async (req, res) => {
try{
	const id = parseInt(req.params.id); // Parse ID from URL parameter
	console.log(id);
	const query = {
		text: 'DELETE FROM items WHERE item_id = $1',
		values: [id],
	}

	const result = await pool.query(query);
	console.log(result.rows[0]);
        res.send("DELETE Request Caled")
} catch(err){
	res.status(500).json({error: err.message});
}
    })

app.post('/item',async (req, res) => {
	console.log(req.body);
try{
	const itemName = req.body.item;
	const authorName = req.body.author;

        const query = {
                text: 'INSERT INTO items(item, author) VALUES($1,$2)',
                values: [itemName, authorName],
        }

        const result = await pool.query(query);
        console.log(result.rows[0]);
	res.send("OK");
}
catch (error) {
	res.status(500).json({error: error.message});
}
    })

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
