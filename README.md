# Employee Management App

A simple employee management app built with LitElement. No backend required - data is stored in the browser.

**Live Demo:** [https://employee-management-app-six-topaz.vercel.app/](https://employee-management-app-six-topaz.vercel.app/)

## Screenshots

### Table View
<img width="1437" height="745" alt="image" src="https://github.com/user-attachments/assets/5a70d5f7-877f-4056-bf8d-544ca00a94cc" />

### Card View  
<img width="1439" height="776" alt="image" src="https://github.com/user-attachments/assets/52d4ab4d-1512-4b16-a4d3-ad1e6f9ea686" />

### Add Employee Form
<img width="1414" height="751" alt="image" src="https://github.com/user-attachments/assets/88bc88b8-858f-4646-8af6-6dffb944bab2" />

### Edit Employee Form
<img width="1436" height="777" alt="image" src="https://github.com/user-attachments/assets/ce3a6ddb-219c-4f3e-9009-81231e69ec57" />

### Delete Confirmation
<img width="1438" height="778" alt="image" src="https://github.com/user-attachments/assets/1e371324-8c03-4052-82d1-30489e02f217" />


### Multiple Selection
<img width="1440" height="772" alt="image" src="https://github.com/user-attachments/assets/72d99634-44c7-4d77-a5e0-c2058f7df1c4" />

### Bulk Delete Confirmation
<img width="1438" height="762" alt="image" src="https://github.com/user-attachments/assets/295d9a03-ccf2-4040-bf38-5da27ba0a015" />

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
