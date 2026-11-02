import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import WINDOW from '@salesforce/schema/Account.de_Engagement_Window_Days__c';
import EMAIL from '@salesforce/schema/Account.de_Engagement_Email__c';
import SMS from '@salesforce/schema/Account.de_Engagement_SMS__c';
import WHATSAPP from '@salesforce/schema/Account.de_Engagement_WhatsApp__c';
import WEBSITE from '@salesforce/schema/Account.de_Engagement_Website__c';

const FIELDS = [WINDOW, EMAIL, SMS, WHATSAPP, WEBSITE];

const META = [
    { key: 'whatsapp', label: 'WhatsApp', icon: 'utility:chat', field: WHATSAPP },
    { key: 'sms', label: 'SMS', icon: 'utility:sms', field: SMS },
    { key: 'website', label: 'Website', icon: 'utility:world', field: WEBSITE },
    { key: 'email', label: 'Email', icon: 'utility:email', field: EMAIL }
];

// Donut geometry (r = 38)
const DONUT_R = 38;
const DONUT_C = 2 * Math.PI * DONUT_R; // ~238.76

// Palette: leader = Hearth red, rest = grayscale ramp (by rank).
const RED = '#CB2228';
const GRAY_RAMP = ['#000000', '#52525b', '#a1a1aa', '#d4d4d8'];

// Synthetic monthly shapes by rank — each sums (after scaling) to the channel total.
// Leader rises, others steady / declining / sparse. Purely for visualisation.
const SHAPES = [
    [0.10, 0.12, 0.15, 0.17, 0.22, 0.24], // 0 leader — rising
    [0.19, 0.17, 0.16, 0.17, 0.15, 0.16], // 1 steady
    [0.26, 0.21, 0.18, 0.15, 0.12, 0.08], // 2 declining
    [0.34, 0.08, 0.24, 0.06, 0.20, 0.08] // 3 sparse / erratic
];
const N_MONTHS = 6;

// Combined chart layout
const CH_W = 616;
const CH_H = 150;
const CH_PAD = { t: 12, r: 14, b: 26, l: 24 };

// Sparkline layout
const SP_W = 108;
const SP_H = 34;
const SP_PAD = 3;

// Catmull-Rom → cubic bezier smoothing through points [[x,y],...]
function smoothPath(pts) {
    if (!pts.length) return '';
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];
        const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
        const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
        const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
        const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
}

export default class De_HearthEngagement extends LightningElement {
    @api recordId;
    record;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ data }) {
        if (data) {
            this.record = data;
        }
    }

    get windowLabel() {
        const w = getFieldValue(this.record, WINDOW);
        return w != null ? `Last ${w} days` : 'Recent activity';
    }

    // Raw channel values present on the record, ranked high → low.
    get ranked() {
        const vals = META
            .map((m) => ({ ...m, value: Number(getFieldValue(this.record, m.field)) }))
            .filter((m) => getFieldValue(this.record, m.field) != null);
        return vals.sort((a, b) => b.value - a.value);
    }

    get total() {
        return this.ranked.reduce((s, c) => s + c.value, 0);
    }

    get hasData() {
        return this.ranked.length > 0 && this.total > 0;
    }

    _colorFor(rankIndex) {
        return rankIndex === 0 ? RED : GRAY_RAMP[Math.min(rankIndex - 1, GRAY_RAMP.length - 1)];
    }

    _pct(value) {
        return this.total > 0 ? Math.round((value / this.total) * 100) : 0;
    }

    // Synthetic monthly series for a channel that sums exactly to `total`.
    _monthly(total, rank) {
        const shape = SHAPES[Math.min(rank, SHAPES.length - 1)];
        const raw = shape.map((w) => total * w);
        const rounded = raw.map((x) => Math.max(0, Math.round(x)));
        let diff = total - rounded.reduce((a, b) => a + b, 0);
        // distribute the rounding remainder onto the biggest months first
        const order = rounded.map((v, i) => i).sort((a, b) => rounded[b] - rounded[a]);
        let k = 0;
        while (diff !== 0 && order.length) {
            const idx = order[k % order.length];
            if (diff > 0) {
                rounded[idx]++;
                diff--;
            } else if (rounded[idx] > 0) {
                rounded[idx]--;
                diff++;
            }
            k++;
            if (k > 200) break;
        }
        return rounded;
    }

    // Master list: each channel + color + pct + synthetic monthly series.
    get series() {
        return this.ranked.map((c, i) => ({
            ...c,
            color: this._colorFor(i),
            pct: this._pct(c.value),
            monthly: this._monthly(c.value, i)
        }));
    }

    // ── Months ──
    get months() {
        const now = new Date();
        const out = [];
        for (let i = N_MONTHS - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            out.push(d.toLocaleString('en-US', { month: 'short' }));
        }
        return out;
    }

    get trendLabel() {
        const m = this.months;
        return `${N_MONTHS}-month trend — ${m[0]} → ${m[m.length - 1]}`;
    }

    // ── Donut segments ──
    get donutSegments() {
        let cumulative = 0;
        return this.series.map((c) => {
            const frac = this.total > 0 ? c.value / this.total : 0;
            const dash = frac * DONUT_C;
            const seg = {
                id: c.key,
                color: c.color,
                style: `stroke-dasharray: ${dash.toFixed(2)} ${(DONUT_C - dash).toFixed(2)}; stroke-dashoffset: ${(-cumulative).toFixed(2)};`
            };
            cumulative += dash;
            return seg;
        });
    }

    // ── Combined trend chart ──
    get trendChart() {
        const s = this.series;
        const n = N_MONTHS;
        const cw = CH_W - CH_PAD.l - CH_PAD.r;
        const chh = CH_H - CH_PAD.t - CH_PAD.b;
        const all = s.flatMap((c) => c.monthly);
        let maxY = Math.max(...all, 1);
        if (maxY % 2 !== 0) maxY++;
        const xStep = cw / (n - 1);
        const toX = (i) => CH_PAD.l + i * xStep;
        const toY = (v) => CH_PAD.t + chh - (v / maxY) * chh;
        const bottom = toY(0);

        const grid = [0, maxY / 2, maxY].map((v) => {
            const y = toY(v);
            return {
                id: 'g' + v,
                x1: CH_PAD.l,
                x2: CH_W - CH_PAD.r,
                y: y.toFixed(1),
                labelX: CH_PAD.l - 6,
                labelY: (y + 3).toFixed(1),
                label: String(v),
                dash: v === 0 ? 'none' : '3 3'
            };
        });

        const monthLabels = this.months.map((m, i) => ({
            id: 'm' + i,
            x: toX(i).toFixed(1),
            y: CH_H - 7,
            label: m
        }));

        const seriesPaths = s.map((c) => {
            const pts = c.monthly.map((v, i) => [toX(i), toY(v)]);
            const linePath = smoothPath(pts);
            const areaPath = `${linePath} L${toX(n - 1).toFixed(1)},${bottom.toFixed(1)} L${toX(0).toFixed(1)},${bottom.toFixed(1)} Z`;
            const dots = pts.map((p, i) => ({ id: c.key + i, cx: p[0].toFixed(1), cy: p[1].toFixed(1) }));
            return { id: c.key, color: c.color, linePath, areaPath, dots };
        });

        return {
            viewBox: `0 0 ${CH_W} ${CH_H}`,
            grid,
            monthLabels,
            series: seriesPaths
        };
    }

    // ── Legend + channel rows (with sparklines) ──
    get channels() {
        const max = Math.max(1, ...this.series.map((c) => c.value));
        const cw = SP_W - SP_PAD * 2;
        const chh = SP_H - SP_PAD * 2;
        const xStep = cw / (N_MONTHS - 1);

        return this.series.map((c) => {
            const maxV = Math.max(...c.monthly, 1);
            const pts = c.monthly.map((v, i) => [SP_PAD + i * xStep, SP_PAD + chh * (1 - v / maxV)]);
            const linePath = smoothPath(pts);
            const areaPath = `${linePath} L${(SP_PAD + cw).toFixed(1)},${SP_H} L${SP_PAD},${SP_H} Z`;
            const last = pts[pts.length - 1];

            return {
                id: c.key,
                label: c.label,
                icon: c.icon,
                value: c.value,
                pct: c.pct + '%',
                color: c.color,
                dotStyle: `background:${c.color};`,
                iconStyle: `--slds-c-icon-color-foreground-default:${c.color};`,
                barStyle: `width:${Math.round((c.value / max) * 100)}%; background:${c.color};`,
                sparkViewBox: `0 0 ${SP_W} ${SP_H}`,
                sparkLine: linePath,
                sparkArea: areaPath,
                sparkLastX: last[0].toFixed(1),
                sparkLastY: last[1].toFixed(1)
            };
        });
    }

    // ── Leader insight ──
    get leader() {
        return this.series.length ? this.series[0] : null;
    }

    get hasLeader() {
        return !!this.leader && this.series.length > 1;
    }

    get leaderName() {
        return this.leader ? this.leader.label : '';
    }

    get leaderPct() {
        return this.leader ? this.leader.pct : 0;
    }

    get leaderText() {
        return `is the dominant channel — ${this.leaderPct}% of all touchpoints, trending up. Prioritise ${this.leaderName} for outreach to maximise engagement.`;
    }
}
