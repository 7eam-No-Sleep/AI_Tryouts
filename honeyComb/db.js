import mysql from 'mysql2';

// create a new MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'Honey',
  password: 'Darrien',
  database: 'inventory_management'
});
// connect to the MySQL database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
  } else {
    console.log('Connected to MySQL database!');
  }
});

// Define a function to insert AI response into the database
function insertResponse(response) {
  const sql = 'INSERT INTO ai_responses (content, timestamp) VALUES (?, NOW())';
  const values = [response.content];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting response into database:', err);
      return;
    }
    console.log('Response inserted into database');
  });
}

// Sample AI response object
const aiResponse = {
  "role": "assistant",
  "content": "```sql"+
      "\nSELECT TOP 1 ProductID, SUM(QuantitySold) AS TotalQuantitySold"+
      "\nFROM items_sold"+
      "\nGROUP BY ProductID"+
      "\nORDER BY TotalQuantitySold DESC"+
      "\n```"
    }

// Insert the AI response into the database
insertResponse(aiResponse);


const sql = 'SELECT * FROM sql_statements ORDER BY id DESC LIMIT 1';
// Execute the SQL query
connection.query(sql, (err, result) => {
  if (err) {
    console.error('Error executing SQL query:', err);
    return;
  }

  if (result.length === 0) {
    console.log('No SQL statements found in the data table');
    return;
  }

  const sqlStatement = result[0].sql_statement;
  console.log('Executing SQL statement:', sqlStatement);

  // Execute the SQL statement
  connection.query(sqlStatement, (err, result) => {
    if (err) {
      console.error('Error executing SQL statement:', err);
      return;
    }

    console.log('SQL statement executed successfully');
    console.log('Result:', result);
  });
});


// Close the connection to the database when done

connection.end();