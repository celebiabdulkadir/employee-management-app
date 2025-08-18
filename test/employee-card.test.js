import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../src/components/listElements/employee-card.js';

describe('EmployeeCard', () => {
  let element;
  const mockEmployee = {
    id: 'emp-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    dateOfBirth: '1990-05-15',
    dateOfEmployment: '2020-03-01',
    department: 'Tech',
    position: 'Senior',
  };

  beforeEach(async () => {
    element = await fixture(html`<employee-card></employee-card>`);
  });

  describe('Rendering', () => {
    it('renders with default properties', () => {
      expect(element.employee).to.be.null;
      expect(element.selected).to.be.false;
      expect(element.showActions).to.be.true;
    });

    it('renders empty when no employee provided', () => {
      const cardElement = element.shadowRoot.querySelector('.employee-card');
      expect(cardElement).to.not.exist;
    });

    it('renders employee card when employee provided', async () => {
      element.employee = mockEmployee;
      await element.updateComplete;

      const cardElement = element.shadowRoot.querySelector('.employee-card');
      expect(cardElement).to.exist;
    });

    it('displays all employee fields', async () => {
      element.employee = mockEmployee;
      await element.updateComplete;

      const fieldValues = element.shadowRoot.querySelectorAll('.field-value');
      expect(fieldValues).to.have.length(6);

      const values = Array.from(fieldValues).map(el => el.textContent.trim());
      expect(values).to.include('John');
      expect(values).to.include('Doe');
      expect(values).to.include('john.doe@example.com');
      expect(values).to.include('+1234567890');
      expect(values).to.include('1990-05-15');
      expect(values).to.include('2020-03-01');
    });

    it('renders checkbox', async () => {
      element.employee = mockEmployee;
      await element.updateComplete;

      const checkbox = element.shadowRoot.querySelector('.checkbox');
      expect(checkbox).to.exist;
      expect(checkbox.type).to.equal('checkbox');
    });
  });

  describe('Selection State', () => {
    beforeEach(async () => {
      element.employee = mockEmployee;
      await element.updateComplete;
    });
    it('dispatches employee-select event on checkbox change', async () => {
      let eventFired = false;
      let eventDetail = null;

      element.addEventListener('employee-select', e => {
        eventFired = true;
        eventDetail = e.detail;
      });

      const checkbox = element.shadowRoot.querySelector('.checkbox');
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));

      expect(eventFired).to.be.true;
      expect(eventDetail.employeeId).to.equal('emp-123');
      expect(eventDetail.checked).to.be.true;
    });
  });

  describe('Actions', () => {
    beforeEach(async () => {
      element.employee = mockEmployee;
      await element.updateComplete;
    });

    it('renders action buttons by default', () => {
      const actionsContainer =
        element.shadowRoot.querySelector('.card-actions');
      expect(actionsContainer).to.exist;

      const buttons = element.shadowRoot.querySelectorAll('app-button');
      expect(buttons).to.have.length(2);
    });

    it('hides action buttons when showActions is false', async () => {
      element.showActions = false;
      await element.updateComplete;

      const actionsContainer =
        element.shadowRoot.querySelector('.card-actions');
      expect(actionsContainer).to.not.exist;
    });

    it('renders edit button with correct properties', () => {
      const editButton = Array.from(
        element.shadowRoot.querySelectorAll('app-button'),
      ).find(
        btn => btn.textContent.trim().includes('Edit') || btn.icon === '✏️',
      );

      expect(editButton).to.exist;
      expect(editButton.variant).to.equal('ghost');
      expect(editButton.size).to.equal('small');
      expect(editButton.icon).to.equal('✏️');
    });

    it('renders delete button with correct properties', () => {
      const deleteButton = Array.from(
        element.shadowRoot.querySelectorAll('app-button'),
      ).find(
        btn => btn.textContent.trim().includes('Delete') || btn.icon === '🗑️',
      );

      expect(deleteButton).to.exist;
      expect(deleteButton.variant).to.equal('primary');
      expect(deleteButton.size).to.equal('small');
      expect(deleteButton.icon).to.equal('🗑️');
    });

    it('dispatches employee-edit event on edit button click', async () => {
      let eventFired = false;
      let eventDetail = null;

      element.addEventListener('employee-edit', e => {
        eventFired = true;
        eventDetail = e.detail;
      });

      element.handleEdit();

      expect(eventFired).to.be.true;
      expect(eventDetail.employeeId).to.equal('emp-123');
    });

    it('dispatches employee-delete event on delete button click', async () => {
      let eventFired = false;
      let eventDetail = null;

      element.addEventListener('employee-delete', e => {
        eventFired = true;
        eventDetail = e.detail;
      });

      element.handleDelete();

      expect(eventFired).to.be.true;
      expect(eventDetail.employeeId).to.equal('emp-123');
    });
  });
});
