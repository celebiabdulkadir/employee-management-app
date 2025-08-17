import { LitElement, html, css } from 'lit';
import { msg } from '../../localization/index.js';
import '../buttons/app-button.js';

export class ViewToggle extends LitElement {
  static properties = {
    currentView: { type: String },
    views: { type: Array },
    disabled: { type: Boolean },
  };

  constructor() {
    super();
    this.currentView = 'table';
    this.views = [
      { id: 'table', label: 'Table View', icon: '📋' },
      { id: 'card', label: 'Card View', icon: '🎯' },
    ];
    this.disabled = false;
  }

  static styles = css`
    :host {
      display: block;
    }

    .view-toggle {
      display: flex;
      gap: 4px;
    }

    @media (max-width: 768px) {
      .view-toggle {
        flex-wrap: wrap;
      }
    }
  `;

  handleViewChange(viewId) {
    if (this.disabled || viewId === this.currentView) return;

    this.dispatchEvent(
      new CustomEvent('view-change', {
        detail: { view: viewId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <div class="view-toggle">
        ${this.views.map(
          view => html`
            <app-button
              variant="ghost"
              size="small"
              icon=${view.icon}
              ?active=${view.id === this.currentView}
              ?disabled=${this.disabled}
              @app-button-click=${() => this.handleViewChange(view.id)}
            >
              ${msg(view.label)}
            </app-button>
          `,
        )}
      </div>
    `;
  }
}

customElements.define('view-toggle', ViewToggle);
