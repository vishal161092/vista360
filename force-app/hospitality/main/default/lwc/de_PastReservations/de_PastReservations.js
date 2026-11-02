import { LightningElement, api } from 'lwc';

export default class De_PastReservations extends LightningElement {
    @api recordId;

    get reservations() {
        return [
            {
                id: '1',
                checkinDate: '2026-05-15',
                channel: 'Direct',
                hotel: 'Lumen Aria Boutique, Andheri East',
                city: 'Mumbai',
                status: 'CHECKOUT',
                bookingId: 'R-8917283'
            },
            {
                id: '2',
                checkinDate: '2026-04-19',
                channel: 'Direct',
                hotel: 'Lumen Hub, MG Road',
                city: 'Bangalore',
                status: 'CHECKOUT',
                bookingId: 'R-8851402'
            },
            {
                id: '3',
                checkinDate: '2026-02-14',
                channel: 'OTA',
                hotel: 'Lumen Kohinoor, Kothrud',
                city: 'Pune',
                status: 'CHECKOUT',
                bookingId: 'R-8817063'
            },
            {
                id: '4',
                checkinDate: '2026-01-07',
                channel: 'Direct',
                hotel: 'Lumen Stay, Hitech City',
                city: 'Hyderabad',
                status: 'CHECKOUT',
                bookingId: 'R-8790112'
            },
            {
                id: '5',
                checkinDate: '2025-09-20',
                channel: 'OTA',
                hotel: 'Lumen Nawab',
                city: 'Lucknow',
                status: 'CHECKOUT',
                bookingId: 'R-8651920'
            }
        ];
    }

    get channelBadgeClass() {
        return 'badge-channel';
    }

    getChannelClass(channel) {
        if (channel === 'Direct') return 'badge badge-direct';
        if (channel === 'OTA') return 'badge badge-ota';
        return 'badge badge-assisted';
    }

    get formattedReservations() {
        return this.reservations.map(res => ({
            ...res,
            channelClass: this.getChannelClass(res.channel)
        }));
    }
}