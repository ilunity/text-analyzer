interface PieChartData {
  name: string;
  value: number;
}

export interface PieChartProps {
  data: PieChartData[];
}

export interface ChartDownloadRef {
  download: () => void;
}
