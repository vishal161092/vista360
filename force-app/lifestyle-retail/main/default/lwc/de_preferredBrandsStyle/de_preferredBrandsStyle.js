import { LightningElement } from 'lwc';

export default class De_preferredBrandsStyle extends LightningElement {
    brands = ['Zara', 'Coach', 'Nike', 'H&M'];
    categories = ['Fashion', 'Handbags', 'Footwear', 'Accessories'];
    apparelSize = 'M / L (Mostly M)';
    footwearSize = 'UK 6';

    handleEdit() {
        // eslint-disable-next-line no-console
        console.log('Edit preferred brands & style');
    }
}
