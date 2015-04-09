/**
 * Highcharts-zh_CN plugins v0.0.1 (2015-01-21)
 *
 * (c) 2015 HCharts.cn http://www.hcharts.cn
 *
 * Author : John Doe
 *
 * License: Creative Commons Attribution (CC)
 */

(function(H) {

    ABSOLUTE = H.ABSOLUTE;
    RELATIVE = H.RELATIVE;
    hasSVG = H.hasSVG;
    isTouchDevice = H.isTouchDevice;
    var defaultOptionsZhCn = {

        colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c',
            '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'
        ],
        symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],
        lang: {
            contextButtonTitle: '图表导出菜单',
            decimalPoint: '.',
            downloadJPEG: "下载JPEG图片",
            downloadPDF: "下载PDF文件",
            downloadPNG: "下载PNG文件",
            downloadSVG: "下载SVG文件",
            drillUpText: "返回 {series.name}",
            loading: '加载中...',
            months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            noData: "没有数据",
            numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'],
            printChart: "打印图表",
            resetZoom: '重置缩放比例',
            resetZoomTitle: '重置为原始大小',
            shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            thousandsSep: ',',
            weekdays: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
        },
        global: {
            useUTC: true,
            //timezoneOffset: 0,
            canvasToolsURL: 'http://cdn.hcharts.cn/highcharts/modules/canvas-tools.js',
            VMLRadialGradientURL: 'http://cdn.hcharts.cn/highcharts/gfx/vml-radial-gradient.png'
        },
        chart: {
            //animation: true,
            //alignTicks: false,
            //reflow: true,
            //className: null,
            //events: { load, selection },
            //margin: [null],
            //marginTop: null,
            //marginRight: null,
            //marginBottom: null,
            //marginLeft: null,
            borderColor: '#4572A7',
            //borderWidth: 0,
            borderRadius: 0,
            defaultSeriesType: 'line',
            ignoreHiddenSeries: true,
            //inverted: false,
            //shadow: false,
            spacing: [10, 10, 15, 10],
            //spacingTop: 10,
            //spacingRight: 10,
            //spacingBottom: 15,
            //spacingLeft: 10,
            //style: {
            //  fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
            //  fontSize: '12px'
            //},
            backgroundColor: '#FFFFFF',
            //plotBackgroundColor: null,
            plotBorderColor: '#C0C0C0',
            //plotBorderWidth: 0,
            //plotShadow: false,
            //zoomType: ''
            resetZoomButton: {
                theme: {
                    zIndex: 20
                },
                position: {
                    align: 'right',
                    x: -10,
                    //verticalAlign: 'top',
                    y: 10
                }
                // relativeTo: 'plot'
            }
        },
        title: {
            text: '图表标题',
            align: 'center',
            // floating: false,
            margin: 15,
            // x: 0,
            // verticalAlign: 'top',
            // y: null,
            style: {
                color: '#333333',
                fontSize: '18px'
            }

        },
        subtitle: {
            text: '',
            align: 'center',
            // floating: false
            // x: 0,
            // verticalAlign: 'top',
            // y: null,
            style: {
                color: '#555555'
            }
        },

        plotOptions: {
            line: { // base series options
                allowPointSelect: false,
                showCheckbox: false,
                animation: {
                    duration: 1000
                },
                //connectNulls: false,
                //cursor: 'default',
                //clip: true,
                //dashStyle: null,
                //enableMouseTracking: true,
                events: {},
                //legendIndex: 0,
                //linecap: 'round',
                lineWidth: 2,
                //shadow: false,
                // stacking: null,
                marker: {
                    //enabled: true,
                    //symbol: null,
                    lineWidth: 0,
                    radius: 4,
                    lineColor: '#FFFFFF',
                    //fillColor: null,
                    states: { // states for a single point
                        hover: {
                            enabled: true,
                            lineWidthPlus: 1,
                            radiusPlus: 2
                        },
                        select: {
                            fillColor: '#FFFFFF',
                            lineColor: '#000000',
                            lineWidth: 2
                        }
                    }
                },
                point: {
                    events: {}
                },
                dataLabels: H.merge(H.defaultLabelOptions, {
                    align: 'center',
                    //defer: true,
                    enabled: false,
                    formatter: function() {
                        return this.y === null ? '' : numberFormat(this.y, -1);
                    },
                    verticalAlign: 'bottom', // above singular point
                    y: 0
                        // backgroundColor: undefined,
                        // borderColor: undefined,
                        // borderRadius: undefined,
                        // borderWidth: undefined,
                        // padding: 3,
                        // shadow: false
                }),
                cropThreshold: 300, // draw points outside the plot area when the number of points is less than this
                pointRange: 0,
                //pointStart: 0,
                //pointInterval: 1,
                //showInLegend: null, // auto: true for standalone series, false for linked series
                states: { // states for the entire series
                    hover: {
                        //enabled: false,
                        lineWidthPlus: 1,
                        marker: {
                            // lineWidth: base + 1,
                            // radius: base + 1
                        },
                        halo: {
                            size: 10,
                            opacity: 0.25
                        }
                    },
                    select: {
                        marker: {}
                    }
                },
                stickyTracking: true,
                //tooltip: {
                //pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b>'
                //valueDecimals: null,
                //xDateFormat: '%A, %b %e, %Y',
                //valuePrefix: '',
                //ySuffix: ''               
                //}
                turboThreshold: 1000
                    // zIndex: null
            }
        },
        labels: {
            //items: [],
            style: {
                //font: defaultFont,
                position: ABSOLUTE,
                color: '#3E576F'
            }
        },
        legend: {
            enabled: true,
            align: 'center',
            //floating: false,
            layout: 'horizontal',
            labelFormatter: function() {
                return this.name;
            },
            //borderWidth: 0,
            borderColor: '#909090',
            borderRadius: 0,
            navigation: {
                // animation: true,
                activeColor: '#274b6d',
                // arrowSize: 12
                inactiveColor: '#CCC'
                    // style: {} // text styles
            },
            // margin: 20,
            // reversed: false,
            shadow: false,
            // backgroundColor: null,
            /*style: {
            padding: '5px'
        },*/
            itemStyle: {
                color: '#333333',
                fontSize: '12px',
                fontWeight: 'bold'
            },
            itemHoverStyle: {
                //cursor: 'pointer', removed as of #601
                color: '#000'
            },
            itemHiddenStyle: {
                color: '#CCC'
            },
            itemCheckboxStyle: {
                position: ABSOLUTE,
                width: '13px', // for IE precision
                height: '13px'
            },
            // itemWidth: undefined,
            // symbolRadius: 0,
            // symbolWidth: 16,
            symbolPadding: 5,
            verticalAlign: 'bottom',
            // width: undefined,
            x: 0,
            y: 0,
            title: {
                //text: null,
                style: {
                    fontWeight: 'bold'
                }
            }
        },

        loading: {
            // hideDuration: 100,
            labelStyle: {
                fontWeight: 'bold',
                position: RELATIVE,
                top: '45%'
            },
            // showDuration: 0,
            style: {
                position: ABSOLUTE,
                backgroundColor: 'white',
                opacity: 0.5,
                textAlign: 'center'
            }
        },

        tooltip: {
            enabled: true,
            animation: hasSVG,
            //crosshairs: null,
            backgroundColor: 'rgba(249, 249, 249, .85)',
            borderWidth: 1,
            borderRadius: 3,
            dateTimeLabelFormats: {
                millisecond: '%A, %b %e, %H:%M:%S.%L',
                second: '%A, %b %e, %H:%M:%S',
                minute: '%A, %b %e, %H:%M',
                hour: '%b %e, %H:%M',
                day: '%Y-%m-%d',
                week: 'Week from %A, %b %e, %Y',
                month: '%m-%Y',
                year: '%Y'
            },
            //formatter: defaultFormatter,
            headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
            pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
            shadow: true,
            //shape: 'callout',
            //shared: false,
            snap: isTouchDevice ? 25 : 10,
            style: {
                color: '#333333',
                cursor: 'default',
                fontSize: '12px',
                padding: '8px',
                whiteSpace: 'nowrap'
            }
            //xDateFormat: '%A, %b %e, %Y',
            //valueDecimals: null,
            //valuePrefix: '',
            //valueSuffix: ''
        },

        credits: {
            enabled: true,
            text: 'Highcharts.com',
            href: 'http://www.highcharts.com',
            position: {
                align: 'right',
                x: -10,
                verticalAlign: 'bottom',
                y: -5
            },
            style: {
                cursor: 'pointer',
                color: '#909090',
                fontSize: '9px'
            }
        },
        xAxis: {
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%Y-%m-%d',
                week: '%e. %b',
                month: '%m-%Y',
                year: '%Y'
            }
        }
    };

    H.setOptions(defaultOptionsZhCn);
}(Highcharts));
