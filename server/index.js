

const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const port = 3001;

const cookieParser = require('cookie-parser');


const { encrypt, decrypt } = require("./encryption.js");


app.use(cors());
app.use(express.json());
app.use(cookieParser());

// const masterPasswordEx = "password";


const db = mysql.createConnection({
    user    : 'root',
    host    : 'localhost',
    password: 'ahmad123',
    database: 'issadb',
});


// Attempt to connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

db.on('error', (err) => {
    console.error('MySQL database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        // Reconnect to the database if the connection is lost
        db.connect();
    } else {
        throw err;
    }
});

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.post("/validatemasterpassword", (req, res) => {
    const userId = req.body.userId;
    const masterPassword = req.body.masterPassword;

    db.query("SELECT * FROM users WHERE id = ?", [userId], async (err, result) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).send("Error fetching user");
        } else {
            if (result.length > 0) {
                const user = result[0];

                // Verify the password
                const isPasswordValid = await decrypt({
                    password: user.password,
                    salt: user.salt,
                    iv: user.iv
                }, masterPassword) === masterPassword;

                if (isPasswordValid) {
                    res.status(200).json({ success: true, message: 'Master password is valid' });
                } else {
                    res.status(401).json({ success: false, message: 'Invalid master password' });
                }
            } else {
                res.status(404).send("User not found");
            }
        }
    });
});

app.post('/saveuser', (req, res) => {
    const user = req.body;
  
    console.log('Received user information:', user);
    
    res.status(200).send('User information received');
  });


app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    const masterPassword = password;
    // Hash the user's password
    const hashedPassword = await encrypt(password, masterPassword);

    db.query(
        "INSERT INTO users (username, email, password, salt, iv) VALUES (?,?,?,?,?)",
        [username, email, hashedPassword.password, hashedPassword.salt, hashedPassword.iv],
        (err, result) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                res.status(500).send("Error creating user");
            } else {
                console.log('User created:', result);
                res.send("User created");
            }
        }
    );
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const masterPassword = password;
    // Fetch the user from the database
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).send("Error fetching user");
        } else {
            if (result.length > 0) {
                const user = result[0];

                // Verify the password
                const isPasswordValid = await decrypt({
                    password: user.password,
                    salt: user.salt,
                    iv: user.iv
                }, masterPassword) === password;

                const userPassword = await decrypt({
                    password: user.password,
                    salt: user.salt,
                    iv: user.iv
                }, masterPassword);

                if (isPasswordValid) {
                    res.send({ user: { id: user.id, name: user.name, email: user.email, password: userPassword } });
                } else {
                    res.status(401).send("Invalid password");
                }
            } else {
                res.status(404).send("User not found");
            }
        }
    });
});


app.get("/showpasswords", (req, res) => {
    const userId = req.query.userId; // Include userId in the request query parameters
    db.query("SELECT * FROM passwords WHERE userId = ?", [userId], (err, result) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).send("Error fetching passwords");
        } else {
            // console.log('Passwords fetched:', result);
            res.send(result);
        }
    });
});

app.post("/decryptpassword", (req, res) => {
    const { password, salt, iv } = req.body; 
    const masterPassword = req.body.userPassword;
    const decryptedPassword = decrypt({ password, salt, iv }, masterPassword);
    res.send(decryptedPassword);
});


app.post("/addpassword", (req, res) => {
    const password = req.body.password;
    const title =  req.body.title; 
    const userId = req.body.userId;
    const masterPassword = req.body.userPassword;

    console.log('User ID received:', userId);

    const hashedPassword = encrypt(password, masterPassword);

    db.query(
        "INSERT INTO passwords (password, title, iv, salt, userId) VALUES (?,?,?,?,?)",
        [hashedPassword.password, title, hashedPassword.iv, hashedPassword.salt, userId],
        (err, result) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                res.status(500).send("Error inserting values");
            } else {
                console.log('Values Inserted:', result);
                res.send("Values Inserted");
            }
        }
    );
});


app.get("/getuserid", (req, res) => {
    const userEmail = req.query.email;

    db.query("SELECT id FROM users WHERE email = ?", [userEmail], (err, result) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).send("Error fetching user ID");
        } else {
            if (result.length > 0) {
                const userId = result[0].id;
                res.send({ userId });
            } else {
                res.status(404).send("User not found");
            }
        }
    });
});

app.post("/deletepassword", (req, res) => {
    const passwordId = req.body.passwordId;
    db.query("DELETE FROM passwords WHERE id = ?", [passwordId], (err, result) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).send("Error deleting password");
        } else {
            console.log('Password deleted:', result);
            res.send("Password deleted");
        }
    });
});

app.listen(port, () => 
console.log('Server running on port ' + port));


