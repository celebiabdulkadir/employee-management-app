import { LitElement, html, css } from 'lit';
import '../components/listElements/employee-list.js';
import '../components/buttons/app-button.js';

export class EmployeeListView extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 0;
    }
  `;

  render() {
    return html` <employee-list></employee-list> `;
  }
}

customElements.define('employee-list-view', EmployeeListView);
