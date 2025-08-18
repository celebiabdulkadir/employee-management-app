import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { employeeStore } from '../src/employee-store.js';

import '../src/components/listElements/employee-list.js';

describe('EmployeeList', () => {
  let element;

  beforeEach(async () => {
    employeeStore.clear();
    element = await fixture(html`<employee-list></employee-list>`);
    await element.updateComplete;
  });

  afterEach(() => {
    employeeStore.clear();
  });

  describe('Core Rendering', () => {
    it('renders with default properties', () => {
      expect(element.employees).to.be.an('array');
      expect(element.searchQuery).to.equal('');
      expect(element.currentPage).to.equal(1);
      expect(element.pageSize).to.equal(10);
      expect(element.viewMode).to.equal('table');
      expect(element.selectedEmployees).to.be.an('array');
    });

    it('renders list header with title', () => {
      const listTitle = element.shadowRoot.querySelector('.list-title');
      expect(listTitle).to.exist;
      expect(listTitle.tagName.toLowerCase()).to.equal('h1');
    });

    it('renders header controls', () => {
      const headerControls =
        element.shadowRoot.querySelector('.header-controls');
      expect(headerControls).to.exist;

      const employeeSearch =
        element.shadowRoot.querySelector('employee-search');
      const viewToggle = element.shadowRoot.querySelector('view-toggle');

      expect(employeeSearch).to.exist;
      expect(viewToggle).to.exist;
    });

    it('renders empty state when no employees and no search', async () => {
      element.employees = [];
      element.searchQuery = '';
      await element.updateComplete;

      const emptyState = element.shadowRoot.querySelector('.empty-state');
      expect(emptyState).to.exist;

      const emptyIcon = element.shadowRoot.querySelector('.empty-state-icon');
      expect(emptyIcon.textContent).to.equal('👥');
    });

    it('renders pagination component', () => {
      const pagination = element.shadowRoot.querySelector(
        'pagination-component',
      );
      expect(pagination).to.exist;
    });

    it('renders confirmation modal', () => {
      const modal = element.shadowRoot.querySelector('confirmation-modal');
      expect(modal).to.exist;
    });
  });

  describe('View Modes', () => {
    beforeEach(async () => {
      const testEmployee = {
        firstName: 'Test',
        lastName: 'Employee',
        email: 'test@example.com',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01',
        department: 'Tech',
        position: 'Junior',
      };
      employeeStore.add(testEmployee);
      element.loadEmployees();
      await element.updateComplete;
    });

    it('renders table view by default', () => {
      const employeeTable = element.shadowRoot.querySelector('employee-table');
      expect(employeeTable).to.exist;

      const cardsGrid = element.shadowRoot.querySelector('.cards-grid');
      expect(cardsGrid).to.not.exist;
    });

    it('switches to card view', async () => {
      element.viewMode = 'card';
      await element.updateComplete;

      const cardsGrid = element.shadowRoot.querySelector('.cards-grid');
      expect(cardsGrid).to.exist;

      const employeeTable = element.shadowRoot.querySelector('employee-table');
      expect(employeeTable).to.not.exist;
    });

    it('renders employee cards in card view', async () => {
      element.viewMode = 'card';
      await element.updateComplete;

      const employeeCards =
        element.shadowRoot.querySelectorAll('employee-card');
      expect(employeeCards.length).to.be.greaterThan(0);
    });
  });

  describe('Search', () => {
    it('handles search input', () => {
      const searchQuery = 'test query';
      element.handleSearch({ detail: { value: searchQuery } });

      expect(element.searchQuery).to.equal(searchQuery);
      expect(element.currentPage).to.equal(1);
    });

    it('resets page to 1 on search', () => {
      element.currentPage = 5;
      element.handleSearch({ detail: { value: 'search' } });
      expect(element.currentPage).to.equal(1);
    });
  });

  describe('Modal Management', () => {
    it('opens confirmation modal for delete', async () => {
      const testEmployee = {
        firstName: 'Test',
        lastName: 'Employee',
        email: 'test@example.com',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01',
        department: 'Tech',
        position: 'Junior',
      };
      const added = employeeStore.add(testEmployee);
      element.loadEmployees();

      element.handleDelete({ detail: { employeeId: added.id } });

      expect(element.confirmationModal.open).to.be.true;
      expect(element.confirmationModal.onConfirm).to.be.a('function');
    });

    it('closes confirmation modal', () => {
      element.confirmationModal = { open: true };
      element.closeConfirmationModal();
      expect(element.confirmationModal.open).to.be.false;
    });

    it('handles confirmation cancel', () => {
      element.confirmationModal = { open: true };
      element.handleConfirmationCancel();
      expect(element.confirmationModal.open).to.be.false;
    });

    it('handles confirmation confirm', () => {
      let confirmCalled = false;
      element.confirmationModal = {
        open: true,
        onConfirm: () => {
          confirmCalled = true;
        },
      };

      element.handleConfirmationConfirm();
      expect(confirmCalled).to.be.true;
    });
  });
});
