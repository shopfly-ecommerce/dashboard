/**
 * echarts基本配置项
 */

export default function(options) {
  options = options || {}
  return {
    color: options.color || ['#3398DB'],
    title: {
      x: 'center',
      text: options.titleText || ''
    },
    legend: options.legend || null,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: options.tooltipFormatter || null
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: options.xAxis || [
      {
        type: 'category',
        data: options.xAxisData || [],
        axisTick: { alignWithLabel: true }
      }
    ],
    yAxis: options.yAxis || [
      {
        type: options.yAxisType || 'value',
        data: options.yAxisData || []
      }
    ],
    series: options.series || [
      {
        name: options.seriesName || '数量',
        type: options.seriesType || 'bar',
        barWidth: '60%',
        data: options.seriesData || []
      }
    ]
  }
}
