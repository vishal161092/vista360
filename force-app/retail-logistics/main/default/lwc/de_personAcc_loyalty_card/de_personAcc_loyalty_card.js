import { LightningElement, api, wire } from 'lwc';
import getLoyaltyData from '@salesforce/apex/de_personAcc_loyalty_card_Controller.getLoyaltyData';

export default class De_personAcc_loyalty_card extends LightningElement {
    @api recordId;

    account = {};
    scheme = {};
    hasScheme = false;
    error;

    connectedCallback() {
        this.loadData();
    }

    loadData() {
        getLoyaltyData({ recordId: this.recordId })
            .then(result => {
                if (result.account) {
                    this.account = result.account;
                }
                if (result.scheme) {
                    this.scheme = result.scheme;
                    this.hasScheme = true;
                }
            })
            .catch(error => {
                this.error = error;
                console.error('de_personAcc_loyalty_card:', error);
            });
    }

    get loyaltyTier() {
        return this.account.Loyalty_Tier__c || '';
    }

    get hasTier() {
        return !!this.account.Loyalty_Tier__c;
    }

    get loyaltyPoints() {
        const pts = this.account.Loyalty_Points__c;
        return pts ? pts.toLocaleString('en-IN') : '0';
    }

    get pointsExpiry() {
        if (!this.account.Points_Expiry__c) return '';
        const d = new Date(this.account.Points_Expiry__c);
        return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }

    get hasPointsExpiry() {
        return !!this.account.Points_Expiry__c;
    }

    get lifetimeValue() {
        const v = this.account.Lifetime_Value__c;
        return v ? '₹' + v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '₹0';
    }

    get diamondAffinity() {
        const a = this.account.Diamond_Affinity__c;
        return a ? Math.round(a) + '%' : '0%';
    }

    get schemeCorpus() {
        const c = this.scheme.Corpus__c;
        return c ? '₹' + c.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '';
    }

    get schemeBonus() {
        const b = this.scheme.Bonus__c;
        return b ? '₹' + b.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '';
    }

    get schemeMaturity() {
        if (!this.scheme.Maturity_Date__c) return '';
        const d = new Date(this.scheme.Maturity_Date__c);
        return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    }

    get schemeMonthsComplete() {
        return this.scheme.Months_Complete__c || 0;
    }

    get schemeTotalMonths() {
        return 12;
    }

    get schemeProgressLabel() {
        return this.schemeMonthsComplete + ' of ' + this.schemeTotalMonths + ' months';
    }

    get schemeProgressWidth() {
        const pct = (this.schemeMonthsComplete / this.schemeTotalMonths) * 100;
        return 'width:' + Math.min(pct, 100) + '%';
    }

    get customerSince() {
        if (!this.account.Customer_Since__c) return '';
        const d = new Date(this.account.Customer_Since__c);
        return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    }

    get schemeName() {
        return this.scheme.Name || 'VISTA Accumulate';
    }
}