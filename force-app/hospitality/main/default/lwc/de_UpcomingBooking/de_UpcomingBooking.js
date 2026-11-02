import { LightningElement, api } from 'lwc';

export default class De_UpcomingBooking extends LightningElement {
    @api recordId;

    get booking() {
        return {
            pax: '2',
            duration: '5 Jul - 8 Jul',
            paymentStatus: 'Fully Paid',
            property: 'Lumen The Fresco Lake Pichola',
            occasion: 'Wedding Anniversary',
            taskLabel: 'Task - Room Decoration, Cake',
            notes: 'Early Check-in, King Size Bed, Non-Smoking Room, Anniversary Celebration'
        };
    }

    get hasUpcomingBooking() {
        return true;
    }
}