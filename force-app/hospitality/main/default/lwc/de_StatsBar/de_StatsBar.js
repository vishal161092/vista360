import { LightningElement, api } from 'lwc';

export default class De_StatsBar extends LightningElement {
    @api recordId;

    get guestName() {
        return 'Mr. Aman Gupta';
    }

    get stats() {
        return [
            { id: '1', label: 'VIP Score', value: '92', icon: 'utility:favorite' },
            { id: '2', label: 'Total Revenue', value: '₹1,85,000', icon: 'utility:moneybag' },
            { id: '3', label: 'Stays', value: '13', icon: 'utility:bed' },
            { id: '4', label: 'Avg Stay', value: '2.4 Nights', icon: 'utility:clock' }
        ];
    }

    get tabs() {
        return [
            { id: '1', label: 'Marketing', active: false },
            { id: '2', label: 'Notification', active: false },
            { id: '3', label: 'SMS', active: false },
            { id: '4', label: 'Email', active: false },
            { id: '5', label: 'WhatsApp', active: false }
        ];
    }
}