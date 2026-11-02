import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import CUST_TYPE from '@salesforce/schema/Account.de_Customer_Type__c';

const FIELDS = [CUST_TYPE];

export default class De_Hearth360 extends LightningElement {
    @api recordId;
    record;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ data }) {
        if (data) {
            this.record = data;
        }
    }

    get customerType() {
        return getFieldValue(this.record, CUST_TYPE);
    }

    get isAnonymous() {
        return this.customerType === 'Anonymous';
    }

    // Known & Omnichannel customers get the richer layout.
    get isKnown() {
        return this.customerType && this.customerType !== 'Anonymous';
    }
}
