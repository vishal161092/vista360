import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getTransactions from '@salesforce/apex/DE_TransactionController.getTransactions';

export default class De_recentTransactions extends NavigationMixin(LightningElement) {
    _recordId;
    transactions = [];
    error;

    @api
    get recordId() {
        return this._recordId;
    }
    set recordId(value) {
        this._recordId = value;
        if (value) {
            this.loadTransactions();
        }
    }

    loadTransactions() {
        getTransactions({ memberId: this._recordId })
            .then(data => {
                this.error = undefined;
                this.transactions = data.map(txn => {
                    let productName = '—';
                    if (txn.Product && txn.Product.Name) {
                        productName = txn.Product.Name.replace('Brightwall Paint ', '');
                    }
                    const qty = txn.Quantity != null ? String(Math.round(txn.Quantity)) : '—';
                    const points = txn.Quantity != null ? String(Math.round(txn.Quantity) * 20) : '0';
                    return {
                        id: txn.Id,
                        date: this.formatDate(txn.JournalDate),
                        invoiceNo: txn.Name,
                        product: productName,
                        quantity: qty,
                        points: points
                    };
                });
            })
            .catch(err => {
                this.error = err;
                this.transactions = [];
            });
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }

    handleViewAll(event) {
        event.preventDefault();
    }

    handleInvoiceClick(event) {
        event.preventDefault();
        const txnId = event.target.dataset.id;
        if (txnId) {
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: txnId,
                    actionName: 'view'
                }
            });
        }
    }

    handleViewAllTransactions(event) {
        event.preventDefault();
        this[NavigationMixin.Navigate]({
            type: 'standard__relatedList',
            attributes: {
                recordId: this._recordId,
                objectApiName: 'LoyaltyProgramMember',
                relationshipApiName: 'TransactionJournals'
            }
        });
    }
}
