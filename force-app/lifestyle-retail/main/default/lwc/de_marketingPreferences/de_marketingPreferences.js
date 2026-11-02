import { LightningElement } from 'lwc';

export default class De_marketingPreferences extends LightningElement {
    channels = [
        { key: 'email', label: 'Email', icon: 'utility:email', enabled: true },
        { key: 'sms', label: 'SMS', icon: 'utility:sms', enabled: false },
        { key: 'whatsapp', label: 'WhatsApp', icon: 'utility:chat', enabled: true },
        {
            key: 'push',
            label: 'Push Notifications',
            icon: 'utility:notification',
            enabled: true
        }
    ];

    get decoratedChannels() {
        return this.channels.map((c) => ({
            ...c,
            statusIcon: c.enabled ? 'utility:success' : 'utility:close',
            statusClass: c.enabled ? 'status-icon on' : 'status-icon off'
        }));
    }

    handleEdit() {
        // eslint-disable-next-line no-console
        console.log('Edit marketing preferences');
    }
}
