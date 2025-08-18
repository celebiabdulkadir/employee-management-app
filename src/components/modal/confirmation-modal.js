import { LitElement, html, css } from 'lit';
import { msg } from '../../localization/index.js';
import '../buttons/app-button.js';

export class ConfirmationModal extends LitElement {
  static properties = {
    open: { type: Boolean },
    modalTitle: { type: String },
    message: { type: String },
    confirmText: { type: String },
    cancelText: { type: String },
    variant: { type: String },
    loading: { type: Boolean },
  };

  constructor() {
    super();
    this.open = false;
    this.modalTitle = '';
    this.message = '';
    this.confirmText = '';
    this.cancelText = '';
    this.variant = 'danger'; // danger, primary, warning
    this.loading = false;
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

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .modal-overlay.open {
      opacity: 1;
      visibility: visible;
    }

    .modal {
      background: white;
      border-radius: 12px;
      padding: 0;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      transform: scale(0.9) translateY(-20px);
      transition: transform 0.3s ease;
    }

    .modal-overlay.open .modal {
      transform: scale(1) translateY(0);
    }

    .modal-header {
      padding: 24px 24px 0 24px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .modal-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0;
      flex: 1;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 24px;
      color: #999;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
      margin-left: 16px;
    }

    .close-button:hover {
      background: #f5f5f5;
      color: #666;
    }

    .modal-body {
      padding: 20px 24px;
    }

    .modal-message {
      color: #666;
      font-size: 16px;
      line-height: 1.5;
      margin: 0;
    }

    .modal-footer {
      padding: 0 24px 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .modal {
        width: 95%;
        margin: 20px;
      }

      .modal-header {
        padding: 20px 20px 0 20px;
      }

      .modal-body {
        padding: 16px 20px;
      }

      .modal-footer {
        padding: 0 20px 20px 20px;
      }
    }
  `;

  handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      this.handleCancel();
    }
  }

  handleCancel() {
    if (this.loading) return;

    this.dispatchEvent(
      new CustomEvent('cancel', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  handleConfirm() {
    if (this.loading) return;

    this.dispatchEvent(
      new CustomEvent('confirm', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  handleKeyDown(e) {
    if (e.key === 'Escape') {
      this.handleCancel();
    }
  }

  render() {
    return html`
      <div
        class="modal-overlay ${this.open ? 'open' : ''}"
        @click=${this.handleOverlayClick}
        @keydown=${this.handleKeyDown}
      >
        <div
          class="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div class="modal-header">
            <h2 class="modal-title" id="modal-title">
              ${this.modalTitle || msg('Are you sure?')}
            </h2>
            <button
              class="close-button"
              @click=${this.handleCancel}
              aria-label=${msg('Close')}
              ?disabled=${this.loading}
            >
              ✕
            </button>
          </div>

          <div class="modal-body">
            <p class="modal-message">${this.message}</p>
          </div>

          <div class="modal-footer">
            <app-button
              variant="ghost"
              @app-button-click=${this.handleCancel}
              ?disabled=${this.loading}
            >
              ${this.cancelText || msg('Cancel')}
            </app-button>
            <app-button
              variant=${this.variant}
              @app-button-click=${this.handleConfirm}
              ?loading=${this.loading}
              ?disabled=${this.loading}
            >
              ${this.confirmText || msg('Confirm')}
            </app-button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirmation-modal', ConfirmationModal);
