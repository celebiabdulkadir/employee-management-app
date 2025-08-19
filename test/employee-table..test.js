import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../src/components/listElements/employee-table.js';

describe('EmployeeTable', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employee-table></employee-table>`);
  });

  describe('Methods', () => {
    it('handleSort dispatches sort-change event', () => {
      let eventFired = false;
      let eventDetail = null;

      element.addEventListener('sort-change', e => {
        eventFired = true;
        eventDetail = e.detail;
      });

      element.handleSort('lastName');

      expect(eventFired).to.be.true;
      expect(eventDetail.field).to.equal('lastName');
    });

    it('handleSelectEmployee dispatches employee-select event', () => {
      let eventFired = false;
      let eventDetail = null;

      element.addEventListener('employee-select', e => {
        eventFired = true;
        eventDetail = e.detail;
      });

      element.handleSelectEmployee('emp-1', true);

      expect(eventFired).to.be.true;
      expect(eventDetail.employeeId).to.equal('emp-1');
      expect(eventDetail.checked).to.be.true;
    });

    it('handleSelectAll dispatches select-all event', () => {
      let eventFired = false;
      let eventDetail = null;

      element.addEventListener('select-all', e => {
        eventFired = true;
        eventDetail = e.detail;
      });

      element.handleSelectAll(true);

      expect(eventFired).to.be.true;
      expect(eventDetail.checked).to.be.true;
    });

    it('handleEdit dispatches employee-edit event', () => {
      let eventFired = false;
      let eventDetail = null;

      element.addEventListener('employee-edit', e => {
        eventFired = true;
        eventDetail = e.detail;
      });

      element.handleEdit('emp-1');

      expect(eventFired).to.be.true;
      expect(eventDetail.employeeId).to.equal('emp-1');
    });

    it('handleDelete dispatches employee-delete event', () => {
      let eventFired = false;
      let eventDetail = null;

      element.addEventListener('employee-delete', e => {
        eventFired = true;
        eventDetail = e.detail;
      });

      element.handleDelete('emp-1');

      expect(eventFired).to.be.true;
      expect(eventDetail.employeeId).to.equal('emp-1');
    });
  });
});
