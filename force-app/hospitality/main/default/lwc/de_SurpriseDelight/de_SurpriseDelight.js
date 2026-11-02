import { LightningElement, api } from 'lwc';

export default class De_SurpriseDelight extends LightningElement {
    @api recordId;

    get offers() {
        return [
            {
                id: '1',
                title: 'Complimentary Room Upgrade',
                description: 'Rosewood Suite available for your next stay',
                icon: 'utility:promotions',
                badge: 'Platinum Perk'
            },
            {
                id: '2',
                title: 'Late Checkout - 2PM',
                description: 'Enjoy extended stay on your upcoming visit',
                icon: 'utility:clock',
                badge: 'Loyalty Reward'
            },
            {
                id: '3',
                title: '20% Off Weekend Getaway',
                description: 'Valid for Lumen Select Premium properties',
                icon: 'utility:discount',
                badge: 'Exclusive'
            }
        ];
    }
}