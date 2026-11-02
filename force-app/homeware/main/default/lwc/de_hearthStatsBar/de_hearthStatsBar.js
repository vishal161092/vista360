import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import HEARTH_IMAGES from '@salesforce/resourceUrl/de_HearthImages';

import NAME from '@salesforce/schema/Account.Name';
import CUST_TYPE from '@salesforce/schema/Account.de_Customer_Type__c';
import TIER from '@salesforce/schema/Account.de_Member_Tier__c';
import LOCATION from '@salesforce/schema/Account.de_Location__c';
import CITY from '@salesforce/schema/Account.PersonMailingCity';
import CLTV from '@salesforce/schema/Account.de_CLTV__c';
import ENGAGEMENT from '@salesforce/schema/Account.de_Engagement_Score__c';
import PROPENSITY from '@salesforce/schema/Account.de_Propensity_To_Buy__c';
import RFM from '@salesforce/schema/Account.de_RFM_Score__c';
import ORDERS from '@salesforce/schema/Account.de_Orders_YTD__c';
import SEGMENT from '@salesforce/schema/Account.de_Segment__c';

const FIELDS = [NAME, CUST_TYPE, TIER, LOCATION, CITY, CLTV, ENGAGEMENT, PROPENSITY, RFM, ORDERS, SEGMENT];

// Propensity ring geometry
const PROP_R = 26;
const PROP_C = 2 * Math.PI * PROP_R; // ~163.36

export default class De_HearthStatsBar extends LightningElement {
    @api recordId;
    record;

    logoUrl = HEARTH_IMAGES + '/logo.png';

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ data }) {
        if (data) {
            this.record = data;
        }
    }

    get photoUrl() {
        if ((this.name || '').toLowerCase().includes('meera')) {
            return HEARTH_IMAGES + '/persona.png';
        }
        return null;
    }

    get name() {
        return getFieldValue(this.record, NAME) || 'Customer';
    }

    get initials() {
        const n = this.name.trim().split(' ');
        return ((n[0] ? n[0][0] : '') + (n.length > 1 ? n[n.length - 1][0] : '')).toUpperCase();
    }

    get customerType() {
        return getFieldValue(this.record, CUST_TYPE);
    }

    get customerTypeLabel() {
        const map = {
            Anonymous: 'Anonymous Visitor',
            'Known-Offline': 'Known Customer',
            Omnichannel: 'Omnichannel'
        };
        return map[this.customerType] || this.customerType || '—';
    }

    get location() {
        return getFieldValue(this.record, LOCATION) || getFieldValue(this.record, CITY) || 'India';
    }

    get tier() {
        return getFieldValue(this.record, TIER);
    }

    get hasTier() {
        return !!this.tier;
    }

    get tierClass() {
        const base = 'badge';
        if (this.tier === 'Gold') return base + ' badge-primary';
        if (this.tier === 'Platinum') return base + ' badge-primary';
        return base + ' badge-primary';
    }

    get segment() {
        return getFieldValue(this.record, SEGMENT);
    }

    get hasSegment() {
        return !!this.segment;
    }

    // ── CLTV hero ──
    get cltvValue() {
        const c = getFieldValue(this.record, CLTV);
        return c != null ? Number(c).toLocaleString('en-IN') : null;
    }

    get hasCltv() {
        return this.cltvValue != null;
    }

    // ── Engagement bar ──
    get engagement() {
        return getFieldValue(this.record, ENGAGEMENT);
    }

    get hasEngagement() {
        return this.engagement != null;
    }

    get engagementBarStyle() {
        return `width: ${Math.max(0, Math.min(100, this.engagement || 0))}%;`;
    }

    // ── RFM pips (out of 10) ──
    get rfm() {
        return getFieldValue(this.record, RFM);
    }

    get hasRfm() {
        return this.rfm != null;
    }

    get rfmPips() {
        const score = Math.max(0, Math.min(10, Math.round(this.rfm || 0)));
        return Array.from({ length: 10 }, (_, i) => ({
            id: i,
            cls: i < score ? 'pip on' : 'pip'
        }));
    }

    // ── Propensity signature ring ──
    get propensity() {
        return getFieldValue(this.record, PROPENSITY);
    }

    get hasPropensity() {
        return this.propensity != null;
    }

    get propensityRingStyle() {
        const pct = Math.max(0, Math.min(100, this.propensity || 0)) / 100;
        const on = (PROP_C * pct).toFixed(2);
        const off = (PROP_C * (1 - pct)).toFixed(2);
        return `stroke-dasharray: ${on} ${off};`;
    }

    get propensityHeadline() {
        const p = this.propensity || 0;
        if (p >= 70) return 'Strong purchase intent signal';
        if (p >= 50) return 'Moderate purchase intent';
        return 'Low purchase intent — nurture';
    }

    get propensitySub() {
        const p = this.propensity || 0;
        return p >= 60 ? 'Above segment avg · Recommend outreach' : 'Monitor · Consider re-engagement';
    }

    // ── Orders dots (out of 8) ──
    get orders() {
        return getFieldValue(this.record, ORDERS);
    }

    get hasOrders() {
        return this.orders != null;
    }

    get orderDots() {
        const count = Math.max(0, Math.round(this.orders || 0));
        const slots = Math.max(8, count);
        return Array.from({ length: slots }, (_, i) => ({
            id: i,
            cls: i < count ? 'odot on' : 'odot'
        }));
    }
}
