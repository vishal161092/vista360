import { LightningElement } from 'lwc';

export default class De_Infocard extends LightningElement {
    get profileSummary() {
        return [
            { id: '1', icon: 'utility:travel_and_places', label: 'Guest Type', value: 'Business Traveller' },
            { id: '2', icon: 'utility:favorite', label: 'Value Segment', value: 'High Value' },
            { id: '3', icon: 'utility:activity', label: 'Total Stays', value: '13' },
            { id: '4', icon: 'utility:trending', label: 'Avg Spend/Stay', value: '₹14,230' },
            { id: '5', icon: 'utility:location', label: 'Top City', value: 'Mumbai' },
            { id: '6', icon: 'utility:date_input', label: 'Member Since', value: '2022' }
        ];
    }
}