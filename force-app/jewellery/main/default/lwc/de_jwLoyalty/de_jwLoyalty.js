import { LightningElement } from 'lwc';

export default class JwLoyalty extends LightningElement {
    // STATIC demo data
    tier = 'Silver';
    memberId = 'AKS-SLV-34006';
    memberSince = 'Mar 2022';
    points = 2450;
    nextTier = 'Gold';
    pointsToNext = 550; // points remaining to Gold (3000)
    coupon = 'AKASYA10';
    couponDesc = '10% off making charges';

    get progressStyle() {
        const earnedTowardGold = 3000 - this.pointsToNext;
        const pct = Math.min(100, Math.round((earnedTowardGold / 3000) * 100));
        return `width:${pct}%;`;
    }

    get stars() {
        // Silver = 2 filled of 4 (Bronze/Silver/Gold/Platinum ladder)
        return [
            { key: 's1', filled: true },
            { key: 's2', filled: true },
            { key: 's3', filled: false },
            { key: 's4', filled: false }
        ];
    }

    handleCopy() {
        const el = this.template.querySelector('.coupon-code');
        if (el && navigator.clipboard) {
            navigator.clipboard.writeText(this.coupon);
        }
    }
}
