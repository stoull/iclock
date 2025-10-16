import './TempHumiLineChart.css';

import { Line } from 'react-chartjs-2';


// Chart.js v3+ requires explicit registration of components. 
// 方案一： import Chart from 'chart.js/auto'; // 直接引入自动注册组件,是不是所有的？？？
// 方案二： 按需引入并注册需要的组件,这里使用到了LinearScale等,在后面注册所用到的组件 ChartJS.register(LinearScale...);
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import React, { useState, useEffect } from 'react';

import {defaultDataTable, createDataTable, lineChartOptions} from './TempHumiLineChartModel';
import logger from '../../utils/logger';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TempHumiLineChart( { data, fontSize } ) {
    const [dataTable, setDataTable] = useState(defaultDataTable);
    const [chartOptions, setChartOptions] = useState(lineChartOptions);
    const [chartHeight, setChartHeight] = useState(180);

    useEffect(() => {
        if (data) {
            const newDataTable = createDataTable(data);
            setDataTable(newDataTable);
        }
    }, [data]);

    useEffect(() => {
        if (fontSize) {
           updateFontSize(fontSize);
        }
    }, [fontSize]);
    
    function updateFontSize(newFontSize) {
        const tFontSize = parseFloat(newFontSize); // '8rem' -> 8
        let nSize = tFontSize;
        if (isNaN(nSize) || nSize <= 0) {
            nSize = 14; // 默认值
        }
        
        console.log('更新图表字体大小, 原始fontSize=', newFontSize, '解析后nSize=', nSize);

        // 字体变化逻辑........
        nSize = Math.round(nSize);
        nSize = nSize - 3;
        nSize = nSize > 30 ? 30 : nSize; // 最大值限制
        nSize = nSize < 6 ? 6 : nSize; // 最小值限制
        console.log('更新图表字体大小, 原始fontSize=', newFontSize, '解析后nSize=', nSize);

        const cNewSize = `${nSize}px`
        logger.info('更新图表字体大小:', cNewSize, nSize);
        const dynamicOptions = {
            ...lineChartOptions,
            scales: {
                ...lineChartOptions.scales,
                x: {
                    ...lineChartOptions.scales.x,
                    ticks: {
                    ...lineChartOptions.scales.x?.ticks,
                    font: { size: cNewSize }
                    }
                },
                y1: {
                    ...lineChartOptions.scales.y1,
                    ticks: {
                    ...lineChartOptions.scales.y1.ticks,
                    font: { size: cNewSize }
                    }
                },
                y2: {
                    ...lineChartOptions.scales.y2,
                    ticks: {
                    ...lineChartOptions.scales.y2.ticks,
                    font: { size: cNewSize }
                    }
                }
            }
        };
        setChartOptions(dynamicOptions);

        // 根据字体大小调整图表高度
        const chartHeight = 160+(tFontSize-16.0)*6;
        console.log('nSize and chartHeight=', tFontSize, chartHeight);
        setChartHeight(chartHeight);
    }

    return (
        <div className='temp-humi-chart-container' style={{ height: `${chartHeight}px` }}>
            <div className='line-chart'>
                <Line data={dataTable} options={chartOptions} />
            </div>
        </div>
    );
}

export default TempHumiLineChart;