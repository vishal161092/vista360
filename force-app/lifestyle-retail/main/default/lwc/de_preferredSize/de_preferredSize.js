import { LightningElement } from 'lwc';

export default class De_preferredSize extends LightningElement {
    apparel = {
        label: 'Apparel Size',
        value: 'Medium (M)',
        note: 'Based on 80% of your purchases'
    };
    footwear = {
        label: 'Footwear Size',
        value: 'UK 6',
        note: 'Based on 70% of your purchases'
    };

    handleViewGuide() {
        // eslint-disable-next-line no-console
        console.log('View size guide');
    }
}
