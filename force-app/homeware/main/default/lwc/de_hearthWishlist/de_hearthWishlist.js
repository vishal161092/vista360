import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import HEARTH_IMAGES from '@salesforce/resourceUrl/de_HearthImages';

import WISHLIST from '@salesforce/schema/Account.de_Wishlist_JSON__c';
import NAME from '@salesforce/schema/Account.Name';

const FIELDS = [WISHLIST, NAME];

// The stored wishlist JSON only carries { name, image }. Price, discount,
// days-added and purchase-intent below are enriched for visualisation —
// keyed by the product image, with deterministic fallbacks.
const ENRICH = {
    'chefAirFryer.png': { price: 15499, original: 18999, days: 45, intent: 75 },
    'duoAirFryer.png': { price: 9999, original: 11999, days: 22, intent: 68 },
    'triplyCookwareSet.png': { price: 8999, original: 10499, days: 31, intent: 60 },
    'hoodChimney.png': { price: 12499, original: 14999, days: 12, intent: 52 },
    'stylusMixerGrinder.png': { price: 4299, original: 4999, days: 18, intent: 58 },
    'compactInductionCooktop.png': { price: 2799, original: 3299, days: 9, intent: 55 },
    'flipLidPressureCooker.png': { price: 3499, original: 3999, days: 27, intent: 62 },
    'cleanSealPressureCooker.png': { price: 2499, original: 2899, days: 14, intent: 50 }
};

function hash(str) {
    let h = 0;
    for (let i = 0; i < (str || '').length; i++) {
        h = (h * 31 + str.charCodeAt(i)) & 0x7fffffff;
    }
    return h;
}

function formatINR(n) {
    const s = String(Math.round(n));
    if (s.length <= 3) return s;
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
}

// Purchase-intent tier drives the "act now" chip + accent.
function intentTier(pct) {
    if (pct >= 70) return { label: 'Act now', hot: true };
    if (pct >= 55) return { label: 'Warming up', hot: false };
    return { label: 'Browsing', hot: false };
}

export default class De_HearthWishlist extends LightningElement {
    @api recordId;
    record;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ data }) {
        if (data) {
            this.record = data;
        }
    }

    get firstName() {
        const n = getFieldValue(this.record, NAME) || '';
        return n.trim().split(/\s+/)[0] || 'customer';
    }

    get items() {
        const raw = getFieldValue(this.record, WISHLIST);
        if (!raw) return [];
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            return [];
        }
        return parsed.map((p, i) => {
            const meta = ENRICH[p.image] || {};
            const h = hash(p.name);
            const price = meta.price != null ? meta.price : 1999 + (h % 12000);
            const original = meta.original != null ? meta.original : Math.round(price * 1.18);
            const days = meta.days != null ? meta.days : 5 + (h % 55);
            const intent = meta.intent != null ? meta.intent : 45 + (h % 45);
            const savePct = original > price ? Math.round(((original - price) / original) * 100) : 0;
            const tier = intentTier(intent);
            return {
                id: String(i),
                name: p.name,
                image: p.image ? HEARTH_IMAGES + '/' + p.image : null,
                hasImage: !!p.image,
                priceLabel: formatINR(price),
                originalLabel: formatINR(original),
                hasDiscount: savePct > 0,
                saveLabel: '−' + savePct + '%',
                daysLabel: 'Added ' + days + ' days ago',
                intentStyle: `width:${intent}%;`,
                intentLabel: tier.label,
                intentClass: tier.hot ? 'intent-chip hot' : 'intent-chip',
                nudgeLabel: `Send ${this.firstName} a WhatsApp Nudge`
            };
        });
    }

    get hasItems() {
        return this.items.length > 0;
    }

    get count() {
        return this.items.length;
    }

    handleNudge(event) {
        const btn = event.currentTarget;
        btn.classList.add('done');
        const label = btn.querySelector('.bp-label');
        if (label) label.textContent = 'Nudge Sent';
    }

    handleAlert(event) {
        const btn = event.currentTarget;
        btn.classList.add('done');
        const label = btn.querySelector('.bs-label');
        if (label) label.textContent = 'Alert Set';
    }
}
