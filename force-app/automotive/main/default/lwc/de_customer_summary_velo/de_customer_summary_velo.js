import { DEMO } from 'c/de_demoScenarios';
import { LightningElement, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { wire } from 'lwc';
import VEHICLE_IMAGES from '@salesforce/resourceUrl/veloVehicleImages';

const TARGET_RECORD_ID = DEMO.C4;
const RECORD_ID_TWO = DEMO.C8;
const RECORD_ID_THREE = DEMO.C3;
const DEFAULT_CUSTOMER_SINCE = '21 Jan 2022';

const CUSTOMER_SINCE_BY_RECORD = {
    [TARGET_RECORD_ID]: '21 Jan 2022',
    [RECORD_ID_TWO]: '21 Jan 2022',
    [RECORD_ID_THREE]: '21 Jan 2022'
};

const CONNECTED_POINTERS_BY_RECORD = {
    [RECORD_ID_THREE]: [
        { id: 'p1', label: 'Brake Health Score', value: '62/100', tone: 'warning' },
        { id: 'p2', label: 'Signal Quality', value: 'Medium', tone: 'warning' },
        { id: 'p3', label: 'Door Status', value: 'Unlocked', tone: 'warning' },
        { id: 'p4', label: 'Remaining Charge', value: '54%', tone: 'good' },
        { id: 'p5', label: 'Power State', value: 'OFF', tone: 'warning' },
        { id: 'p6', label: 'Critical Alert', value: 'Brake maintenance predicted', tone: 'critical' }
    ]
};

const INTERACTIONS_BY_RECORD = {
    [TARGET_RECORD_ID]: [
        {
            id: 'r1-i1',
            cardTitle: 'Recent interaction with Velo Motors | Online Channel',
            channel: 'Website',
            date: '02 May 2026',
            headline: 'Customer used auto.velomotors.example 7XO webpage and tried to book the vehicle.',
            feedback: '',
            dealerDetails: 'NBS International, Andheri - Shop No: 06, Shiv Shrushti, Mahavir Nagar, Kandivali West, Mumbai - 400067',
            salesConsultant: '',
            salesContactDate: '',
            serviceAdvisor: '',
            serviceContactDate: '',
            lastInteraction: 'Last Interaction: 30 minutes ago'
        },
        {
            id: 'r1-i2',
            cardTitle: 'Last interaction with Velo Motors | Online Channel',
            channel: 'Whatsapp',
            date: '02 May 2026',
            headline: 'Read promotional Whatsapp message for VX 7X.',
            feedback: '',
            dealerDetails: '',
            salesConsultant: '',
            salesContactDate: '',
            serviceAdvisor: '',
            serviceContactDate: '',
            lastInteraction: 'Last Interaction: 2 hours ago'
        }
    ],
    [RECORD_ID_TWO]: [
        {
            id: 'r2-i1',
            cardTitle: 'Recent interaction with Velo Motors | Online Channel',
            channel: 'Website',
            date: '10 May 2026',
            headline: 'Customer used auto.velomotors.example 7XO webpage and booked the vehicle..',
            feedback: '',
            dealerDetails: 'NBS International, Andheri - Shop No: 06, Shiv Shrushti, Mahavir Nagar, Kandivali West, Mumbai - 400067',
            salesConsultant: '',
            salesContactDate: '',
            serviceAdvisor: '',
            serviceContactDate: '',
            lastInteraction: 'Last Interaction: 6 hours ago'
        },
        {
            id: 'r2-i2',
            cardTitle: 'Last interaction with Velo Motors | Online Channel',
            channel: 'Whatsapp',
            date: '08 May 2026',
            headline: 'Personalised Car configurator and booking link.',
            feedback: '',
            dealerDetails: '',
            salesConsultant: '',
            salesContactDate: '',
            serviceAdvisor: '',
            serviceContactDate: '',
            lastInteraction: 'Last Interaction: 2 days ago'
        }
    ],
    [RECORD_ID_THREE]: [
        {
            id: 'r3-i1',
            cardTitle: 'Connected Vehicle Experience | Adrenox Channel',
            channel: 'In-car alerts',
            date: '',
            headline: 'Connected vehicle telemetry indicates brake wear trend and suggests preventive braking system maintenance.',
            feedback: '',
            dealerDetails: 'NBS International, Andheri - Shop No: 06, Shiv Shrushti, Mahavir Nagar, Kandivali West, Mumbai - 400067.',
            salesConsultant: '',
            salesContactDate: '',
            serviceAdvisor: '',
            serviceContactDate: '',
            lastInteraction: ''
        }
    ]
};

export default class DeCustomerSummaryVelo extends LightningElement {
    @api recordId;
    pageRefRecordId;
    connectedVehicleImageUrl = `${VEHICLE_IMAGES}/connectedVehicle.png`;

    @wire(CurrentPageReference)
    setCurrentPageReference(pageRef) {
        this.pageRefRecordId = pageRef?.state?.recordId || pageRef?.attributes?.recordId || null;
    }

    get effectiveRecordId() {
        if (this.recordId) {
            return this.recordId;
        }

        if (this.pageRefRecordId) {
            return this.pageRefRecordId;
        }

        const urlAddress = location.pathname;
        const match = urlAddress && urlAddress.match(/\/([a-zA-Z0-9]{18})[\/]?/);
        return match ? match[1] : null;
    }

    get aiSummaryText() {
        if (this.effectiveRecordId === TARGET_RECORD_ID) {
            return 'Rahul is an existing customer with high propensity to buy VX 7X. He explored the AX7 L Turbo Petrol Automatic variant (panoramic sunroof, ADAS Level 2, dual 10.25-inch displays, connected car suite) but did not complete the booking. Engage him on the AX7 L variant benefits, provide a clear variant-level specification walkthrough, and share the configured car link to help him complete booking. Also discuss currently available financing options and EMI plans to support conversion.';
        }

        if (this.effectiveRecordId === RECORD_ID_TWO) {
            return 'Rahul is a High LTV Customer. Owns two vehicles 7XO, purchased in May and VX 700. Provide priority treatment - Focus on Premium relationship handling, proactive service updates and adrenox adoption.';
        }

        if (this.effectiveRecordId === RECORD_ID_THREE) {
            return 'Rahul is a High Priority Customer. Inform about the Brake maintenance required.  Offer to book appointment with NBS International and trigger confirmation through Whatsapp.';
        }

        return 'After test driving both the VX700 and Stallion N, the customer moved forward and booked the VX700. The customer is currently awaiting delivery of the vehicle and is excited to take ownership.';
    }

    get showMaintenanceAlert() {
        return this.effectiveRecordId === RECORD_ID_THREE;
    }

    get customerSinceText() {
        return CUSTOMER_SINCE_BY_RECORD[this.effectiveRecordId] || DEFAULT_CUSTOMER_SINCE;
    }

    get showConnectedVehicleExperience() {
        return this.effectiveRecordId === RECORD_ID_THREE;
    }

    get connectedVehiclePointers() {
        const pointers = CONNECTED_POINTERS_BY_RECORD[this.effectiveRecordId] || [];
        return pointers.map((pointer) => ({
            ...pointer,
            valueClass: `pointer-value pointer-value-${pointer.tone}`
        }));
    }

    get showConnectedGraph() {
        return this.effectiveRecordId === RECORD_ID_THREE;
    }

    get interactions() {
        const sourceInteractions = INTERACTIONS_BY_RECORD[this.effectiveRecordId] || INTERACTIONS_BY_RECORD[TARGET_RECORD_ID];
        return sourceInteractions.map((item) => ({
            ...item,
            hasChannel: this.hasValue(item.channel),
            hasDate: this.hasValue(item.date),
            hasHeadline: this.hasValue(item.headline),
            hasFeedback: this.hasValue(item.feedback),
            hasDealerDetails: this.hasValue(item.dealerDetails),
            hasSalesConsultant: this.hasValue(item.salesConsultant),
            hasSalesContactDate: this.hasValue(item.salesContactDate),
            hasServiceAdvisor: this.hasValue(item.serviceAdvisor),
            hasServiceContactDate: this.hasValue(item.serviceContactDate),
            hasLastInteraction: this.hasValue(item.lastInteraction)
        }));
    }

    hasValue(value) {
        return value !== null && value !== undefined && String(value).trim() !== '';
    }
}