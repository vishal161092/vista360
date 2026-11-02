import { LightningElement } from 'lwc';
export default class De_accountDetails extends LightningElement {
  rows = [{
    key: 'num',
    label: 'Account Number',
    value: 'ST-2026-00142'
  }, {
    key: 'industry',
    label: 'Industry',
    value: 'Textiles & Garments'
  }, {
    key: 'type',
    label: 'Type',
    value: 'Mid-Market'
  }, {
    key: 'employees',
    label: 'Employees',
    value: '120'
  }, {
    key: 'phone',
    label: 'Phone',
    value: '+91-98XXXXXXXX'
  }, {
    key: 'revenue',
    label: 'Annual Revenue',
    value: '₹ 4.2 Cr (FY 2026)'
  }, {
    key: 'tier',
    label: 'Account Tier',
    value: 'Gold'
  }, {
    key: 'contact',
    label: 'Primary Contact',
    value: 'Amit Sharma — Logistics Manager'
  }, {
    key: 'since',
    label: 'Relationship Since',
    value: 'March 2019'
  }];
}