import { LightningElement, api } from 'lwc';
import getServiceAppointments from '@salesforce/apex/De_ServiceAppointmentsController.getServiceAppointments';

const DUMMY_DATA = [
    {
        key: 'sa001',
        id: 'SA-2026-04821',
        route: 'Eye Check-up — Progressive Lens Fitting',
        service: 'In-Store',
        amount: '24 Jul 2026, 10:30 AM',
        status: 'Scheduled',
        statusClass: 'de-status de-warn',
        dotClass: 'de-dot de-dot-warn'
    },
    {
        key: 'sa002',
        id: 'SA-2026-04790',
        route: 'Frame Adjustment & Cleaning',
        service: 'Walk-In',
        amount: '22 Jul 2026, 3:00 PM',
        status: 'In Progress',
        statusClass: 'de-status de-success',
        dotClass: 'de-dot de-dot-success'
    }
];

export default class De_serviceAppointments extends LightningElement {
    @api recordId;
    @api useLiveData = false;

    appointments = [];

    connectedCallback() {
        if (this.useLiveData) {
            this.loadLiveData();
        } else {
            this.appointments = DUMMY_DATA;
        }
ghtningElement, api } from 'lwc';
import getServiceAppointments from '@salesforce/apex/De_ServiceAppointmentsController.getServiceAppointments';

const DUMMY_DATA = [
    {
        key: 'sa001',
        id: 'SA-2026-04821',
        route: 'Eye Check-up — Progressive Lens Fitting',
        service: 'In-Store',
        amount: '24 Jul 2026, 10:30 AM',
        status: 'Scheduled',
        statusClass: 'de-status de-warn',
        dotClass: 'de-dot de-dot-warn'
    },
    {
        key: 'sa002',
        id: 'SA-2026-04790',
        route: 'Frame Adjustment & Cleaning',
        service: 'Walk-In',
        amount: '22 Jul 2026, 3:00 PM',
        status: 'In Progress',
        statusClass: 'de-status de-success',
        dotClass: 'de-dot de-dot-success'
    }
];

export default class De_serviceAppointments extends LightningElement {
    @api recordId;
    @api useLiveData = false;

    appointments = [];

    connectedCallback() {
        if (this.useLiveData) {
            this.loadLiveData();
        } else {
            this.appointments = DUMMY_DATA;
        }
    }

    loadLiveData() {
        if (!this.recordId) {
            this.appointments = [];
            return;
        }
        getServiceAppointments({ recordId: this.recordId })
            .then(result => {
                this.appointments = result && result.length > 0 ? result : [];
            })
            .catch(() => {
                this.appointments = [];
            });
    }
}
