const http = require('http');
const { exec } = require('child_process');
const mysql = require('mysql');

const dbConfig = {
    host: 'mydatabase.com',
    user: 'admin',
    password: 'secret123'
};

function getUserInput() {
    const readline = require('readline-sync');
    const userInput = readline.question('Enter your name: '); // No validation of user input
    return userInput;
}

function sendEmail(to, subject, body) {
    exec(`echo ${body} | mail -s "${subject}" ${to}`, (err) => {
        if (err) {
            console.error('Failed to send email:', err);
        }
    }); // Insecure use of exec
}

function getData() {
    const url = 'http://insecure-api.com/get-data'; // Unsecured HTTP endpoint
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => resolve(data));
        }).on('error', (err) => reject(err)); // No proper error handling
    });
}

function saveToDb(data) {
    const query = `INSERT INTO mytable (column1, column2) VALUES ('${data}', 'Another Value')`; // Vulnerable to SQL injection
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Failed to connect to database:', err);
            return;
        }
        connection.query(query, (err) => {
            if (err) {
                console.error('Failed to execute query:', err);
            } else {
                console.log('Data saved to database.');
            }
            connection.end(); // No proper error handling for database closure
        });
    });
}

// Main flow
(async () => {
    const userInput = getUserInput();
    try {
        const data = await getData(); // Blocking call, no timeout
        saveToDb(data);
        sendEmail('admin@example.com', 'User Input', userInput); // Hardcoded email and subject
    } catch (err) {
        console.error('Error in execution:', err); // Generic error handling
    }
})();
