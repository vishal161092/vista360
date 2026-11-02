import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import HEARTH_IMAGES from '@salesforce/resourceUrl/de_HearthImages';

import RECS from '@salesforce/schema/Account.de_Recommendations_JSON__c';
import UPSELL from '@salesforce/schema/Account.de_Upsell_Recommendation__c';
import NAME from '@salesforce/schema/Account.Name';
import CUST_TYPE from '@salesforce/schema/Account.de_Customer_Type__c';

const FIELDS = [RECS, UPSELL, NAME, CUST_TYPE];

// Confidence ring geometry (r = 17)
const RING_C = 2 * Math.PI * 17; // ~106.81

// The stored recommendation JSON only carries { name, image, reason }. Price,
// confidence and rec-type below are enriched for visualisation — keyed by the
// product image, with keyword fallbacks. Curated fill items round out the list
// to match the design when the org returns only a single recommendation.
const PRICE = {
    'duoAirFryer.png': 9999,
    'chefAirFryer.png': 5499,
    'compactInductionCooktop.png': 2799,
    'stylusMixerGrinder.png': 4299,
    'triplyCookwareSet.png': 8999,
    'hoodChimney.png': 12499,
    'flipLidPressureCooker.png': 3499,
    'cleanSealPressureCooker.png': 2499
};

const TAG_META = {
    upsell: { label: 'Upsell', cls: 'rec-tag tag-upsell' },
    fbt: { label: 'Frequently Bought Together', cls: 'rec-tag tag-fbt' },
    cross: { label: 'Cross-sell', cls: 'rec-tag tag-cross' }
};

function hash(str) {
    let h = 0;
    for (let i = 0; i < (str || '').length; i++) {
        h = (h * 31 + str.charCodeAt(i)) & 0x7fffffff;
    }
    return h;
}

function priceFor(image, name) {
    if (image && PRICE[image] != null) return PRICE[image];
    return 1999 + (hash(name) % 11000);
}

function formatINR(n) {
    const s = String(Math.round(n));
    if (s.length <= 3) return s;
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
}

function categoryFor(name) {
    const n = (name || '').toLowerCase();
    if (n.includes('cooktop') || n.includes('induction')) return 'Cooktop';
    if (n.includes('cookware') || n.includes('triply') || n.includes('pressure') || n.includes('pan')) return 'Cookware';
    return 'Appliance';
}

function tagFor(name) {
    const n = (name || '').toLowerCase();
    if (n.includes('cooktop') || n.includes('induction')) return 'fbt';
    if (n.includes('mixer') || n.includes('grinder')) return 'cross';
    return 'upsell';
}

function ringStyle(pct) {
    const dash = (pct / 100) * RING_C;
    return `stroke-dasharray: ${dash.toFixed(1)} ${(RING_C - dash).toFixed(1)};`;
}

// red for strong matches, black mid, grey lower — keeps red as the "signal".
function ringColor(pct) {
    if (pct >= 75) return '#CB2228';
    if (pct >= 62) return '#000000';
    return '#a1a1aa';
}

export default class De_HearthRecommendations extends LightningElement {
    @api recordId;
    record;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ data }) {
        if (data) {
            this.record = data;
        }
    }

    get isAnonymous() {
        return getFieldValue(this.record, CUST_TYPE) === 'Anonymous';
    }

    get isOmnichannel() {
        return getFieldValue(this.record, CUST_TYPE) === 'Omnichannel';
    }

    get accountName() {
        return getFieldValue(this.record, NAME) || '';
    }

    get firstName() {
        return this.accountName.trim().split(/\s+/)[0] || 'customer';
    }

    get rawRecs() {
        const raw = getFieldValue(this.record, RECS);
        if (!raw) return [];
        try {
            return JSON.parse(raw);
        } catch (e) {
            return [];
        }
    }

    // ── HERO (top upsell) — real recommendation when present ──
    get heroRec() {
        const top = this.rawRecs[0];
        if (!top) return null;
        const price = priceFor(top.image, top.name);
        const match = 88 + (hash(top.name) % 10); // 88–97
        return {
            name: top.name,
            reason: top.reason || 'Aligned with recent purchase behaviour.',
            image: top.image ? HEARTH_IMAGES + '/' + top.image : null,
            hasImage: !!top.image,
            category: categoryFor(top.name),
            priceLabel: formatINR(price),
            matchLabel: match + '% Match'
        };
    }

    get hasHero() {
        return !this.isAnonymous && !!this.heroRec;
    }

    get ctaLabel() {
        return `Send to ${this.firstName} via WhatsApp`;
    }

    // ── MORE RECOMMENDATIONS ──
    get moreRecs() {
        if (this.isAnonymous) return [];

        // additional real recommendations (beyond the hero) — no demo fill
        const out = this.rawRecs.slice(1).map((r) => ({
            name: r.name, image: r.image, tag: tagFor(r.name), conf: 60 + (hash(r.name) % 25)
        }));

        return out.map((r, i) => {
            const meta = TAG_META[r.tag] || TAG_META.upsell;
            const price = priceFor(r.image, r.name);
            return {
                id: 'm' + i,
                name: r.name,
                image: r.image ? HEARTH_IMAGES + '/' + r.image : null,
                hasImage: !!r.image,
                tagLabel: meta.label,
                tagClass: meta.cls,
                scoreLabel: r.conf + '%',
                ringStyle: ringStyle(r.conf),
                ringColor: ringColor(r.conf),
                priceLabel: formatINR(price)
            };
        });
    }

    get hasMore() {
        return this.moreRecs.length > 0;
    }

    get hasContent() {
        return this.hasHero || this.hasMore;
    }

    handleHeroSend(event) {
        const btn = event.currentTarget;
        btn.classList.add('sent');
        const label = btn.querySelector('.cta-label');
        if (label) label.textContent = 'Recommendation Sent';
    }

    handleSuggest(event) {
        const btn = event.currentTarget;
        btn.classList.add('sent');
        const label = btn.querySelector('.sg-label');
        if (label) label.textContent = 'Sent';
    }
}
