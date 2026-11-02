import { LightningElement } from 'lwc';
export default class De_contacts extends LightningElement {
  contacts = [{
    key: 'amit',
    initials: 'AS',
    name: 'Amit Sharma',
    role: 'Logistics Manager',
    phone: '+91-98XXXXXXXX',
    email: 'amit@example.com',
    primary: true
  }, {
    key: 'suresh',
    initials: 'SP',
    name: 'Suresh Patel',
    role: 'Finance Head',
    phone: '+91-97XXXXXXXX',
    email: 'suresh@example.com',
    primary: false
  }, {
    key: 'kavita',
    initials: 'KS',
    name: 'Kavita Shah',
    role: 'Operations Coordinator',
    phone: '+91-96XXXXXXXX',
    email: 'kavita@example.com',
    primary: false
  }];
}