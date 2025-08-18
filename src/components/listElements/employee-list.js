import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { msg } from '../../localization/index.js';
import { employeeStore } from '../../employee-store.js';
import '../buttons/app-button.js';
import './employee-search.js';
import './view-toggle.js';
import './pagination.js';
import './employee-table.js';
import './employee-card.js';
import '../modal/confirmation-modal.js';

const VIEW_STORAGE_KEY = 'preferred-view';

export class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    searchQuery: { type: String },
    currentPage: { type: Number },
    pageSize: { type: Number },
    totalPages: { type: Number },
    totalItems: { type: Number },
    viewMode: { type: String },
    sortField: { type: String },
    sortDirection: { type: String },
    selectedEmployees: { type: Array },
    confirmationModal: { type: Object },
  };

  constructor() {
    super();
    this.employees = [];
    this.searchQuery = '';
    this.currentPage = 1;
    this.pageSize = 10;
    this.totalPages = 0;
    this.totalItems = 0;
    this.viewMode = this.getStoredView() || 'table';
    this.sortField = 'firstName';
    this.sortDirection = 'asc';
    this.selectedEmployees = [];
    this.confirmationModal = {
      open: false,
      title: '',
      message: '',
      confirmText: '',
      onConfirm: null,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getStoredView() {
    try {
      return localStorage.getItem(VIEW_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
      color: #c63f19;
    }

    .list-title {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
      color: #c63f19;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .bulk-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #fff3e0;
      border-radius: 8px;
      margin-bottom: 16px;
      border: 1px solid #c63f19;
    }

    .bulk-actions-text {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }

    .selected-count {
      color: #c63f19;
      font-weight: 600;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    @media (max-width: 768px) {
      .cards-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }

    .add-button {
      background: #c63f19;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background-color 0.2s;
    }

    .add-button:hover {
      background: #a53516;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-state-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .list-header {
        flex-direction: column;
        align-items: stretch;
      }

      .header-controls {
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
      }

      .search-input {
        width: 100%;
        max-width: 300px;
      }

      .table-container {
        border-radius: 8px 8px 0 0;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.addSampleDataIfEmpty();
    this.loadEmployees();
    this.unsubscribe = employeeStore.subscribe(() => {
      this.loadEmployees();
    });

    this.localeChangeHandler = () => {
      this.requestUpdate();
    };
    window.addEventListener('locale-changed', this.localeChangeHandler);
  }

  // eslint-disable-next-line class-methods-use-this
  addSampleDataIfEmpty() {
    if (employeeStore.getAll().length === 0) {
      try {
        const firstNames = [
          'Jane',
          'Bob',
          'Alice',
          'Charlie',
          'Diana',
          'Eva',
          'Frank',
          'Grace',
          'Henry',
          'Ivy',
          'Jack',
          'Kate',
        ];
        const lastNames = [
          'Smith',
          'Johnson',
          'Brown',
          'Wilson',
          'Davis',
          'Miller',
          'Garcia',
          'Martinez',
          'Anderson',
          'Taylor',
          'White',
          'Lee',
        ];
        const departments = ['Analytics', 'Tech'];
        const positions = ['Junior', 'Medior', 'Senior'];

        const employees = [];
        for (let i = 0; i < 12; i += 1) {
          const firstName = firstNames[i];
          const lastName = lastNames[i];
          const employmentDate = new Date(2023, 2 + i, 10 + i * 5);
          const birthDate = new Date(1984 + i, (i * 3) % 12, 15 + i * 2);

          employees.push({
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
            phone: `+1555${(1234567 + i * 111111).toString().slice(-7)}`,
            dateOfEmployment: employmentDate.toISOString().split('T')[0],
            dateOfBirth: birthDate.toISOString().split('T')[0],
            department: departments[i % 2],
            position: positions[i % 3],
          });
        }

        employees.forEach(emp => employeeStore.add(emp));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error adding sample data:', error);
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    window.removeEventListener('locale-changed', this.localeChangeHandler);
  }

  loadEmployees() {
    const result = employeeStore.getPaginated(
      this.currentPage,
      this.pageSize,
      this.searchQuery,
    );

    if (
      result.items.length === 0 &&
      result.totalPages > 0 &&
      this.currentPage > result.totalPages
    ) {
      this.currentPage = Math.max(1, result.totalPages);
      this.loadEmployees();
      return;
    }

    this.employees = result.items;
    this.totalPages = result.totalPages;
    this.totalItems = result.totalItems;
    this.requestUpdate();
  }

  handleSearch(e) {
    this.searchQuery = e.detail.value;
    this.currentPage = 1;
    this.loadEmployees();
  }

  handleSort(e) {
    const { field } = e.detail;
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.employees = employeeStore.sort(field, this.sortDirection);
    this.requestUpdate();
  }

  handlePageChange(e) {
    this.currentPage = e.detail.page;
    this.loadEmployees();
  }

  handleViewToggle(e) {
    this.viewMode = e.detail.view;
  }

  // eslint-disable-next-line class-methods-use-this
  handleEdit(e) {
    Router.go(`/edit/${e.detail.employeeId}`);
  }

  handleDelete(e) {
    const { employeeId } = e.detail;
    this.confirmationModal = {
      open: true,
      title: msg('Delete Employee'),
      message: msg(
        'Are you sure you want to delete this employee? This action cannot be undone.',
      ),
      confirmText: msg('Delete'),
      onConfirm: () => {
        try {
          employeeStore.delete(employeeId);
          this.selectedEmployees = this.selectedEmployees.filter(
            id => id !== employeeId,
          );
          this.loadEmployees();
          this.closeConfirmationModal();
        } catch (error) {
          // eslint-disable-next-line no-alert
          alert(msg('Error deleting employee'));
        }
      },
    };
    this.requestUpdate();
  }

  handleSelectEmployee(e) {
    const { employeeId, checked } = e.detail;
    if (checked) {
      this.selectedEmployees = [...this.selectedEmployees, employeeId];
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(
        id => id !== employeeId,
      );
    }
  }

  handleSelectAll(e) {
    const { checked } = e.detail;
    if (checked) {
      this.selectedEmployees = this.employees.map(emp => emp.id);
    } else {
      this.selectedEmployees = [];
    }
  }

  // eslint-disable-next-line class-methods-use-this
  handleBulkDelete() {
    const count = this.selectedEmployees.length;
    if (count === 0) return;

    this.confirmationModal = {
      open: true,
      title: msg('Delete Employees'),
      message: msg(
        'Are you sure you want to delete %s employee(s)? This action cannot be undone.',
      ).replace('%s', count),
      confirmText: msg('Delete All'),
      onConfirm: () => {
        try {
          this.selectedEmployees.forEach(employeeId => {
            employeeStore.delete(employeeId);
          });
          this.selectedEmployees = [];
          this.loadEmployees();
          this.closeConfirmationModal();
        } catch (error) {
          // eslint-disable-next-line no-alert
          alert(msg('Error deleting employees'));
        }
      },
    };
    this.requestUpdate();
  }

  handleClearSelection() {
    this.selectedEmployees = [];
  }

  closeConfirmationModal() {
    this.confirmationModal = {
      ...this.confirmationModal,
      open: false,
    };
    this.requestUpdate();
  }

  handleConfirmationCancel() {
    this.closeConfirmationModal();
  }

  handleConfirmationConfirm() {
    if (this.confirmationModal.onConfirm) {
      this.confirmationModal.onConfirm();
    }
  }

  render() {
    return html`
      <div class="list-header">
        <h1 class="list-title">${msg('Employee List')}</h1>
        <div class="header-controls">
          <employee-search
            .value=${this.searchQuery}
            @search-input=${this.handleSearch}
          ></employee-search>

          <view-toggle
            .currentView=${this.viewMode}
            @view-change=${this.handleViewToggle}
          ></view-toggle>
        </div>
      </div>

      ${this.selectedEmployees.length > 0
        ? html`
            <div class="bulk-actions">
              <span class="bulk-actions-text">
                <span class="selected-count"
                  >${this.selectedEmployees.length}</span
                >
                ${this.selectedEmployees.length === 1
                  ? msg('employee selected')
                  : msg('employees selected')}
              </span>
              <app-button
                variant="primary"
                size="small"
                icon="🗑️"
                @app-button-click=${this.handleBulkDelete}
              >
                ${msg('Delete Selected')}
              </app-button>
              <app-button
                variant="ghost"
                size="small"
                @app-button-click=${this.handleClearSelection}
              >
                ${msg('Clear Selection')}
              </app-button>
            </div>
          `
        : ''}
      ${this.employees.length === 0 && !this.searchQuery
        ? html`
            <div class="empty-state">
              <div class="empty-state-icon">👥</div>
              <h3>${msg('No employees yet')}</h3>
              <p>${msg('Add your first employee to get started')}</p>
            </div>
          `
        : html`
            ${this.viewMode === 'table'
              ? html`
                  <employee-table
                    .employees=${this.employees}
                    .selectedEmployees=${this.selectedEmployees}
                    .sortField=${this.sortField}
                    .sortDirection=${this.sortDirection}
                    @sort-change=${this.handleSort}
                    @employee-select=${this.handleSelectEmployee}
                    @select-all=${this.handleSelectAll}
                    @employee-edit=${this.handleEdit}
                    @employee-delete=${this.handleDelete}
                  ></employee-table>
                `
              : html`
                  <div class="cards-grid">
                    ${this.employees.map(
                      employee => html`
                        <employee-card
                          .employee=${employee}
                          .selected=${this.selectedEmployees.includes(
                            employee.id,
                          )}
                          @employee-select=${this.handleSelectEmployee}
                          @employee-edit=${this.handleEdit}
                          @employee-delete=${this.handleDelete}
                        ></employee-card>
                      `,
                    )}
                  </div>
                `}

            <pagination-component
              .currentPage=${this.currentPage}
              .totalPages=${this.totalPages}
              @page-change=${this.handlePageChange}
            ></pagination-component>
          `}

      <confirmation-modal
        .open=${this.confirmationModal.open}
        .modalTitle=${this.confirmationModal.title}
        .message=${this.confirmationModal.message}
        .confirmText=${this.confirmationModal.confirmText}
        @cancel=${this.handleConfirmationCancel}
        @confirm=${this.handleConfirmationConfirm}
      ></confirmation-modal>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
