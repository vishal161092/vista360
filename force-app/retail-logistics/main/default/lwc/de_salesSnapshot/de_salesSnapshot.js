import { LightningElement } from 'lwc';
export default class De_salesSnapshot extends LightningElement {
  tiles = [{
    key: 'ytd',
    label: 'YTD Revenue',
    value: '₹ 4.2 Cr',
    icon: 'utility:moneybag',
    tileClass: 'de-tile de-tile-primary'
  }, {
    key: 'lastq',
    label: 'Last Quarter',
    value: '₹ 1.12 Cr',
    icon: 'utility:trending',
    tileClass: 'de-tile de-tile-accent'
  }];
  rows = [{
    key: 'booking',
    icon: 'utility:event',
    label: 'Last Booking',
    value: '09 Jun 2026 — ₹ 31,200'
  }, {
    key: 'opp',
    icon: 'utility:opportunity',
    label: 'Open Opportunity',
    value: 'SFX Surat–Bangalore Expansion — ₹ 18L'
  }, {
    key: 'renewal',
    icon: 'utility:contract',
    label: 'Contract Renewal',
    value: '31 Aug 2026'
  }];
}