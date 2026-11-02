import { LightningElement, api } from 'lwc';
import getCases from '@salesforce/apex/De_CasesController.getCases';

const DUMMY_DATA = [
    {
        key: 'cas01147',
        id: 'CAS-2026-01147',
        type: 'Delivery Delay — Weather Hold',
        badge: 'Open',
        badgeClass: 'de-badge de-badge-open',
        rows: [
            { key: 'priority', label: 'Priority', value: 'High', valueClass: 'de-value de-high' },
            { key: 'assigned', label: 'Assigned To', value: 'Rohit Verma', valueClass: 'de-value' },
            { key: 'opened', label: 'Opened', value: '07 Jun 2026', valueClass: 'de-value' }
        ]
    },
    {
        key: 'cas00583',
        id: 'CAS-2026-00583',
        type: 'Damage Claim',
        badge: 'Closed',
        badgeClass: 'de-badge de-badge-closed',
        rows: [
            { key: 'claimed', label: 'Claimed', value: '₹ 72,000', valueClass: 'de-value' },
            { key: 'approved', label: 'Approved', value: '₹ 58,500', valueClass: 'de-value' },
            { key: 'settled', label: 'Settled', value: '12 May 2026', valueClass: 'de-value' },
            { key: 'deduction', label: 'Deduction', value: 'Packaging non-compliance', valueClass: 'de-value' }
        ]
    }
];

export default class De_cases extends LightningElement {
    @api recordId;
    @api useLiveData = false;

    cases = [];

    connectedCallback() {
        if (this.useLiveData) {
            this.loadLiveData();
        } else {
            this.cases = DUMMY_DATA;
        }
ghtningElement, api } from 'lwc';
import getCases from '@salesforce/apex/De_CasesController.getCases';

const DUMMY_DATA = [
    {
        key: 'cas01147',
        id: 'CAS-2026-01147',
        type: 'Delivery Delay — Weather Hold',
        badge: 'Open',
        badgeClass: 'de-badge de-badge-open',
        rows: [
            { key: 'priority', label: 'Priority', value: 'High', valueClass: 'de-value de-high' },
            { key: 'assigned', label: 'Assigned To', value: 'Rohit Verma', valueClass: 'de-value' },
            { key: 'opened', label: 'Opened', value: '07 Jun 2026', valueClass: 'de-value' }
        ]
    },
    {
        key: 'cas00583',
        id: 'CAS-2026-00583',
        type: 'Damage Claim',
        badge: 'Closed',
        badgeClass: 'de-badge de-badge-closed',
        rows: [
            { key: 'claimed', label: 'Claimed', value: '₹ 72,000', valueClass: 'de-value' },
            { key: 'approved', label: 'Approved', value: '₹ 58,500', valueClass: 'de-value' },
            { key: 'settled', label: 'Settled', value: '12 May 2026', valueClass: 'de-value' },
            { key: 'deduction', label: 'Deduction', value: 'Packaging non-compliance', valueClass: 'de-value' }
        ]
    }
];

export default class De_cases extends LightningElement {
    @api recordId;
    @api useLiveData = false;

    cases = [];

    connectedCallback() {
        if (this.useLiveData) {
            this.loadLiveData();
        } else {
            this.cases = DUMMY_DATA;
        }
    }

    loadLiveData() {
        if (!this.recordId) {
            this.cases = [];
            return;
        }
        getCases({ recordId: this.recordId })
            .then(result => {
                this.cases = result && result.length > 0 ? result : [];
            })
            .catch(() => {
                this.cases = [];
            });
    }
}
