import { Pie } from '@ant-design/plots';
import { ChartDownloadRef, PieChartProps } from './PieChart.types.ts';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { BasePlot } from '@ant-design/charts';

export const PieChart = forwardRef<ChartDownloadRef, PieChartProps>(({ data }, ref) => {
  const [chart, setChart] = useState<BasePlot>();

  const roundedData = data.map(({ value, name }) =>
    ({ name: `${name} (${value.toFixed(3)})`, value}));

  const config = {
    height: 400,
    width: 700,
    appendPadding: 10,
    data: roundedData,
    angleField: 'value',
    colorField: 'name',
    radius: 0.75,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };

  useImperativeHandle(
    ref,
    () => ({
      download: () => {
        if (chart?.downloadImage) {
          chart.downloadImage('text-categorization-diagram');
        }
      },
    }),
    [chart],
  );

  return <Pie { ...config } onReady={ setChart } />;
});

PieChart.displayName = 'PieChart';
