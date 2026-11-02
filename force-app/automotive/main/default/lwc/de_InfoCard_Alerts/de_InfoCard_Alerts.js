import { DEMO } from 'c/de_demoScenarios';
import { LightningElement, api } from 'lwc';
export default class De_InfoCard_Alerts extends LightningElement {

    _recordId;
    @api
    get recordId() {
        return this._recordId;
    }
    set recordId(value) {
        this._recordId = value;
        this.evaluateRecordState();
    }

    showComp = true;

    showInsight = true;
    showCustomer = false;
    extraPV = true;
    cust1 = false;
    cust2 = false;
    customerServiceAlertText = 'First service due in 60 days';

    connectedCallback() {
        // Fallback for contexts where recordId is not passed as @api.
        if (!this.recordId) {
            const URLaddress = location.pathname;
            console.log('URLaddress>> '+URLaddress);
            if (URLaddress) {
                const match = URLaddress.match(/\/([a-zA-Z0-9]{18})[\/]?/);
                if (match) {
                    this._recordId = match[1];
                }
            }
        }
        this.evaluateRecordState();
    }

    resetViewState() {
        this.showComp = true;
        this.showInsight = true;
        this.showCustomer = false;
        this.extraPV = true;
        this.cust1 = false;
        this.cust2 = false;
        this.customerServiceAlertText = 'First service due in 60 days';
    }

    evaluateRecordState() {
        this.resetViewState();
        console.log('recordId>> '+this.recordId);

        if(this.recordId == DEMO.C1){
            this.showComp = false;
        }
        if(this.recordId == DEMO.C2){
            this.showComp = false;
        }

        if(this.recordId == DEMO.C3){
            this.showInsight = false;
            this.showCustomer = true;
            this.cust1 = true;
            this.cust2 = false;
            this.customerServiceAlertText = 'System predicted maintenance of braking is needed!!!!';
        }

        if(this.recordId == DEMO.C4){
            this.showInsight = false;
            this.showCustomer = true;
            this.cust1 = false;
            this.cust2 = true;
        }

        if(this.recordId == DEMO.C8){
            this.showInsight = false;
            this.showCustomer = true;
            this.cust1 = false;
            this.cust2 = true;
        }

        if(this.recordId == DEMO.C7){
            this.showInsight = false;
            this.showCustomer = true;
            this.cust1 = false;
            this.cust2 = true;
        }
        if(this.recordId == DEMO.C5){
            this.extraPV = false;
        }
        if(this.recordId == DEMO.C6){
            this.extraPV = false;
        }
    }

}