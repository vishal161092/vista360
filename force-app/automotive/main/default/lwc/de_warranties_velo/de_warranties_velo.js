import VEHICLE_IMAGES from '@salesforce/resourceUrl/veloVehicleImages';
import { LightningElement } from 'lwc';

const TYRE_IMAGE_URL = `${VEHICLE_IMAGES}/rubixWheel.png`;

export default class DeWarrantiesVelo extends LightningElement {
    tyreImageUrl = TYRE_IMAGE_URL;

    productSpecs = [
        { id: 's1', label: 'Tyre Name', value: 'Zenova Street Z1' },
        { id: 's3', label: 'Date of Manufacture', value: '4925' },
        { id: 's2', label: 'Serial Number / Type Code', value: 'RBX094271A8' }
    ];

    productFeatures = [
        { id: 'f1', text: 'All-season road grip profile' },
        { id: 'f2', text: 'Reinforced sidewall durability' },
        { id: 'f3', text: 'Low-noise urban tread pattern' }
    ];
}
