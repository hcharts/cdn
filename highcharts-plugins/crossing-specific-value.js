/**
 * Highcharts plugin for axis crossing at specific value
 * Last revision: 2013-06-10
 * Note: xAxis must have opposite: true
 */

(function (H) {
    H.wrap(H.Axis.prototype, 'render', function (proceed) {
        var chart = this.chart,
            otherAxis;
        
        if (typeof this.options.crossing === 'number') {
            otherAxis = chart[this.isXAxis ? 'yAxis' : 'xAxis'][0];
			this.offset = otherAxis.toPixels(this.options.crossing, true);
            chart.axisOffset[this.side] = 10;
            console.log(this.offset);
        }
        proceed.call(this);
        
    });
    
}(Highcharts));