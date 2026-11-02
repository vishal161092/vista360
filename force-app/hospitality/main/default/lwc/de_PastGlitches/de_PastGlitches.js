import { LightningElement, api } from 'lwc';

export default class De_PastGlitches extends LightningElement {
    @api recordId;

    get glitches() {
        return [
            { id: '1', type: 'In-room Dining Delay', status: 'Occurred yesterday', date: '2026-07-06', resolved: 'Yes' },
            { id: '2', type: 'Food Quality', status: 'Reported', date: '2025-03-15', resolved: 'Yes' },
            { id: '3', type: 'Room Key encoding failure', status: 'Reported', date: '2025-03-15', resolved: 'Yes' },
            { id: '4', type: 'Duplicate reservation entries', status: 'System', date: '2025-02-12', resolved: 'No' },
            { id: '5', type: 'Soft Mattress Unavailable', status: 'Reported', date: '2024-12-01', resolved: 'Yes' }
        ];
    }

    get glitchCount() {
        return `${this.glitches.length} items - Sorted by Glitch_type - Filtered by Status - Updated a few seconds ago`;
    }

    get formattedGlitches() {
        return this.glitches.map((g, index) => ({
            ...g,
            index: index + 1,
            resolvedClass: g.resolved === 'Yes' ? 'resolved-yes' : 'resolved-no'
        }));
    }
}