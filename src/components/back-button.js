import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { msg } from '../localization/index.js';
import './app-button.js';

export class BackButton extends LitElement {
  static properties = {
    text: { type: String },
    path: { type: String },
  };

  constructor() {
    super();
    this.text = '';
    this.path = '/';
  }

  static styles = css`
    :host {
      display: inline-block;
    }
  `;

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

  handleClick(e) {
    e.preventDefault();
    if (this.path === 'back') {
      window.history.back();
    } else {
      Router.go(this.path);
    }
  }

  render() {
    const buttonText = this.text || msg('Back');

    return html`
      <app-button
        variant="ghost"
        size="medium"
        icon="←"
        @app-button-click=${this.handleClick}
      >
        ${buttonText}
      </app-button>
    `;
  }
}

customElements.define('back-button', BackButton);
