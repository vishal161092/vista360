import { LightningElement, api } from 'lwc';

const DATA = {
    Logistics: {
        heading: 'Weavewell Textiles — Logistics Snapshot (FY 2026)',
        metrics: [
            { key: 'value', label: 'Monthly Shipment Value', value: '₹ 38.4 L', delta: '+14.2% MoM', deltaClass: 'de-delta de-pos' },
            { key: 'routes', label: 'Active Routes', value: '6 Routes', delta: '+2 New Routes', deltaClass: 'de-delta de-pos' },
            { key: 'claim', label: 'Damage Claim Rate', value: '3.2%', delta: '-0.8 pts', deltaClass: 'de-delta de-pos' },
            { key: 'ontime', label: 'On-Time Delivery', value: '91.4%', delta: '+2.1 pts', deltaClass: 'de-delta de-pos' }
        ],
        tableTitle: 'Top Shipping Corridors',
        tableHeaders: { col1: 'Route', col2: 'Volume', col3: 'Service', col4: 'SLA' },
        corridors: [
            { key: 'delhi', route: 'Surat → Delhi', volume: '38%', service: 'Express Surface', sla: '4-5 days' },
            { key: 'mumbai', route: 'Surat → Mumbai', volume: '27%', service: 'Express Surface', sla: '2-3 days' },
            { key: 'bangalore', route: 'Surat → Bangalore', volume: '19%', service: 'Express Surface', sla: '4-5 days' },
            { key: 'kolkata', route: 'Surat → Kolkata', volume: '16%', service: 'SafeAir', sla: '24-48 hrs' }
        ],
        mixTitle: 'Service Mix',
        serviceMix: [
            { key: 'surface', label: 'Express Surface', value: '72%', style: 'width:72%' },
            { key: 'air', label: 'SafeAir (Express Air)', value: '18%', style: 'width:18%' },
            { key: 'easy', label: 'Easy2Move', value: '10%', style: 'width:10%' }
        ],
        recommendations: [
            { key: 'rec1', text: 'Upsell SafeAir on Surat–Kolkata corridor for festival season — SLA compliance critical for retailer commitments.' },
            { key: 'rec2', text: 'Offer enhanced insurance (1.5% premium) for high-value silk & embroidery shipments — reduces claim disputes.' },
            { key: 'rec3', text: 'Propose Stock2Shelf service for direct-to-retail delivery in Delhi NCR — new revenue opportunity.' }
        ]
    },
    Eyecare: {
        heading: 'Aakash Gupta — Clearview Eyecare Vision Profile (Gold Member)',
        metrics: [
            { key: 'ltv', label: 'Lifetime Spend', value: '₹ 1.08 L', delta: '+22% YoY', deltaClass: 'de-delta de-pos' },
            { key: 'visits', label: 'Store Visits (12M)', value: '5 Visits', delta: 'Connaught Place', deltaClass: 'de-delta de-pos' },
            { key: 'power', label: 'Current Power (R/L)', value: '-2.25 / -2.50', delta: 'Stable (6M)', deltaClass: 'de-delta de-pos' },
            { key: 'service', label: 'Next Service Due', value: 'This Week', delta: '6-month complimentary', deltaClass: 'de-delta de-warn' }
        ],
        tableTitle: 'Purchase & Service History',
        tableHeaders: { col1: 'Item', col2: 'Date', col3: 'Category', col4: 'Value' },
        corridors: [
            { key: 'frame', route: 'Rimless Alloy Frame', volume: 'Jan 2026', service: 'Frames', sla: '₹ 12,400' },
            { key: 'lens', route: 'Crizal Sapphire UV Lenses', volume: 'Jan 2026', service: 'Lenses', sla: '₹ 9,800' },
            { key: 'exam', route: 'Comprehensive Eye Exam', volume: 'Jan 2026', service: 'Service', sla: 'Complimentary' },
            { key: 'sun', route: 'Swiftline Polarized Aviators', volume: 'Oct 2025', service: 'Sunglasses', sla: '₹ 3,290' }
        ],
        mixTitle: 'Engagement Breakdown',
        serviceMix: [
            { key: 'frames', label: 'Frames & Lenses', value: '65%', style: 'width:65%' },
            { key: 'service', label: 'Service Appointments', value: '20%', style: 'width:20%' },
            { key: 'sun', label: 'Sunglasses & Accessories', value: '15%', style: 'width:15%' }
        ],
        recommendations: [
            { key: 'rec1', text: 'Complimentary 6-month spectacle service is due — includes cleaning, frame alignment, screw & nose pad check, and lens inspection (~20 min).' },
            { key: 'rec2', text: 'Suggest Transitions XTRActive add-on — Aakash purchased polarized sunglasses recently, indicating light-sensitivity needs.' },
            { key: 'rec3', text: 'Introduce VISTA savings scheme (₹5,000/mo × 11 = ₹55,000 + ₹5,000 bonus) — ideal timing ahead of next lens upgrade cycle.' }
        ]
    }
};

export default class De_analyticsSnapshot extends LightningElement {
    @api industry = 'Logistics';

    get heading() { return this.currentData.heading; }
    get metrics() { return this.currentData.metrics; }
    get tableTitle() { return this.currentData.tableTitle; }
    get tableHeaders() { return this.currentData.tableHeaders; }
    get corridors() { return this.currentData.corridors; }
    get mixTitle() { return this.currentData.mixTitle; }
    get serviceMix() { return this.currentData.serviceMix; }
    get recommendations() { return this.currentData.recommendations; }

    get currentData() {
        return DATA[this.industry] || DATA.Logistics;
    }

    connectedCallback() {
ghtningElement, api } from 'lwc';

const DATA = {
    Logistics: {
        heading: 'Weavewell Textiles — Logistics Snapshot (FY 2026)',
        metrics: [
            { key: 'value', label: 'Monthly Shipment Value', value: '₹ 38.4 L', delta: '+14.2% MoM', deltaClass: 'de-delta de-pos' },
            { key: 'routes', label: 'Active Routes', value: '6 Routes', delta: '+2 New Routes', deltaClass: 'de-delta de-pos' },
            { key: 'claim', label: 'Damage Claim Rate', value: '3.2%', delta: '-0.8 pts', deltaClass: 'de-delta de-pos' },
            { key: 'ontime', label: 'On-Time Delivery', value: '91.4%', delta: '+2.1 pts', deltaClass: 'de-delta de-pos' }
        ],
        tableTitle: 'Top Shipping Corridors',
        tableHeaders: { col1: 'Route', col2: 'Volume', col3: 'Service', col4: 'SLA' },
        corridors: [
            { key: 'delhi', route: 'Surat → Delhi', volume: '38%', service: 'Express Surface', sla: '4-5 days' },
            { key: 'mumbai', route: 'Surat → Mumbai', volume: '27%', service: 'Express Surface', sla: '2-3 days' },
            { key: 'bangalore', route: 'Surat → Bangalore', volume: '19%', service: 'Express Surface', sla: '4-5 days' },
            { key: 'kolkata', route: 'Surat → Kolkata', volume: '16%', service: 'SafeAir', sla: '24-48 hrs' }
        ],
        mixTitle: 'Service Mix',
        serviceMix: [
            { key: 'surface', label: 'Express Surface', value: '72%', style: 'width:72%' },
            { key: 'air', label: 'SafeAir (Express Air)', value: '18%', style: 'width:18%' },
            { key: 'easy', label: 'Easy2Move', value: '10%', style: 'width:10%' }
        ],
        recommendations: [
            { key: 'rec1', text: 'Upsell SafeAir on Surat–Kolkata corridor for festival season — SLA compliance critical for retailer commitments.' },
            { key: 'rec2', text: 'Offer enhanced insurance (1.5% premium) for high-value silk & embroidery shipments — reduces claim disputes.' },
            { key: 'rec3', text: 'Propose Stock2Shelf service for direct-to-retail delivery in Delhi NCR — new revenue opportunity.' }
        ]
    },
    Eyecare: {
        heading: 'Aakash Gupta — Clearview Eyecare Vision Profile (Gold Member)',
        metrics: [
            { key: 'ltv', label: 'Lifetime Spend', value: '₹ 1.08 L', delta: '+22% YoY', deltaClass: 'de-delta de-pos' },
            { key: 'visits', label: 'Store Visits (12M)', value: '5 Visits', delta: 'Connaught Place', deltaClass: 'de-delta de-pos' },
            { key: 'power', label: 'Current Power (R/L)', value: '-2.25 / -2.50', delta: 'Stable (6M)', deltaClass: 'de-delta de-pos' },
            { key: 'service', label: 'Next Service Due', value: 'This Week', delta: '6-month complimentary', deltaClass: 'de-delta de-warn' }
        ],
        tableTitle: 'Purchase & Service History',
        tableHeaders: { col1: 'Item', col2: 'Date', col3: 'Category', col4: 'Value' },
        corridors: [
            { key: 'frame', route: 'Rimless Alloy Frame', volume: 'Jan 2026', service: 'Frames', sla: '₹ 12,400' },
            { key: 'lens', route: 'Crizal Sapphire UV Lenses', volume: 'Jan 2026', service: 'Lenses', sla: '₹ 9,800' },
            { key: 'exam', route: 'Comprehensive Eye Exam', volume: 'Jan 2026', service: 'Service', sla: 'Complimentary' },
            { key: 'sun', route: 'Swiftline Polarized Aviators', volume: 'Oct 2025', service: 'Sunglasses', sla: '₹ 3,290' }
        ],
        mixTitle: 'Engagement Breakdown',
        serviceMix: [
            { key: 'frames', label: 'Frames & Lenses', value: '65%', style: 'width:65%' },
            { key: 'service', label: 'Service Appointments', value: '20%', style: 'width:20%' },
            { key: 'sun', label: 'Sunglasses & Accessories', value: '15%', style: 'width:15%' }
        ],
        recommendations: [
            { key: 'rec1', text: 'Complimentary 6-month spectacle service is due — includes cleaning, frame alignment, screw & nose pad check, and lens inspection (~20 min).' },
            { key: 'rec2', text: 'Suggest Transitions XTRActive add-on — Aakash purchased polarized sunglasses recently, indicating light-sensitivity needs.' },
            { key: 'rec3', text: 'Introduce VISTA savings scheme (₹5,000/mo × 11 = ₹55,000 + ₹5,000 bonus) — ideal timing ahead of next lens upgrade cycle.' }
        ]
    }
};

export default class De_analyticsSnapshot extends LightningElement {
    @api industry = 'Logistics';

    get heading() { return this.currentData.heading; }
    get metrics() { return this.currentData.metrics; }
    get tableTitle() { return this.currentData.tableTitle; }
    get tableHeaders() { return this.currentData.tableHeaders; }
    get corridors() { return this.currentData.corridors; }
    get mixTitle() { return this.currentData.mixTitle; }
    get serviceMix() { return this.currentData.serviceMix; }
    get recommendations() { return this.currentData.recommendations; }

    get currentData() {
        return DATA[this.industry] || DATA.Logistics;
    }

}
