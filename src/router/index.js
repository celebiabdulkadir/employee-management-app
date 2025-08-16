import { Router } from '@vaadin/router';

export class AppRouter {
  constructor(outlet) {
    this.router = new Router(outlet);
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.setRoutes([
      {
        path: '/',
        name: 'home',
        component: 'employee-list-view',
        action: () => {
          import('../views/employee-list-view.js');
        },
      },
      {
        path: '/employees',
        name: 'employees',
        component: 'employee-list-view',
        action: () => {
          import('../views/employee-list-view.js');
        },
      },
      {
        path: '/add',
        name: 'add-employee',
        component: 'employee-form-view',
        action: () => {
          import('../views/employee-form-view.js');
        },
      },
      {
        path: '/edit/:id',
        name: 'edit-employee',
        component: 'employee-form-view',
        action: () => {
          import('../views/employee-form-view.js');
        },
      },
    ]);
  }

  navigate(path) {
    this.router.go(path);
  }

  getCurrentLocation() {
    return this.router.location;
  }
}

export function navigateTo(path) {
  Router.go(path);
}

export function getRouterOutlet() {
  return document.querySelector('#router-outlet');
}
