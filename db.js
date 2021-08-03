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
db.run(`CREATE TABLE IF NOT EXISTS Companies  (id INT PRIMARY KEY ,company_id VARCHAR,name VARCHAR UNIQUE,description VARCHAR,country VARCHAR,city VARCHAR,logo_link VARCHAR,activity_id INTEGER ,FOREIGN KEY(activity_id) REFERENCES Activities(id),keyfigure_id INTEGER ,FOREIGN KEY(keyfigure_id) REFERENCES Figures(company_id))
organisation_id INTEGER ,FOREIGN KEY(organisation_id) REFERENCES Figures(company_id),commercial_info_id INTEGER ,FOREIGN KEY(commercial_info_id) REFERENCES Commercial(company_id),contact_id INTEGER ,FOREIGN KEY(contact_id) REFERENCES Figures(company_id),category_id INTEGER ,FOREIGN KEY(category_id) REFERENCES Category(id)`);
db.run('CREATE TABLE IF NOT EXISTS Activities (id INT PRIMARY KEY,name VARCHAR)');
db.run('CREATE TABLE IF NOT EXISTS Figures (id INT PRIMARY KEY,company_id INT,headcount VARCHAR NULLABLE ,sales_staff VARCHAR NULLABLE,export_sales VARCHAR NULLABLE,sales_turnover VARCHAR NULLABLE)');
db.run('CREATE TABLE IF NOT EXISTS Organisations (id INT PRIMARY KEY,company_id INT,estabilished_year INT NULLABLE ,site_status VARCHAR NULLABLE,main_activity VARCHAR NULLABLE)');
db.run('CREATE TABLE IF NOT EXISTS Commercial(id INT PRIMARY KEY,company_id INT,abbreviation VARCHAR NULLABLE ,title VARCHAR NULLABLE,image VARCHAR NULLABLE)');
db.run('CREATE TABLE IF NOT EXISTS Contacts(id INT PRIMARY KEY,company_id INT,vat_code VARCHAR NULLABLE ,phone VARCHAR NULLABLE)');
db.run('CREATE TABLE IF NOT EXISTS Categories(id INT PRIMARY KEY,name VARCHAR)');


/**
 * Close database connection
 */
db.close();