import { expect } from '@open-wc/testing';
import { employeeStore } from '../src/employee-store.js';

describe('EmployeeStore', () => {
  beforeEach(() => {
    employeeStore.clear();
    localStorage.clear();
  });

  afterEach(() => {
    employeeStore.clear();
    localStorage.clear();
  });

  describe('Basic functionality', () => {
    it('starts empty', () => {
      expect(employeeStore.getAll()).to.have.length(0);
    });

    it('generates unique IDs', () => {
      const id1 = employeeStore.generateId();
      const id2 = employeeStore.generateId();
      expect(id1).to.not.equal(id2);
      expect(id1).to.be.a('string');
      expect(id2).to.be.a('string');
    });

    it('normalizes phone numbers', () => {
      const normalized = employeeStore.normalizePhone('+1 (555) 123-4567');
      expect(normalized).to.equal('+15551234567');
    });
  });

  describe('CRUD operations', () => {
    it('adds employee', () => {
      const employee = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@test.com',
        phone: '+1555123456789',
        dateOfBirth: '1985-05-15',
        dateOfEmployment: '2021-03-01',
        department: 'Analytics',
        position: 'Senior',
      };

      const result = employeeStore.add(employee);
      expect(result.id).to.be.a('string');
      expect(result.firstName).to.equal('Jane');
      expect(employeeStore.getAll()).to.have.length(1);
    });

    it('gets employee by ID', () => {
      const employee = {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@test.com',
        phone: '+1555987654321',
        dateOfBirth: '1988-12-10',
        dateOfEmployment: '2019-07-15',
        department: 'Tech',
        position: 'Medior',
      };

      const added = employeeStore.add(employee);
      const retrieved = employeeStore.getById(added.id);

      expect(retrieved).to.exist;
      expect(retrieved.firstName).to.equal('Bob');
    });

    it('updates employee', () => {
      const employee = {
        firstName: 'Alice',
        lastName: 'Williams',
        email: 'alice@test.com',
        phone: '+1555456789123',
        dateOfBirth: '1992-03-20',
        dateOfEmployment: '2022-01-10',
        department: 'Analytics',
        position: 'Junior',
      };

      const added = employeeStore.add(employee);
      const updates = {
        firstName: 'Alice',
        lastName: 'Williams',
        email: 'alice@test.com',
        phone: '+1555456789123',
        dateOfBirth: '1992-03-20',
        dateOfEmployment: '2022-01-10',
        position: 'Senior',
        department: 'Tech',
      };
      const updated = employeeStore.update(added.id, updates);

      expect(updated.position).to.equal('Senior');
      expect(updated.department).to.equal('Tech');
      expect(updated.firstName).to.equal('Alice');
    });

    it('deletes employee', () => {
      const employee = {
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie@test.com',
        phone: '+1555789123456',
        dateOfBirth: '1987-08-05',
        dateOfEmployment: '2020-11-20',
        department: 'Tech',
        position: 'Medior',
      };

      const added = employeeStore.add(employee);
      const deleted = employeeStore.delete(added.id);

      expect(deleted).to.exist;
      expect(employeeStore.getById(added.id)).to.be.undefined;
      expect(employeeStore.getAll()).to.have.length(0);
    });

    it('returns undefined for invalid ID', () => {
      const result = employeeStore.getById('invalid-id');
      expect(result).to.be.undefined;
    });

    it('fails update for invalid ID', () => {
      expect(() => {
        employeeStore.update('invalid-id', { firstName: 'Test' });
      }).to.throw('Employee not found');
    });

    it('fails delete for invalid ID', () => {
      expect(() => {
        employeeStore.delete('invalid-id');
      }).to.throw('Employee not found');
    });
  });
});
