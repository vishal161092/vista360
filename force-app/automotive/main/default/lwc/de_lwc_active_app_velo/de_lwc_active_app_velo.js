import { DEMO } from 'c/de_demoScenarios';
import { LightningElement, api } from 'lwc';
import { wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

const TARGET_RECORD_IDS = [DEMO.C8, DEMO.C3];
const RECORD_ID_THREE = DEMO.C3;

export default class DeLwcActiveAppVelo extends LightningElement {
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

    get lastUsedDateLabel() {
        return TARGET_RECORD_IDS.includes(this.effectiveRecordId) ? '10th May 2026' : '08 May 2026';
    }

    get isRecordThree() {
        return this.effectiveRecordId === RECORD_ID_THREE;
    }
}