import { LitElement, html, css } from 'lit';
import { msg } from '../../localization/index.js';

export class EmployeeSearch extends LitElement {
  static properties = {
    value: { type: String },
    placeholder: { type: String },
    disabled: { type: Boolean },
  };

  constructor() {
    super();
    this.value = '';
    this.placeholder = '';
    this.disabled = false;
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
      border-color: #ff6b35;
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

    @media (max-width: 768px) {
      .search-input {
        width: 100%;
        max-width: 300px;
      }
    }
  `;

  handleInput(e) {
    this.dispatchEvent(
      new CustomEvent('search-input', {
        detail: { value: e.target.value },
        bubbles: true,
        composed: true,
      }),
    );
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
      </div>
    `;
  }
}

customElements.define('employee-search', EmployeeSearch);
