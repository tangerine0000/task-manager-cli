# Task Manager CLI

A simple and efficient command-line task management tool built with Node.js and SQLite.

## Features

- Add tasks with optional due dates and priority levels
- List all tasks or filter by status (pending/completed)
- Mark tasks as complete
- Edit task descriptions
- Delete tasks
- Interactive mode for basic interactions

## Upcoming Features

### Planned Enhancements
- **Task Categories/Tags**: Add support for categorizing tasks with tags or labels
- **Task Dependencies**: Allow setting up task dependencies (e.g., "Task B can't start until Task A is complete")
- **Recurring Tasks**: Support for creating recurring tasks (daily, weekly, monthly)
- **Task Notes**: Add detailed notes or comments to tasks
- **Due Date Reminders**: Implement notification system for upcoming due dates
- **Task Search**: Add search functionality to find tasks by description, tags, or other attributes
- **Task Export/Import**: Export tasks to CSV/JSON and import from other task management tools
- **Task Statistics**: Generate reports on task completion rates and productivity metrics
- **Color Coding**: Add color support in terminal output for better visual organization
- **Task Priority Levels**: Enhance priority system with more levels and visual indicators
- **Task Archiving**: Archive completed tasks instead of deleting them
- **Task Sorting**: Add ability to sort tasks by various criteria (due date, priority, creation date)
- **Task Templates**: Create and use templates for common task types
- **Task Sharing**: Add support for sharing tasks with other users
- **Task Comments**: Allow adding comments to tasks for collaboration
- **Task History**: Track changes made to tasks over time

### Technical Improvements
- **Unit Tests**: Add comprehensive test coverage
- **CI/CD Pipeline**: Set up automated testing and deployment
- **Configuration File**: Add support for user configuration file
- **Database Migrations**: Implement proper database migration system
- **API Support**: Add REST API for remote task management
- **Interactive Mode**: Enhance interactive mode with more features
- **Progress Tracking**: Add progress tracking for long-running tasks
- **Data Backup**: Implement automatic backup system
- **Performance Optimization**: Optimize database queries and operations
- **Error Handling**: Enhance error handling and user feedback
- **Logging System**: Add comprehensive logging for debugging
- **Documentation**: Add API documentation and contribution guidelines

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