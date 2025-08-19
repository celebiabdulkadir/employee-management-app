# Employee Management App

A simple employee management app built with LitElement. No backend required - data is stored in the browser.

**Live Demo:** [https://employee-management-app-six-topaz.vercel.app/](https://employee-management-app-six-topaz.vercel.app/)

## Screenshots

### Table View
![Table View]()

### Card View  
![Card View]()

### Add Employee Form
![Add Employee]()

### Edit Employee Form
![Edit Employee]()

### Delete Confirmation
![Delete Confirmation]()

### Multiple Selection
![Multiple Selection]()

### Bulk Delete Confirmation
![Bulk Delete Confirmation]()

## Features

- Add, edit, and delete employees
- Search and sort employee data
- Table and card view modes
- Form validation with uniqueness checks
- Turkish/English language support
- Responsive design
- Pagination

## Employee Data

Each employee has:
- First name, last name (required)
- Employment date (required, not future)
- Date of birth (required, minimum 15 years)
- Phone number (required, unique)
- Email (required, unique)
- Department (Analytics or Tech)
- Position (Junior, Medior, or Senior)

## Quick Start

```bash
npm install
npm start
```

Visit http://localhost:8000

## Development

```bash
npm start          # dev server
npm run build      # build for production
npm test           # run tests
npm run test:watch # tests with watch
npm run lint       # check code
npm run format     # format code
```

## Project Structure

```
src/
├── employee-management-app.js  # main app
├── employee-store.js           # data layer
├── components/                 # reusable components
├── views/                      # page components
├── localization/               # i18n
└── router/                     # routing
test/                           # unit tests
```

## Routes

- `/` - employee list
- `/add` - add new employee
- `/edit/:id` - edit employee

## Validation

- Email uniqueness (case insensitive)
- Phone uniqueness (normalized comparison)
- Employment date not in future
- Minimum age 15 years
- Required field validation

## Testing

Tests use @open-wc/testing over 85% coverage target.

```bash
npm test -- --coverage
```

## Tech Stack

- LitElement (vanilla JS)
- Vaadin Router
- Pure CSS (no frameworks)
- localStorage persistence
- Web Test Runner
