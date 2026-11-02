import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

const FIELDS = [
    'LoyaltyProgramMember.ProgramId',
    'LoyaltyProgramMember.Program.Name'
];

export default class De_enrollmentEligibility extends NavigationMixin(LightningElement) {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    memberRecord;

    get programName() {
        const name = getFieldValue(this.memberRecord.data, 'LoyaltyProgramMember.Program.Name');
        return name || 'Brightwall Decorative Painters Program';
    }

    get programId() {
        return getFieldValue(this.memberRecord.data, 'LoyaltyProgramMember.ProgramId');
    }

    handleProgramClick(event) {
        event.preventDefault();
        if (this.programId) {
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.programId,
                    actionName: 'view'
                }
            });
        }
    }
}
