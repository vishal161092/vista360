import { LightningElement } from 'lwc';

export default class JwFestivalPattern extends LightningElement {
    // STATIC demo data — festival buying pattern (very India-jewelry)
    insight = 'Festive-season buyer — 68% of spend lands around Akshaya Tritiya & Diwali';

    festivals = [
        { key: 'ugadi', name: 'Ugadi', month: 'Mar', pct: 8, active: false },
        { key: 'akshaya', name: 'Akshaya Tritiya', month: 'Apr', pct: 34, active: true },
        { key: 'onam', name: 'Onam', month: 'Aug', pct: 12, active: false },
        { key: 'dhanteras', name: 'Dhanteras', month: 'Oct', pct: 18, active: false },
        { key: 'diwali', name: 'Diwali', month: 'Nov', pct: 28, active: true }
    ];

    get bars() {
        // scale bar height relative to the max pct for a mini column chart
        const max = Math.max(...this.festivals.map((f) => f.pct));
        return this.festivals.map((f) => ({
            ...f,
            style: `height:${Math.round((f.pct / max) * 100)}%;`,
            barClass: f.active ? 'col active' : 'col'
        }));
    }
}
