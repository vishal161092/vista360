import { LightningElement } from 'lwc';

export default class De_loyaltyProgram extends LightningElement {
    tier = 'Gold Tier';
    stylePoints = 1850;
    nextTier = 'Platinum';
    pointsToNext = 2150;

    benefits = [
        { key: 'b1', label: 'Exclusive member offers' },
        { key: 'b2', label: 'Early access to seasonal sales' },
        { key: 'b3', label: 'Birthday rewards' }
    ];

    get formattedPoints() {
        return this.stylePoints.toLocaleString('en-IN');
    }

    get nextTierText() {
        return `Next Tier: ${this.nextTier} (${this.pointsToNext.toLocaleString(
            'en-IN'
        )} points away)`;
    }
}
