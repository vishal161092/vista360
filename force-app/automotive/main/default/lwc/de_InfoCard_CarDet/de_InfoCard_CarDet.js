import VEHICLE_IMAGES from '@salesforce/resourceUrl/veloVehicleImages';
import { DEMO } from 'c/de_demoScenarios';
import { LightningElement, api} from 'lwc';
export default class De_InfoCard_CarDet extends LightningElement {
 productName = '8/12/2024';
    loanAmount = 'Rs. 21,000';
    tenure = '2';
    monthlyEMI = '10/12/2024';
    interestRate = 'Excellent';
    loanStatus = 'No';

    @api recordId;

    showComp = true;
    extraPV = true;

    wteCheck = false;
    showRecentPurchase = false;

    connectedCallback() {
        
        // Prefer platform-provided recordId; fallback to URL parsing only when missing.
        if (!this.recordId) {
            const URLaddress = location.pathname;
            console.log('URLaddress>> '+URLaddress);
            if (URLaddress) {
                const match = URLaddress.match(/\/([a-zA-Z0-9]{18})[\/]?/);
                if (match) {
                    this.recordId = match[1];
                }
            }
        }
        console.log('recordId>> '+this.recordId);

        if(this.recordId == DEMO.C3){
            this.showComp = false;
        }
        if(this.recordId == DEMO.C4){
            this.showComp = false;
        }
        if(this.recordId == DEMO.C7){
            this.showComp = false;
            this.wteCheck = true; 
        }
        if(this.recordId == DEMO.C5){
            this.extraPV = false;
        }
        if(this.recordId == DEMO.C6){
            this.extraPV = false;
        }
        if(this.recordId == DEMO.C8 || this.recordId == DEMO.C3){
            this.showRecentPurchase = true;
            this.showComp = false;
        }

    }

    get vx7xImageUrl() {
        return `${VEHICLE_IMAGES}/vx7x.png`;
    }

    get vx700ImageUrl() {
        return `${VEHICLE_IMAGES}/vx700.png`;
    }
}
