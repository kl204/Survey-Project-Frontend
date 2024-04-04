/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'react-google-charts';
import '../../../../global.css';
import { Box } from '@mui/system';

interface GooglePieChartProps {
  selectionAnswer: [string, number][];
}

export default function GooglePieChart({
  selectionAnswer,
}: GooglePieChartProps) {
  const [options, setOptions] = useState({
    legend: 'right',
  });
  const [maxSelectionValue, setMaxSelectionValue] = useState<string>('');
  const [maxSelectionCount, setMaxSelectionCount] = useState<number>(0);
  const colorsRef = useRef<string[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const newOptions = {
        legend: window.innerWidth < 600 ? 'bottom' : 'right',
        pieSliceTextStyle: {
          color: '#747474',
          fontSize: 15,
        },
      };

      setOptions(newOptions);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateUniqueRandomPastelColor = (): string => {
    const pastelColors = [
      '#FFD1DC',
      '#FFA07A',
      '#FFB6C1',
      '#FFDEAD',
      '#87CEEB',
      '#98FB98',
      '#DDA0DD',
      '#FFD700',
      '#FFB5C5',
      '#FFD47A',
      '#C1FFC1',
      '#FED8B1',
      '#B0E0E6',
      '#D3FFCE',
      '#E6CFFF',
      '#FFEC8B',
      '#FF6347',
      '#9ACD32',
      '#FFC0CB',
      '#FFECB3',
      '#FFE4E1',
      '#F0FFF0',
      '#DDA0FF',
      '#FFF68F',
      '#FF4500',
      '#ADFF2F',
      '#E0BBE4',
      '#FFD700',
    ];

    const unusedColors = pastelColors.filter(
      (color) => !colorsRef.current.includes(color)
    );
    const randomColor =
      unusedColors[Math.floor(Math.random() * unusedColors.length)];

    colorsRef.current.push(randomColor);

    return randomColor;
  };

  const aggregateData = (data: any[]) => {
    const aggregatedData = [];
    const map = new Map();

    for (const item of data) {
      if (map.has(item[0])) {
        const index = map.get(item[0]);
        aggregatedData[index][1] += item[1];

        if (aggregatedData[index][1] > maxSelectionCount) {
          setMaxSelectionCount(aggregatedData[index][1]);
          setMaxSelectionValue(item[0]);
        }
      } else {
        const randomColor = generateUniqueRandomPastelColor();
        map.set(item[0], aggregatedData.length);
        aggregatedData.push([item[0], item[1], randomColor]);

        if (item[1] > maxSelectionCount) {
          setMaxSelectionCount(item[1]);
          setMaxSelectionValue(item[0]);
        }
      }
    }
    return { aggregatedData, maxSelectionValue };
  };

  const { aggregatedData } = aggregateData(selectionAnswer);
  aggregatedData.unshift([
    'selectionValue',
    'selectionCount',
    { role: 'style' },
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Chart
        chartType="PieChart"
        data={aggregatedData}
        width={`${window.innerWidth <= 600 ? '300px' : '700px'}`}
        height={`${window.innerWidth <= 600 ? '250px' : '400px'}`}
        style={{
          marginTop: '0',
          fontWeight: 900,
        }}
        options={{
          ...options,
          colors: colorsRef.current,
          is3D: true,
        }}
      />
    </Box>
  );
}
