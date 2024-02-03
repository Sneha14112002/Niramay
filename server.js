//server.js
//server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Replace with your desired port number

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// MySQL Database Configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'simran@123',
  database: 'niramay',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Example API endpoint to fetch data from MySQL
app.get('/api/data', (req, res) => {
  const sql = 'SELECT * FROM users'; // Replace with your table name
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(result);
    }
  });
});
app.post('/updateFields', (req, res) => {
  const { anganwadiNo, childsName, addictions, source_of_drinking_water, other, diabetes, anaemia, tuberculosis } = req.body;

  // Update the phone number in the child table
  const sql = `UPDATE child SET addictions=?,source_of_drinking_water=?,other=?, diabetes=?, anaemia=?, tuberculosis=? WHERE anganwadi_no = ? AND child_name = ?`;

  db.query(sql, [addictions, source_of_drinking_water, other, diabetes, anaemia, tuberculosis, anganwadiNo, childsName], (err, result) => {
    if (err) {
      console.error('Error updating phone number:', err);
      res.status(500).json({ error: 'Error updating phone number' });
      throw err;
    }

    console.log('Phone number updated successfully');
    res.status(200).json({ message: 'Phone number updated successfully' });
  });
});
app.post('/updateFields', (req, res) => {
  const { anganwadiNo, childsName, addictions, source_of_drinking_water, other, diabetes, anaemia, tuberculosis } = req.body;

  // Update the phone number in the child table
  const sql = `UPDATE child SET addictions=?,source_of_drinking_water=?,other=?, diabetes=?, anaemia=?, tuberculosis=? WHERE anganwadi_no = ? AND child_name = ?`;

  db.query(sql, [addictions, source_of_drinking_water, other, diabetes, anaemia, tuberculosis, anganwadiNo, childsName], (err, result) => {
    if (err) {
      console.error('Error updating phone number:', err);
      res.status(500).json({ error: 'Error updating phone number' });
      throw err;
    }

    console.log('Phone number updated successfully');
    res.status(200).json({ message: 'Phone number updated successfully' });
  });
});
// Add this code to your server.js file
app.post('/checkData2', (req, res) => {
  const { anganwadiNo, childsName } = req.body;

  if (!anganwadiNo || !childsName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check 'child' table
  const querychild = `SELECT COUNT(*) AS count FROM child WHERE anganwadi_no = ? AND child_name = ?`;
  db.query(querychild, [anganwadiNo, childsName], (err, results) => {
    if (err) {
      console.error('Error checking child table:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check 'generalhistory' table
    const queryGeneralHistory = `SELECT COUNT(*) AS count FROM generalhistory WHERE anganwadiNo = ? AND childName = ?`;
    db.query(queryGeneralHistory, [anganwadiNo, childsName], (err, genHistoryResults) => {
      if (err) {
        console.error('Error checking generalhistory table:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const customerDataPresent = results[0].count > 0;
      const generalHistoryDataPresent = genHistoryResults[0].count > 0;

      res.json({ customerDataPresent, generalHistoryDataPresent });
    });
  });
});
app.post('/checkData2', (req, res) => {
  const { anganwadiNo, childsName } = req.body;

  if (!anganwadiNo || !childsName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check 'child' table
  const querychild = `SELECT COUNT(*) AS count FROM child WHERE anganwadi_no = ? AND child_name = ?`;
  db.query(querychild, [anganwadiNo, childsName], (err, results) => {
    if (err) {
      console.error('Error checking child table:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check 'generalhistory' table
    const queryGeneralHistory = `SELECT COUNT(*) AS count FROM generalhistory WHERE anganwadiNo = ? AND childName = ?`;
    db.query(queryGeneralHistory, [anganwadiNo, childsName], (err, genHistoryResults) => {
      if (err) {
        console.error('Error checking generalhistory table:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const customerDataPresent = results[0].count > 0;
      const generalHistoryDataPresent = genHistoryResults[0].count > 0;

      res.json({ customerDataPresent, generalHistoryDataPresent });
    });
  });
});
// User registration endpoint
app.post('/api/register', (req, res) => {
  const { name, email, password, phoneNumber, post } = req.body;

  // Perform data validation here, e.g., check if required fields are provided.

  // Insert user data into the users table
  const sql = 'INSERT INTO users (name, email, password, phoneNo, role) VALUES (?, ?, ?, ?, ?)';
  const values = [name, email, password, phoneNumber, post];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting user data into the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.status(201).json({ message: 'User registered successfully' });
    }
  });
});
app.post('/checkPhoneNumber', (req, res) => {
  const { phoneNumber } = req.body;

  // Query the database to check if the phone number exists
  db.query('SELECT * FROM users WHERE phoneNo = ?', [phoneNumber], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Phone number not found' });
    }

    return res.status(200).json({ message: 'Phone number found' });
  });
});

app.post('/updatePassword', (req, res) => {
  const { phoneNo, newPassword } = req.body; // Assuming you have a userId to identify the user

  const updateQuery = 'UPDATE users SET password = ? WHERE phoneNO = ?'; // Update query

  db.query(updateQuery, [newPassword, phoneNo], (error, results) => {
    if (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Failed to update password' });
      return;
    }

    res.status(200).json({ message: 'Password updated successfully' });
  });
});
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log("here");
  // Query the database to check if the email and password match a user record
  const sql = 'SELECT role,name  FROM users WHERE email = ? AND password = ?';
  const values = [email, password];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        // User exists and credentials are correct
        res.status(200).json({ message: 'Login successful', user: result[0] });
      } else {
        // User not found or credentials are incorrect
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  });
});
app.post('/submitForm', (req, res) => {
  const formData = req.body;
  console.log("****************");
  console.log("FORM DATA", formData);
  console.log("****************");
  // Convert array to comma-separated string for prevHistory
  if (formData.prev_history && Array.isArray(formData.prev_history)) {
    formData.prev_history = formData.prev_history.join(', ');
  }

  // Insert form data into the MySQL table
  db.query('INSERT INTO child SET ?', formData, (err, result) => {
    if (err) {
      console.error('Error inserting form data:', err);
      res.status(500).send('Error inserting form data');
    } else {
      console.log('Form data inserted');
      res.send('Form data inserted');
    }
  });
});
  const { name, email, password, phoneNumber, post } = req.body;

  // Perform data validation here, e.g., check if required fields are provided.

  // Insert user data into the users table
  const sql = 'INSERT INTO users (name, email, password, phoneNo, role) VALUES (?, ?, ?, ?, ?)';
  const values = [name, email, password, phoneNumber, post];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting user data into the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.status(201).json({ message: 'User registered successfully' });
    }
  });
});
app.post('/checkPhoneNumber', (req, res) => {
  const { phoneNumber } = req.body;

  // Query the database to check if the phone number exists
  db.query('SELECT * FROM users WHERE phoneNo = ?', [phoneNumber], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Phone number not found' });
    }

    return res.status(200).json({ message: 'Phone number found' });
  });
});

app.post('/updatePassword', (req, res) => {
  const { phoneNo, newPassword } = req.body; // Assuming you have a userId to identify the user

  const updateQuery = 'UPDATE users SET password = ? WHERE phoneNO = ?'; // Update query

  db.query(updateQuery, [newPassword, phoneNo], (error, results) => {
    if (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Failed to update password' });
      return;
    }

    res.status(200).json({ message: 'Password updated successfully' });
  });
});
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log("here");
  // Query the database to check if the email and password match a user record
  const sql = 'SELECT role,name  FROM users WHERE email = ? AND password = ?';
  const values = [email, password];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        // User exists and credentials are correct
        res.status(200).json({ message: 'Login successful', user: result[0] });
      } else {
        // User not found or credentials are incorrect
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  });
});
app.post('/submitForm', (req, res) => {
  const formData = req.body;
  console.log("****************");
  console.log("FORM DATA", formData);
  console.log("****************");
  // Convert array to comma-separated string for prevHistory
  if (formData.prev_history && Array.isArray(formData.prev_history)) {
    formData.prev_history = formData.prev_history.join(', ');
  }

  // Insert form data into the MySQL table
  db.query('INSERT INTO child SET ?', formData, (err, result) => {
    if (err) {
      console.error('Error inserting form data:', err);
      res.status(500).send('Error inserting form data');
    } else {
      console.log('Form data inserted');
      res.send('Form data inserted');
    }
  });
});
app.post('/checkData', (req, res) => {
  const { anganwadiNo, childsName } = req.body;

  // Query the database to check if the data exists
  const sql = 'SELECT * FROM child WHERE anganwadi_no = ? AND child_name = ?';
  const values = [anganwadiNo, childsName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        // Data exists in the database
        console.log()
        res.status(200).json({ message: 'Data exists in the database' });
      } else {
        // Data does not exist in the database
        res.status(404).json({ message: "Data doesn't exist in the database" });
      }
    }
  });
});
app.post('/check-duplicates', (req, res) => {
  const { anganwadiNo, childName } = req.body;

  const query = `
  const { anganwadiNo, childsName } = req.body;

  // Query the database to check if the data exists
  const sql = 'SELECT * FROM child WHERE anganwadi_no = ? AND child_name = ?';
  const values = [anganwadiNo, childsName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        // Data exists in the database
        console.log()
        res.status(200).json({ message: 'Data exists in the database' });
      } else {
        // Data does not exist in the database
        res.status(404).json({ message: "Data doesn't exist in the database" });
      }
    }
  });
});
app.post('/check-duplicates', (req, res) => {
  const { anganwadiNo, childName } = req.body;

  const query = `
      SELECT anganwadi_no, child_name FROM child
      WHERE anganwadi_no = ? AND child_name = ?
    `;

  db.query(query, [anganwadiNo, childName], (err, results) => {
    if (err) {
      console.error('Error checking duplicates:', err);
      res.status(500).json({ error: true });
    } else {
      if (results.length > 0) {
        // Duplicate entries found
        res.json({ error: true });
      } else {
        // No duplicate entries found
        res.json({ error: false });
      }
    }
  });
});
app.post('/updatePhoneNumber', (req, res) => {
  const { anganwadiNo, childsName, updatedPhoneNumber } = req.body;

  // Update the phone number in the child table
  const sql = `UPDATE child SET child_phone = ? WHERE anganwadi_no = ? AND child_name = ?`;

  db.query(sql, [updatedPhoneNumber, anganwadiNo, childsName], (err, result) => {
    if (err) {
      console.error('Error updating phone number:', err);
      res.status(500).json({ error: 'Error updating phone number' });
      throw err;
    }

    console.log('Phone number updated successfully');
    res.status(200).json({ message: 'Phone number updated successfully' });
  });
});
app.post('/updateAssistantNumber', (req, res) => {
  const { anganwadiNo, childsName, updatedPhoneNumber } = req.body;

  // Update the phone number in the child table
  const sql = `UPDATE child SET assistant_phone= ? WHERE anganwadi_no = ? AND child_name = ?`;

  db.query(sql, [updatedPhoneNumber, anganwadiNo, childsName], (err, result) => {
    if (err) {
      console.error('Error updating phone number:', err);
      res.status(500).json({ error: 'Error updating phone number' });
      throw err;
    }

    console.log('Phone number updated successfully');
    res.status(200).json({ message: 'Phone number updated successfully' });
  });
});

app.post('/checkDataMedical', (req, res) => {
  const { anganwadiNo, childsName } = req.body;
  console.log(anganwadiNo, childsName);
  // Query the database to check if the data exists
  const sql = 'SELECT * FROM GeneralHistory WHERE anganwadiNo = ? AND childName  = ?';
  const values = [anganwadiNo, childsName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        // Data exists in the database
        res.status(200).json({ message: 'Data exists in the database' });
      } else {
        // Data does not exist in the database
        res.status(404).json({ message: "Data doesn't exist in the database" });
      }
    }
  });
});
app.post('/submit-sibling-data', (req, res) => {
  const { anganwadi_no, child_name, siblings } = req.body;

  // Assuming you have a 'Siblings' table in your database
  // Insert each sibling into the 'Siblings' table
  siblings.forEach((sibling) => {
    const { name, age, malnourished } = sibling;

    const sql = `

  db.query(query, [anganwadiNo, childName], (err, results) => {
    if (err) {
      console.error('Error checking duplicates:', err);
      res.status(500).json({ error: true });
    } else {
      if (results.length > 0) {
        // Duplicate entries found
        res.json({ error: true });
      } else {
        // No duplicate entries found
        res.json({ error: false });
      }
    }
  });
});
app.post('/updatePhoneNumber', (req, res) => {
  const { anganwadiNo, childsName, updatedPhoneNumber } = req.body;

  // Update the phone number in the child table
  const sql = `UPDATE child SET child_phone = ? WHERE anganwadi_no = ? AND child_name = ?`;

  db.query(sql, [updatedPhoneNumber, anganwadiNo, childsName], (err, result) => {
    if (err) {
      console.error('Error updating phone number:', err);
      res.status(500).json({ error: 'Error updating phone number' });
      throw err;
    }

    console.log('Phone number updated successfully');
    res.status(200).json({ message: 'Phone number updated successfully' });
  });
});
app.post('/updateAssistantNumber', (req, res) => {
  const { anganwadiNo, childsName, updatedPhoneNumber } = req.body;

  // Update the phone number in the child table
  const sql = `UPDATE child SET assistant_phone= ? WHERE anganwadi_no = ? AND child_name = ?`;

  db.query(sql, [updatedPhoneNumber, anganwadiNo, childsName], (err, result) => {
    if (err) {
      console.error('Error updating phone number:', err);
      res.status(500).json({ error: 'Error updating phone number' });
      throw err;
    }

    console.log('Phone number updated successfully');
    res.status(200).json({ message: 'Phone number updated successfully' });
  });
});

app.post('/checkDataMedical', (req, res) => {
  const { anganwadiNo, childsName } = req.body;
  console.log(anganwadiNo, childsName);
  // Query the database to check if the data exists
  const sql = 'SELECT * FROM GeneralHistory WHERE anganwadiNo = ? AND childName  = ?';
  const values = [anganwadiNo, childsName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        // Data exists in the database
        res.status(200).json({ message: 'Data exists in the database' });
      } else {
        // Data does not exist in the database
        res.status(404).json({ message: "Data doesn't exist in the database" });
      }
    }
  });
});
app.post('/submit-sibling-data', (req, res) => {
  const { anganwadi_no, child_name, siblings } = req.body;

  // Assuming you have a 'Siblings' table in your database
  // Insert each sibling into the 'Siblings' table
  siblings.forEach((sibling) => {
    const { name, age, malnourished } = sibling;

    const sql = `
        INSERT INTO Siblings (anganwadi_no, child_name, name, age, malnourished)
        VALUES (?, ?, ?, ?, ?)
      `;

    db.query(sql, [anganwadi_no, child_name, name, age, malnourished], (err, results) => {
      if (err) {
        console.error('Error inserting sibling data:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log('Sibling data inserted successfully');
        res.json({ message: 'Sibling data inserted successfully' });
      }
    });
  });

    db.query(sql, [anganwadi_no, child_name, name, age, malnourished], (err, results) => {
      if (err) {
        console.error('Error inserting sibling data:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log('Sibling data inserted successfully');
        res.json({ message: 'Sibling data inserted successfully' });
      }
    });
  });
});
app.post('/updateSibling', (req, res) => {
  const { anganwadiNo, childsName, newTotalFamilyMembers, newTotalSiblings } = req.body;

  // Update the database query
  const sql = `UPDATE child 
               SET total_family_members = ?, TotalSiblings = ?
               WHERE child_name = ? AND anganwadi_no = ?`;

  db.query(sql, [newTotalFamilyMembers, newTotalSiblings, childsName, anganwadiNo], (err, results) => {
    if (err) {
      console.error('Error updating sibling information:', err);
      res.status(500).send('Failed to update sibling information');
      return;
    }

    console.log('Siblings data updated successfully');
    res.status(200).send('Siblings data updated successfully');
  });
});
app.post('/getFormData', (req, res) => {
  const { anganwadiNo, childsName } = req.body;
  console.log(anganwadiNo, childsName)
  // Query the database to fetch the data
  const sql = 'SELECT * FROM child WHERE anganwadi_no = ? AND child_name = ?';
  const values = [anganwadiNo, childsName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        // Data exists in the database
        res.status(200).json(result[0]); // Send the first row of data as JSON response
      } else {
        // Data does not exist in the database
        res.status(404).json({ message: "Data doesn't exist in the database" });
      }
    }
  });
});

app.post('/getSiblingData', async (req, res) => {
  const { anganwadiNo, childsName } = req.body;
  try {
    // Assuming you have a "siblings" table in your database
    console.log(anganwadiNo, childsName);
    const [siblingData] = await db.promise().query(
      'SELECT * FROM siblings WHERE anganwadi_no = ? AND child_name = ?',
      [anganwadiNo, childsName]
    );
app.post('/getFormData', (req, res) => {
  const { anganwadiNo, childsName } = req.body;
  console.log(anganwadiNo, childsName)
  // Query the database to fetch the data
  const sql = 'SELECT * FROM child WHERE anganwadi_no = ? AND child_name = ?';
  const values = [anganwadiNo, childsName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        // Data exists in the database
        res.status(200).json(result[0]); // Send the first row of data as JSON response
      } else {
        // Data does not exist in the database
        res.status(404).json({ message: "Data doesn't exist in the database" });
      }
    }
  });
});

app.post('/getSiblingData', async (req, res) => {
  const { anganwadiNo, childsName } = req.body;
  try {
    // Assuming you have a "siblings" table in your database
    console.log(anganwadiNo, childsName);
    const [siblingData] = await db.promise().query(
      'SELECT * FROM siblings WHERE anganwadi_no = ? AND child_name = ?',
      [anganwadiNo, childsName]
    );


    if (siblingData.length >= 0) {
      console.log('Sibling Data:', siblingData);
      res.status(200).json(siblingData);
    } else {
      res.status(404).json({ message: 'Sibling data not found' });
    }
  } catch (error) {
    console.error('Error fetching sibling data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/generalHistory', (req, res) => {
  const generalHistoryData = req.body;

  // Perform the database insert operation
  db.query('INSERT INTO GeneralHistory SET ?', generalHistoryData, (err, result) => {
    if (err) {
      console.error('Error inserting data into GeneralHistory: ', err);
      res.status(500).json({ error: 'Error inserting data' });
    } else {
      console.log('Data inserted into GeneralHistory');
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
});

    if (siblingData.length >= 0) {
      console.log('Sibling Data:', siblingData);
      res.status(200).json(siblingData);
    } else {
      res.status(404).json({ message: 'Sibling data not found' });
    }
  } catch (error) {
    console.error('Error fetching sibling data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/generalHistory', (req, res) => {
  const generalHistoryData = req.body;

  // Perform the database insert operation
  db.query('INSERT INTO GeneralHistory SET ?', generalHistoryData, (err, result) => {
    if (err) {
      console.error('Error inserting data into GeneralHistory: ', err);
      res.status(500).json({ error: 'Error inserting data' });
    } else {
      console.log('Data inserted into GeneralHistory');
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
});

app.post('/visits', (req, res) => {
  try {
    const { anganwadiNo, childName, visitDate, weight, height, muac, difference, grade, haemoglobin, totalNoOfJars, observations, multivitamin, iron, calcium, protein } = req.body;
    console.log(visitDate);
    const sql = 'INSERT INTO Visits (anganwadiNo, childName, visitDate,weight, height, muac, difference,grade,haemoglobin,totalNoOfJars,observations,multivitamin,iron,calcium,protein) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?)';
    db.query(sql, [anganwadiNo, childName, visitDate, weight, height, muac, difference, grade, haemoglobin, totalNoOfJars, observations, multivitamin, iron, calcium, protein], (err, result) => {
      if (err) {
        console.error('Database error: ' + err.message);
        res.status(500).json({ error: 'Error inserting data into the database' });
      } else {
        console.log('Data inserted successfully');
        res.status(200).json({ message: 'Data inserted successfully' });
      }
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/getVisitsData', (req, res) => {
  const { anganwadiNo, childsName, fromDate, toDate } = req.body;
  console.log(anganwadiNo, childsName, fromDate, toDate);
  let query = 'SELECT height, weight, haemoglobin, grade, visitDate FROM visits WHERE anganwadiNo = ? AND childName = ?';

  // Modify the query to include date filtering if fromDate and toDate are provided
  const queryParams = [anganwadiNo, childsName];
  if (fromDate && toDate) {
    query += ' AND visitDate BETWEEN ? AND ?';
    queryParams.push(fromDate, toDate);
  }

  db.query(query, queryParams, (err, results) => {
    console.log('Sending response data:', results);
    if (err) {
      console.error('Error executing database query: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Data not found' });
    } else {
      res.status(200).json({ data: results });
      console.log(results);
    }
  });
});
app.post('/visits', (req, res) => {
  try {
    const { anganwadiNo, childName, visitDate, weight, height, muac, difference, grade, haemoglobin, totalNoOfJars, observations, multivitamin, iron, calcium, protein } = req.body;
    console.log(visitDate);
    const sql = 'INSERT INTO Visits (anganwadiNo, childName, visitDate,weight, height, muac, difference,grade,haemoglobin,totalNoOfJars,observations,multivitamin,iron,calcium,protein) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?)';
    db.query(sql, [anganwadiNo, childName, visitDate, weight, height, muac, difference, grade, haemoglobin, totalNoOfJars, observations, multivitamin, iron, calcium, protein], (err, result) => {
      if (err) {
        console.error('Database error: ' + err.message);
        res.status(500).json({ error: 'Error inserting data into the database' });
      } else {
        console.log('Data inserted successfully');
        res.status(200).json({ message: 'Data inserted successfully' });
      }
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/getVisitsData', (req, res) => {
  const { anganwadiNo, childsName, fromDate, toDate } = req.body;
  console.log(anganwadiNo, childsName, fromDate, toDate);
  let query = 'SELECT height, weight, haemoglobin, grade, visitDate FROM visits WHERE anganwadiNo = ? AND childName = ?';

  // Modify the query to include date filtering if fromDate and toDate are provided
  const queryParams = [anganwadiNo, childsName];
  if (fromDate && toDate) {
    query += ' AND visitDate BETWEEN ? AND ?';
    queryParams.push(fromDate, toDate);
  }

  db.query(query, queryParams, (err, results) => {
    console.log('Sending response data:', results);
    if (err) {
      console.error('Error executing database query: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Data not found' });
    } else {
      res.status(200).json({ data: results });
      console.log(results);
    }
  });
});



// Route for fetching GeneralHistory data
app.post('/getGeneralHistory', (req, res) => {
  const { anganwadiNo, childsName } = req.body;

  const sql = 'SELECT * FROM GeneralHistory WHERE anganwadiNo = ? AND childName = ?';
  const values = [anganwadiNo, childsName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying GeneralHistory:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Data doesn't exist in the GeneralHistory table" });
      }
    }
  });
});

// Route for fetching Visits data
app.post('/getVisits', (req, res) => {
  const { anganwadiNo, childsName } = req.body;

  const sql = 'SELECT * FROM Visits WHERE anganwadiNo = ? AND childName = ?';
  const values = [anganwadiNo, childsName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying Visits:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Data doesn't exist in the Visits table" });
      }
    }
  });
});
app.post('/submit-sibling', (req, res) => {
  const { anganwadiNo, childsName, siblings } = req.body;

  // Iterate through the siblings array and insert each sibling into the database
  siblings.forEach((sibling) => {
    const { name, age, malnourished } = sibling;

    // Insert the sibling data into the MySQL database
    const insertSql = 'INSERT INTO siblings (anganwadi_no, child_name, name, age, malnourished) VALUES (?, ?, ?, ?, ?)';
    const insertValues = [anganwadiNo, childsName, name, age, malnourished ? 1 : 0];

    db.query(insertSql, insertValues, (insertErr, result) => {
      if (insertErr) {
        console.error('Error inserting sibling data into MySQL:', insertErr);
        res.status(500).json({ message: 'Failed to insert sibling data into MySQL' });
      } else {
        console.log('Sibling data inserted into MySQL');
      }
    });
  });

  res.status(200).json({ message: 'Sibling data inserted into MySQL successfully' });
});
  const { anganwadiNo, childsName } = req.body;

  const sql = 'SELECT * FROM GeneralHistory WHERE anganwadiNo = ? AND childName = ?';
  const values = [anganwadiNo, childsName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying GeneralHistory:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Data doesn't exist in the GeneralHistory table" });
      }
    }
  });
});

// Route for fetching Visits data
app.post('/getVisits', (req, res) => {
  const { anganwadiNo, childsName } = req.body;

  const sql = 'SELECT * FROM Visits WHERE anganwadiNo = ? AND childName = ?';
  const values = [anganwadiNo, childsName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying Visits:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Data doesn't exist in the Visits table" });
      }
    }
  });
});
app.post('/submit-sibling', (req, res) => {
  const { anganwadiNo, childsName, siblings } = req.body;

  // Iterate through the siblings array and insert each sibling into the database
  siblings.forEach((sibling) => {
    const { name, age, malnourished } = sibling;

    // Insert the sibling data into the MySQL database
    const insertSql = 'INSERT INTO siblings (anganwadi_no, child_name, name, age, malnourished) VALUES (?, ?, ?, ?, ?)';
    const insertValues = [anganwadiNo, childsName, name, age, malnourished ? 1 : 0];

    db.query(insertSql, insertValues, (insertErr, result) => {
      if (insertErr) {
        console.error('Error inserting sibling data into MySQL:', insertErr);
        res.status(500).json({ message: 'Failed to insert sibling data into MySQL' });
      } else {
        console.log('Sibling data inserted into MySQL');
      }
    });
  });

  res.status(200).json({ message: 'Sibling data inserted into MySQL successfully' });
});

// app.get('/childGenderData', (req, res) => {
//   const sql = 'SELECT bit_name, child_gender, COUNT(*) as count FROM child GROUP BY bit_name, child_gender';
//   db.query(sql, (err, result) => {
//     if (err) {
//       console.error('Error querying the database: ', err);
//       res.status(500).json({ error: 'Database error' });
//     } else {
//       res.json(result);
//     }
//   });
// });
// app.get('/childGenderData', (req, res) => {
//   const sql = 'SELECT bit_name, child_gender, COUNT(*) as count FROM child GROUP BY bit_name, child_gender';
//   db.query(sql, (err, result) => {
//     if (err) {
//       console.error('Error querying the database: ', err);
//       res.status(500).json({ error: 'Database error' });
//     } else {
//       res.json(result);
//     }
//   });
// });


app.get('/childGenderData', (req, res) => {
  const query = 'SELECT bit_name, child_gender FROM child'; // Replace with your actual SQL query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(results);
    }
    console.log(results)
  });
});

app.get('/childGenderData', (req, res) => {
  const query = 'SELECT bit_name, child_gender FROM child'; // Replace with your actual SQL query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(results);
    }
    console.log(results)
  });
});




app.get('/stack_data', (req, res) => {
  const query = 'SELECT bit_name, child_name, child_gender, COUNT(*) AS child_count FROM child GROUP BY  bit_name,child_gender';

  db.query(query, (err, rows) => {
    if (err) {
      console.error('MySQL query error: ' + err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Send the fetched data as JSON
    res.json(rows);
  });
});

app.get('/stack_data', (req, res) => {
  const query = 'SELECT bit_name, child_name, child_gender, COUNT(*) AS child_count FROM child GROUP BY  bit_name,child_gender';

  db.query(query, (err, rows) => {
    if (err) {
      console.error('MySQL query error: ' + err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Send the fetched data as JSON
    res.json(rows);
  });
});


app.get('/stack_demo', (req, res) => {
  const query = 'SELECT bit_name, child_gender FROM child'; // Replace with your table name
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(results);
  });
});
app.get('/stack_demo', (req, res) => {
  const query = 'SELECT bit_name, child_gender FROM child'; // Replace with your table name
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(results);
  });
});















app.get('/bit_name', (req, res) => {
  const query = 'SELECT DISTINCT bit_name FROM child';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      const bit_name = results.map((row) => row.bit_name);
      res.json(bit_name);
      console.log(bit_name)
    }
  });
});

app.get('/bit_name', (req, res) => {
  const query = 'SELECT DISTINCT bit_name FROM child';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      const bit_name = results.map((row) => row.bit_name);
      res.json(bit_name);
      console.log(bit_name)
    }
  });
});


// // Endpoint to fetch visit dates for a specific Anganwadi from the MySQL database
// app.get('/visitDate/:anganwadi_name', async (req, res) => {
//   const { anganwadi_name } = req.params;

//   try {
//     const [rows] = await pool.query('SELECT DISTINCT visitDate FROM visits WHERE anganwadi_name = ?', [anganwadi_name]);
//     const visitDate = rows.map((row) => row.visitDate);
//     res.json(visitDate);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while fetching visit dates' });
//   }
// });
// // Endpoint to fetch visit dates for a specific Anganwadi from the MySQL database
// app.get('/visitDate/:anganwadi_name', async (req, res) => {
//   const { anganwadi_name } = req.params;

//   try {
//     const [rows] = await pool.query('SELECT DISTINCT visitDate FROM visits WHERE anganwadi_name = ?', [anganwadi_name]);
//     const visitDate = rows.map((row) => row.visitDate);
//     res.json(visitDate);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while fetching visit dates' });
//   }
// });

app.get('/visitDate/:bit_name', (req, res) => {
  const { bit_name } = req.params;

  // Fetch all anganwadi_no values associated with the given bit_name
  const query1 = 'SELECT anganwadi_no FROM child WHERE bit_name = ?';
  db.query(query1, [bit_name], (err, results) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      const anganwadiNos = results.map((row) => row.anganwadi_no);

      // Check if anganwadiNos is empty
      if (anganwadiNos.length === 0) {
        res.status(404).json({ error: 'No matching records found' });
        return;
      }

      // Next, fetch distinct visit dates for all obtained anganwadi_no values
      const query2 = 'SELECT DISTINCT visitDate FROM visits WHERE anganwadiNo IN (?)';
      db.query(query2, [anganwadiNos], (err, results) => {
        if (err) {
          console.error('Error querying the database: ', err);
          res.status(500).json({ error: 'Database error' });
        } else {
          const visitDate = results.map((row) => row.visitDate);
          console.log('****')
          console.log(bit_name)
          res.json(visitDate);
        }
      });
    }
  });
});

app.get('/visitDate/:bit_name', (req, res) => {
  const { bit_name } = req.params;

  // Fetch all anganwadi_no values associated with the given bit_name
  const query1 = 'SELECT anganwadi_no FROM child WHERE bit_name = ?';
  db.query(query1, [bit_name], (err, results) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      const anganwadiNos = results.map((row) => row.anganwadi_no);

      // Check if anganwadiNos is empty
      if (anganwadiNos.length === 0) {
        res.status(404).json({ error: 'No matching records found' });
        return;
      }

      // Next, fetch distinct visit dates for all obtained anganwadi_no values
      const query2 = 'SELECT DISTINCT visitDate FROM visits WHERE anganwadiNo IN (?)';
      db.query(query2, [anganwadiNos], (err, results) => {
        if (err) {
          console.error('Error querying the database: ', err);
          res.status(500).json({ error: 'Database error' });
        } else {
          const visitDate = results.map((row) => row.visitDate);
          console.log('****')
          console.log(bit_name)
          res.json(visitDate);
        }
      });
    }
  });
});

// Define an endpoint to fetch child distribution
app.get('/child_distribution/:bit_name/:visitDate(*)', (req, res) => {
  const { bit_name, visitDate } = req.params;
  console.log('bit_name:', bit_name);
  console.log('visitDate:', visitDate);
  // Fetch child distribution data for the provided bit_name and visitDate for all matching anganwadi_no
  const query = `
  SELECT grade, COUNT(*) AS count
  FROM visits v
  JOIN child c ON v.anganwadiNo = c.anganwadi_no AND v.childName = c.child_name
  JOIN child c ON v.anganwadiNo = c.anganwadi_no AND v.childName = c.child_name
  WHERE c.bit_name = ? AND v.visitDate = ?
  GROUP BY grade;
  
  `;

  db.query(query, [bit_name, visitDate], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const childDistribution = results.map((row) => ({
      grade: row.grade,
      count: row.count,


    }));
    console.log(childDistribution)
    console.log("!!!!")
    res.json(childDistribution);
  });
});
app.get('/anganwadi-count', async (req, res) => {
  const { year } = req.query;

  try {
    let query = `
      SELECT bit_name, COUNT(DISTINCT anganwadi_no) AS anganwadi_count, EXTRACT(YEAR FROM date) as extracted_year
      FROM child
    `;

    if (year) {
      query += ` WHERE EXTRACT(YEAR FROM date) = ${year}`;
    }

    query += `
      GROUP BY bit_name, extracted_year
    `;

    const [rows, fields] = await db.promise().query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/anganwadi-count', async (req, res) => {
  const { year } = req.query;

  try {
    let query = `
      SELECT bit_name, COUNT(DISTINCT anganwadi_no) AS anganwadi_count, EXTRACT(YEAR FROM date) as extracted_year
      FROM child
    `;

    if (year) {
      query += ` WHERE EXTRACT(YEAR FROM date) = ${year}`;
    }

    query += `
      GROUP BY bit_name, extracted_year
    `;

    const [rows, fields] = await db.promise().query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get('/childGenderData', (req, res) => {
  // Replace 'your_table_name' with the name of your MySQL table
  const query = 'SELECT * FROM child';
  console.log("childGenderData API is getting hit");
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(results);
    }
    console.log("Result of SELECT * FROM child: ", results);
    console.log("Result of SELECT * FROM child: ", results);
  });
});



app.get('/childData', async (req, res) => {
  const { year } = req.query;

  try {
    let query = `
      SELECT bit_name,
             COUNT(*) as total_children_count,
             SUBSTRING(date, 1, 4) as extracted_year
      FROM child
    `;

    if (year) {
      query += ` WHERE SUBSTRING(date, 1, 4) = ${year} AND bit_name IS NOT NULL AND bit_name != ''`;
    } else {
      query += ` WHERE bit_name IS NOT NULL AND bit_name != ''`;
    }

    query += `
      GROUP BY bit_name, extracted_year
    `;

    const [rows, fields] = await db.promise().query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Define an API route to fetch user data
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';

  try {
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      console.log(results);
      res.json(results);
    });
  } catch (error) {
    console.error('Caught an exception:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/childDataGender', (req, res) => {
  const query = `
    SELECT bit_name,
           SUM(CASE WHEN child_gender = 'male' THEN 1 ELSE 0 END) as male_count,
           SUM(CASE WHEN child_gender = 'female' THEN 1 ELSE 0 END) as female_count
    FROM child
    FROM child
    GROUP BY bit_name
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Format the data to match the stacked bar graph format
    const formattedData = results.map((row) => ({
      bit_name: row.bit_name,
      male_count: row.male_count,
      female_count: row.female_count,
    }));

    console.log('Fetched data:', formattedData);
    res.json(formattedData);
  });
});


app.get('/gender_distribution/:bit_name/:year?', (req, res) => {
  const { bit_name, year } = req.params;

  // Fetch child distribution data for the provided bit_name and year
  const query = `
    SELECT child_gender AS gender, COUNT(*) AS count
    FROM child
    WHERE bit_name = ? ${year ? 'AND YEAR(date) = ?' : ''}
    GROUP BY child_gender;
  `;

  const params = [bit_name];
  if (year) {
    params.push(year);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const childDistribution = results.map((row) => ({
      gender: row.gender,
      count: row.count,
    }));

    console.log(childDistribution);
    res.json(childDistribution);
  });
});



app.get('/anganwadi-count', async (req, res) => {
  const { year } = req.query;

  try {
    let query = `
      SELECT bit_name, COUNT(DISTINCT anganwadi_no) AS anganwadi_count, EXTRACT(YEAR FROM date) as extracted_year
      FROM child
    `;

    if (year) {
      query += ` WHERE EXTRACT(YEAR FROM date) = ${year}`;
    }

    query += `
      GROUP BY bit_name, extracted_year
    `;

    const [rows, fields] = await db.promise().query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/children/:anganwadiName/:gender/:year?', (req, res) => {
  const { anganwadiName, gender, year } = req.params;
  
  // Modify the SQL query to include the year filter if it is provided
  const query = `
    SELECT child_name, anganwadi_no
    FROM child
    WHERE bit_name = ? AND child_gender = ? ${year ? 'AND YEAR(date) = ?' : ''}
  `;
  
  const params = [anganwadiName, gender];
  if (year) {
    params.push(year);
  }

  db.query(query, params, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});





app.get('/child_distribution/:bit_name/:visitDate(*)', (req, res) => {
  const { bit_name, visitDate } = req.params;
  console.log('bit_name:', bit_name);
  console.log('visitDate:', visitDate);
  // Fetch child distribution data for the provided bit_name and visitDate for all matching anganwadi_no
  const query = `
SELECT grade, COUNT(*) AS count
FROM visits v
JOIN child c ON v.anganwadiNo = c.anganwadi_no AND v.childName = c.child_name
WHERE c.bit_name = ? AND v.visitDate = ?
GROUP BY grade;

`;

  db.query(query, [bit_name, visitDate], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const childDistribution = results.map((row) => ({
      grade: row.grade,
      count: row.count,

    }));
    console.log(childDistribution)
    console.log("!!!!")
    res.json(childDistribution);
  });
});


app.get('/grade_details/:bit_name/:visitDate/:grade', (req, res) => {
  const { bit_name, visitDate, grade } = req.params;

  // Fetch child details for the provided bit_name, visitDate, and grade
  const query = `
  SELECT childName, anganwadiNo
  FROM visits
  WHERE anganwadiNo IN (SELECT anganwadi_no FROM child WHERE bit_name = ?)
  AND visitDate = ?
  AND grade = ?;
`;

  db.query(query, [bit_name, visitDate, grade], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const gradeDetails = results.map((row) => ({
      childName: row.childName,
      anganwadiNo: row.anganwadiNo,
    }));

    res.json(gradeDetails);
  });
});

app.get('/availableYears', async (req, res) => {
  try {
    const query = 'SELECT DISTINCT SUBSTRING(date, 1, 4) as year FROM child WHERE bit_name IS NOT NULL AND bit_name != ""';
    const [rows, fields] = await db.promise().query(query);
    const years = rows.map(row => row.year).filter(year => !!year);
    res.json(years);
  } catch (error) {
    console.error('Error fetching available years:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/children/:anganwadiName/:gender/:year?', (req, res) => {
  const { anganwadiName, gender, year } = req.params;
  
  // Modify the SQL query to include the year filter if it is provided
  const query = `
    SELECT child_name, anganwadi_no
    FROM child
    WHERE bit_name = ? AND child_gender = ? ${year ? 'AND YEAR(date) = ?' : ''}
  `;
  
  const params = [anganwadiName, gender];
  if (year) {
    params.push(year);
  }

  db.query(query, params, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});





app.get('/child_distribution/:bit_name/:visitDate(*)', (req, res) => {
  const { bit_name, visitDate } = req.params;
  console.log('bit_name:', bit_name);
  console.log('visitDate:', visitDate);
  // Fetch child distribution data for the provided bit_name and visitDate for all matching anganwadi_no
  const query = `
SELECT grade, COUNT(*) AS count
FROM visits v
JOIN child c ON v.anganwadiNo = c.anganwadi_no AND v.childName = c.child_name
WHERE c.bit_name = ? AND v.visitDate = ?
GROUP BY grade;

`;

  db.query(query, [bit_name, visitDate], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const childDistribution = results.map((row) => ({
      grade: row.grade,
      count: row.count,

    }));
    console.log(childDistribution)
    console.log("!!!!")
    res.json(childDistribution);
  });
});


app.get('/grade_details/:bit_name/:visitDate/:grade', (req, res) => {
  const { bit_name, visitDate, grade } = req.params;

  // Fetch child details for the provided bit_name, visitDate, and grade
  const query = `
  SELECT childName, anganwadiNo
  FROM visits
  WHERE anganwadiNo IN (SELECT anganwadi_no FROM child WHERE bit_name = ?)
  AND visitDate = ?
  AND grade = ?;
`;

  db.query(query, [bit_name, visitDate, grade], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const gradeDetails = results.map((row) => ({
      childName: row.childName,
      anganwadiNo: row.anganwadiNo,
    }));

    res.json(gradeDetails);
  });
});

app.get('/availableYears', async (req, res) => {
  try {
    const query = 'SELECT DISTINCT SUBSTRING(date, 1, 4) as year FROM child WHERE bit_name IS NOT NULL AND bit_name != ""';
    const [rows, fields] = await db.promise().query(query);
    const years = rows.map(row => row.year).filter(year => !!year);
    res.json(years);
  } catch (error) {
    console.error('Error fetching available years:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/years', (req, res) => {
  const query = 'SELECT DISTINCT YEAR(date) as year FROM child';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      const years = results.map((row) => row.year);
      res.json(years);
    }
  });
});

app.get('/childList', async (req, res) => {
  const { year, bitName } = req.query;

  try {
    let query;
    let queryParams;

    if (year) {
      query = `
        SELECT child_name, anganwadi_no
        FROM child
        WHERE bit_name = ? AND SUBSTRING(date, 1, 4) = ?
      `;
      queryParams = [bitName, year];
    } else {
      // When no year is provided, fetch data for all years
      query = `
        SELECT child_name, anganwadi_no
        FROM child
        WHERE bit_name = ?
      `;
      queryParams = [bitName];
    }

    const [rows, fields] = await db.promise().query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error('Error executing MySQL query for child list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/childList', async (req, res) => {
  const { year, bitName } = req.query;

  try {
    let query;
    let queryParams;

    if (year) {
      query = `
        SELECT child_name, anganwadi_no
        FROM child
        WHERE bit_name = ? AND SUBSTRING(date, 1, 4) = ?
      `;
      queryParams = [bitName, year];
    } else {
      // When no year is provided, fetch data for all years
      query = `
        SELECT child_name, anganwadi_no
        FROM child
        WHERE bit_name = ?
      `;
      queryParams = [bitName];
    }

    const [rows, fields] = await db.promise().query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error('Error executing MySQL query for child list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getTransitionCount', async (req, res) => {
  try {
    // Extract the distinct years from the visits table
    const distinctYearsQuery = 'SELECT DISTINCT YEAR(visitDate) AS year FROM visits;';
    const distinctYearsResult = await db.promise().query(distinctYearsQuery);
    const distinctYears = distinctYearsResult[0].map((row) => row.year);

    // Extract the year parameter from the request query
    const selectedYear = req.query.year;

    // Use the year parameter in your SQL query
    const query = `
      SELECT
        c.bit_name,
        COUNT(DISTINCT CASE WHEN sam_visits.firstVisitDate IS NOT NULL AND normal_visits.visitDate IS NOT NULL THEN v.childName END) AS sam_to_normal_count,
        COUNT(DISTINCT CASE WHEN mam_visits.firstVisitDate IS NOT NULL AND normal_visits.visitDate IS NOT NULL THEN v.childName END) AS mam_to_normal_count
      FROM child c
      JOIN visits v ON c.child_name = v.childName AND c.anganwadi_no = v.anganwadiNo
      LEFT JOIN (
        SELECT childName, MIN(visitDate) AS firstVisitDate
        FROM visits
        WHERE grade = 'SAM'
        GROUP BY childName
      ) AS sam_visits ON v.childName = sam_visits.childName
      LEFT JOIN (
        SELECT childName, MIN(visitDate) AS firstVisitDate
        FROM visits
        WHERE grade = 'MAM'
        GROUP BY childName
      ) AS mam_visits ON v.childName = mam_visits.childName
      LEFT JOIN visits normal_visits ON v.childName = normal_visits.childName AND normal_visits.grade = 'Normal'
      WHERE (v.grade = 'SAM' OR v.grade = 'MAM')
      ${selectedYear ? `AND YEAR(v.visitDate) = ${db.escape(selectedYear)}` : ''}
      GROUP BY c.bit_name;
    `;

    const result = await db.promise().query(query);

    // Return the result along with distinct years for the dropdown
    res.json({ data: result[0], distinctYears });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/updateVaccinationData', (req, res) => {
  const { anganwadiNo, childsName, BCG, POLIO, IPV, PCV, PENTAVALENT, ROTAVIRUS, MR, VITAMIN_A, DPT, TD } = req.body;
  // Debugging: Log the request body
  console.log("Request body before query execution: ", {
    BCG,
    POLIO,
    IPV,
    PCV,
    PENTAVALENT,
    ROTAVIRUS,
    MR,
    VITAMIN_A,
    DPT,
    TD,
    anganwadiNo,
    childsName,
  });
  const sqlQuery = `
    UPDATE generalhistory
    SET BCG = ${BCG},
        POLIO = ${POLIO},
        IPV = ${IPV},
        PCV = ${PCV},
        PENTAVALENT = ${PENTAVALENT},
        ROTAVIRUS = ${ROTAVIRUS},
        MR = ${MR},
        VITAMIN_A = ${VITAMIN_A},
        DPT = ${DPT},
        TD = ${TD}
    WHERE anganwadiNo = '${anganwadiNo}' AND LOWER(childName) = LOWER('${childsName}')
  `;
  db.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error updating vaccination data:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    } else {
      console.log('Vaccination data updated successfully.');
      console.log("Result of query: ", results);
      res.status(200).json({ success: true });
    }
  });
});
app.post('/updateVaccinationData', (req, res) => {
  const { anganwadiNo, childsName, BCG, POLIO, IPV, PCV, PENTAVALENT, ROTAVIRUS, MR, VITAMIN_A, DPT, TD } = req.body;
  // Debugging: Log the request body
  console.log("Request body before query execution: ", {
    BCG,
    POLIO,
    IPV,
    PCV,
    PENTAVALENT,
    ROTAVIRUS,
    MR,
    VITAMIN_A,
    DPT,
    TD,
    anganwadiNo,
    childsName,
  });
  const sqlQuery = `
    UPDATE generalhistory
    SET BCG = ${BCG},
        POLIO = ${POLIO},
        IPV = ${IPV},
        PCV = ${PCV},
        PENTAVALENT = ${PENTAVALENT},
        ROTAVIRUS = ${ROTAVIRUS},
        MR = ${MR},
        VITAMIN_A = ${VITAMIN_A},
        DPT = ${DPT},
        TD = ${TD}
    WHERE anganwadiNo = '${anganwadiNo}' AND LOWER(childName) = LOWER('${childsName}')
  `;
  db.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error updating vaccination data:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    } else {
      console.log('Vaccination data updated successfully.');
      console.log("Result of query: ", results);
      res.status(200).json({ success: true });
    }
  });
});
app.get('/getDistinctYears', async (req, res) => {
  try {
    // Extract the distinct years from the visits table
    const distinctYearsQuery = 'SELECT DISTINCT YEAR(visitDate) AS year FROM visits;';
    const distinctYearsResult = await db.promise().query(distinctYearsQuery);
    const distinctYears = distinctYearsResult[0].map((row) => row.year);

    // Return the distinct years as JSON
    res.json(distinctYears);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getChildDetails', async (req, res) => {
  try {
    const { bitName, year } = req.query;

  

    const querySAM = `
    SELECT DISTINCT
        c.anganwadi_no,
        c.child_name
      FROM child c
      JOIN visits v ON c.child_name = v.childName AND c.anganwadi_no = v.anganwadiNo
      LEFT JOIN (
        SELECT childName
        FROM visits
        WHERE grade = 'SAM'
        GROUP BY childName
      ) AS sam_visits ON v.childName = sam_visits.childName
      LEFT JOIN visits normal_visits ON v.childName = normal_visits.childName AND normal_visits.grade = 'Normal'
      WHERE v.grade = 'SAM'
        AND normal_visits.grade = 'Normal'
        AND c.bit_name = ${db.escape(bitName)}
        ${year ? `AND YEAR(v.visitDate) = ${db.escape(year)}` : ''};
    `;

  //   const queryMAM = `
  //   SELECT DISTINCT
  //   child.child_name,
  //   child.anganwadi_no,
  //   visits.grade AS originalGrade,
  //   normal_visits.grade AS finalGrade
  // FROM child
  // JOIN visits ON child.child_name = visits.childName AND child.anganwadi_no = visits.anganwadiNo
  // LEFT JOIN visits normal_visits ON child.child_name = normal_visits.childName
  //   AND normal_visits.grade = 'Normal'
  //   AND normal_visits.visitDate > visits.visitDate
  // WHERE child.bit_name = ${db.escape(bitName)}
  //   AND visits.grade = 'MAM'
  //   ${year ? `AND YEAR(visits.visitDate) = ${db.escape(year)}` : ''}
  //   AND normal_visits.grade = 'Normal';
  //   `;

    const queryMAM = `
    SELECT DISTINCT
        c.anganwadi_no,
        c.child_name
      FROM child c
      JOIN visits v ON c.child_name = v.childName AND c.anganwadi_no = v.anganwadiNo
      LEFT JOIN (
        SELECT childName
        FROM visits
        WHERE grade = 'MAM'
        GROUP BY childName
      ) AS sam_visits ON v.childName = sam_visits.childName
      LEFT JOIN visits normal_visits ON v.childName = normal_visits.childName AND normal_visits.grade = 'Normal'
      WHERE v.grade = 'MAM'
        AND normal_visits.grade = 'Normal'
        AND c.bit_name = ${db.escape(bitName)}
        ${year ? `AND YEAR(v.visitDate) = ${db.escape(year)}` : ''};
    `;

    const resultSAM = await db.promise().query(querySAM);
    const resultMAM = await db.promise().query(queryMAM);

    if (resultSAM[0].length > 0 || resultMAM[0].length > 0) {
      const childDetails = {
        SAM: resultSAM[0],
        MAM: resultMAM[0],
      };
      res.json(childDetails);
    } else {
      res.json({ error: 'No child details found for the given parameters' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getChildDetails', async (req, res) => {
  try {
    const { bitName, year } = req.query;

  

    const querySAM = `
    SELECT DISTINCT
        c.anganwadi_no,
        c.child_name
      FROM child c
      JOIN visits v ON c.child_name = v.childName AND c.anganwadi_no = v.anganwadiNo
      LEFT JOIN (
        SELECT childName
        FROM visits
        WHERE grade = 'SAM'
        GROUP BY childName
      ) AS sam_visits ON v.childName = sam_visits.childName
      LEFT JOIN visits normal_visits ON v.childName = normal_visits.childName AND normal_visits.grade = 'Normal'
      WHERE v.grade = 'SAM'
        AND normal_visits.grade = 'Normal'
        AND c.bit_name = ${db.escape(bitName)}
        ${year ? `AND YEAR(v.visitDate) = ${db.escape(year)}` : ''};
    `;

  //   const queryMAM = `
  //   SELECT DISTINCT
  //   child.child_name,
  //   child.anganwadi_no,
  //   visits.grade AS originalGrade,
  //   normal_visits.grade AS finalGrade
  // FROM child
  // JOIN visits ON child.child_name = visits.childName AND child.anganwadi_no = visits.anganwadiNo
  // LEFT JOIN visits normal_visits ON child.child_name = normal_visits.childName
  //   AND normal_visits.grade = 'Normal'
  //   AND normal_visits.visitDate > visits.visitDate
  // WHERE child.bit_name = ${db.escape(bitName)}
  //   AND visits.grade = 'MAM'
  //   ${year ? `AND YEAR(visits.visitDate) = ${db.escape(year)}` : ''}
  //   AND normal_visits.grade = 'Normal';
  //   `;

    const queryMAM = `
    SELECT DISTINCT
        c.anganwadi_no,
        c.child_name
      FROM child c
      JOIN visits v ON c.child_name = v.childName AND c.anganwadi_no = v.anganwadiNo
      LEFT JOIN (
        SELECT childName
        FROM visits
        WHERE grade = 'MAM'
        GROUP BY childName
      ) AS sam_visits ON v.childName = sam_visits.childName
      LEFT JOIN visits normal_visits ON v.childName = normal_visits.childName AND normal_visits.grade = 'Normal'
      WHERE v.grade = 'MAM'
        AND normal_visits.grade = 'Normal'
        AND c.bit_name = ${db.escape(bitName)}
        ${year ? `AND YEAR(v.visitDate) = ${db.escape(year)}` : ''};
    `;

    const resultSAM = await db.promise().query(querySAM);
    const resultMAM = await db.promise().query(queryMAM);

    if (resultSAM[0].length > 0 || resultMAM[0].length > 0) {
      const childDetails = {
        SAM: resultSAM[0],
        MAM: resultMAM[0],
      };
      res.json(childDetails);
    } else {
      res.json({ error: 'No child details found for the given parameters' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Start the server
app.listen(port, '0.0.0.0', () => {
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});