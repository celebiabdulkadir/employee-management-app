import { LitElement, html, css } from 'lit';

export class AppButton extends LitElement {
  static properties = {
    variant: { type: String },
    size: { type: String },
    disabled: { type: Boolean },
    loading: { type: Boolean },
    icon: { type: String },
    iconPosition: { type: String },
    fullWidth: { type: Boolean },
    active: { type: Boolean },
    iconOnly: { type: Boolean },
  };

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'medium';
    this.disabled = false;
    this.loading = false;
    this.icon = '';
    this.iconPosition = 'left';
    this.fullWidth = false;
    this.active = false;
    this.iconOnly = false;
  }

  static styles = css`
    :host {
      display: inline-block;
    }

    :host([full-width]) {
      display: block;
      width: 100%;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      border: none;
      border-radius: 8px;
      font-family: inherit;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      user-select: none;
      outline: none;
      box-sizing: border-box;
    }

    :host([full-width]) .button {
      width: 100%;
    }

    /* Variants */
    .button--primary {
      background: #ff6b35;
      color: white;
      border: 1px solid #ff6b35;
    }

    .button--primary:hover:not(:disabled) {
      background: #e55a2b;
      border-color: #e55a2b;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }

    .button--secondary {
      background: white;
      color: #ff6b35;
      border: 1px solid #ff6b35;
    }

    .button--secondary:hover:not(:disabled) {
      background: #ff6b35;
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
    }

    .button--ghost {
      background: transparent;
      color: #666;
      border: 1px solid #ddd;
    }

    .button--ghost:hover:not(:disabled) {
      background: #f5f5f5;
      border-color: #ff6b35;
      color: #ff6b35;
    }

    .button--ghost.active {
      background: #ff6b35;
      color: white;
      border-color: #ff6b35;
    }

    .button--link {
      background: transparent;
      color: #ff6b35;
      border: none;
      text-decoration: underline;
    }

    .button--link:hover:not(:disabled) {
      color: #e55a2b;
      text-decoration: none;
    }

    .button--danger {
      background: #dc3545;
      color: white;
      border: 1px solid #dc3545;
    }

    .button--danger:hover:not(:disabled) {
      background: #c82333;
      border-color: #c82333;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
    }

    .button--success {
      background: #28a745;
      color: white;
      border: 1px solid #28a745;
    }

    .button--success:hover:not(:disabled) {
      background: #218838;
      border-color: #218838;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
    }

    /* Sizes */
    .button--small {
      padding: 6px 12px;
      font-size: 13px;
      min-height: 32px;
    }

    .button--small.icon-only {
      padding: 4px;
      min-width: 28px;
      min-height: 28px;
    }

    .button--medium {
      padding: 8px 16px;
      font-size: 14px;
      min-height: 40px;
    }

    .button--large {
      padding: 12px 24px;
      font-size: 16px;
      min-height: 48px;
    }

    /* States */
    .button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    .button--loading {
      pointer-events: none;
    }

    .button--loading .button-text {
      opacity: 0.7;
    }

    /* Icon */
    .button-icon {
      display: flex;
      align-items: center;
      font-size: 1.1em;
    }

    .button-icon--right {
      order: 2;
    }

    /* Loading spinner */
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    /* Focus styles */
    .button:focus-visible {
      outline: 2px solid #ff6b35;
      outline-offset: 2px;
    }

    /* Active state */
    .button:active:not(:disabled) {
      transform: translateY(0);
    }

    /* Mobile optimizations */
    @media (max-width: 768px) {
      .button--small {
        padding: 6px 10px;
        font-size: 12px;
        min-height: 36px;
      }

      .button--medium {
        padding: 8px 14px;
        font-size: 13px;
        min-height: 44px;
      }

      .button--large {
        padding: 10px 20px;
        font-size: 15px;
        min-height: 48px;
      }
    }
  `;

  handleClick(e) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent('app-button-click', {
        detail: { originalEvent: e },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    const classes = [
      'button',
      `button--${this.variant}`,
      `button--${this.size}`,
      this.loading && 'button--loading',
      this.active && 'active',
      this.iconOnly && 'icon-only',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <button
        class=${classes}
        ?disabled=${this.disabled || this.loading}
        @click=${this.handleClick}
      >
        ${this.loading ? html` <span class="spinner"></span> ` : ''}
        ${this.icon && this.iconPosition === 'left'
          ? html` <span class="button-icon">${this.icon}</span> `
          : ''}
        ${!this.iconOnly
          ? html`
              <span class="button-text">
                <slot></slot>
              </span>
            `
          : ''}
        ${this.icon && this.iconPosition === 'right'
          ? html`
              <span class="button-icon button-icon--right">${this.icon}</span>
            `
          : ''}
      </button>
    `;
  }
}

customElements.define('app-button', AppButton);
