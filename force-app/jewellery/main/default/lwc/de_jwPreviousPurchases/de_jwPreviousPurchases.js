import { LightningElement } from 'lwc';
import JEWELRY_IMAGES from '@salesforce/resourceUrl/de_JewelryImages';

export default class JwPreviousPurchases extends LightningElement {
    // STATIC data per requirement
    purchases = [
        {
            id: 'UB3112161C1A1',
            name: 'Striking Gold Necklace',
            specs: '22 Karat, 65 gms',
            price: '₹1,12,800',
            meta: 'Medium',
            image: `${JEWELRY_IMAGES}/goldNecklace.jpg`,
            selected: false
        },
        {
            id: 'NFFM02PFL-S0127',
            name: 'Queenly 22 Karat Gold Bangle',
            specs: '35 gms, 22 Karat',
            price: '₹20,400',
            meta: "Women's 8",
            image: `${JEWELRY_IMAGES}/goldBangle.jpg`,
            selected: false
        }
    ];

    handleToggle(event) {
        const id = event.currentTarget.dataset.id;
        this.purchases = this.purchases.map((p) =>
            p.id === id ? { ...p, selected: !p.selected } : p
        );
    }
}
