import React from 'react';

// 室内温湿度显示组件
class IndoorDisplay extends React.PureComponent {
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
    const temperature = tempInfo.temperature;
    let tempColor = '#333333'; // 默认色
    if (temperature < 10) {
      tempColor = '#0066cc'; // 蓝色 - 冷
    } else if (temperature < 25) {
      tempColor = '#00cc66'; // 绿色 - 适宜
    } else if (temperature < 35) {
      tempColor = '#ff9900'; // 橙色 - 温暖
    } else {
      tempColor = '#ff3300'; // 红色 - 热
    }

    // 根据湿度计算颜色
    const humidity = tempInfo.humidity;
    let humiColor = '#333333';
    if (humidity < 30) {
      humiColor = '#cc6600'; // 棕色 - 干燥
    } else if (humidity < 60) {
      humiColor = '#00cc66'; // 绿色 - 适宜
    } else if (humidity < 80) {
      humiColor = '#0066cc'; // 蓝色 - 潮湿
    } else {
      humiColor = '#003399'; // 深蓝 - 很潮湿
    }

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

export default IndoorDisplay;