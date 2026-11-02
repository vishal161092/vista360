import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import NAME_FIELD from '@salesforce/schema/Contact.Name';
import LOYALTY_TIER_FIELD from '@salesforce/schema/Contact.Loyalty_Tier__c';
import LOYALTY_POINTS_FIELD from '@salesforce/schema/Contact.Loyalty_Points__c';

const FIELDS = [NAME_FIELD, LOYALTY_TIER_FIELD, LOYALTY_POINTS_FIELD];

const BENEFITS_MAP = {
    Logistics: [
        { key: 'b1', text: 'Priority pickup scheduling during festival season' },
        { key: 'b2', text: 'Dedicated service manager for shipment tracking' },
        { key: 'b3', text: 'Faster claim processing — 48-hr SLA' },
        { key: 'b4', text: '8% rate discount on Express Surface routes' }
    ],
    Eyecare: [
        { key: 'b1', text: 'Free annual comprehensive eye check-up at any Clearview Eyecare store' },
        { key: 'b2', text: '20% off on premium lens upgrades (Crizal, Transitions)' },
        { key: 'b3', text: 'Priority appointment booking & zero wait-time service' },
        { key: 'b4', text: 'Complimentary frame adjustments & cleaning for life' }
    ]
};

export default class De_loyaltyStatus extends LightningElement {
    @api recordId;
    @api industry = 'Logistics';

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    contact;

    get memberName() {
        return getFieldValue(this.contact.data, NAME_FIELD) || '—';
    }

    get tier() {
        return getFieldValue(this.contact.data, LOYALTY_TIER_FIELD) || 'Standard';
    }

    get points() {
        const pts = getFieldValue(this.contact.data, LOYALTY_POINTS_FIELD);
        return pts != null ? pts.toLocaleString('en-IN') : '0';
    }

    get benefits() {
        return BENEFITS_MAP[this.industry] || BENEFITS_MAP.Logistics;
    }

    get hasData() {
        return !!(this.contact && this.contact.data);
    }

    connectedCallback() {
ghtningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import NAME_FIELD from '@salesforce/schema/Contact.Name';
import LOYALTY_TIER_FIELD from '@salesforce/schema/Contact.Loyalty_Tier__c';
import LOYALTY_POINTS_FIELD from '@salesforce/schema/Contact.Loyalty_Points__c';

const FIELDS = [NAME_FIELD, LOYALTY_TIER_FIELD, LOYALTY_POINTS_FIELD];

const BENEFITS_MAP = {
    Logistics: [
        { key: 'b1', text: 'Priority pickup scheduling during festival season' },
        { key: 'b2', text: 'Dedicated service manager for shipment tracking' },
        { key: 'b3', text: 'Faster claim processing — 48-hr SLA' },
        { key: 'b4', text: '8% rate discount on Express Surface routes' }
    ],
    Eyecare: [
        { key: 'b1', text: 'Free annual comprehensive eye check-up at any Clearview Eyecare store' },
        { key: 'b2', text: '20% off on premium lens upgrades (Crizal, Transitions)' },
        { key: 'b3', text: 'Priority appointment booking & zero wait-time service' },
        { key: 'b4', text: 'Complimentary frame adjustments & cleaning for life' }
    ]
};

export default class De_loyaltyStatus extends LightningElement {
    @api recordId;
    @api industry = 'Logistics';

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    contact;

    get memberName() {
        return getFieldValue(this.contact.data, NAME_FIELD) || '—';
    }

    get tier() {
        return getFieldValue(this.contact.data, LOYALTY_TIER_FIELD) || 'Standard';
    }

    get points() {
        const pts = getFieldValue(this.contact.data, LOYALTY_POINTS_FIELD);
        return pts != null ? pts.toLocaleString('en-IN') : '0';
    }

    get benefits() {
        return BENEFITS_MAP[this.industry] || BENEFITS_MAP.Logistics;
    }

    get hasData() {
        return !!(this.contact && this.contact.data);
    }

}
