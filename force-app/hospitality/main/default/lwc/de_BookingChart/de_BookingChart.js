import { LightningElement, api } from 'lwc';
import chartjs from '@salesforce/resourceUrl/chartjs';
import { loadScript } from 'lightning/platformResourceLoader';

export default class De_BookingChart extends LightningElement {
    @api recordId;
    chartInitialized = false;
    chart;
    drillLevel = 'channel';
    currentChannel = '';

    bookingData = {
        channels: {
            labels: ['Direct', 'OTA', 'Assisted Sales'],
            data: [4186, 3603, 2211],
            colors: ['#2B7A7F', '#C9A960', '#6366f1']
        },
        cities: {
            'Direct': {
                labels: ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Goa', 'Udaipur', 'Jaipur'],
                data: [820, 690, 580, 520, 410, 380, 420, 366],
                colors: ['#1a5c5f', '#2B7A7F', '#3a9198', '#4db3b9', '#6bc5ca', '#8fd8dc', '#b3e8eb', '#d4f3f4']
            },
            'OTA': {
                labels: ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Lucknow', 'Kolkata', 'Chennai'],
                data: [710, 620, 540, 460, 390, 340, 290, 253],
                colors: ['#8B6914', '#A07A1A', '#B58B20', '#C9A960', '#D4B870', '#DFC780', '#EAD690', '#F5E5A0']
            },
            'Assisted Sales': {
                labels: ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Goa', 'Jaipur', 'Others'],
                data: [440, 380, 320, 280, 240, 210, 180, 161],
                colors: ['#4338ca', '#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#eef2ff']
            }
        }
    };

    get chartTitle() {
        if (this.drillLevel === 'channel') {
            return 'Bookings by Channel';
        }
        return `${this.currentChannel} — Bookings by City`;
    }

    get showBackButton() {
        return this.drillLevel === 'city';
    }

    renderedCallback() {
        if (this.chartInitialized) return;
        this.chartInitialized = true;
        loadScript(this, chartjs).then(() => {
            this.renderChart();
        });
    }

    renderChart() {
        const canvas = this.template.querySelector('canvas.chart-canvas');
        const ctx = canvas.getContext('2d');

        if (this.chart) {
            this.chart.destroy();
        }

        let labels, data, colors;

        if (this.drillLevel === 'channel') {
            labels = this.bookingData.channels.labels;
            data = this.bookingData.channels.data;
            colors = this.bookingData.channels.colors;
        } else {
            const cityData = this.bookingData.cities[this.currentChannel];
            labels = cityData.labels;
            data = cityData.data;
            colors = cityData.colors;
        }

        this.chart = new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: this.drillLevel === 'channel' ? 'Total Bookings' : `${this.currentChannel} Bookings`,
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 1,
                    borderRadius: 6,
                    barThickness: this.drillLevel === 'channel' ? 60 : 36
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onClick: (event, elements) => {
                    if (elements.length > 0 && this.drillLevel === 'channel') {
                        const index = elements[0].index;
                        this.currentChannel = this.bookingData.channels.labels[index];
                        this.drillLevel = 'city';
                        this.renderChart();
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1a1a1a',
                        titleFont: { size: 13, weight: '600' },
                        bodyFont: { size: 12 },
                        padding: 10,
                        cornerRadius: 8,
                        callbacks: {
                            afterLabel: () => {
                                return this.drillLevel === 'channel' ? '(Click to drill down by city)' : '';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 11, weight: '600' }, color: '#4b5563' }
                    },
                    y: {
                        grid: { color: '#f3f4f6' },
                        ticks: { font: { size: 11 }, color: '#6b7280' },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    handleBack() {
        this.drillLevel = 'channel';
        this.currentChannel = '';
        this.renderChart();
    }
}