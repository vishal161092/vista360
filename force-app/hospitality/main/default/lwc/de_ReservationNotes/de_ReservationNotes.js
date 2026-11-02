import { LightningElement, api } from 'lwc';
import LUMEN_RECS from '@salesforce/resourceUrl/lumenRecommendations';

export default class De_ReservationNotes extends LightningElement {
    @api recordId;

    get recommendations() {
        return [
            {
                id: '1',
                title: 'Upgrade to Suite',
                description: 'Enjoy a spacious suite with premium amenities and lake-facing views',
                imageUrl: LUMEN_RECS + '/suite.jpg'
            },
            {
                id: '2',
                title: 'Long Weekend Offer',
                description: 'Special rates for the upcoming long weekend getaway — book now',
                imageUrl: LUMEN_RECS + '/weekend.png'
            }
        ];
    }
}