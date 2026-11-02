import { LightningElement } from 'lwc';

export default class JwNextBestAction extends LightningElement {
    // STATIC demo data — reflects the Data Cloud propensity prediction
    propensity = 60; // P(buy next 180d), matches contact card
    headline = 'High propensity to purchase';
    recommendation = 'Introduce the Diamond Solitaire collection';
    rationale =
        'Silver-tier customer with rising engagement and a Gold affinity — strong signal for a diamond upsell this festive season.';
    confidence = 78;

    sent = false;

    get propensityStyle() {
        return `width:${this.propensity}%;`;
    }

    get confidenceLabel() {
        return `${this.confidence}% model confidence`;
    }

    get sendLabel() {
        return this.sent ? 'Sent ✓' : 'Send via WhatsApp';
    }

    handleSend() {
        this.sent = true;
    }
}
