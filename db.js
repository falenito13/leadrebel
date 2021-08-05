/**
 * Database connection
 */
import sqlite3 from 'sqlite3';
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
export function createTable() {
    /**
     * Create tables
     */
    db.serialize(() => {

        db.run(`CREATE TABLE IF NOT EXISTS Companies
                (
                    id INTEGER PRIMARY KEY,
                    name VARCHAR NULLABLE,
                    country VARCHAR NULLABLE,
                    address VARCHAR NULLABLE,
                    website VARCHAR NULLABLE,
                    description VARCHAR NULLABLE,
                    phone VARCHAR NULLABLE,
                    head_count VARCHAR NULLABLE,
                    established_year VARCHAR NULLABLE,
                    sales_staff VARCHAR  NULLABLE,
                    export_sales VARCHAR NULLABLE,
                    categories VARCHAR NULLABLE,
                    vat_code VARCHAR NULLABLE,
                    sales_turnover VARCHAR NULLABLE,
                    keywords  VARCHAR NULLABLE
                )`);
    });
}
    export function insertTable(name,address,website,categories,country,vat,head_count,sales_staff,sales_turnover,phone_number,description,established_year,export_sales,keywordsArray){
        db.serialize(() => {
            db.run(`INSERT INTO Companies (name,country,address,website,description,phone,head_count,established_year,sales_staff,export_sales,
            categories,vat_code,sales_turnover,keywords)` + ` values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[name,country,address,website,description,phone_number,head_count,
            established_year,sales_staff,export_sales,categories,vat,sales_turnover,keywordsArray],function(err){

                if(err){
                    console.log(err.message);
                }

                    console.log('success');
            });
        });
    }


