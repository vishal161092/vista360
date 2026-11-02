import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import CUST_TYPE from '@salesforce/schema/Account.de_Customer_Type__c';
import PREF_CAT from '@salesforce/schema/Account.de_Preferred_Category__c';
import PROPENSITY from '@salesforce/schema/Account.de_Propensity_To_Buy__c';
import PREF_STORE from '@salesforce/schema/Account.de_Preferred_Store__c';
import PREF_SIZE from '@salesforce/schema/Account.de_Preferred_Size__c';
import CHANNEL from '@salesforce/schema/Account.de_Channel_Affinity__c';
import CSAT from '@salesforce/schema/Account.de_CSAT_Score__c';
import SEGMENT from '@salesforce/schema/Account.de_Segment__c';
import UPSELL from '@salesforce/schema/Account.de_Upsell_Recommendation__c';
import OPEN_TICK from '@salesforce/schema/Account.de_Open_Service_Tickets__c';
import CLOSED_TICK from '@salesforce/schema/Account.de_Closed_Service_Tickets__c';
import RECENTNESS from '@salesforce/schema/Account.de_Recentness__c';
import PRODUCT_VIEWED from '@salesforce/schema/Account.de_Product_Viewed__c';
import CAT_VIEWED from '@salesforce/schema/Account.de_Category_Viewed__c';
import VIEW_TIME from '@salesforce/schema/Account.de_View_Time_Seconds__c';
import PAST_ORDERS from '@salesforce/schema/Account.de_Past_Orders_JSON__c';
import CLTV from '@salesforce/schema/Account.de_CLTV__c';
import ENGAGEMENT from '@salesforce/schema/Account.de_Engagement_Score__c';
import RFM from '@salesforce/schema/Account.de_RFM_Score__c';
import ORDERS from '@salesforce/schema/Account.de_Orders_YTD__c';

const FIELDS = [CUST_TYPE, PREF_CAT, PROPENSITY, PREF_STORE, PREF_SIZE, CHANNEL, CSAT, SEGMENT, UPSELL,
    OPEN_TICK, CLOSED_TICK, RECENTNESS, PRODUCT_VIEWED, CAT_VIEWED, VIEW_TIME, PAST_ORDERS,
    CLTV, ENGAGEMENT, RFM, ORDERS];

// Propensity ring geometry
const PROP_R = 26;
const PROP_C = 2 * Math.PI * PROP_R;

export default class De_HearthInsights extends LightningElement {
    @api recordId;
    record;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ data }) {
        if (data) {
            this.record = data;
        }
    }

    _v(field) {
        return getFieldValue(this.record, field);
    }

    get isAnonymous() {
        return this._v(CUST_TYPE) === 'Anonymous';
    }

    get isKnown() {
        return !this.isAnonymous;
    }

    // ── Header segment badge ──
    get segment() {
        return this._v(SEGMENT);
    }

    get hasSegment() {
        return !!this.segment;
    }

    // ══ PERFORMANCE (CLTV / Engagement / RFM / Propensity / Orders) ══
    get cltvValue() {
        const c = this._v(CLTV);
        return c != null ? Number(c).toLocaleString('en-IN') : null;
    }

    get hasCltv() {
        return this.cltvValue != null;
    }

    get engagement() {
        return this._v(ENGAGEMENT);
    }

    get hasEngagement() {
        return this.engagement != null;
    }

    get engagementBarStyle() {
        return `width: ${Math.max(0, Math.min(100, this.engagement || 0))}%;`;
    }

    get rfm() {
        return this._v(RFM);
    }

    get hasRfm() {
        return this.rfm != null;
    }

    get rfmPips() {
        const score = Math.max(0, Math.min(10, Math.round(this.rfm || 0)));
        return Array.from({ length: 10 }, (_, i) => ({
            id: i,
            cls: i < score ? 'pf-pip on' : 'pf-pip'
        }));
    }

    get propensity() {
        return this._v(PROPENSITY);
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

    get orders() {
        return this._v(ORDERS);
    }

    get hasOrders() {
        return this.orders != null;
    }

    get orderDots() {
        const count = Math.max(0, Math.round(this.orders || 0));
        const slots = Math.max(8, count);
        return Array.from({ length: slots }, (_, i) => ({
            id: i,
            cls: i < count ? 'pf-dot on' : 'pf-dot'
        }));
    }

    get hasPerformance() {
        return this.isKnown && (this.hasCltv || this.hasEngagement || this.hasRfm || this.hasPropensity || this.hasOrders);
    }

    // ── PREFERENCES (enriched with a context caption) ──
    get prefTiles() {
        return [
            this._tile('Preferred Category', this._v(PREF_CAT), 'utility:list', { caption: 'Buys most often' }),
            this._tile('Preferred Size', this._v(PREF_SIZE), 'utility:resource_capacity', { caption: 'Typical capacity' }),
            this._tile('Channel Affinity', this._v(CHANNEL), 'utility:chat', { caption: 'Best way to reach' }),
            this._tile('Preferred Store', this._v(PREF_STORE), 'utility:store', { caption: 'Home outlet' })
        ].filter(Boolean);
    }

    get hasPreferences() {
        return this.prefTiles.length > 0;
    }

    // ── SATISFACTION (CSAT — pips out of 10) ──
    get csat() {
        return this._v(CSAT);
    }

    get hasCsat() {
        return this.csat != null;
    }

    get csatPips() {
        const s = Math.max(0, Math.min(10, Math.round(this.csat || 0)));
        return Array.from({ length: 10 }, (_, i) => ({
            id: i,
            cls: i < s ? 'pip on' : 'pip'
        }));
    }

    get csatSub() {
        const c = this.csat || 0;
        if (c >= 8) return 'Delighted';
        if (c >= 6) return 'Satisfied';
        if (c >= 4) return 'At risk';
        return 'Detractor';
    }

    get csatSubClass() {
        const c = this.csat || 0;
        return c < 6 ? 'csat-sub warn' : 'csat-sub';
    }

    // ── SERVICE ──
    get serviceTiles() {
        const tiles = [];
        tiles.push(this._tile('Last Purchase', this._v(RECENTNESS), 'utility:clock', { caption: 'Recency' }));
        const ot = this._v(OPEN_TICK);
        if (ot != null) {
            tiles.push(this._tile('Open Tickets', ot, 'utility:warning', { big: true, warn: ot > 0, caption: 'Needs attention' }));
        }
        const ct = this._v(CLOSED_TICK);
        if (ct != null) {
            tiles.push(this._tile('Closed Tickets', ct, 'utility:success', { big: true, caption: 'Resolved' }));
        }
        return tiles.filter(Boolean);
    }

    get hasService() {
        return this.serviceTiles.length > 0;
    }

    get hasSatisfaction() {
        return this.hasCsat || this.hasService;
    }

    // ── SERVICE NOTE (from Past Orders) — eye-catching alert ──
    get serviceNote() {
        const raw = this._v(PAST_ORDERS);
        if (!raw) return null;
        let orders;
        try {
            orders = JSON.parse(raw);
        } catch (e) {
            return null;
        }
        const flagged = (orders || []).find((o) => o && o.serviceNote);
        if (!flagged) return null;
        return {
            product: flagged.name,
            note: flagged.serviceNote
        };
    }

    get hasServiceNote() {
        return this.isKnown && !!this.serviceNote;
    }

    _tile(label, value, icon, opts = {}) {
        if (value == null || value === '') return null;
        return {
            id: label,
            label,
            value,
            icon,
            caption: opts.caption || null,
            tileClass: 's-tile' + (opts.warn ? ' warn-tile' : ''),
            quadClass: 'q-tile' + (opts.warn ? ' warn-tile' : ''),
            valClass: 's-val' + (opts.big ? ' big' : '') + (opts.warn ? ' warn-val' : '')
        };
    }

    // ── ANONYMOUS ──
    get anonTiles() {
        return [
            this._tile('Category Viewed', this._v(CAT_VIEWED), 'utility:list'),
            this._tile('Product Viewed', this._v(PRODUCT_VIEWED), 'utility:preview'),
            this._tile('View Time', this._secLabel(this._v(VIEW_TIME)), 'utility:clock')
        ].filter(Boolean);
    }

    _secLabel(v) {
        return v != null ? v + ' seconds' : null;
    }

    // ── UPSELL ──
    get upsell() {
        return this._v(UPSELL);
    }

    get hasUpsell() {
        return !!this.upsell && this.isKnown;
    }

    get upsellSub() {
        const parts = [];
        if (this._v(PREF_CAT)) parts.push(`Matches ${this._v(PREF_CAT)} affinity`);
        const p = this._v(PROPENSITY);
        if (p != null) parts.push(`${p}% buy probability`);
        return parts.join('  ·  ');
    }

    handleRecommend(event) {
        const btn = event.currentTarget;
        btn.textContent = '✓ Noted';
        btn.classList.add('noted');
    }
}
