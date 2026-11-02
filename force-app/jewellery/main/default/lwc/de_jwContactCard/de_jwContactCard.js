import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import JEWELRY_IMAGES from '@salesforce/resourceUrl/de_JewelryImages';

import NAME_FIELD from '@salesforce/schema/Contact.Name';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import MOBILE_FIELD from '@salesforce/schema/Contact.MobilePhone';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import STREET_FIELD from '@salesforce/schema/Contact.MailingStreet';
import CITY_FIELD from '@salesforce/schema/Contact.MailingCity';
import STATE_FIELD from '@salesforce/schema/Contact.MailingState';
import POSTAL_FIELD from '@salesforce/schema/Contact.MailingPostalCode';

const FIELDS = [
    NAME_FIELD,
    EMAIL_FIELD,
    MOBILE_FIELD,
    PHONE_FIELD,
    STREET_FIELD,
    CITY_FIELD,
    STATE_FIELD,
    POSTAL_FIELD
];

export default class JwContactCard extends LightningElement {
    @api recordId;

    contact;

    // Persona photo (static resource)
    personaImage = `${JEWELRY_IMAGES}/persona.png`;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredContact({ data, error }) {
        if (data) {
            this.contact = data;
        } else if (error) {
            // eslint-disable-next-line no-console
            console.error('jwContactCard getRecord error', error);
        }
    }

    // ---- DYNAMIC (live from the Contact record) --------------------------
    get name() {
        return getFieldValue(this.contact, NAME_FIELD) || 'Contact';
    }

    get email() {
        return getFieldValue(this.contact, EMAIL_FIELD) || '—';
    }

    get phone() {
        // prefer mobile, fall back to business phone
        return (
            getFieldValue(this.contact, MOBILE_FIELD) ||
            getFieldValue(this.contact, PHONE_FIELD) ||
            '—'
        );
    }

    get address() {
        const parts = [
            getFieldValue(this.contact, STREET_FIELD),
            getFieldValue(this.contact, CITY_FIELD),
            getFieldValue(this.contact, STATE_FIELD),
            getFieldValue(this.contact, POSTAL_FIELD)
        ].filter((p) => p);
        return parts.length ? parts.join(', ') : '—';
    }

    get initials() {
        const n = this.name || '';
        const bits = n.trim().split(/\s+/);
        if (!bits.length || !bits[0]) return 'C';
        if (bits.length === 1) return bits[0].charAt(0).toUpperCase();
        return (bits[0].charAt(0) + bits[bits.length - 1].charAt(0)).toUpperCase();
    }

    // ---- STATIC (hardcoded per requirement) ------------------------------
    customerId = 'AEID34006';
    loyaltyTier = 'Silver Tier';
    segment = 'Seasonal Buyer';
    lifetimeValue = '₹426,000';
    propensityScore = 60;
    engagementScore = 50;

    get propensityStyle() {
        return `width:${this.propensityScore}%;`;
    }

    get engagementStyle() {
        return `width:${this.engagementScore}%;`;
    }
}
