import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import HEARTH_IMAGES from '@salesforce/resourceUrl/de_HearthImages';

import ORDERS from '@salesforce/schema/Account.de_Past_Orders_JSON__c';

const FIELDS = [ORDERS];

// The stored JSON only carries { name, image }. The order detail below (price,
// date, order id, category) is enriched for demo visualisation — keyed by the
// known product image, with keyword-based fallbacks for anything else.
const ENRICH = {
    'flipLidPressureCooker.png': { price: 3499, date: '15 Jul 2026', orderId: 'ORD-2847' },
    'triplyCookwareSet.png': { price: 8999, date: '02 Jun 2026', orderId: 'ORD-2631' },
    'hoodChimney.png': { price: 12499, date: '18 Apr 2026', orderId: 'ORD-2419' },
    'stylusMixerGrinder.png': { price: 4299, date: '05 Mar 2026', orderId: 'ORD-2283' },
    'compactInductionCooktop.png': { price: 2799, date: '22 Jan 2026', orderId: 'ORD-2104' }
};

// Deterministic fallbacks so unknown products still render sensibly.
function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) & 0x7fffffff;
    }
    return h;
}

function categoryFor(name) {
    const n = (name || '').toLowerCase();
    if (n.includes('cooktop') || n.includes('induction') || n.includes('stove')) return 'Cooktop';
    if (n.includes('chimney') || n.includes('hood') || n.includes('mixer') || n.includes('grinder') ||
        n.includes('fryer') || n.includes('oven') || n.includes('kettle') || n.includes('appliance')) return 'Appliance';
    return 'Cookware';
}

function formatINR(n) {
    // Indian grouping: 12,499 / 1,32,095
    const s = String(Math.round(n));
    if (s.length <= 3) return s;
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
}

export default class De_HearthPastOrders extends LightningElement {
    @api recordId;
    record;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ data }) {
        if (data) {
            this.record = data;
        }
    }

    get parsed() {
        const raw = getFieldValue(this.record, ORDERS);
        if (!raw) return [];
        try {
            return JSON.parse(raw);
        } catch (e) {
            return [];
        }
    }

    get items() {
        return this.parsed.map((p, i) => {
            const meta = ENRICH[p.image] || {};
            const price = meta.price != null ? meta.price : 1499 + (hash(p.name || '') % 12000);
            const orderId = meta.orderId || 'ORD-' + (2000 + (hash(p.name || '') % 900));
            // Real purchase/warranty data from the record wins over demo enrichment.
            const date = p.purchaseDate || meta.date || null;
            const warrantyStart = p.warrantyStart || null;
            const warrantyStatus = p.warrantyStatus || null;
            const warrantyActive = (warrantyStatus || '').toLowerCase() === 'active';
            return {
                id: String(i),
                name: p.name,
                image: p.image ? HEARTH_IMAGES + '/' + p.image : null,
                hasImage: !!p.image,
                category: categoryFor(p.name),
                orderId,
                date,
                hasWarranty: !!warrantyStatus,
                warrantyStart,
                warrantyStatus,
                warrantyIcon: warrantyActive ? 'utility:shield' : 'utility:clock',
                warrantyClass: warrantyActive ? 'warranty-chip active' : 'warranty-chip expired',
                priceLabel: formatINR(price),
                priceRaw: price,
                isLatest: i === 0,
                rowClass: i === 0 ? 'order-row is-latest' : 'order-row'
            };
        });
    }

    get hasItems() {
        return this.items.length > 0;
    }

    get count() {
        return this.items.length;
    }

    // ── Footer summary ──
    get totalSpent() {
        return formatINR(this.items.reduce((s, o) => s + o.priceRaw, 0));
    }

    get avgOrder() {
        const n = this.items.length;
        if (!n) return '0';
        const total = this.items.reduce((s, o) => s + o.priceRaw, 0);
        return formatINR(total / n);
    }

    get topBrand() {
        const counts = {};
        this.items.forEach((o) => {
            const brand = (o.name || '').trim().split(/\s+/)[0] || '—';
            counts[brand] = (counts[brand] || 0) + 1;
        });
        return this._topKey(counts);
    }

    get topCategory() {
        const counts = {};
        this.items.forEach((o) => {
            counts[o.category] = (counts[o.category] || 0) + 1;
        });
        return this._topKey(counts);
    }

    _topKey(counts) {
        let best = '—';
        let max = -1;
        Object.keys(counts).forEach((k) => {
            if (counts[k] > max) {
                max = counts[k];
                best = k;
            }
        });
        return best;
    }

    handleReorder(event) {
        const btn = event.currentTarget;
        btn.classList.add('added');
        const label = btn.querySelector('.btn-label');
        if (label) label.textContent = 'Added';
    }
}
