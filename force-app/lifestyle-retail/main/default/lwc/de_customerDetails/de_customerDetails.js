import { LightningElement, api, wire } from 'lwc';
import getCustomer from '@salesforce/apex/de_CustomerController.getCustomer';
import FEMALE_PERSONA from '@salesforce/resourceUrl/de_femalePersona';

export default class De_customerDetails extends LightningElement {
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

    get photoUrl() {
        return FEMALE_PERSONA;
    }

    get stateCountry() {
        if (!this.customer) {
            return '';
        }
        return [this.customer.state, this.customer.country]
            .filter(Boolean)
            .join(', ');
    }

    get rows() {
        if (!this.customer) {
            return [];
        }
        const c = this.customer;
        return [
            { key: 'name', icon: 'utility:user', label: 'Name', value: c.name },
            { key: 'age', icon: 'utility:knowledge_base', label: 'Age', value: c.age },
            { key: 'gender', icon: 'utility:socialshare', label: 'Gender', value: c.gender },
            { key: 'location', icon: 'utility:location', label: 'Location', value: c.location },
            {
                key: 'language',
                icon: 'utility:world',
                label: 'Preferred Language',
                value: 'English, Hindi'
            },
            {
                key: 'contact',
                icon: 'utility:chat',
                label: 'Preferred Contact',
                value: c.preferredContact || 'WhatsApp, Email'
            },
            {
                key: 'member',
                icon: 'utility:date_input',
                label: 'Member Since',
                value: c.memberSince
            }
        ];
    }

    handleEdit() {
        // eslint-disable-next-line no-console
        console.log('Edit customer details');
    }
}
