import { LightningElement } from 'lwc';

export default class De_velo_sales_dashboard extends LightningElement {
    lastUpdated = '15 May 2026, 10:45 AM';

    etbrData = [
        { label: 'Enquiry', value: '9,271,757' },
        { label: 'Test Drive', value: '3,888,216' },
        { label: 'Booking', value: '1,962,883' },
        { label: 'Retail', value: '1,177,400' }
    ];

    channelData = [
        { id: '1', channel: 'Walk-in', total: '542,863', items: [
            { source: 'Newspaper', count: '292,894', pct: 54 },
            { source: 'Television', count: '107,589', pct: 20 },
            { source: 'Workshop Promoter', count: '66,192', pct: 12 },
            { source: 'Hoarding', count: '40,770', pct: 8 },
            { source: 'Outbound Calling', count: '16,336', pct: 3 }
        ]},
        { id: '2', channel: 'Digital', total: '778,374', items: [
            { source: 'Hyperlocal', count: '614,729', pct: 79 },
            { source: 'Dealer Website', count: '58,708', pct: 8 },
            { source: 'External Integration', count: '43,745', pct: 6 },
            { source: 'Workshop Promoter', count: '37,106', pct: 5 },
            { source: 'Social Media', count: '16,790', pct: 2 }
        ]},
        { id: '3', channel: 'Telephonic', total: '77,892', items: [
            { source: 'Newspaper', count: '44,846', pct: 58 },
            { source: 'Television', count: '11,400', pct: 15 },
            { source: 'Outbound Calling', count: '7,581', pct: 10 },
            { source: 'Ad Campaigns', count: '3,342', pct: 4 },
            { source: 'Hoarding', count: '2,894', pct: 4 }
        ]},
        { id: '4', channel: 'Field', total: '315,408', items: [
            { source: 'Activations', count: '214,615', pct: 68 },
            { source: 'Newspaper', count: '26,375', pct: 8 },
            { source: 'Outbound Calling', count: '19,887', pct: 6 },
            { source: 'Hoarding', count: '14,187', pct: 5 },
            { source: 'Mitra', count: '12,378', pct: 4 }
        ]}
    ];

    kpiCards = [
        { id: '1', label: 'Total Enquiries', value: '9.27M', change: '+2.7%', trend: 'up', period: 'vs Last Month' },
        { id: '2', label: 'Total Bookings', value: '1.96M', change: '+4.1%', trend: 'up', period: 'vs Last Month' },
        { id: '3', label: 'Total Retail', value: '1.18M', change: '+1.8%', trend: 'up', period: 'vs Last Month' },
        { id: '4', label: 'Digital Enquiries', value: '774K', change: '-95.1%', trend: 'down', period: 'YoY' }
    ];
}
