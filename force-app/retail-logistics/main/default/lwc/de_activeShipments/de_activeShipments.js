import { LightningElement, api } from 'lwc';
import getActiveOrders from '@salesforce/apex/De_ActiveShipmentsController.getActiveOrders';

const DUMMY_DATA = {
    Logistics: [
        {
            key: 'sfx07214',
            id: 'SFX-2026-07214',
            route: 'Surat → Delhi',
            service: 'Express Surface',
            amount: '₹ 31,200',
            status: 'Pickup Scheduled — 9 Jun 2026',
            statusClass: 'de-status de-warn',
            dotClass: 'de-dot de-dot-warn'
        },
        {
            key: 'sfx06891',
            id: 'SFX-2026-06891',
            route: 'Surat → Kolkata',
            service: 'SafeAir',
            amount: '₹ 24,800',
            status: 'On Hold — Weather Delay (Howrah Hub)',
            statusClass: 'de-status de-danger',
            dotClass: 'de-dot de-dot-danger'
        }
    ],
    Eyecare: [
        {
            key: 'tep4821a',
            id: 'TEP-2026-04821',
            route: 'Connaught Place Store',
            service: 'Frame Dispatch',
            amount: '₹ 12,400',
            status: 'Dispatched — Arriving 24 Jul 2026',
            statusClass: 'de-status de-success',
            dotClass: 'de-dot de-dot-success'
        },
        {
            key: 'tep4821b',
            id: 'TEP-2026-04899',
            route: 'Lens Lab → CP Store',
            service: 'Crizal Sapphire UV',
            amount: '₹ 9,800',
            status: 'In Production — Ready by 25 Jul',
            statusClass: 'de-status de-warn',
            dotClass: 'de-dot de-dot-warn'
        }
    ]
};

export default class De_activeShipments extends LightningElement {
    @api recordId;
    @api useLiveData = false;
    @api industry = 'Logistics';

    shipments = [];

    connectedCallback() {
        if (this.useLiveData) {
            this.loadLiveData();
        } else {
            const data = DUMMY_DATA[this.industry] || DUMMY_DATA.Logistics;
            this.shipments = data;
        }
ghtningElement, api } from 'lwc';
import getActiveOrders from '@salesforce/apex/De_ActiveShipmentsController.getActiveOrders';

const DUMMY_DATA = {
    Logistics: [
        {
            key: 'sfx07214',
            id: 'SFX-2026-07214',
            route: 'Surat → Delhi',
            service: 'Express Surface',
            amount: '₹ 31,200',
            status: 'Pickup Scheduled — 9 Jun 2026',
            statusClass: 'de-status de-warn',
            dotClass: 'de-dot de-dot-warn'
        },
        {
            key: 'sfx06891',
            id: 'SFX-2026-06891',
            route: 'Surat → Kolkata',
            service: 'SafeAir',
            amount: '₹ 24,800',
            status: 'On Hold — Weather Delay (Howrah Hub)',
            statusClass: 'de-status de-danger',
            dotClass: 'de-dot de-dot-danger'
        }
    ],
    Eyecare: [
        {
            key: 'tep4821a',
            id: 'TEP-2026-04821',
            route: 'Connaught Place Store',
            service: 'Frame Dispatch',
            amount: '₹ 12,400',
            status: 'Dispatched — Arriving 24 Jul 2026',
            statusClass: 'de-status de-success',
            dotClass: 'de-dot de-dot-success'
        },
        {
            key: 'tep4821b',
            id: 'TEP-2026-04899',
            route: 'Lens Lab → CP Store',
            service: 'Crizal Sapphire UV',
            amount: '₹ 9,800',
            status: 'In Production — Ready by 25 Jul',
            statusClass: 'de-status de-warn',
            dotClass: 'de-dot de-dot-warn'
        }
    ]
};

export default class De_activeShipments extends LightningElement {
    @api recordId;
    @api useLiveData = false;
    @api industry = 'Logistics';

    shipments = [];

    connectedCallback() {
        if (this.useLiveData) {
            this.loadLiveData();
        } else {
            const data = DUMMY_DATA[this.industry] || DUMMY_DATA.Logistics;
            this.shipments = data;
        }
    }

    loadLiveData() {
        if (!this.recordId) {
            this.shipments = [];
            return;
        }
        getActiveOrders({ recordId: this.recordId })
            .then(result => {
                this.shipments = result && result.length > 0 ? result : [];
            })
            .catch(() => {
                this.shipments = [];
            });
    }
}
