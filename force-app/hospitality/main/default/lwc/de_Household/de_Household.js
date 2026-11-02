import { LightningElement, api } from 'lwc';

export default class De_Household extends LightningElement {
    @api recordId;

    get members() {
        return [
            { id: '1', name: 'Priya Gupta', relation: 'Spouse', initial: 'PG', age: '34', preference: 'Spa & Wellness', loyalty: 'Gold' },
            { id: '2', name: 'Arjun Gupta', relation: 'Son', initial: 'AG', age: '8', preference: 'Kids Activity Club', loyalty: '-' },
            { id: '3', name: 'Kavya Gupta', relation: 'Daughter', initial: 'KG', age: '5', preference: 'Pool & Playtime', loyalty: '-' }
        ];
    }

    get memberCount() {
        return this.members.length;
    }
}