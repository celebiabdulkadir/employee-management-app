const STORAGE_KEY = 'employees';

class EmployeeStore {
  constructor() {
    this.employees = this.loadFromStorage();
    this.listeners = new Set();
  }

  // eslint-disable-next-line class-methods-use-this
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading employees from storage:', error);
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.employees));
      this.notifyListeners();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving employees to storage:', error);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.employees));
  }

  // eslint-disable-next-line class-methods-use-this
  generateId() {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  }

  validateEmployee(employee, excludeId = null) {
    const errors = {};

    if (!employee.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!employee.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!employee.email?.trim()) {
      errors.email = 'Email is required';
    }
    if (!employee.phone?.trim()) {
      errors.phone = 'Phone is required';
    }
    if (!employee.dateOfEmployment) {
      errors.dateOfEmployment = 'Date of employment is required';
    }
    if (!employee.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    }
    if (!employee.department?.trim()) {
      errors.department = 'Department is required';
    }
    if (!employee.position?.trim()) {
      errors.position = 'Position is required';
    }

    if (employee.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
      errors.email = 'Invalid email format';
    }

    if (employee.phone && !/^\+?[\d\s\-()]{10,15}$/.test(employee.phone)) {
      errors.phone = 'Invalid phone format';
    }
    if (employee.dateOfEmployment) {
      const empDate = new Date(employee.dateOfEmployment);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (empDate > today) {
        errors.dateOfEmployment = 'Employment date cannot be in the future';
      }
    }

    if (employee.dateOfBirth) {
      const birthDate = new Date(employee.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const actualAge =
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;

      if (actualAge < 15) {
        errors.dateOfBirth = 'Employee must be at least 15 years old';
      }
    }

    if (employee.dateOfBirth && employee.dateOfEmployment) {
      const birthDate = new Date(employee.dateOfBirth);
      const employmentDate = new Date(employee.dateOfEmployment);

      if (birthDate >= employmentDate) {
        errors.dateOfBirth = 'Birth date must be before employment date';
      } else {
        const ageAtEmployment =
          employmentDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = employmentDate.getMonth() - birthDate.getMonth();
        const actualAgeAtEmployment =
          monthDiff < 0 ||
          (monthDiff === 0 && employmentDate.getDate() < birthDate.getDate())
            ? ageAtEmployment - 1
            : ageAtEmployment;

        if (actualAgeAtEmployment < 15) {
          errors.dateOfEmployment =
            'Employee must be at least 15 years old at employment date';
        }
      }
    }

    if (
      employee.department &&
      !['Analytics', 'Tech'].includes(employee.department)
    ) {
      errors.department = 'Department must be Analytics or Tech';
    }

    if (
      employee.position &&
      !['Junior', 'Medior', 'Senior'].includes(employee.position)
    ) {
      errors.position = 'Position must be Junior, Medior, or Senior';
    }
    if (employee.email) {
      const emailExists = this.employees.some(
        emp =>
          emp.id !== excludeId &&
          emp.email.toLowerCase() === employee.email.toLowerCase(),
      );
      if (emailExists) {
        errors.email = 'Email already exists';
      }
    }

    if (employee.phone) {
      const normalizedPhone = this.normalizePhone(employee.phone);
      const phoneExists = this.employees.some(
        emp =>
          emp.id !== excludeId &&
          this.normalizePhone(emp.phone) === normalizedPhone,
      );
      if (phoneExists) {
        errors.phone = 'Phone number already exists';
      }
    }

    if (employee.firstName && employee.lastName && employee.dateOfBirth) {
      const duplicateExists = this.employees.some(
        emp =>
          emp.id !== excludeId &&
          emp.firstName.toLowerCase() === employee.firstName.toLowerCase() &&
          emp.lastName.toLowerCase() === employee.lastName.toLowerCase() &&
          emp.dateOfBirth === employee.dateOfBirth,
      );
      if (duplicateExists) {
        errors.duplicate =
          'An employee with the same name and birth date already exists';
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // eslint-disable-next-line class-methods-use-this
  normalizePhone(phone) {
    return phone.replace(/[\s\-()]/g, '');
  }

  getAll() {
    return [...this.employees];
  }

  getById(id) {
    return this.employees.find(emp => emp.id === id);
  }

  add(employeeData) {
    const errors = this.validateEmployee(employeeData);
    if (errors) {
      throw new Error(JSON.stringify(errors));
    }

    const employee = {
      id: this.generateId(),
      firstName: employeeData.firstName.trim(),
      lastName: employeeData.lastName.trim(),
      email: employeeData.email.trim(),
      phone: employeeData.phone.trim(),
      dateOfEmployment: employeeData.dateOfEmployment,
      dateOfBirth: employeeData.dateOfBirth,
      department: employeeData.department || '',
      position: employeeData.position || '',
    };

    this.employees.push(employee);
    this.saveToStorage();
    return employee;
  }

  update(id, employeeData) {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      throw new Error('Employee not found');
    }

    const errors = this.validateEmployee(employeeData, id);
    if (errors) {
      throw new Error(JSON.stringify(errors));
    }

    const updatedEmployee = {
      ...this.employees[index],
      firstName: employeeData.firstName.trim(),
      lastName: employeeData.lastName.trim(),
      email: employeeData.email.trim(),
      phone: employeeData.phone.trim(),
      dateOfEmployment: employeeData.dateOfEmployment,
      dateOfBirth: employeeData.dateOfBirth,
      department: employeeData.department || '',
      position: employeeData.position || '',
    };

    this.employees[index] = updatedEmployee;
    this.saveToStorage();
    return updatedEmployee;
  }

  delete(id) {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      throw new Error('Employee not found');
    }

    const deletedEmployee = this.employees[index];
    this.employees.splice(index, 1);
    this.saveToStorage();
    return deletedEmployee;
  }

  search(query) {
    if (!query.trim()) {
      return this.getAll();
    }

    const searchTerm = query.toLowerCase();
    return this.employees.filter(
      emp =>
        emp.firstName.toLowerCase().includes(searchTerm) ||
        emp.lastName.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.phone.includes(searchTerm),
    );
  }

  getPaginated(page = 1, pageSize = 10, searchQuery = '') {
    const filteredEmployees = this.search(searchQuery);
    const totalItems = filteredEmployees.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = filteredEmployees.slice(startIndex, endIndex);

    return {
      items,
      totalItems,
      totalPages,
      currentPage: page,
      pageSize,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  sort(field, direction = 'asc') {
    const sorted = [...this.employees].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (field === 'dateOfEmployment' || field === 'dateOfBirth') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  clear() {
    this.employees = [];
    this.saveToStorage();
  }
}

export const employeeStore = new EmployeeStore();
