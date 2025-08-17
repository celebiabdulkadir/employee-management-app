import { LitElement, html, css } from 'lit';
import { msg } from '../../localization/index.js';
import '../buttons/app-button.js';

export class Pagination extends LitElement {
  static properties = {
    currentPage: { type: Number },
    totalPages: { type: Number },
    disabled: { type: Boolean },
    visiblePages: { type: Number },
  };

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
    this.disabled = false;
    this.visiblePages = 5;
  }

  connectedCallback() {
    super.connectedCallback();
    this.localeChangeHandler = () => {
      this.requestUpdate();
    };
    window.addEventListener('locale-changed', this.localeChangeHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('locale-changed', this.localeChangeHandler);
  }

  static styles = css`
    :host {
      display: block;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 24px;
      padding: 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .pagination app-button {
      margin: 0;
    }

    .pagination app-button .button {
      padding: 8px 12px !important;
      border: 1px solid #ddd !important;
      background: white !important;
      color: #333 !important;
      border-radius: 4px !important;
      font-size: 14px !important;
      min-height: auto !important;
      box-shadow: none !important;
      transform: none !important;
    }

    .pagination app-button[active] .button {
      background: #ff6b35 !important;
      color: white !important;
      border-color: #ff6b35 !important;
    }

    .pagination app-button .button:disabled {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
    }

    @media (max-width: 768px) {
      .pagination {
        flex-wrap: wrap;
        gap: 4px;
        padding: 12px;
      }
    }
  `;

  handlePageChange(page) {
    if (
      this.disabled ||
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage
    ) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('page-change', {
        detail: { page },
        bubbles: true,
        composed: true,
      }),
    );
  }

  getVisiblePages() {
    const pages = [];
    const halfVisible = Math.floor(this.visiblePages / 2);
    let startPage = Math.max(1, this.currentPage - halfVisible);
    const endPage = Math.min(
      this.totalPages,
      startPage + this.visiblePages - 1,
    );

    if (endPage - startPage + 1 < this.visiblePages) {
      startPage = Math.max(1, endPage - this.visiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i += 1) {
      pages.push(i);
    }

    return pages;
  }

  render() {
    if (this.totalPages < 1) {
      return html``;
    }

    const visiblePages = this.getVisiblePages();

    return html`
      <div class="pagination">
        <app-button
          variant="ghost"
          size="small"
          ?disabled=${this.disabled || this.currentPage === 1}
          @app-button-click=${() => this.handlePageChange(this.currentPage - 1)}
        >
          ${msg('Previous')}
        </app-button>

        ${visiblePages.map(
          page => html`
            <app-button
              variant="ghost"
              size="small"
              ?active=${page === this.currentPage}
              ?disabled=${this.disabled}
              @app-button-click=${() => this.handlePageChange(page)}
            >
              ${page}
            </app-button>
          `,
        )}

        <app-button
          variant="ghost"
          size="small"
          ?disabled=${this.disabled || this.currentPage === this.totalPages}
          @app-button-click=${() => this.handlePageChange(this.currentPage + 1)}
        >
          ${msg('Next')}
        </app-button>
      </div>
    `;
  }
}

customElements.define('pagination-component', Pagination);
