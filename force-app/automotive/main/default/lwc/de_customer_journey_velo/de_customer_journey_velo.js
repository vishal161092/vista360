import { DEMO } from 'c/de_demoScenarios';
import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

const RECORD_WITH_VX700_ONLY = DEMO.C4;
const RECORDS_WITH_BOTH_CARS = [DEMO.C8, DEMO.C3];

export default class DeCustomerJourneyVelo extends LightningElement {
    @api recordId;
    pageRefRecordId;

    @wire(CurrentPageReference)
    setCurrentPageReference(pageRef) {
        this.pageRefRecordId = pageRef?.state?.recordId || pageRef?.attributes?.recordId || null;
    }

    get effectiveRecordId() {
        if (this.recordId) {
            return this.recordId;
        }

        if (this.pageRefRecordId) {
            return this.pageRefRecordId;
        }

        const urlAddress = location.pathname;
        const match = urlAddress && urlAddress.match(/\/([a-zA-Z0-9]{18})[\/]?/);
        return match ? match[1] : null;
    }

    get carOptions() {
        if (this.effectiveRecordId === RECORD_WITH_VX700_ONLY) {
            return [
                { id: 'all', label: 'All', pillClass: 'pill active' },
                { id: 'vx700', label: 'VX 700', pillClass: 'pill' }
            ];
        }

        if (RECORDS_WITH_BOTH_CARS.includes(this.effectiveRecordId)) {
            return [
                { id: 'all', label: 'All', pillClass: 'pill active' },
                { id: 'vx700', label: 'VX 700', pillClass: 'pill' },
                { id: 'vx7x', label: 'VX7X', pillClass: 'pill' }
            ];
        }

        return [
            { id: 'all', label: 'All', pillClass: 'pill active' },
            { id: 'vx700', label: 'VX 700', pillClass: 'pill' },
            { id: 'vx7x', label: 'VX7X', pillClass: 'pill' }
        ];
    }
}