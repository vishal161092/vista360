import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import ACTIVITY from '@salesforce/schema/Account.de_Recent_Activity_JSON__c';

const FIELDS = [ACTIVITY];

/* ── category + icon resolution (keyword-matched, first hit wins) ── */
const CAT_MAP = [
    { match: ['purchase', 'online'], cat: 'Online', icon: 'utility:world', accent: false },
    { match: ['purchase', 'store'], cat: 'In-Store', icon: 'utility:cart', accent: false },
    { match: ['purchase', 'sarjapur'], cat: 'In-Store', icon: 'utility:cart', accent: false },
    { match: ['purchase'], cat: 'Purchase', icon: 'utility:cart', accent: false },
    { match: ['whatsapp'], cat: 'Marketing', icon: 'utility:chat', accent: false },
    { match: ['promotional', 'promo'], cat: 'Marketing', icon: 'utility:announcement', accent: false },
    { match: ['sms', 'ebill'], cat: 'Comms', icon: 'utility:sms', accent: false },
    { match: ['email'], cat: 'Comms', icon: 'utility:email', accent: false },
    { match: ['service', 'complaint'], cat: 'Service', icon: 'utility:priority', accent: true },
    { match: ['points', 'redeem'], cat: 'Loyalty', icon: 'utility:coupon_codes', accent: false },
    { match: ['abandon', 'cart'], cat: 'Intent', icon: 'utility:cart', accent: true },
    { match: ['visit', 'website'], cat: 'Digital', icon: 'utility:world', accent: false },
    { match: ['profile'], cat: 'Account', icon: 'utility:edit', accent: false }
];

const MONTHS = {
    jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
    may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7,
    sep: 8, sept: 8, september: 8, oct: 9, october: 9, nov: 10, november: 10,
    dec: 11, december: 11
};
const MON_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default class De_HearthTimeline extends LightningElement {
    @api recordId;
    record;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ data }) {
        if (data) {
            this.record = data;
        }
    }

    resolveCat(label) {
        const l = (label || '').toLowerCase();
        for (const cfg of CAT_MAP) {
            if (cfg.match.every((m) => l.includes(m))) return cfg;
        }
        return { cat: 'Event', icon: 'utility:record', accent: false };
    }

    /* parse "07 April 2026" / "01 Feb 2026" → {day, month(0-11), year} */
    parseDate(str) {
        if (!str) return null;
        const parts = String(str).trim().split(/\s+/);
        if (parts.length < 3) return null;
        const day = parseInt(parts[0], 10);
        const month = MONTHS[parts[1].toLowerCase()];
        const year = parseInt(parts[2], 10);
        if (isNaN(day) || month === undefined || isNaN(year)) return null;
        return { day, month, year };
    }

    dateLabel(d) {
        if (!d) return '';
        const dd = String(d.day).padStart(2, '0');
        return `${dd} ${MON_ABBR[d.month]} ${d.year}`;
    }

    relLabel(d) {
        if (!d) return '';
        const now = new Date();
        const months = (now.getFullYear() * 12 + now.getMonth()) - (d.year * 12 + d.month);
        if (months <= 0) return 'this month';
        if (months < 12) return `${months} mo ago`;
        const yrs = Math.floor(months / 12);
        return `${yrs} yr${yrs > 1 ? 's' : ''} ago`;
    }

    get groups() {
        const raw = getFieldValue(this.record, ACTIVITY);
        if (!raw) return [];
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            return [];
        }

        const rows = parsed.map((a, i) => {
            const label = a.type || a.label || 'Event';
            const cfg = this.resolveCat(label);
            const d = this.parseDate(a.date);
            return {
                id: String(i),
                label,
                cat: cfg.cat,
                icon: cfg.icon,
                nodeClass: cfg.accent ? 't-node accent' : 't-node',
                chipClass: cfg.accent ? 't-chip accent' : 't-chip',
                dateLabel: this.dateLabel(d),
                relLabel: this.relLabel(d),
                _sort: d ? d.year * 372 + d.month * 31 + d.day : 0,
                _year: d ? d.year : 0
            };
        });

        rows.sort((a, b) => b._sort - a._sort);

        const byYear = [];
        const seen = {};
        rows.forEach((r) => {
            const y = r._year || 'Undated';
            if (seen[y] === undefined) {
                seen[y] = byYear.length;
                byYear.push({ year: String(y), items: [] });
            }
            byYear[seen[y]].items.push(r);
        });

        // flag last item of each group so the connector line stops
        byYear.forEach((g) => {
            g.items.forEach((it, idx) => {
                it.rowClass = idx === g.items.length - 1 ? 't-item last' : 't-item';
            });
        });
        return byYear;
    }

    get hasItems() {
        return this.groups.length > 0;
    }

    get countLabel() {
        const n = this.groups.reduce((s, g) => s + g.items.length, 0);
        return `${n} event${n === 1 ? '' : 's'}`;
    }
}
