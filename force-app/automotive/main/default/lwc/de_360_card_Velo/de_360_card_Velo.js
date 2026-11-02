import VEHICLE_IMAGES from '@salesforce/resourceUrl/veloVehicleImages';
import { DEMO } from 'c/de_demoScenarios';
import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import NAME_FIELD from '@salesforce/schema/Contact.Name';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import PHONE_Mobile from '@salesforce/schema/Contact.MobilePhone';
import MAILING_STREET_FIELD from '@salesforce/schema/Contact.MailingStreet';
import MAILING_CITY_FIELD from '@salesforce/schema/Contact.MailingCity';
import MAILING_STATE_FIELD from '@salesforce/schema/Contact.MailingState';
import MAILING_POSTAL_CODE_FIELD from '@salesforce/schema/Contact.MailingPostalCode';
import MAILING_COUNTRY_FIELD from '@salesforce/schema/Contact.MailingCountry';

const FIELDS = [
    NAME_FIELD,
    EMAIL_FIELD,
    PHONE_FIELD,
    PHONE_Mobile,
    MAILING_STREET_FIELD,
    MAILING_CITY_FIELD,
    MAILING_STATE_FIELD,
    MAILING_POSTAL_CODE_FIELD,
    MAILING_COUNTRY_FIELD
];

const MODERATE_ENGAGEMENT_RECORD_ID = DEMO.C4;
const HIGH_VALUE_RECORD_IDS = [DEMO.C8, DEMO.C3];

export default class De360CardVelo extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    contactRecord;

    get customerName() {
        return getFieldValue(this.contactRecord.data, NAME_FIELD) || 'Arjun Rao';
    }

    get email() {
        return getFieldValue(this.contactRecord.data, EMAIL_FIELD) || 'arjun.rao@example.com';
    }

    get phone() {
        return getFieldValue(this.contactRecord.data, PHONE_FIELD) || '+91 90000 00000';
    }
    get mobile() {
        return getFieldValue(this.contactRecord.data, PHONE_Mobile) || '+91 90000 00000';
    }

    get fullAddress() {
        const street = getFieldValue(this.contactRecord.data, MAILING_STREET_FIELD);
        const city = getFieldValue(this.contactRecord.data, MAILING_CITY_FIELD);
        const state = getFieldValue(this.contactRecord.data, MAILING_STATE_FIELD);
        const postalCode = getFieldValue(this.contactRecord.data, MAILING_POSTAL_CODE_FIELD);
        const country = getFieldValue(this.contactRecord.data, MAILING_COUNTRY_FIELD);

        const builtAddress = [street, city, state, postalCode, country].filter(Boolean).join(', ');
        return builtAddress || 'Mumbai';
    }

    get personaImageUrl() {
        return `${VEHICLE_IMAGES}/persona.png`;
    }

    get isModeratelyEngagedRecord() {
        return this.recordId === MODERATE_ENGAGEMENT_RECORD_ID;
    }

    get engagementLabel() {
        return this.isModeratelyEngagedRecord ? 'Moderately Engaged' : 'Actively Engaged';
    }

    get engagementScore() {
        if (this.isModeratelyEngagedRecord) {
            return 65;
        }

        if (HIGH_VALUE_RECORD_IDS.includes(this.recordId)) {
            return 85;
        }

        return 76;
    }

    get isHighEngagement() {
        return this.engagementScore > 80;
    }

    get engagementClass() {
        return this.isHighEngagement ? 'engaged engaged-green' : 'engaged engaged-yellow';
    }

    get showPropensityToBuy() {
        return this.recordId === MODERATE_ENGAGEMENT_RECORD_ID;
    }

    get propensityProgressStyle() {
        return 'width: 84%;';
    }

    get scoreCircleClass() {
        return this.isHighEngagement ? 'score-circle score-circle-green' : 'score-circle score-circle-yellow';
    }

    get rewardPoints() {
        return this.isModeratelyEngagedRecord ? '5000' : '10000';
    }

    get customerLifetimeValue() {
        return HIGH_VALUE_RECORD_IDS.includes(this.recordId) ? '₹ 59,00,000/-' : '₹ 35,00,000/-';
    }

    get rewardPointsNumber() {
        return Number(this.rewardPoints);
    }

    get tierLabel() {
        return this.isModeratelyEngagedRecord ? 'Silver Tier' : 'Gold Tier';
    }

    get tierBadgeClass() {
        return this.isModeratelyEngagedRecord ? 'tier-badge tier-badge-silver' : 'tier-badge tier-badge-gold';
    }

    get nextMilestoneTarget() {
        return this.isModeratelyEngagedRecord ? 10000 : 15000;
    }

    get pointsToNextMilestone() {
        return Math.max(this.nextMilestoneTarget - this.rewardPointsNumber, 0);
    }

    get progressBarStyle() {
        const progressPercent = (this.rewardPointsNumber / this.nextMilestoneTarget) * 100;
        return `width: ${Math.min(Math.max(progressPercent, 0), 100)}%;`;
    }
}