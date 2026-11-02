import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import AVATAR from '@salesforce/resourceUrl/de_paas_member_avatar';

const FIELDS = [
    'Lead.Name',
    'Lead.Title',
    'Lead.Company',
    'Lead.Phone',
    'Lead.Email',
    'Lead.Street',
    'Lead.City',
    'Lead.PostalCode',
    'Lead.State',
    'Lead.LeadSource',
    'Lead.Status',
    'Lead.CreatedDate'
];

export default class De_paasLead360Card extends LightningElement {
    @api recordId;
    avatarUrl = AVATAR;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    lead;

    get name() {
        return this.lead?.data?.fields?.Name?.value || 'Mrs. Meera Nair';
    }

    get title() {
        return this.lead?.data?.fields?.Title?.value || 'VP Operations';
    }

    get company() {
        return this.lead?.data?.fields?.Company?.value || 'Bodell Construction';
    }

    get email() {
        return this.lead?.data?.fields?.Email?.value || 'meera.nair@example.com';
    }

    get phone() {
        return this.lead?.data?.fields?.Phone?.value || '+91 90000 00000';
    }

    get address() {
        const street = this.lead?.data?.fields?.Street?.value || '';
        const city = this.lead?.data?.fields?.City?.value || 'Chennai';
        const state = this.lead?.data?.fields?.State?.value || 'TN';
        const postal = this.lead?.data?.fields?.PostalCode?.value || '600020';
        if (street) {
            return `${street}, ${city}, ${state} ${postal}`;
        }
        return `${city}, ${state} ${postal}`;
    }

    get leadSource() {
        return this.lead?.data?.fields?.LeadSource?.value || 'Referral';
    }

    get status() {
        return this.lead?.data?.fields?.Status?.value || 'Working';
    }

    get customerSince() {
        const created = this.lead?.data?.fields?.CreatedDate?.value;
        if (created) {
            return new Date(created).getFullYear().toString();
        }
        return '2024';
    }
}
