export class DashedCircle
{
    centerX: number;
    centerY: number;
    radius: number;
    color: string;
    dashSize: number;
    ctx: CanvasRenderingContext2D;

    constructor(ctx:CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, color: string, dashSize: number)
    {
        this.ctx = ctx;
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.color = color;
        this.dashSize = dashSize;
    }

    CalculateCirclePoints()
    {
        var n = this.radius / this.dashSize;
        var alpha = Math.PI * 2 / n;
        var pointObj = {};
        var points = [];
        var i = -1;

        while (i < n)
        {
            var theta = alpha * i;
            var theta2 = alpha * (i + 1);
            points.push({
                x: (Math.cos(theta) * this.radius) + this.centerX,
                y: (Math.sin(theta) * this.radius) + this.centerY,
                ex: (Math.cos(theta2) * this.radius) + this.centerX,
                ey: (Math.sin(theta2) * this.radius) + this.centerY });
                i += 2;
        }

        return points;
    }

    Draw()
    {
        var points = this.CalculateCirclePoints();
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        for (var p = 0; p < points.length; p++)
        {
            this.ctx.moveTo(points[p].x, points[p].y);
            this.ctx.lineTo(points[p].ex, points[p].ey);
            this.ctx.stroke();
        }
        this.ctx.closePath();
    }
}