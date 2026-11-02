import { LightningElement } from 'lwc';
import INSTAGRAM_ICON from '@salesforce/resourceUrl/socialInstagram';
import WHATSAPP_ICON from '@salesforce/resourceUrl/socialWhatsapp';
import X_ICON from '@salesforce/resourceUrl/socialX';

export default class DeSocialMediaVelo extends LightningElement {
    instagramIcon = INSTAGRAM_ICON;
    whatsappIcon = WHATSAPP_ICON;
    xIcon = X_ICON;
}