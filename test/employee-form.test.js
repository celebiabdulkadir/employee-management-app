import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { Router } from '@vaadin/router';

import '../src/components/employee-form.js';
import { employeeStore } from '../src/employee-store.js';

// Mock Router
const mockRouter = {
  go: () => {},
};
Object.defineProperty(Router, 'go', {
  value: mockRouter.go,
  writable: true,
});

describe('EmployeeForm', () => {
  let element;

  beforeEach(async () => {
    employeeStore.clear();
    localStorage.clear();
    element = await fixture(html`<employee-form></employee-form>`);
  });

  afterEach(() => {
    employeeStore.clear();
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('has correct default properties', () => {
      expect(element.employeeId).to.be.null;
      expect(element.isEdit).to.be.false;
      expect(element.isSubmitting).to.be.false;
      expect(element.errors).to.deep.equal({});
      expect(element.formData).to.deep.equal({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfEmployment: '',
        dateOfBirth: '',
        department: '',
        position: '',
      });
    });

    it('renders form with all required fields', () => {
      const form = element.shadowRoot.querySelector('form');
      expect(form).to.exist;

      const inputs = element.shadowRoot.querySelectorAll('input');
      expect(inputs).to.have.length(6);

      const selects = element.shadowRoot.querySelectorAll('select');
      expect(selects).to.have.length(2);

      const buttons = element.shadowRoot.querySelectorAll('app-button');
      expect(buttons).to.have.length(2);
    });

    it('shows correct labels for required fields', () => {
      const labels = element.shadowRoot.querySelectorAll(
        '.form-label.required',
      );
      expect(labels).to.have.length(8);

      const labelTexts = Array.from(labels).map(label =>
        label.textContent.trim(),
      );
      expect(labelTexts).to.include('First Name');
      expect(labelTexts).to.include('Last Name');
      expect(labelTexts).to.include('Email');
      expect(labelTexts).to.include('Phone');
      expect(labelTexts).to.include('Date of Employment');
      expect(labelTexts).to.include('Date of Birth');
      expect(labelTexts).to.include('Department');
      expect(labelTexts).to.include('Position');
    });

    it('shows "Add" button for new employee', () => {
      const submitButton = element.shadowRoot.querySelectorAll('app-button')[1];
      expect(submitButton.textContent.trim()).to.include('Add');
    });
  });

  describe('Edit Mode', () => {
    let testEmployee;

    beforeEach(async () => {
      testEmployee = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01',
        department: 'Tech',
        position: 'Junior',
      };
      const added = employeeStore.add(testEmployee);

      element.employeeId = added.id;
      element.isEdit = true;
      element.loadEmployee();
      await element.updateComplete;
    });

    it('loads employee data in edit mode', () => {
      expect(element.formData.firstName).to.equal('John');
      expect(element.formData.lastName).to.equal('Doe');
      expect(element.formData.email).to.equal('john@test.com');
      expect(element.formData.phone).to.equal('+1234567890');
      expect(element.formData.department).to.equal('Tech');
      expect(element.formData.position).to.equal('Junior');
    });

    it('shows "Update" button for edit mode', () => {
      const submitButton = element.shadowRoot.querySelectorAll('app-button')[1];
      expect(submitButton.textContent.trim()).to.include('Update');
    });

    it('populates form fields with employee data', () => {
      const firstNameInput =
        element.shadowRoot.querySelector('input[type="text"]');
      expect(firstNameInput.value).to.equal('John');

      const emailInput = element.shadowRoot.querySelector(
        'input[type="email"]',
      );
      expect(emailInput.value).to.equal('john@test.com');

      const departmentSelect = element.shadowRoot.querySelectorAll('select')[0];
      expect(departmentSelect.value).to.equal('Tech');
    });
    it('redirects to home if employee not found', () => {
      const originalGo = Router.go;
      let calledWith = null;
      Router.go = path => {
        calledWith = path;
      };
      element.employeeId = 'non-existent-id';
      element.loadEmployee();

      expect(calledWith).to.equal('/');
      Router.go = originalGo;
    });
  });
});
