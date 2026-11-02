import VEHICLE_IMAGES from '@salesforce/resourceUrl/veloVehicleImages';
import { DEMO } from 'c/de_demoScenarios';
import { LightningElement, api } from 'lwc';
export default class De_info_Banner_Service extends LightningElement {

    @api recordId;

    showComp = true;
    showVal = true;

    showInsight = true;
    showCustomer = false;

    showCust1 = true;
    showCust2 = true;

    addPV = true;
    wteVal = false;

    connectedCallback() {
        
        const URLaddress = location.pathname;
            console.log('URLaddress>> '+URLaddress);
            if (URLaddress) {
                const match = URLaddress.match(/\/([a-zA-Z0-9]{18})[\/]?/);
                if (match) {
                    this.recordId = match[1];
                }
                console.log('recordId>> '+this.recordId);
        }

        if(this.recordId == DEMO.C1){
            this.showComp = false;

        }
        if(this.recordId == DEMO.C2){
            this.showVal = false;
        }
        if(this.recordId == DEMO.C3){
            this.showComp = true;
            this.showInsight = false;
            this.showCustomer = true;
            this.showVal = true;
        }
        if(this.recordId == DEMO.C4){
            this.showComp = true;
            this.showInsight = false;
            this.showCustomer = true;
            this.showVal = false;
        }
        if(this.recordId == DEMO.C5){
            this.showComp = true;
            this.showInsight = false;
            this.showCustomer = true;
            this.showVal = true;
            this.addPV = false;
        }
        if(this.recordId == DEMO.C6){
            this.showComp = true;
            this.showInsight = false;
            this.showCustomer = true;
            this.showVal = true;
        }
        if(this.recordId == DEMO.C7){
            this.showComp = true;
            this.showInsight = true;
            this.showCustomer = false;
            this.showVal = true;
            this.wteVal = true;
        }

    }

    get behaviourImageUrl() {
        return `${VEHICLE_IMAGES}/behaviour.png`;
    }

    get bannerImageUrl() {
        return `${VEHICLE_IMAGES}/banner.png`;
    }
}
