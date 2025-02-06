const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create an instance of Express
const app = express();

// Add CORS middleware
app.use(cors({
    origin: ['http://127.0.0.1:5501', 'http://localhost:5501'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1804',
    database: 'food_recommendation_based_on_health_analysis'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    const { name, email, password, termsAccepted } = req.body;
    console.log(name, email, password, termsAccepted);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            'SELECT * FROM users_data WHERE email = ?',
            [email],
            (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }

                if (results.length > 0) {
                    return res.status(400).json({ error: 'Email already exists' });
                }

                db.query(
                    'INSERT INTO users_data(name, email, password, terms_accepted) VALUES (?, ?, ?, ?)',
                    [name, email, hashedPassword, termsAccepted],
                    (err) => {
                        if (err) {
                            console.error('Database error:', err);
                            return res.status(500).json({ error: 'Database error' });
                        }

                        res.status(201).json({ message: 'User created successfully' });
                    }
                );
            }
        );
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add new user
app.post('/api/users', async (req, res) => {

    const {userData} = req.body;
    console.log(userData);

    const userId = userData.userId
    const age = userData.age
    const gender = userData.gender
    const weight = userData.weight
    const height = userData.height
    const activityLevel = userData.activityLevel
    const dietaryPreferences = userData.dietaryPreferences
    const healthConditions = userData.healthConditions
    
    try{
        const query = `
            INSERT INTO users 
            (user_id, age, gender, weight, height, activity_level, dietary_preference, health_condition)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            query,
            [userId, age, gender, weight, height, activityLevel, dietaryPreferences, healthConditions],
            (error, results) => {
                if (error) {
                    console.error('Error saving user data:', error);
                    return res.status(500).json({ error: 'Error saving user data' });
                }
                res.status(201).json({
                    message: 'User data saved successfully',
                    // userId: results.insertId
                });
            }
        );
    } 
    catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/allergies', async (req, res) => {

    const {allergyData} = req.body;
    const userId = allergyData.userId
    const allergyName = allergyData.allergyName
    const severityLevel = allergyData.severityLevel
    const diagnosedDate = allergyData.diagnosedDate

    
    try{
        const query = `
            INSERT INTO food_allergy 
            (user_id, allergy_type,severity, diagnosed_on)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            query,
            [userId, allergyName, severityLevel, diagnosedDate],
            (error, results) => {
                if (error) {
                    console.error('Error saving user data:', error);
                    return res.status(500).json({ error: 'Error saving user data' });
                }
                res.status(201).json({
                    message: 'User data saved successfully',
                    userId: results.insertId
                });
            }
        );
    } 
    catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// app.get('api/recipes', (req, res) => {
//     const query = 'SELECT * FROM food_recipes';
//     db.query(query, (err, results) => {
//       if (err) {
//         console.error('Error fetching recipes:', err);
//         res.status(500).send('An error occurred while fetching recipes.');
//         return;
//       }
//       res.json(results);
//       console.log(results);
//     });
//   });


app.get('/api/recipes', (req, res) => {
    const query = 'SELECT * FROM food_recipes';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching recipes:', err.message);
        res.status(500).json({ error: 'An error occurred while fetching recipes.' });
        return;
      }
  
      // Check if any results are returned
      if (results.length === 0) {
        res.status(404).json({ message: 'No recipes found.' });
        return;
      }
  
      // Send the fetched data as a response
      res.status(200).json(results);
      console.log('Fetched recipes:', results);
    });
  });

app.post('/api/recommendations', async (req, res) => {
    const insertQuery = `
    INSERT INTO recommend (user_id, recommended_by, reason, food_name)
    SELECT 
        u.user_id,
        'ai' AS recommended_by, -- Default value for recommended_by
        JSON_OBJECT('health_condition', u.health_condition, 'dietary_preference', u.dietary_preference) AS reason,
        f.food_name
    FROM users u
    JOIN diseases d ON u.health_condition = d.health_condition
    JOIN food_items f ON d.disease_id = f.disease_id
    WHERE u.dietary_preference = f.dietary_restriction
      AND NOT EXISTS (
          SELECT 1 
          FROM recommend r
          WHERE r.user_id = u.user_id
            AND r.food_name = f.food_name
            AND r.recommended_by = 'ai'
  );
    `;

    db.query(insertQuery, (error, results) => {
        if (error) {
            console.error('Error inserting food recommendations:', error);
            return res.status(500).json({
                success: false,
                message: 'Error inserting food recommendations',
                error: error.message
            });
        }

        if (results.affectedRows > 0) {
            return res.status(201).json({
                success: true,
                message: 'Food recommendations inserted successfully',
                insertedRows: results.affectedRows
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'No matching recommendations found to insert'
            });
        }
    });
});


app.get('/api/getrecommendations', (req, res) => {
    const userId = req.query.userId; // Get the userId from query parameters

    if (!userId) {
        return res.status(400).json({ message: 'UserId is required.' }); // Validation
    }


    const query = `
        SELECT food_name, reason 
        FROM recommend 
        WHERE user_id = ?
    `;

    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error executing query:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Error retrieving recommendations',
                error: error.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No recommendations found for the specified user'
            });
        }

        res.status(200).json({
            success: true,
            recommendations: results
        });
    });
});
  
// // Define the PORT
const PORT = 3000;

// // Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});