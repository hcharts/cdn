(function(H){
		var each = H.each,
		seriesTypes = H.seriesTypes,
		mathFloor = Math.floor,
		mathMax = Math.max,
		mathMin = Math.min,
		mathAbs = Math.abs,
		UNDEFINED,
		NORMAL_STATE = '',
		HOVER_STATE = 'hover',
		SELECT_STATE = 'select',
		VISIBLE = 'visible',
		HIDDEN = 'hidden',
		PREFIX = 'highcharts-',
		NONE = 'none',
		hasTouch = document.documentElement.ontouchstart !== UNDEFINED,
		TRACKER_FILL = 'rgba(192,192,192,' + (H.hasSVG ? 0.0001 : 0.002) + ')', // invisible but clickable
		M = 'M',
		L = 'L';
		
		// handle unsorted data, throw error anyway
		function error(code, stop) {
			var msg = 'Highcharts error #' + code + ': www.highcharts.com/errors/' + code;
			if (stop) {
				throw msg;
			} else if (window.console) {
				console.log(msg);                
			}
		}
		
		/***
		If replacing L and M in trakcer will be necessary use that getPath():
		
		function getPath(arr){
		var ret = [];
		each(arr, function(el, ind) {
		var len = el[0].length;
		for(var i = 0; i < len; i++){
		var p = el[0][i];
		if(p == M && ind != 0 && i == 0) {
		p = L;
		}
		ret.push(p);
		}
		});
		return ret;
		}
		***/
		
		
		function getPath(arr){
			var ret = [];
			each(arr, function(el) {
					ret = ret.concat(el[0]);
			});
			return ret;
		}
		
		/***
		*
		*   ColoredLine series type
		*
		***/
		
		seriesTypes.coloredline = Highcharts.extendClass(seriesTypes.line);
		H.seriesTypes.coloredline.prototype.processData = function(force) {
			
			var series = this,
			processedXData = series.xData, // copied during slice operation below
			processedYData = series.yData,
			dataLength = processedXData.length,
			croppedData,
			cropStart = 0,
			cropped,
			distance,
			closestPointRange,
			xAxis = series.xAxis,
			i, // loop variable
			options = series.options,
			cropThreshold = options.cropThreshold,
			isCartesian = series.isCartesian;
			
			// If the series data or axes haven't changed, don't go through this. Return false to pass
			// the message on to override methods like in data grouping. 
			if (isCartesian && !series.isDirty && !xAxis.isDirty && !series.yAxis.isDirty && !force) {
				return false;
			}
			
			// Find the closest distance between processed points
			for (i = processedXData.length - 1; i >= 0; i--) {
				distance = processedXData[i] - processedXData[i - 1];
				if (distance > 0 && (closestPointRange === UNDEFINED || distance < closestPointRange)) {
					closestPointRange = distance;
					
					// Unsorted data is not supported by the line tooltip, as well as data grouping and 
					// navigation in Stock charts (#725) and width calculation of columns (#1900)
				} else if (distance < 0 && series.requireSorting) {
					error(15);
				}
			}
			
			// Record the properties
			series.cropped = cropped; // undefined or true
			series.cropStart = cropStart;
			series.processedXData = processedXData;
			series.processedYData = processedYData;
			
			if (options.pointRange === null) { // null means auto, as for columns, candlesticks and OHLC
				series.pointRange = closestPointRange || 1;
			}
			series.closestPointRange = closestPointRange;
		};
		
		H.seriesTypes.coloredline.prototype.setTooltipPoints = function (renew) {
			var series = this,
			points = [],
			pointsLength,
			low,
			high,
			xAxis = series.xAxis,
			xExtremes = xAxis && xAxis.getExtremes(),
			axisLength = xAxis ? (xAxis.tooltipLen || xAxis.len) : series.chart.plotSizeX, // tooltipLen and tooltipPosName used in polar
			point,
			pointX,
			nextPoint,
			i,
			tooltipPoints = []; // a lookup array for each pixel in the x dimension
			
			// don't waste resources if tracker is disabled
			if (series.options.enableMouseTracking === false) {
				return;
			}
			
			// renew
			if (renew) {
				series.tooltipPoints = null;
			}
			// concat segments to overcome null values
			each(series.points, function (segment) {
					if(segment.y !== null){
						points = points.concat(segment);
					}
			});
			each(series.segments, function (segment) {
					each(segment.points, function(point) {
							if(point.y !== null){
								points = points.concat(point);
							}
					});
			});
			// Reverse the points in case the X axis is reversed
			if (xAxis && xAxis.reversed) {
				points = points.reverse();
			}
			
			// Polar needs additional shaping
			if (series.orderTooltipPoints) {
				series.orderTooltipPoints(points);
			}
			
			// Assign each pixel position to the nearest point
			pointsLength = points.length;
			for (i = 0; i < pointsLength; i++) {
				point = points[i];
				pointX = point.x;
				if (pointX >= xExtremes.min && pointX <= xExtremes.max) { // #1149
					nextPoint = points[i + 1];
					
					// Set this range's low to the last range's high plus one
					low = high === UNDEFINED ? 0 : high + 1;
					// Now find the new high
					high = points[i + 1] ?
					mathMin(mathMax(0, mathFloor( // #2070
						(point.clientX + (nextPoint ? (nextPoint.wrappedClientX || nextPoint.clientX) : axisLength)) / 2 )), axisLength) :
					axisLength;
					
					while (low >= 0 && low <= high) {
						tooltipPoints[low++] = point;
					}
				}
			}
			series.tooltipPoints = tooltipPoints;
		};
		
		H.seriesTypes.coloredline.prototype.drawTracker = function () {
			var series = this,
			options = series.options,
			trackByArea = options.trackByArea,
			trackerPath = [].concat(trackByArea ? series.areaPath : getPath(series.graphPath)),
			trackerPathLength = trackerPath.length,
			chart = series.chart,
			pointer = chart.pointer,
			renderer = chart.renderer,
			snap = chart.options.tooltip.snap,
			tracker = series.tracker,
			cursor = options.cursor,
			css = cursor && { cursor: cursor },
			singlePoints = series.singlePoints,
			singlePoint,
			i,
			onMouseOver = function () {
				if (chart.hoverSeries !== series) {
					series.onMouseOver();
				}
			};
			// Extend end points. A better way would be to use round linecaps,
			// but those are not clickable in VML.
			if (trackerPathLength && !trackByArea) {
				i = trackerPathLength + 1;
				while (i--) {
					if (trackerPath[i] === M) { // extend left side
						trackerPath.splice(i + 1, 0, trackerPath[i + 1] - snap, trackerPath[i + 2], L);
					}
					if ((i && trackerPath[i] === M) || i === trackerPathLength) { // extend right side
						trackerPath.splice(i, 0, L, trackerPath[i - 2] + snap, trackerPath[i - 1]);
					}
				}
			}
			
			// handle single points
			for (i = 0; i < singlePoints.length; i++) {
				singlePoint = singlePoints[i];
				if(singlePoint.plotX && singlePoint.plotY) {
					trackerPath.push(M, singlePoint.plotX - snap, singlePoint.plotY,
						L, singlePoint.plotX + snap, singlePoint.plotY);
				}
			}
			
			
			
			// draw the tracker
			if (tracker) {
				tracker.attr({ d: trackerPath });
				
			} else { // create
				
				series.tracker = renderer.path(trackerPath)
				.attr({
						'stroke-linejoin': 'round', // #1225
						visibility: series.visible ? VISIBLE : HIDDEN,
						stroke: TRACKER_FILL,
						fill: trackByArea ? TRACKER_FILL : NONE,
						'stroke-width' : options.lineWidth + (trackByArea ? 0 : 2 * snap),
						zIndex: 2
				})
				.add(series.group);
				
				// The tracker is added to the series group, which is clipped, but is covered 
				// by the marker group. So the marker group also needs to capture events.
				each([series.tracker, series.markerGroup], function (tracker) {
						tracker.addClass(PREFIX + 'tracker')
						.on('mouseover', onMouseOver)
						.on('mouseout', function (e) { pointer.onTrackerMouseOut(e); })
						.css(css);
						
						if (hasTouch) {
							tracker.on('touchstart', onMouseOver);
						} 
				});
			}
			
		};
		
		H.seriesTypes.coloredline.prototype.setState = function (state) {
			var series = this,
			options = series.options,
			graph = series.graph,
			graphNeg = series.graphNeg,
			stateOptions = options.states,
			lineWidth = options.lineWidth,
			attribs;
			
			state = state || NORMAL_STATE;
			
			if (series.state !== state) {
				series.state = state;
				
				if (stateOptions[state] && stateOptions[state].enabled === false) {
					return;
				}
				
				if (state) {
					lineWidth = stateOptions[state].lineWidth || lineWidth + 1;
				}
				
				if (graph && !graph.dashstyle) { // hover is turned off for dashed lines in VML
					attribs = {
						'stroke-width': lineWidth
					};
					// use attr because animate will cause any other animation on the graph to stop
					each(graph, function(seg, i){
							seg.attr(attribs);
					});
				}
			}
		};
		
		/***
		*
		*  The main change to get multi color isFinite changes segments array. 
		*  From array of points to object with color and array of points.
		*
		***/
		H.seriesTypes.coloredline.prototype.getSegments = function(f){
			var series = this,
			lastColor = 0,
			segments = [],
			i,
			points = series.points,
			pointsLength = points.length;
			
			if (pointsLength) { // no action required for []
				
				// if connect nulls, just remove null points
				if (series.options.connectNulls) {
					each(points, function (point, i) {
							if (points[i].y === null) {
								points.splice(i, 1);
							} 
					});
					each(points, function (point, i) {
							if (i > 0 && points[i].segmentColor != points[i-1].segmentColor){
								segments.push({
										points: points.slice(lastColor, i + 1), 
										color: points[i - 1].segmentColor
								});
								lastColor = i;
							} 
					});
					
					if (points.length && segments.length === 0) {
						segments = [points];
					}
					
					// else, split on null points or different colors
				} else {
					var previousColor = null;
					each(points, function (point, i) {
							var colorChanged = i > 0 && point.segmentColor != points[i-1].segmentColor && points[i].segmentColor != previousColor,
							colorExists = points[i-1] && points[i-1].segmentColor ? true : false;
							
							// handle first point
							if(!previousColor && point.segmetColor){
								previousColor = point.segmentColor;
							}
							
							if(colorChanged){
								var p = points.slice(lastColor, i + 1);
								if(p.length > 0) {
									segments.push({
											points: p,
											color:  colorExists ? points[i-1].segmentColor : previousColor
									});
									lastColor = i;
								}
							} else if (i === pointsLength - 1){
								var next = i + 1;
								if(point.y === null) {
									next--;
								}
								var p = points.slice(lastColor, next);
								if(p.length > 0) {
									segments.push({
											points: p,
											color:  colorExists ? points[i-1].segmentColor : previousColor
									});
									lastColor = i;
								}
								
							}
							
							// store previous color
							if(point){
								previousColor = point.segmentColor;
							}
					});
				}
			}
			// register it
			series.segments = segments;
		};
		
		H.seriesTypes.coloredline.prototype.getGraphPath = function(f){
			
			//var ret =  f.apply(this, Array.prototype.slice.call(arguments, 1));
			var series = this,
			graphPath = [],
			segmentPath,
			singlePoints = []; // used in drawTracker
			// Divide into segments and build graph and area paths
			each(series.segments, function (segment) {
					segmentPath = series.getSegmentPath(segment.points);
					// add the segment to the graph, or a single point for tracking
					if (segment.points.length > 1) {
						graphPath.push([segmentPath, segment.color]);
					} else {
						singlePoints.push(segment.points);
					}
			});
			
			// Record it for use in drawGraph and drawTracker, and return graphPath
			series.singlePoints = singlePoints;
			series.graphPath = graphPath;
			
			return graphPath;
		};
		
		H.seriesTypes.coloredline.prototype.drawGraph = function(f){
			var series = this,
			options = series.options,
			props = [['graph', options.lineColor || series.color]],
			lineWidth = options.lineWidth,
			dashStyle =  options.dashStyle,
			roundCap = options.linecap !== 'square',
			graphPath = series.getGraphPath(),
			graphPathLength = graphPath.length,
			graphSegmentsLength = 0,
			negativeColor = options.negativeColor;
			
			// draw the graph
			each(props, function (prop, i) {
					var graphKey = prop[0],
					graph = series[graphKey];
					
					if (graph) {// cancel running animations, #459
						// do we have animation
						each(graphPath, function(segment, j) {
								// update color and path
								
								if(series[graphKey][j]){
									series[graphKey][j].attr({ d: segment[0], stroke: segment[1]  });
								} else {
									series[graphKey][j] = getSegment(segment, prop, i);
								}
						});
						
					} else if (lineWidth && graphPath.length) { // #1487
						graph = [];
						each(graphPath, function(segment, j) {
								graph[j] = getSegment(segment, prop, i);
						});
						series[graphKey] = graph;
						//add destroying elements
						series[graphKey].destroy = function(){
							for(g in series[graphKey]){
								var el = series[graphKey][g];
								if(el && el.destroy){
									el.destroy();
								}
							}
						};
					}
					graphSegmentsLength = series.graph.length;
					
					for(var j = graphSegmentsLength; j >= graphPathLength; j --){
						if(series[graphKey][j]) {
							series[graphKey][j].destroy();
							series[graphKey].splice(j, 1);
						}
					}
			});
			
			
			function getSegment(segment, prop, i){
				var attribs = {
					stroke: prop[1],
					'stroke-width': lineWidth,
					zIndex: 1 // #1069
				},
				item;
				if (dashStyle) {
					attribs.dashstyle = dashStyle;
				} else if (roundCap) {
					attribs['stroke-linecap'] = attribs['stroke-linejoin'] = 'round';
				}
				if(segment[1]){
					attribs.stroke = segment[1];
				}
				
				item = series.chart.renderer.path(segment[0])
				.attr(attribs)
				.add(series.group)
				.shadow(!i && options.shadow);
				
				return item;
			}
			
		};
		
		
		/***
		*
		*   ColoredArea series type
		*
		***/
		seriesTypes.coloredarea = Highcharts.extendClass(seriesTypes.coloredline);
		
		H.seriesTypes.coloredarea.prototype.init = function(chart, options) {
			options.threshold = options.threshold || null;
			H.Series.prototype.init.call(this, chart, options);
		};
		
		H.seriesTypes.coloredarea.prototype.closeSegment = H.seriesTypes.area.prototype.closeSegment;
		
		H.seriesTypes.coloredarea.prototype.drawGraph = function(f) {
			H.seriesTypes.coloredline.prototype.drawGraph.call(this, f);
			var series = this,
					options = this.options,
					props = [['graph', options.lineColor || series.color]];
			
			each(props, function(prop, i) {
					var graphKey = prop[0],
					graph = series[graphKey];
					
					if (graph) {// cancel running animations, #459
						// do we have animation
						each(series.graphPath, function(segment, j) {
								// update color and path
								
								if(series[graphKey][j]){
									series[graphKey][j].attr({ fill: segment[1]  });
								} 
						});
						
					}
			});
		};
		
		H.seriesTypes.coloredarea.prototype.getSegmentPath = function(segment){
			var path;
			
			seriesTypes.area.prototype.getSegmentPath.call(this, segment);
			
			path = [].concat(this.areaPath);
			this.areaPath = [];
			
			return path;
		};
		
		H.seriesTypes.coloredarea.prototype.getGraphPath = function() {
			var series = this,
					graphPath = [],
					segmentPath,
					singlePoints = []; // used in drawTracker
			// Divide into segments and build graph and area paths
			
			this.areaPath = [];
			each(series.segments, function (segment) {
					segmentPath = series.getSegmentPath(segment.points);
					// add the segment to the graph, or a single point for tracking
					if (segment.points.length > 1) {
						graphPath.push([segmentPath, segment.color]);
					} else {
						singlePoints.push(segment.points);
					}
			});
			
			// Record it for use in drawGraph and drawTracker, and return graphPath
			series.singlePoints = singlePoints;
			series.graphPath = graphPath;
			return graphPath;
		
		};
		
		H.seriesTypes.coloredarea.prototype.drawLegendSymbol = H.LegendSymbolMixin.drawRectangle;
		
})(Highcharts);
