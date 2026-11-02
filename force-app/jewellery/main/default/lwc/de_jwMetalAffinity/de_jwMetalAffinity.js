import { LightningElement } from 'lwc';

export default class JwMetalAffinity extends LightningElement {
    // STATIC demo data — mirrors the Data Cloud "Product Affinity" CI
    topMetal = 'Gold';

    metals = [
        { key: 'gold', label: 'Gold 22K', pct: 62, spend: '₹2,64,000', cls: 'gold' },
        { key: 'diamond', label: 'Diamond', pct: 24, spend: '₹1,02,000', cls: 'diamond' },
        { key: 'silver', label: 'Silver', pct: 9, spend: '₹38,000', cls: 'silver' },
        { key: 'platinum', label: 'Platinum', pct: 5, spend: '₹22,000', cls: 'platinum' }
    ];

    get bars() {
        return this.metals.map((m) => ({
            ...m,
            style: `width:${m.pct}%;`
        }));
    }
}
