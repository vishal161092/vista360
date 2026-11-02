import VEHICLE_IMAGES from '@salesforce/resourceUrl/veloVehicleImages';
import { DEMO } from 'c/de_demoScenarios';
import { LightningElement, api } from 'lwc';

const VEHICLE_TAB_DATA = {
    vx7x: {
        offers: ['New Vehicle Health Checkup', 'Accessories Pack Offer', 'Free 1st Service'],
        complaints: [
            {
                id: 1,
                area: 'Pre-Delivery',
                status: 'Open',
                date: '16 May 2026',
                description: 'Requested delivery kit clarification and additional vehicle orientation support.',
                reference: 'NX70011',
                dealer: 'NBS International, Andheri',
                source: 'Delivery Desk',
                assignedTo: 'Rohit Mehta'
            },
            {
                id: 2,
                area: 'Registration',
                status: 'Closed',
                date: '14 May 2026',
                description: 'Temporary plate update was raised and resolved by dealership.',
                reference: 'NX70008',
                dealer: 'NBS International, Andheri',
                source: 'Dealer Support',
                assignedTo: 'Sneha Kulkarni'
            }
        ],
        feedback: [
            { id: 1, area: 'Booking', rating: '4.9/5', date: '18 Apr 2026', text: 'Booking experience was smooth and updates were shared proactively.' },
            { id: 2, area: 'Delivery', rating: '4.8/5', date: '25 Apr 2026', text: 'Delivery walkthrough was detailed and the team explained all new features clearly.' },
            { id: 3, area: 'Test Drive', rating: '4.7/5', date: '10 Apr 2026', text: 'Vehicle performance and comfort felt excellent during city test drive.' }
        ],
        sentiments: [
            { year: '2023-24', score: '4.1', positive: 58, neutral: 30, negative: 12 },
            { year: '2024-25', score: '4.4', positive: 70, neutral: 22, negative: 8 },
            { year: '2025-26', score: '4.7', positive: 80, neutral: 15, negative: 5 }
        ]
    },
    vx700: {
        offers: ['Free Vehicle Health Checkup', 'Spares Offer', 'Paid Service Offer'],
        complaints: [
            {
                id: 1,
                area: 'Service',
                status: 'Open',
                date: '23 Jun 2023',
                description: 'Services are going great in NBS I would recommend to my friends and family to service in NBS Andheri.',
                reference: 'RO234567',
                dealer: 'NBS International, Goregaon',
                source: 'Feedback form',
                assignedTo: 'Sarvesh Gupta'
            },
            {
                id: 2,
                area: 'Service',
                status: 'Closed',
                date: '8 Jan 2020',
                description: 'Post service car cleaning was not done properly.',
                reference: 'RO234566',
                dealer: 'NBS International, Goregaon',
                source: 'MRC Call Center',
                assignedTo: 'Vishal Rao'
            }
        ],
        feedback: [
            { id: 1, area: 'First Service', rating: '4.7/5', date: '23 Jun 2023', text: 'Services are going great in mega i would recommend to my friends and family to service in Mega Automobiles Ankleshwar.' },
            { id: 2, area: 'Delivery', rating: '4.3/5', date: '23 Jan 2023', text: 'Sales team and Mr Prajwal where very cooperative and helpful people overall a happy delivery experience thank you team.' },
            { id: 3, area: 'Booking', rating: '4.2/5', date: '19 Sept 2022', text: 'Very good experience and Kusuma handled the whole process smoothly and patiently.' },
            { id: 4, area: 'Test Drive', rating: '4.0/5', date: '12 Sept 2022', text: 'I visited the showroom i took test drive and demo of car explanation my overall experience was good with Velo Motors.' },
            { id: 5, area: 'Dealership Visit/Enquiry', rating: '4.0/5', date: '5 Sept 2022', text: 'Fantastic sales service and provided deep detail about car.' }
        ],
        sentiments: [
            { year: '2017-18', score: '3.2', positive: 35, neutral: 25, negative: 10 },
            { year: '2018-19', score: '2.8', positive: 25, neutral: 30, negative: 10 },
            { year: '2019-20', score: '4.3', positive: 65, neutral: 28, negative: 10 },
            { year: '2020-21', score: '4.5', positive: 75, neutral: 20, negative: 5 }
        ]
    }
};

const VX7X_IMAGE_URL = `${VEHICLE_IMAGES}/vx7x.png`;
const VX700_IMAGE_URL = `${VEHICLE_IMAGES}/vx700.png`;

const RECORDS_WITH_TWO_VEHICLES = [DEMO.C8, DEMO.C3];
const RECORD_WITH_ONLY_VX700 = DEMO.C4;

export default class DeVehicleOwnedVelo extends LightningElement {
    @api recordId;
    activeTab = 'complaints';
    expandedVehicleId = null;

    vehicles = [
        {
            id: 'vx7x',
            title: 'VX 7X',
            vin: 'MA1X7XO2024A1188',
            reg: 'MH01GX7021',
            odo: '340 KM',
            saleDate: '15 May 2026',
            dealer: 'NBS International, Andheri',
            customerName: 'Rahul Kannan',
            accountType: 'Household',
            imageUrl: VX7X_IMAGE_URL
        },
        {
            id: 'vx700',
            title: 'VX700 BS6.2- AX7 L D AT AWD',
            vin: 'MAIYL2HJUJ6D63639',
            reg: 'MH01EF5034',
            odo: '12,038 KM',
            saleDate: '21 Jan 2022',
            dealer: 'NBS International, Andheri',
            customerName: 'Rani Kumari',
            accountType: 'Spouse',
            imageUrl: VX700_IMAGE_URL
        }
    ];

    connectedCallback() {
        if (!this.recordId) {
            const urlAddress = location.pathname;
            const match = urlAddress && urlAddress.match(/\/([a-zA-Z0-9]{18})[\/]?/);
            if (match) {
                this.recordId = match[1];
            }
        }
    }

    get visibleVehicles() {
        if (this.recordId === RECORD_WITH_ONLY_VX700) {
            return this.vehicles.filter((vehicle) => vehicle.id === 'vx700');
        }

        if (RECORDS_WITH_TWO_VEHICLES.includes(this.recordId)) {
            return this.vehicles;
        }

        return this.vehicles;
    }

    get vehiclesWithExpansion() {
        return this.visibleVehicles.map((vehicle) => ({
            ...vehicle,
            isExpanded: this.expandedVehicleId === vehicle.id
        }));
    }

    get complaints() {
        return this.currentVehicleData.complaints.map((item) => ({
            ...item,
            iconClass: item.status === 'Open' ? 'timeline-icon timeline-icon-open' : 'timeline-icon timeline-icon-closed'
        }));
    }

    get feedback() {
        return this.currentVehicleData.feedback.map((item, index) => ({
            ...item,
            iconClass: index === 0 ? 'timeline-icon timeline-icon-open' : 'timeline-icon timeline-icon-closed'
        }));
    }

    get sentiments() {
        return this.currentVehicleData.sentiments.map((item) => ({
            ...item,
            positiveStyle: `height:${item.positive}%;`,
            neutralStyle: `height:${item.neutral}%;`,
            negativeStyle: `height:${item.negative}%;`
        }));
    }

    get offerButtons() {
        return this.currentVehicleData.offers;
    }

    get currentVehicleData() {
        const fallbackVehicleId = this.visibleVehicles.length ? this.visibleVehicles[0].id : 'vx700';
        const vehicleId = this.expandedVehicleId || fallbackVehicleId;
        return VEHICLE_TAB_DATA[vehicleId] || VEHICLE_TAB_DATA.vx700;
    }

    get isComplaints() {
        return this.activeTab === 'complaints';
    }

    get isFeedback() {
        return this.activeTab === 'feedback';
    }

    get isSentiment() {
        return this.activeTab === 'sentiment';
    }

    get tabClasses() {
        return {
            complaints: this.activeTab === 'complaints' ? 'tab active' : 'tab',
            feedback: this.activeTab === 'feedback' ? 'tab active' : 'tab',
            sentiment: this.activeTab === 'sentiment' ? 'tab active' : 'tab'
        };
    }

    handleToggle(event) {
        const clickedVehicleId = event.currentTarget.dataset.id;
        this.expandedVehicleId = this.expandedVehicleId === clickedVehicleId ? null : clickedVehicleId;
    }

    handleTabChange(event) {
        this.activeTab = event.currentTarget.dataset.tab;
    }
}