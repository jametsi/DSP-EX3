var plot = {
    canvas: null,
    width: 640,
    height: 480,
    margin: {
        left: 70,
        right: 70,
        top: 58,
        bottom: 38
    }
    ,
    init: function (plotContainer) {
        var self = this;
        this.canvas = $('<canvas>')
            .attr({
                'width': self.width,
                'height': self.height,
                'class': 'plot-canvas'
            });
        plotContainer.html(this.canvas);
        this.plotSine(this.generateData());
    },
    plotSine: function (data) {
        var ctx = this.canvas[0].getContext("2d");
        this.drawAxes(ctx);
        this.drawCurve(ctx, data);
    },
    drawAxes: function (ctx) {
        ctx.font = "16px Arial";

        // Y
        ctx.beginPath();
        ctx.moveTo(this.margin.left, this.margin.top);
        ctx.lineTo(this.margin.left, this.height - this.margin.bottom);
        ctx.stroke();
        ctx.fillText("-π", this.margin.left - 5, this.height - this.margin.bottom + 15);
        ctx.fillText("π", this.width - this.margin.right - 5, this.height - this.margin.bottom + 15);

        // X
        ctx.beginPath();
        ctx.moveTo(this.margin.left, this.height - this.margin.bottom);
        ctx.lineTo(this.width - this.margin.right, this.height - this.margin.bottom);
        ctx.stroke();
        ctx.fillText("1", this.margin.left - 15, this.margin.top + 5);
        ctx.fillText("-1", this.margin.left - 20, this.height - this.margin.bottom );
    },
    drawCurve: function (ctx, data) {
        var self = this;
        var stepWidth = (this.width - this.margin.left - this.margin.right) / data.length;

        function calculateY(value) {
            // scale -1 - 1 to 0 - container_height
            var innerHeight = self.height - self.margin.top - self.margin.bottom;
            return innerHeight - (((value + 1) / 2) * innerHeight) + self.margin.top;
        }

        ctx.beginPath();
        data.forEach(function (value, i) {
            if (i == 0) {
                ctx.moveTo(self.margin.left, calculateY(value));
            }
            var x = i * stepWidth + self.margin.left;
            var y = calculateY(value);
            ctx.lineTo(x, y);
        });
        ctx.stroke();
    },
    generateData: function () {
        var data = [];
        for (var i = -Math.PI; i < Math.PI; i += .1) {
            data.push(Math.sin(i));
        }
        return data;
    }
};