# Task Manager CLI

A simple and efficient command-line task management tool built with Node.js and SQLite.

## Features

- Add tasks with optional due dates and priority levels
- List all tasks or filter by status (pending/completed)
- Mark tasks as complete
- Edit task descriptions
- Delete tasks
- Interactive mode for basic interactions

## Installation

1. Clone this repository:
```bash
git clone [your-repository-url]
cd task-manager-cli
```

2. Install dependencies:
```bash
npm install
```

## Usage

The CLI supports the following commands:

### Add a Task
```bash
node index.js add "Your task description" [--due YYYY-MM-DD] [--priority low/medium/high]
```

### List Tasks
```bash
node index.js list [--status pending/completed]
```

### Complete a Task
```bash
node index.js complete <task-id>
```

### Edit a Task
```bash
node index.js edit <task-id> "New task description"
```

### Delete a Task
```bash
node index.js delete <task-id>
```

### Get Help
```bash
node index.js help
```

## Examples

1. Add a task with due date and priority:
```bash
node index.js add "Buy groceries" --due 2024-03-20 --priority high
```

2. List all pending tasks:
```bash
node index.js list --status pending
```

3. Complete a task:
```bash
node index.js complete 1
```

## Project Structure

- `index.js` - Main application file containing CLI logic and database operations
- `database.js` - Database initialization and connection management
- `tasks.db` - SQLite database file (created automatically)

## Dependencies

- Node.js
- SQLite3
- Readline (built-in)

## License

MIT License 