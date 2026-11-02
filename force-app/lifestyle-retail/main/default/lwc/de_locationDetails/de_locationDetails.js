import { LightningElement, api, wire } from 'lwc';
import getCustomer from '@salesforce/apex/de_CustomerController.getCustomer';

export default class De_locationDetails extends LightningElement {
    @api recordId;
    customer;
    showMap = false;

    // Nearest stores are illustrative (mock) data, chosen by the customer's
    // region. Addresses are geocoded automatically by lightning-map.
    storesByRegion = {
        chennai: [
            {
                key: 's1',
                name: 'Urbanweave - VR Chennai',
                distance: '3.1 km',
                Street: 'VR Chennai Mall, Anna Nagar',
                City: 'Chennai',
                State: 'Tamil Nadu',
                PostalCode: '600040',
                Country: 'India'
            },
            {
                key: 's2',
                name: 'Urbanweave - Express Avenue',
                distance: '5.4 km',
                Street: 'Express Avenue Mall, Royapettah',
                City: 'Chennai',
                State: 'Tamil Nadu',
                PostalCode: '600014',
                Country: 'India'
            },
            {
                key: 's3',
                name: 'Urbanweave - Phoenix Marketcity',
                distance: '9.2 km',
                Street: 'Phoenix Marketcity, Velachery',
                City: 'Chennai',
                State: 'Tamil Nadu',
                PostalCode: '600042',
                Country: 'India'
            }
        ],
        mumbai: [
            {
                key: 's1',
                name: 'Urbanweave - Phoenix Palladium',
                distance: '2.8 km',
                Street: 'Phoenix Palladium, Lower Parel',
                City: 'Mumbai',
                State: 'Maharashtra',
                PostalCode: '400013',
                Country: 'India'
            },
            {
                key: 's2',
                name: 'Urbanweave - Inorbit Mall',
                distance: '6.1 km',
                Street: 'Inorbit Mall, Malad West',
                City: 'Mumbai',
                State: 'Maharashtra',
                PostalCode: '400064',
                Country: 'India'
            },
            {
                key: 's3',
                name: 'Urbanweave - R City Mall',
                distance: '9.7 km',
                Street: 'R City Mall, Ghatkopar West',
                City: 'Mumbai',
                State: 'Maharashtra',
                PostalCode: '400086',
                Country: 'India'
            }
        ],
        delhi: [
            {
                key: 's1',
                name: 'Urbanweave - Pacific Mall',
                distance: '3.1 km',
                Street: 'Pacific Mall, Tagore Garden',
                City: 'New Delhi',
                State: 'Delhi',
                PostalCode: '110027',
                Country: 'India'
            },
            {
                key: 's2',
                name: 'Urbanweave - Ambience Mall',
                distance: '5.4 km',
                Street: 'Ambience Mall, Vasant Kunj',
                City: 'New Delhi',
                State: 'Delhi',
                PostalCode: '110070',
                Country: 'India'
            },
            {
                key: 's3',
                name: 'Urbanweave - Select Citywalk',
                distance: '9.2 km',
                Street: 'Select Citywalk, Saket',
                City: 'New Delhi',
                State: 'Delhi',
                PostalCode: '110017',
                Country: 'India'
            }
        ]
    };

    @wire(getCustomer, { recordId: '$recordId' })
    wiredCustomer({ data }) {
        if (data) {
            this.customer = data;
        }
    }

    // Picks the store region from the customer's city/state.
    // Chennai (or Tamil Nadu) => Chennai stores; Mumbai (or Maharashtra) =>
    // Mumbai stores; everything else => Delhi.
    get region() {
        const c = this.customer;
        const hay = `${(c && c.city) || ''} ${(c && c.state) || ''}`.toLowerCase();
        if (hay.includes('chennai') || hay.includes('tamil nadu')) {
            return 'chennai';
        }
        if (hay.includes('mumbai') || hay.includes('maharashtra')) {
            return 'mumbai';
        }
        return 'delhi';
    }

    get stores() {
        return this.storesByRegion[this.region];
    }

    get addressLines() {
        const c = this.customer;
        if (!c) {
            return [];
        }
        const lines = [];
        if (c.street) {
            lines.push({ key: 'street', label: 'Street', value: c.street });
        }
        const cityState = [c.city, c.state].filter(Boolean).join(', ');
        if (cityState) {
            lines.push({ key: 'cityState', label: 'City / State', value: cityState });
        }
        if (c.country) {
            lines.push({ key: 'country', label: 'Country', value: c.country });
        }
        if (c.postalCode) {
            lines.push({ key: 'pincode', label: 'Pincode', value: c.postalCode });
        }
        return lines;
    }

    get hasAddress() {
        return this.addressLines.length > 0;
    }

    get mapMarkers() {
        const markers = [];
        const c = this.customer;

        // Current customer location
        if (c && (c.street || c.city || c.state)) {
            markers.push({
                location: {
                    Street: c.street,
                    City: c.city,
                    State: c.state,
                    PostalCode: c.postalCode,
                    Country: c.country
                },
                title: c.name || 'Current Location',
                description: 'Current customer location',
                mapIcon: {
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
                    fillColor: '#4b4ded',
                    fillOpacity: 1,
                    strokeColor: '#4b4ded',
                    scale: 1.4
                }
            });
        }

        // Nearest Urbanweave stores
        this.stores.forEach((s) => {
            markers.push({
                location: {
                    Street: s.Street,
                    City: s.City,
                    State: s.State,
                    PostalCode: s.PostalCode,
                    Country: s.Country
                },
                title: s.name,
                description: `Nearest Urbanweave Store · ${s.distance}`
            });
        });

        return markers;
    }

    get hasMarkers() {
        return this.mapMarkers.length > 0;
    }

    get noMarkers() {
        return !this.hasMarkers;
    }

    get centerLocation() {
        const c = this.customer;
        if (c && (c.street || c.city || c.state)) {
            return {
                location: {
                    Street: c.street,
                    City: c.city,
                    State: c.state,
                    PostalCode: c.postalCode,
                    Country: c.country
                }
            };
        }
        return undefined;
    }

    handleViewNearby() {
        this.openMap();
    }

    openMap() {
        this.showMap = true;
    }

    closeMap() {
        this.showMap = false;
    }
}
