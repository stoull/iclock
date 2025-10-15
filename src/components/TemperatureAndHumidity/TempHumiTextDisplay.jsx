import React from 'react';

import { getHumiColorValue, getTempColorValue, getWheatherColorValue } from './TempHumiTextDisplayData';
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
      temperature: '--',
      humidity: '--',
      weather_des: '--',
      color_temp: null,
      color_humi: null,
      color_weather: null
    };
  }

  componentDidMount() {
    this.updateProperties();
  }

  componentDidUpdate(prevProps) {
    // 当 tempInfo 变化时，重新计算颜色
    if (prevProps.tempInfo !== this.props.tempInfo) {
      this.updateProperties();
    }
  }

  // 根据温湿度值计算颜色
  updateProperties = () => {
    const { tempInfo } = this.props;
    if (!tempInfo) return;

    // 根据温度计算颜色
    const temperature = this.state.displayType === TempHumiDisplayType.INDOOR ? tempInfo.temperature : tempInfo.outdoors_temp;
    let tempColor = getTempColorValue(temperature); 

    // 根据湿度计算颜色
    const humidity = this.state.displayType === TempHumiDisplayType.INDOOR ? tempInfo.humidity : tempInfo.outdoors_humidity;
    let humiColor = getHumiColorValue(humidity); 

    // 根据天气类型计算颜色
    const weather_code = tempInfo.weather_code;
    let weatherColor = getWheatherColorValue(weather_code);

    this.setState({
      color_temp: tempColor,
      color_humi: humiColor,
      color_weather: weatherColor,
      temperature: temperature,
      humidity: humidity,
      weather_des: tempInfo.weather_des
    });
  }

  render() {
    const { tempInfo, fontSize } = this.props;
    const { displayType, temperature, humidity, weather_des, color_temp, color_humi, color_weather } = this.state;
    const displayTypeClass = displayType === TempHumiDisplayType.INDOOR ? 'indoor' : 'outdoor';
    const fontSizeRatio = displayType === TempHumiDisplayType.INDOOR ? 0.32 : 0.14; 
    const adjustedFontSize = `${parseFloat(fontSize) * fontSizeRatio}rem`;
    return (
      <div className={`temp-humi-board ${displayTypeClass}`}
           style={{ fontSize: adjustedFontSize }}>
        <div style={{ color: color_temp }}>
          { temperature }˚C
        </div>
        <div style={{ color: color_humi }}>
          { humidity }%
        </div>
        {
          displayType === TempHumiDisplayType.OUTDOOR && (
            <div style={{ color: color_weather }}>
              { weather_des }
            </div>
          )
        }
      </div>
    );
  }
}
