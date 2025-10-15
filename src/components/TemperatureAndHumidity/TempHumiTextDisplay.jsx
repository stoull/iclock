import React from 'react';

export const TempHumiDisplayType = Object.freeze({
  INDOOR: 'indoor',
  OUTDOOR: 'outdoor'
});

// 室外温湿度显示组件
export class TempHumiTextDisplay extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      displayType: props.displayType || TempHumiDisplayType.INDOOR,
      color_temp: null,
      color_humi: null,
      color_weather: null
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
    const temperature = this.state.displayType === TempHumiDisplayType.INDOOR ? tempInfo.temperature : tempInfo.outdoors_temp;
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
    const humidity = this.state.displayType === TempHumiDisplayType.INDOOR ? tempInfo.humidity : tempInfo.outdoors_humidity;
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

    // 根据天气类型计算颜色
    const weather_code = tempInfo.weather_code;
    let wetherColor = '#333333';
    if (weather_code < 30) {
      wetherColor = '#cc6600'; // 棕色 - 干燥
    } else if (weather_code < 60) {
      wetherColor = '#00cc66'; // 绿色 - 适宜
    } else if (weather_code < 80) {
      wetherColor = '#0066cc'; // 蓝色 - 潮湿
    } else {
      wetherColor = '#003399'; // 深蓝 - 很潮湿
    }

    

    this.setState({
      color_temp: tempColor,
      color_humi: humiColor,
      color_weather: wetherColor
    });
  }

  render() {
    const { tempInfo, fontSize } = this.props;
    const { color_temp, color_humi, color_weather, displayType} = this.state;
    const displayTypeClass = displayType === TempHumiDisplayType.INDOOR ? 'indoor' : 'outdoor';
    const fontSizeRatio = displayType === TempHumiDisplayType.INDOOR ? 0.32 : 0.14; 
    const adjustedFontSize = `${parseFloat(fontSize) * fontSizeRatio}rem`;
    return (
      <div className={`temp-humi-board ${displayTypeClass}`}
           style={{ fontSize: adjustedFontSize }}>
        <div style={{ color: color_temp }}>
          {tempInfo ? tempInfo.outdoors_temp : "--"}˚C
        </div>
        <div style={{ color: color_humi }}>
          {tempInfo ? tempInfo.outdoors_humidity : "--"}%
        </div>
        {
          displayType === TempHumiDisplayType.OUTDOOR && (
            <div style={{ color: color_weather }}>
              {tempInfo ? tempInfo.weather_des : "--"}
            </div>
          )
        }
      </div>
    );
  }
}
