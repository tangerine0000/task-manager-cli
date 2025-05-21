// database.js (Updated for controlled initialization)
const sqlite3 = require('sqlite3').verbose();
const DB_FILE = 'tasks.db';

let dbInstance = null; // Hold the instance
let dbReadyPromise = null; // Promise to track when DB is ready

function initDb() {
    if (dbReadyPromise) {
        return dbReadyPromise; // Return existing promise if already initializing/initialized
    }

    dbReadyPromise = new Promise((resolve, reject) => {
        dbInstance = new sqlite3.Database(DB_FILE, (err) => {
            if (err) {
                console.error('Error connecting to database:', err.message);
                dbInstance = null; // Reset instance on error
                dbReadyPromise = null; // Reset promise on error
                return reject(err);
            }
            console.log(`Connected to the SQLite database: ${DB_FILE}`); // This log
            dbInstance.run(`
                CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    description TEXT NOT NULL,
                    completed INTEGER DEFAULT 0
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating tasks table:', err.message);
                    dbInstance = null; // Reset instance on error
                    dbReadyPromise = null; // Reset promise on error
                    return reject(err);
                }
                console.log('Tasks table ensured.'); // This log
                // console.log('DEBUG: In database.js initDb - dbInstance value at resolve:', dbInstance); // ADD THIS LINE
                dbInstance.run(`ALTER TABLE tasks ADD COLUMN due TEXT`, (err) => {
                    if (err && !err.message.includes('duplicate column name')) {
                        console.warn('Warning: Could not add "due" column (might already exist):', err.message);
                    }
                });
            
                // Add 'priority' column if it doesn't exist
                dbInstance.run(`ALTER TABLE tasks ADD COLUMN priority TEXT`, (err) => {
                    if (err && !err.message.includes('duplicate column name')) {
                        console.warn('Warning: Could not add "priority" column (might already exist):', err.message);
                    }
                });
                resolve(dbInstance); // Resolve with the connected instance
            });
        });
    });
    return dbReadyPromise;
}

// Export functions to manage the DB
module.exports = {
    initDb,
    get db() { // Getter to provide the instance once ready
        return dbInstance;
    },
    closeDb: () => { // Function to close
        return new Promise((resolve, reject) => {
            if (!dbInstance) {
                console.log('No database connection to close.');
                return resolve();
            }
            dbInstance.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                    return reject(err);
                }
                console.log('Database connection closed.');
                dbInstance = null;
                dbReadyPromise = null;
                resolve();
            });
        });
    }
};