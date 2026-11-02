import { LightningElement } from 'lwc';

export default class De_InfoCard_Alerts_v2 extends LightningElement {
    alerts = [
        { id: 1, message: 'Vehicle TN01QH2330 in breakdown for 5 days', icon: 'utility:automate' },
        { id: 2, message: 'Insurance renewal for TN04RF5923 overdue', icon: 'standard:product' },
        { id: 3, message: 'Service due for TN14GH5639', icon: 'utility:service_appointment' },
        { id: 4, message: 'Battery replacement needed for TN23HR2552', icon: 'utility:change_record_type' }
    ];
}