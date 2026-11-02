import { LightningElement } from 'lwc';
import MARVELOUS_MAY from '@salesforce/resourceUrl/de_scheme_marvelous_may';
import MONSOON_DHAMAKA from '@salesforce/resourceUrl/de_scheme_monsoon_dhamaka';
import PAINTER_REWARDS from '@salesforce/resourceUrl/de_scheme_painter_rewards';
import FESTIVE_BONANZA from '@salesforce/resourceUrl/de_scheme_festive_bonanza';

export default class De_enrolledSchemes extends LightningElement {
    schemes = [
        {
            id: '1',
            name: 'MARVELOUS MAY',
            bannerImage: MARVELOUS_MAY,
            subtext: '(Eco, Mid & Pre Products)',
            dateRange: '01 May – 31 May 2026',
            points: '350 Pts',
            progressStyle: 'width: 70%; background: linear-gradient(90deg, #5b21b6, #7c3aed);',
            progressLabel: '70%',
            isComingSoon: false
        },
        {
            id: '2',
            name: 'MONSOON DHAMAKA',
            bannerImage: MONSOON_DHAMAKA,
            subtext: '(All Products)',
            dateRange: '01 Jun – 31 Jul 2026',
            points: '600 Pts',
            progressStyle: 'width: 40%; background: linear-gradient(90deg, #1d4ed8, #3b82f6);',
            progressLabel: '40%',
            isComingSoon: false
        },
        {
            id: '3',
            name: 'MEGA PAINTER REWARDS',
            bannerImage: PAINTER_REWARDS,
            subtext: '(Premium Products)',
            dateRange: '01 Apr – 30 Jun 2026',
            points: '500 Pts',
            progressStyle: 'width: 50%; background: linear-gradient(90deg, #78350f, #a16207);',
            progressLabel: '50%',
            isComingSoon: false
        },
        {
            id: '4',
            name: 'FESTIVE BONANZA',
            bannerImage: FESTIVE_BONANZA,
            subtext: '(All Products)',
            dateRange: '01 Sep – 31 Oct 2026',
            points: '',
            progressStyle: 'width: 0%; background-color: #d97706;',
            progressLabel: '0%',
            isComingSoon: true
        }
    ];

    handleViewAll(event) {
        event.preventDefault();
        console.log('View All Schemes clicked');
    }
}
