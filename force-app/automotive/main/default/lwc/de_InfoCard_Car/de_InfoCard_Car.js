import { DEMO } from 'c/de_demoScenarios';
import { LightningElement, api} from 'lwc';
export default class De_InfoCard_Car extends LightningElement {
 productName = '8/12/2024';
    loanAmount = 'Rs. 21,000';
    tenure = '2';
    monthlyEMI = '10/12/2024';
    interestRate = 'Excellent';
    loanStatus = 'No';

    @api recordId;

    showComp = true;
    extraPV = true;

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
            this.showComp = false;
        }
        if(this.recordId == DEMO.C5){
            this.extraPV = false;
        }
        if(this.recordId == DEMO.C6){
            this.extraPV = false;
        }

    }

}