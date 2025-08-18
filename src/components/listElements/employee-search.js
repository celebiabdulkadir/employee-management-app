import { LitElement, html, css } from 'lit';
import { msg } from '../../localization/index.js';

export class EmployeeSearch extends LitElement {
  static properties = {
    value: { type: String },
    placeholder: { type: String },
    disabled: { type: Boolean },
    debounceDelay: { type: Number },
  };

  constructor() {
    super();
    this.value = '';
    this.placeholder = '';
    this.disabled = false;
    this.debounceDelay = 300;
    this.debounceTimer = null;
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
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  static styles = css`
    :host {
      display: block;
    }

    .search-container {
      position: relative;
    }

    .search-input {
      padding: 8px 12px 8px 36px;
      border: 1px solid #ddd;
      border-radius: 6px;
      width: 300px;
      font-size: 14px;
      box-sizing: border-box;
    }

    .search-input:focus {
      outline: none;
      border-color: #c63f19;
      box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
    }

    .search-input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
      width: 16px;
      height: 16px;
      pointer-events: none;
    }

    .clear-button {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      transition: all 0.2s ease;
    }

    .clear-button:hover {
      background: #f0f0f0;
      color: #666;
    }

    .clear-button:active {
      background: #e0e0e0;
    }

    .clear-button.hidden {
      display: none;
    }

    @media (max-width: 768px) {
      .search-input {
        width: 100%;
        max-width: 300px;
      }
    }
  `;

  handleInput(e) {
    const inputValue = e.target.value;

    const trimmedValue = inputValue ? inputValue.trim() : '';

    this.value = trimmedValue;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.dispatchEvent(
        new CustomEvent('search-input', {
          detail: { value: trimmedValue },
          bubbles: true,
          composed: true,
        }),
      );
      this.debounceTimer = null;
    }, this.debounceDelay);
  }

  handleClear() {
    this.value = '';

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    this.dispatchEvent(
      new CustomEvent('search-input', {
        detail: { value: '' },
        bubbles: true,
        composed: true,
      }),
    );

    const input = this.shadowRoot.querySelector('.search-input');
    if (input) {
      input.focus();
    }
  }

  render() {
    return html`
      <div class="search-container">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          class="search-input"
          placeholder=${this.placeholder ||
          msg('Search by name, email or phone...')}
          .value=${this.value}
          ?disabled=${this.disabled}
          @input=${this.handleInput}
        />
        <button
          class="clear-button ${this.value ? '' : 'hidden'}"
          @click=${this.handleClear}
          ?disabled=${this.disabled}
          title=${msg('Clear search')}
          type="button"
        >
          ✕
        </button>
      </div>
    `;
  }
}

customElements.define('employee-search', EmployeeSearch);
