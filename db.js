/**
 * Database connection
 */
import sqlite3 from 'sqlite3';

export function databaseConnection(name) {
    /**
     * Create tables
     */
    var verbose = sqlite3.verbose();
    var db = new verbose.Database('./db/leadrebel.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        /**
         * Database connection
         */
        console.log('Connected to the leadrebel database.');
    });
    db.run(`CREATE TABLE IF NOT EXISTS Companies  (
                id
                INTEGER PRIMARY KEY,
                name
                VARCHAR,
                country
                VARCHAR NULLABLE,
                address
                VARCHAR NULLABLE,
                website
                VARCHAR NULLABLE,
                description
                VARCHAR NULLABLE,
                phone
                VARCHAR
                NULLABLE,
                head_count
                VARCHAR
                NULLABLE,
                established_year
                VARCHAR
                NULLABLE,
                sales_staff
                VARCHAR
                NULLABLE,
                export_sales
                VARCHAR
                NULLABLE,
                categories
                VARCHAR
                NULLABLE,
                vat_code
                VARCHAR
                NULLABLE,
                sales_turnover
                VARCHAR
                NULLABLE
            )`);
    db.run(`INSERT INTO Companies (name) VALUES ('${name}')`);
    db.close();
}
