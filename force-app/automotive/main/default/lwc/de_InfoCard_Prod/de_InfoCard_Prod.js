import { DEMO } from 'c/de_demoScenarios';
import { LightningElement, api } from 'lwc';
export default class De_InfoCard_Prod_Kotak extends LightningElement {
    
@api recordId;
showComp = true;

    sales360 = false;

    accBalance = 'Rs. 2,00,00';
    avgMonthlyBal = 'Rs. 1,12,829';
    rm = 'Avinash Mehra';
    
    leadSource = 'Website';

    loanAmount = 'Rs. 7,00,000';
    tenure = '3 Years';
    emiAmount = 'Rs. 21,000';
    rate = '9.8%'
    loanStatus = 'Open';

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
        
        if(this.recordId == DEMO.C10){
            this.sales360 = true;
        }
        else {
            this.sales360 = false;
        }
    }
    
}