import { LightningElement } from 'lwc';
export default class De_logisticsSnapshot extends LightningElement {
  accountName = 'Weavewell Textiles Pvt. Ltd.';
  segmentLabel = 'Mid-Market · Textiles';
  initials = 'ST';
  stats = [{
    key: 'revenue',
    label: 'Revenue',
    value: '₹ 4.2 Cr'
  }, {
    key: 'shipments',
    label: 'Shipments',
    value: '1,200+'
  }, {
    key: 'segment',
    label: 'Segment',
    value: 'Mid-Market'
  }];
  description = 'Weavewell Textiles is a mid-size saree and dress material manufacturer based in Surat, shipping finished fabric and garments to wholesale retailers and boutiques across Delhi, Mumbai, Kolkata, and Bangalore. High shipment frequency with strong festival-season spikes.';
  details = [{
    key: 'id',
    icon: 'utility:identity',
    label: 'Account Number',
    value: 'ST-2026-00142'
  }, {
    key: 'web',
    icon: 'utility:world',
    label: 'Website',
    value: 'www.weavewell.com'
  }, {
    key: 'phone',
    icon: 'utility:call',
    label: 'Phone',
    value: '+91-98XXXXXXXX'
  }, {
    key: 'addr',
    icon: 'utility:location',
    label: 'Address',
    value: 'Ring Road, Sachin GIDC, Surat, Gujarat — 394230'
  }];
  signals = [{
    key: 'priorities',
    label: 'Shipping Priorities',
    value: 'Ensure on-time festival season delivery, reduce transit damage on silk & embroidery, and expand retailer coverage in South India.'
  }, {
    key: 'supply',
    label: 'Supply Chain Focus',
    value: 'Improve PTL reliability on Surat–Bangalore corridor and reduce claim frequency through better packaging compliance.'
  }, {
    key: 'account',
    label: 'Account Signals',
    value: 'High repeat booking frequency in Oct–Nov (Diwali) and Feb–Mar (wedding season). Sensitive to delivery delays — escalates quickly.'
  }];
}