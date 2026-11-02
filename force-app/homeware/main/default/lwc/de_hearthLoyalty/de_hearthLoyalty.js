import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import MEMBER_ID from '@salesforce/schema/Account.de_Member_ID__c';
import TIER from '@salesforce/schema/Account.de_Member_Tier__c';
import POINTS from '@salesforce/schema/Account.de_Member_Points__c';
import SINCE from '@salesforce/schema/Account.de_Member_Since__c';
import PROMOS from '@salesforce/schema/Account.de_Promos_Applicable__c';
import COUPON from '@salesforce/schema/Account.de_Active_Coupon__c';
import EXPIRING from '@salesforce/schema/Account.de_Points_About_To_Expire__c';

const FIELDS = [MEMBER_ID, TIER, POINTS, SINCE, PROMOS, COUPON, EXPIRING];

// Tier ladder — next tier to climb to (target points) and star fill / theme.
const LADDER = {
    Bronze: { next: 'Silver', nextAt: 500, stars: 1, theme: 'theme-bronze' },
    Silver: { next: 'Gold', nextAt: 1000, stars: 2, theme: 'theme-silver' },
    Gold: { next: 'Platinum', nextAt: 2000, stars: 3, theme: 'theme-gold' },
    Platinum: { next: null, nextAt: null, stars: 5, theme: 'theme-platinum' }
};

export default class De_HearthLoyalty extends LightningElement {
    @api recordId;
    record;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ data }) {
        if (data) {
            this.record = data;
        }
    }

    get hasLoyalty() {
        return !!getFieldValue(this.record, MEMBER_ID) || !!getFieldValue(this.record, TIER);
    }

    get memberId() {
        return getFieldValue(this.record, MEMBER_ID) || '—';
    }

    get tier() {
        return getFieldValue(this.record, TIER) || 'Member';
    }

    get rung() {
        return LADDER[this.tier] || LADDER.Bronze;
    }

    get heroThemeClass() {
        return 'tier-hero ' + this.rung.theme;
    }

    // 5 star slots, filled per tier
    get tierStars() {
        const filled = this.rung.stars;
        return Array.from({ length: 5 }, (_, i) => ({
            id: i,
            cls: i < filled ? 'tstar on' : 'tstar'
        }));
    }

    get pointsRaw() {
        const p = getFieldValue(this.record, POINTS);
        return p != null ? Number(p) : 0;
    }

    get points() {
        return this.pointsRaw.toLocaleString('en-IN');
    }

    // ── Progress to next tier ──
    get hasNextTier() {
        return !!this.rung.next;
    }

    get nextTier() {
        return this.rung.next;
    }

    get pointsFromLabel() {
        return this.points + ' pts';
    }

    get nextTierLabel() {
        return `${this.rung.next} at ${this.rung.nextAt.toLocaleString('en-IN')} pts`;
    }

    get progressPct() {
        if (!this.rung.next) return 100;
        return Math.max(0, Math.min(100, Math.round((this.pointsRaw / this.rung.nextAt) * 100)));
    }

    get progressBarStyle() {
        return `width: ${this.progressPct}%;`;
    }

    get pointsToNext() {
        if (!this.rung.next) return 0;
        return Math.max(0, this.rung.nextAt - this.pointsRaw);
    }

    get pointsToNextLabel() {
        return this.pointsToNext.toLocaleString('en-IN');
    }

    get memberSince() {
        return getFieldValue(this.record, SINCE);
    }

    get coupon() {
        return getFieldValue(this.record, COUPON);
    }

    get promos() {
        return getFieldValue(this.record, PROMOS);
    }

    get expiring() {
        return getFieldValue(this.record, EXPIRING);
    }

    get hasExpiring() {
        return this.expiring != null && this.expiring > 0;
    }

    get expiringLabel() {
        return this.expiring != null ? Number(this.expiring).toLocaleString('en-IN') + ' pts' : null;
    }

    handleCopy(event) {
        const btn = event.currentTarget;
        const text = btn.dataset.copy;
        if (text && navigator.clipboard) {
            navigator.clipboard.writeText(text);
            const original = btn.dataset.label || btn.textContent;
            btn.textContent = '✓ COPIED';
            btn.classList.add('copied');
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                btn.textContent = original;
                btn.classList.remove('copied');
            }, 1800);
        }
    }
}
