import { LightningElement, api, wire } from 'lwc';
import getCustomer from '@salesforce/apex/de_CustomerController.getCustomer';

export default class De_customerHeader extends LightningElement {
    @api recordId;
    customer;
    error;

    @wire(getCustomer, { recordId: '$recordId' })
    wiredCustomer({ data, error }) {
        if (data) {
            this.customer = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.customer = undefined;
        }
    }

    get metaLine() {
        if (!this.customer) {
            return '';
        }
        const bits = [];
        if (this.customer.customerId) {
            bits.push('Customer ID: ' + this.customer.customerId);
        }
        bits.push('Urbanweave Premium');
        if (this.customer.age) {
            bits.push('Age: ' + this.customer.age);
        }
        if (this.customer.gender) {
            bits.push(this.customer.gender);
        }
        return bits.join('  |  ');
    }
}
