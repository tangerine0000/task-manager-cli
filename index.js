// index.js (Finalized db instance management)
const readline = require('readline');
const { initDb, closeDb } = require('./database'); // Only import initDb and closeDb functions

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let _db = null; // Declare a local variable to hold our database connection instance

async function runCommand() {
    try {
        _db = await initDb(); // Assign the resolved database instance to _db
        // DEBUGGING: Remove these lines after confirming it works
        // console.log('DEBUG: In index.js runCommand - Before initDb, _db is:', _db);
        // console.log('DEBUG: In index.js runCommand - After initDb, _db is:', _db);
    } catch (dbError) {
        console.error("Failed to initialize database, exiting:", dbError.message);
        process.exit(1);
    }

    console.log("Welcome to your Task Manager CLI!");
    console.log("---------------------------------");

    const args = process.argv.slice(2);
    const command = args[0];

    try {
        switch (command) {
            case 'add':
                let descriptionParts = [];
                let due = null;
                let priority = null;
                let hasDescription = false; // Flag to ensure there's at least some description

                // Iterate through arguments starting from the one after 'add' (args[1])
                for (let i = 1; i < args.length; i++) {
                    if (args[i] === '--due') {
                        if (args.length > i + 1) { // Check if there's a value after --due
                            due = args[i + 1];
                            i++; // Skip the next argument since it's the value for --due
                        } else {
                            console.log("Error: --due flag requires a date value (e.g., --due YYYY-MM-DD).");
                            return; // Exit the command if syntax is wrong
                        }
                    } else if (args[i] === '--priority') {
                        if (args.length > i + 1) { // Check if there's a value after --priority
                            priority = args[i + 1];
                            i++; // Skip the next argument
                        } else {
                            console.log("Error: --priority flag requires a value (e.g., --priority low).");
                            return; // Exit the command if syntax is wrong
                        }
                    } else {
                        // If it's not a flag, it's part of the task description
                        descriptionParts.push(args[i]);
                        hasDescription = true;
                    }
                }

                if (!hasDescription) { // Check if any description parts were collected
                    console.log("Error: Please provide a description for the 'add' command.");
                    console.log("Example: node index.js add 'Read a book'");
                    console.log("Example 2: node index.js add 'Read a book' --due 2025-05-30 --priority low");
                    break; // Exit the case
                }

                const taskDescription = descriptionParts.join(' ');
                await addTask(_db, taskDescription, due, priority);
                break; // Don't forget the break statement for the 'add' case!

            case 'list':
                let statusFilter = null;
                const statusArgIndex = args.indexOf('--status');
                if (statusArgIndex !== -1 && args.length > statusArgIndex + 1) {
                    const requestedStatus = args[statusArgIndex + 1].toLowerCase();
                    if (requestedStatus === 'completed' || requestedStatus === 'pending') {
                        statusFilter = requestedStatus;
                    } else {
                        console.log("Error: Invalid status filter. Use 'completed' or 'pending'.");
                        console.log("Example: node index.js list --status pending");
                        return; // Exit the case and thus the command execution
                    }
                }
                // Pass _db explicitly to listTasks
                await listTasks(_db, statusFilter);
                break;

            case 'complete':
                if (args.length > 1) {
                    const taskId = parseInt(args[1]);
                    if (!isNaN(taskId)) {
                        // Pass _db explicitly to completeTask
                        await completeTask(_db, taskId);
                    } else {
                        console.log("Error: Please provide a valid task ID to complete.");
                        console.log("Example: node index.js complete 1");
                    }
                } else {
                    console.log("Error: Please provide a task ID to complete.");
                    console.log("Example: node index.js complete 1");
                }
                break;

            case 'delete':
                if (args.length > 1) {
                    const taskId = parseInt(args[1]);
                    if (!isNaN(taskId)) {
                        // Pass _db explicitly to deleteTask
                        await deleteTask(_db, taskId);
                    } else {
                        console.log("Error: Please provide a valid task ID to delete.");
                        console.log("Example: node index.js delete 1");
                    }
                } else {
                    console.log("Error: Please provide a task ID to delete.");
                    console.log("Example: node index.js delete 1");
                }
                break;

            case 'edit':
                if (args.length > 1) {
                    const taskId = args[1];
                    const taskDescription = args.slice(2).join(' ');
                    if (!isNaN(taskId)) {
                        await editTask(_db, taskId, taskDescription);
                    } else {
                        console.log("Error: Please provide a valid task ID to edit.");
                        console.log("Example: node index.js edit id \"New description for task\"");
                    }
                } else {
                    console.log("Error: Please provide id and new description.")
                    console.log("Example: node index.js edit id \"New description for task\"")
                }
                break;

            case 'help':
                const instruction = `
                    A guidance on using this CLI tool.
                    - To add a new task: node index.js add <your task's description>. Example: node index.js add "Cook the rice by rice-cooker".
                    - To edit your task: node index.js edit <task's id> <new description>. Example: node index.js edit 1 "Cook the white rice by rice-cooker".
                    - To view your task and your task's ID: node index.js list
                    - - To view your completed task or pending task: node index.js list --status [pending, completed]. Example: node index.js list --status pending
                    - To change the state of your task to complete: node index.js complete <task's id>. Example: node index.js complete 1
                    - To delete your task: node index.js delete <task's id>. Example: node index.js delete 1.
                `
                console.log(instruction);
                break;

            case 'ask':
                await new Promise(resolve => {
                    rl.question('What is your name? ', (name) => {
                        console.log(`Hello, ${name}! It's nice to meet you.`);
                        rl.close();
                        resolve();
                    });
                });
                break;

            case undefined:
                console.log("No specific command provided. Available commands: add, list, complete, delete, ask");
                console.log("Example: node index.js add 'Buy groceries'");
                console.log("Example: node index.js list");
                break;

            default:
                console.log(`Unknown command: "${command}". Available commands: add, list, complete, delete, ask`);
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    } finally {
        await closeDb();
        process.exit(0);
    }
}

// --- Database Operations (CRUD) ---
// Now each function accepts the db instance as its first argument

// CREATE
function addTask(dbInstance, description, due = null, priority = null) { // Accept dbInstance here
    return new Promise((resolve, reject) => {
        // Correct SQL: one '?' for each column
        dbInstance.run(`INSERT INTO tasks (description, due, priority) VALUES (?, ?, ?)`, [description, due, priority], function(err) {
            if (err) {
                console.error('Error adding task:', err.message);
                reject(err);
            } else {
                console.log(`Task "${description}" added with ID: ${this.lastID}`);
                if (due) console.log(`  Due: ${due}`);
                if (priority) console.log(`  Priority: ${priority}`);
                resolve(this.lastID);
            }
        });
    });
}

// READ
function listTasks(dbInstance, statusFilter = null) { // Accept dbInstance here
    // DEBUGGING: Remove this line after confirming it works
    // console.log('DEBUG: In index.js listTasks - dbInstance is:', dbInstance);
    return new Promise((resolve, reject) => {
        let sql = `SELECT id, description, completed, due, priority FROM tasks`;
        const params = [];

        if (statusFilter === 'completed') {
            sql += ` WHERE completed = 1`;
        } else if (statusFilter === 'pending') {
            sql += ` WHERE completed = 0`;
        }

        sql += ` ORDER BY id ASC`;

        dbInstance.all(sql, params, (err, rows) => { // Use dbInstance here
            if (err) {
                console.error('Error listing tasks:', err.message);
                reject(err);
            } else {
                if (rows.length === 0) {
                    if (statusFilter === 'completed') {
                        console.log("No completed tasks found.");
                    } else if (statusFilter === 'pending') {
                        console.log("No pending tasks found.");
                    } else {
                        console.log("No tasks found. Add one with 'node index.js add \"My task\"'");
                    }
                } else {
                    console.log("Your Tasks:");
                    rows.forEach(task => {
                        const status = task.completed === 1 ? '[x]' : '[ ]';
                        let basic_display = `${task.id}. ${status} ${task.description}`
                        if (task.due !== null) {
                            basic_display += `\n- Due: ${task.due}`
                        }
                        if (task.priority !== null) {
                            basic_display += `\n- Priority: ${task.priority}`
                        }
                        console.log(basic_display);
                    });
                }
                resolve(rows);
            }
        });
    });
}

// UPDATE
function completeTask(dbInstance, id) { // Accept dbInstance here
    return new Promise((resolve, reject) => {
        dbInstance.run(`UPDATE tasks SET completed = 1 WHERE id = ?`, [id], function (err) {
            if (err) {
                console.error(`Error completing task ID ${id}:`, err.message);
                reject(err);
            } else if (this.changes === 0) {
                console.log(`Task ID ${id} not found or already completed.`);
                resolve(false);
            } else {
                console.log(`Task ID ${id} marked as completed.`);
                resolve(true);
            }
        });
    });
}

function editTask(dbInstance, id, new_description) {
    return new Promise((resolve, reject) => {
        dbInstance.run(`UPDATE tasks SET description = ? WHERE id = ?`, [new_description, id], (err) => {
            if (err) {
                console.error(`Error editing the description of task ID ${id}:`, err.message);
                reject(err);
            } else if (this.changes === 0) {
                console.log(`Task ID ${id} not found or description is already the same.`)
                resolve(false);
            } else {
                console.log(`Update the description of ID ${id} successfully.`)
                resolve(true);
            }
        });
    });
}

// DELETE
function deleteTask(dbInstance, id) { // Accept dbInstance here
    return new Promise((resolve, reject) => {
        dbInstance.run(`DELETE FROM tasks WHERE id = ?`, [id], function (err) {
            if (err) {
                console.error(`Error deleting task ID ${id}:`, err.message);
                reject(err);
            } else if (this.changes === 0) {
                console.log(`Task ID ${id} not found.`);
                resolve(false);
            } else {
                console.log(`Task ID ${id} deleted.`);
                resolve(true);
            }
        });
    });
}

runCommand();