import { lerp } from './utils.js';

export default class Road {
    constructor(x, width, laneCount = 3) {
        if (width <= 0 || laneCount <= 0) {
            throw new Error('Road width and laneCount must be positive values');
        }

        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width / 2;
        this.right = x + width / 2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

        // Pre-calculate border points
        this.borders = [
            [
                { x: this.left, y: this.top },
                { x: this.left, y: this.bottom }
            ],
            [
                { x: this.right, y: this.top },
                { x: this.right, y: this.bottom }
            ]
        ];
    }

    getLaneCenter(laneIndex) {
        const clampedIndex = Math.max(0, Math.min(laneIndex, this.laneCount - 1));
        const laneWidth = this.width / this.laneCount;
        return this.left + (clampedIndex + 0.5) * laneWidth;
    }

    draw(ctx) {
        if (!ctx) {
            console.error('Canvas context is required for drawing');
            return;
        }

        ctx.save();
        try {
            // Draw lane markings
            ctx.lineWidth = 5;
            ctx.strokeStyle = "white";
            ctx.setLineDash([20, 20]);

            for (let i = 1; i < this.laneCount; i++) {
                const x = lerp(this.left, this.right, i / this.laneCount);
                ctx.beginPath();
                ctx.moveTo(x, this.top);
                ctx.lineTo(x, this.bottom);
                ctx.stroke();
            }

            // Draw road borders
            ctx.setLineDash([]);
            this.borders.forEach(border => {
                ctx.beginPath();
                ctx.moveTo(border[0].x, border[0].y);
                ctx.lineTo(border[1].x, border[1].y);
                ctx.stroke();
            });
        } finally {
            ctx.restore();
        }
    }
}