import { LightningElement } from 'lwc';
import GOODWILL from '@salesforce/resourceUrl/de_nbaGoodwill';
import RECOMMENDATION from '@salesforce/resourceUrl/de_nbaRecommendation';
import PLATINUM from '@salesforce/resourceUrl/de_nbaPlatinum';
import FASHION from '@salesforce/resourceUrl/de_nbaFashion';

export default class De_nextBestActions extends LightningElement {
    actions = [
        {
            key: 'a1',
            image: GOODWILL,
            title: 'Offer ₹500 goodwill voucher',
            subtitle: 'if delivery is delayed beyond SLA',
            cta: 'Apply',
            highlight: true
        },
        {
            key: 'a2',
            image: RECOMMENDATION,
            title: 'Recommend matching accessories',
            subtitle: 'based on recent purchases',
            cta: 'View Suggestions',
            highlight: false
        },
        {
            key: 'a3',
            image: PLATINUM,
            title: 'Invite Neha to Platinum Tier',
            subtitle: '(2,150 points away)',
            cta: 'Send Invite',
            highlight: false
        },
        {
            key: 'a4',
            image: FASHION,
            title: 'Enrol in upcoming Premium Fashion Campaign',
            subtitle: '',
            cta: 'Add to Journey',
            highlight: false
        }
    ];

    handleAction(event) {
        const key = event.currentTarget.dataset.key;
        // eslint-disable-next-line no-console
        console.log('Next best action clicked: ' + key);
    }
}
