import { LightningElement, api, wire } from 'lwc';
import getContact from '@salesforce/apex/de_GuestProfile_Controller.getContact';

export default class De_GuestProfileCard extends LightningElement {
    @api recordId;
    contact = {};
    error;

    @wire(getContact, { currentRecord: '$recordId' })
    wiredContact({ error, data }) {
        if (data) {
            this.contact = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contact = {};
        }
    }

    get hasContact() {
        return this.contact && this.contact.Id;
    }

    get contactName() {
        return this.contact.Name || 'Aman Gupta';
    }

    get contactCity() {
        return this.contact.MailingCity || 'Delhi';
    }

    get contactState() {
        return this.contact.MailingState || 'India';
    }

    get contactLocation() {
        return `${this.contactCity}, ${this.contactState}`;
    }

    get contactEmail() {
        return this.contact.Email || 'a.gupta@example.com';
    }

    get contactPhone() {
        return this.contact.Phone || '+91 90000 00000';
    }

    get customerId() {
        return '02567418';
    }

    get loyaltyTier() {
        return 'Lumen Platinum';
    }

    get supportLevel() {
        return 'Priority Support';
    }

    get preferredChannel() {
        return 'Direct';
    }

    get existingProduct() {
        return 'Lumen Select Premium';
    }

    get propensityToBuy() {
        return '70%';
    }

    get churnRisk() {
        return 'Low';
    }

    get npsScore() {
        return 'High';
    }

    get tags() {
        return [
            { id: '1', label: 'Loyalty Member', class: 'tag tag-loyalty' },
            { id: '2', label: 'High Value', class: 'tag tag-high-value' },
            { id: '3', label: 'Fitness Enthusiast', class: 'tag tag-interest' }
        ];
    }

    get affinities() {
        return [
            { id: '1', label: 'Early Check-in' },
            { id: '2', label: 'Garden Facing Room' },
            { id: '3', label: 'Smoking Room' },
            { id: '4', label: 'Gym' },
            { id: '5', label: 'Vegetarian' },
            { id: '6', label: 'Restaurant Dining' }
        ];
    }
}