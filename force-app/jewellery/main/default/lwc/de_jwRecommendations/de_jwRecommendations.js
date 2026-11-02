import { LightningElement } from 'lwc';
import JEWELRY_IMAGES from '@salesforce/resourceUrl/de_JewelryImages';

export default class JwRecommendations extends LightningElement {
    // STATIC data per requirement
    recommendations = [
        {
            id: 'rec1',
            name: 'Layered Gold Chain Bracelet',
            price: '₹27,900',
            tag: 'Cross-sell',
            image: `${JEWELRY_IMAGES}/goldBracelet.jpg`
        },
        {
            id: 'rec2',
            name: 'Diamond Halo Ring',
            price: '₹46,200',
            tag: 'Upsell',
            image: `${JEWELRY_IMAGES}/diamondRing.jpg`
        },
        {
            id: 'rec3',
            name: 'Diamond-Studded Bracelet',
            price: '₹58,500',
            tag: 'Frequently bought',
            image: `${JEWELRY_IMAGES}/diamondBracelet.jpg`
        }
    ];
}
