import { LightningElement, api } from 'lwc';

export default class De_Recommendations extends LightningElement {
    @api recordId;

    get recommendations() {
        return [
            {
                id: '1',
                title: 'Book a Couple Spa',
                description: 'Based on anniversary celebration pattern',
                icon: 'utility:heart',
                type: 'experience'
            },
            {
                id: '2',
                title: 'Dinner Reservation - Chandni',
                description: 'Top-rated restaurant near Lumen Aria Boutique',
                icon: 'utility:food_and_drink',
                type: 'dining'
            },
            {
                id: '3',
                title: 'Upgrade to Lumen Select Premium',
                description: 'Exclusive vacation long weekend offer',
                icon: 'utility:trending',
                type: 'upgrade'
            }
        ];
    }
}