import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

const FIELDS = [
    'LoyaltyProgramMember.ContactId',
    'LoyaltyProgramMember.Contact.Name'
];

export default class De_memberDetailsBar extends NavigationMixin(LightningElement) {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    memberRecord;

    get contactName() {
        const name = getFieldValue(this.memberRecord.data, 'LoyaltyProgramMember.Contact.Name');
        return name || 'Rohit Menon';
    }

    get contactId() {
        return getFieldValue(this.memberRecord.data, 'LoyaltyProgramMember.ContactId');
    }

    handleContactClick(event) {
        event.preventDefault();
        if (this.contactId) {
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.contactId,
                    actionName: 'view'
                }
            });
        }
    }
}
