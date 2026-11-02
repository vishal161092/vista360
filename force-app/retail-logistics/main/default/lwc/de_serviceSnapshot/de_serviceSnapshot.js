import { LightningElement } from 'lwc';
export default class De_serviceSnapshot extends LightningElement {
  tiles = [{
    key: 'open',
    label: 'Open Cases',
    value: '1',
    sub: 'High Priority',
    icon: 'utility:case',
    tileClass: 'de-tile de-tile-danger'
  }, {
    key: 'csat',
    label: 'CSAT Score',
    value: '4.2 / 5.0',
    sub: 'Customer Satisfaction',
    icon: 'utility:favorite',
    tileClass: 'de-tile de-tile-success'
  }];
  rows = [{
    key: 'resolved',
    icon: 'utility:check',
    label: 'Resolved Cases (YTD)',
    value: '14'
  }, {
    key: 'avg',
    icon: 'utility:clock',
    label: 'Avg Resolution Time',
    value: '2.4 days'
  }, {
    key: 'escalation',
    icon: 'utility:priority',
    label: 'Last Escalation',
    value: '07 Jun 2026 — Kolkata delivery delay'
  }];
}