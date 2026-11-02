import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import CUST_TYPE from '@salesforce/schema/Account.de_Customer_Type__c';
import CUST_ID from '@salesforce/schema/Account.de_Customer_ID__c';
import USER_ID from '@salesforce/schema/Account.de_User_ID__c';
import SUB_KEY from '@salesforce/schema/Account.de_Subscriber_Key__c';
import EMAIL from '@salesforce/schema/Account.PersonEmail';
import PHONE from '@salesforce/schema/Account.PersonMobilePhone';
import DOB from '@salesforce/schema/Account.PersonBirthdate';
import MARITAL from '@salesforce/schema/Account.PersonMaritalStatus';
import STREET from '@salesforce/schema/Account.PersonMailingStreet';
import CITY from '@salesforce/schema/Account.PersonMailingCity';
import STATE from '@salesforce/schema/Account.PersonMailingState';
import POSTAL from '@salesforce/schema/Account.PersonMailingPostalCode';
import DEVICE from '@salesforce/schema/Account.de_Device__c';
import LOCATION from '@salesforce/schema/Account.de_Location__c';
import ACTIVE_SINCE from '@salesforce/schema/Account.de_Active_Since__c';
import LAST_ACTIVITY from '@salesforce/schema/Account.de_Last_Activity__c';
import VISIT_LEN from '@salesforce/schema/Account.de_Visit_Length_Seconds__c';
import VISIT_ACTIONS from '@salesforce/schema/Account.de_Visit_Action_Count__c';
import LAST_ACTION from '@salesforce/schema/Account.de_Last_Action__c';
import CATEGORY_VIEWED from '@salesforce/schema/Account.de_Category_Viewed__c';

const FIELDS = [CUST_TYPE, CUST_ID, USER_ID, SUB_KEY, EMAIL, PHONE, DOB, MARITAL, STREET, CITY, STATE, POSTAL,
    DEVICE, LOCATION, ACTIVE_SINCE, LAST_ACTIVITY, VISIT_LEN, VISIT_ACTIONS, LAST_ACTION, CATEGORY_VIEWED];

export default class De_HearthProfileCard extends LightningElement {
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

    get custId() {
        return getFieldValue(this.record, CUST_ID) || getFieldValue(this.record, USER_ID);
    }

    get hasCustId() {
        return !!this.custId;
    }

    fmtDate(v) {
        if (!v) return null;
        const d = new Date(v);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    ageFrom(v) {
        if (!v) return null;
        const b = new Date(v);
        const now = new Date();
        let age = now.getFullYear() - b.getFullYear();
        const m = now.getMonth() - b.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
        return age >= 0 && age < 130 ? age : null;
    }

    // Row builder. opts: { copy, chip: 'device'|'status'|'age', chipText, address, sub }
    row(label, value, icon, opts = {}) {
        if (value == null || value === '') return null;
        const chip = opts.chip || null;
        const isAddress = !!opts.address;
        const copy = !!opts.copy;
        return {
            id: label,
            label,
            value,
            icon,
            copy,
            sub: opts.sub || null,
            isAddress,
            isDevice: chip === 'device',
            isStatus: chip === 'status',
            isAge: chip === 'age',
            isPlainValue: !isAddress && !copy && !chip,
            chipText: opts.chipText || null,
            rowClass: 'row' + (isAddress ? ' address-row' : '')
        };
    }

    get addressLine1() {
        return getFieldValue(this.record, STREET);
    }

    get addressLine2() {
        const parts = [
            getFieldValue(this.record, CITY),
            getFieldValue(this.record, STATE),
            getFieldValue(this.record, POSTAL)
        ].filter((p) => p);
        return parts.length ? parts.join(', ') : null;
    }

    _sec(v) {
        return v != null ? v + ' seconds' : null;
    }

    get sections() {
        const secs = [];
        if (this.isAnonymous) {
            secs.push({
                id: 'session',
                label: 'Session',
                rows: [
                    this.row('User ID', getFieldValue(this.record, USER_ID), 'utility:user', { copy: true }),
                    this.row('Visit Length', this._sec(getFieldValue(this.record, VISIT_LEN)), 'utility:clock'),
                    this.row('Visit Actions', getFieldValue(this.record, VISIT_ACTIONS), 'utility:touch_action'),
                    this.row('Last Action', getFieldValue(this.record, LAST_ACTION), 'utility:touch_action')
                ].filter(Boolean)
            });
            secs.push({
                id: 'activity',
                label: 'Activity',
                rows: [
                    this.row('Active Since', this.fmtDate(getFieldValue(this.record, ACTIVE_SINCE)), 'utility:event'),
                    this.row('Last Activity', this.fmtDate(getFieldValue(this.record, LAST_ACTIVITY)), 'utility:recent'),
                    this.row('Category Viewed', getFieldValue(this.record, CATEGORY_VIEWED), 'utility:type_tool')
                ].filter(Boolean)
            });
            secs.push({
                id: 'platform',
                label: 'Platform',
                rows: [
                    this.row('Location', getFieldValue(this.record, LOCATION), 'utility:location'),
                    this.row('Device', getFieldValue(this.record, DEVICE), 'utility:phone_portrait', { chip: 'device' })
                ].filter(Boolean)
            });
        } else {
            secs.push({
                id: 'contact',
                label: 'Contact',
                rows: [
                    this.row('Customer ID', this.custId, 'utility:number_input', { copy: true }),
                    this.row('Phone', getFieldValue(this.record, PHONE), 'utility:call', { copy: true }),
                    this.row('Email', getFieldValue(this.record, EMAIL), 'utility:email', { copy: true })
                ].filter(Boolean)
            });
            const line1 = this.addressLine1;
            secs.push({
                id: 'location',
                label: 'Location',
                rows: [
                    this.row('City', getFieldValue(this.record, CITY), 'utility:location'),
                    line1
                        ? this.row('Address', line1, 'utility:home', { address: true, sub: this.addressLine2 })
                        : this.row('Address', this.addressLine2, 'utility:home', { address: true })
                ].filter(Boolean)
            });
            const age = this.ageFrom(getFieldValue(this.record, DOB));
            secs.push({
                id: 'personal',
                label: 'Personal',
                rows: [
                    this.row('Date of Birth', this.fmtDate(getFieldValue(this.record, DOB)), 'utility:event',
                        age != null ? { chip: 'age', chipText: age + ' yrs' } : {}),
                    this.row('Marital Status', getFieldValue(this.record, MARITAL), 'utility:heart', { chip: 'status' })
                ].filter(Boolean)
            });
            secs.push({
                id: 'platform',
                label: 'Platform',
                rows: [
                    this.row('Device', getFieldValue(this.record, DEVICE), 'utility:phone_portrait', { chip: 'device' })
                ].filter(Boolean)
            });
        }
        return secs.filter((s) => s.rows.length);
    }

    handleCopy(event) {
        const btn = event.currentTarget;
        const text = btn.dataset.copy;
        if (text && navigator.clipboard) {
            navigator.clipboard.writeText(text);
            const original = btn.textContent;
            btn.textContent = '✓';
            btn.classList.add('copied');
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                btn.textContent = original;
                btn.classList.remove('copied');
            }, 1500);
        }
    }
}
