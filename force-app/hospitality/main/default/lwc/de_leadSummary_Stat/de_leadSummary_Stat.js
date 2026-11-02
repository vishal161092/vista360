import { LightningElement, api } from 'lwc';

export default class De_leadSummary_Stat extends LightningElement {
    @api confidence = '76';
    @api summary =
        '- Outreach initiated by TASC (Anirudh/TARA) offering staffing, payroll, and compliance support in the UAE.\n- Lead (Udt) replied multiple times requesting details on regional experience, SLAs/metrics, and pricing for UAE/GCC operations.\n- No budget disclosed and no competitor mentioned.\n- Tone is professional and exploratory, with the lead seeking specifics and the seller proposing a meeting.';
    @api latestInteractionDate = '1/9/2026';
    @api latestInteractionDirection = 'Outgoing';
    @api latestInteractionPriority = 'Medium';
    @api latestInteractionSubject = 'Streamline Your Workforce Management with TASC Outsourcing';
    @api latestInteractionTone = 'Professional';
    @api buyerIntentStage = 'Evaluation';
    @api buyerIntentInterest = 'Medium';
    @api buyerIntentUrgency = 'Low';
    @api buyerIntentDecisionMaker = 'No';
    @api painPointsText =
        'Complexity in managing recruitment, payroll, and compliance in the UAE\nNeed for clarity on SLAs, success metrics, and pricing structure';

    get formattedSummary() {
        const original = this.summary || '';
        const trimmed = original.trim();

        if (!trimmed.startsWith('-')) {
            return original;
        }

        // If bullets are entered in a single line, force each "-" bullet to a new line.
        if (!trimmed.includes('\n-')) {
            return trimmed.replace(/\s+-\s+/g, '\n- ');
        }

        return trimmed.replace(/\n\s*-\s*/g, '\n- ');
    }

    get confidenceLabel() {
        return `${this.confidence}% Confidence`;
    }

    get painPoints() {
        return (this.painPointsText || '')
            .replace(/;/g, '\n')
            .split('\n')
            .map((item) => item.trim())
            .filter((item) => item);
    }
}
