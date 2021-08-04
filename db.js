/**
 * Database connection
 */

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/leadrebel.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    /**
     * Database connection
     */
    console.log('Connected to the leadrebel database.');
});
/**
 * Create tables
 */
db.run(`CREATE TABLE IF NOT EXISTS Companies  (
    id INT PRIMARY KEY,name VARCHAR,country VARCHAR ,address VARCHAR,website VARCHAR,
    description VARCHAR ,phone VARCHAR NULLABLE,
    head_count VARCHAR NULLABLE,established_year VARCHAR NULLABLE,sales_staff VARCHAR NULLABLE,export_sales VARCHAR NULLABLE,categories VARCHAR NULLABLE ,vat_code VARCHAR NULLABLE ,sales_turnover VARCHAR NULLABLE)`);




db.close();