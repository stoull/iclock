import React from 'react';

import { getHumiColorValue, getTempColorValue, getWheatherColorValue } from './TempHumiTextDisplayData';
// 室内温湿度显示组件
class TempIndoorDisplay extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      color_temp_indoor: '#333333', // 默认颜色
      color_humi_indoor: '#333333'  // 默认颜色
    };
  }

  componentDidMount() {
    this.updateColors();
  }

  componentDidUpdate(prevProps) {
    // 当 tempInfo 变化时，重新计算颜色
    if (prevProps.tempInfo !== this.props.tempInfo) {
      this.updateColors();
    }
  }

  // 根据温湿度值计算颜色
  updateColors = () => {
    const { tempInfo } = this.props;
    if (!tempInfo) return;

    // 根据温度计算颜色
    const tempColor = getTempColorValue(tempInfo.temperature); 

    // 根据湿度计算颜色
    const humiColor = getHumiColorValue(tempInfo.humidity); 

    this.setState({
      color_temp_indoor: tempColor,
      color_humi_indoor: humiColor
    });
  }

  render() {
    const { tempInfo, fontSize } = this.props;
    const { color_temp_indoor, color_humi_indoor } = this.state;
    
    return (
      <div className='temp-humi-board indoor' 
           style={{ fontSize: `${parseFloat(fontSize)*0.3}rem` }}>
        <div style={{ color: color_temp_indoor }}>
          {tempInfo ? tempInfo.temperature : "--"}˚C
        </div>
        <div style={{ color: color_humi_indoor }}>
          {tempInfo ? tempInfo.humidity : "--"}%
        </div>
      </div>
    );
  }
}

export default TempIndoorDisplay;