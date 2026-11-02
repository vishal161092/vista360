import { LightningElement, api, wire, track } from 'lwc';
import getRelatedTimelineActivities from '@salesforce/apex/de_Timeline_Controller.getRelatedTimelineActivities';

export default class De_Timeline extends LightningElement {
    @api recordId;
    @track activities = [];
    @track loading = false;
    error;

    @wire(getRelatedTimelineActivities, { relatedToId: '$recordId' })
    wiredActivities(result) {
        this.loading = true;
        if (result.data) {
            this.activities = result.data.length > 0 ? result.data : this.staticActivities;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.activities = this.staticActivities;
        }
        this.loading = false;
    }

    get hasActivities() {
        return this.activities && this.activities.length > 0;
    }

    get staticActivities() {
        return [
            {
                Id: '1',
                Subject: 'Call - Requested a King Size Bed',
                Description: 'Requested a King Size Bed with Soft Mattress',
                ActivityDate: '2026-06-28',
                Status: 'Completed',
                icon: 'standard:log_a_call'
            },
            {
                Id: '2',
                Subject: 'Email - Booking Confirmation Sent',
                Description: 'Confirmation for Lumen Aria Boutique, Mumbai',
                ActivityDate: '2026-06-25',
                Status: 'Completed',
                icon: 'standard:email'
            },
            {
                Id: '3',
                Subject: 'Task - Follow up on loyalty upgrade',
                Description: 'Guest eligible for Platinum upgrade based on stay count',
                ActivityDate: '2026-06-20',
                Status: 'Open',
                icon: 'standard:task'
            },
            {
                Id: '4',
                Subject: 'Call - Complaint Resolution',
                Description: 'Resolved smoking room unavailability issue',
                ActivityDate: '2026-06-15',
                Status: 'Completed',
                icon: 'standard:log_a_call'
            }
        ];
    }

    get displayActivities() {
        return this.activities.map(act => ({
            ...act,
            icon: this.getActivityIcon(act.Subject || ''),
            formattedDate: act.ActivityDate
        }));
    }

    getActivityIcon(subject) {
        if (subject.toLowerCase().includes('call')) return 'standard:log_a_call';
        if (subject.toLowerCase().includes('email')) return 'standard:email';
        return 'standard:task';
    }

    handleSectionToggle(event) {
        const buttonId = event.currentTarget.dataset.buttonId;
        const section = this.template.querySelector(`[data-section-id="${buttonId}"]`);
        if (section) {
            section.classList.toggle('slds-is-open');
        }
    }
}