import { LightningElement } from 'lwc';

export default class De_shoppingPreferences extends LightningElement {
    brands = ['Zara', 'Coach', 'Nike', 'H&M'];
    categories = ['Fashion', 'Handbags', 'Footwear', 'Accessories'];
    payments = ['UPI', 'Credit Card'];

    handleEdit() {
        // eslint-disable-next-line no-console
        console.log('Edit shopping preferences');
    }
}
