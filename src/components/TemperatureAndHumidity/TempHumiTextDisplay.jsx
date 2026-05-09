import React from 'react';

import { t } from '../../assets/i18n/translationHelpers.js';
import windSockIcon from '../../assets/resource/fengxiangdai.svg';
import {
  getHumiColorValue,
  getTempColorValue,
  getWindyWindColorAtMs,
  getWheatherColorValue,
} from './TempHumiTextDisplayData';

const WIND_DIR_KEYS = [
  'climate.windDirection.N',
  'climate.windDirection.NE',
  'climate.windDirection.E',
  'climate.windDirection.SE',
  'climate.windDirection.S',
  'climate.windDirection.SW',
  'climate.windDirection.W',
  'climate.windDirection.NW',
];

/** 气象风来自的方向（度）→ 八方位索引，用于无障碍文案 */
function sectorIndexFromWindDegrees(deg) {
  const d = Number(deg);
  if (!Number.isFinite(d)) return null;
  const normalized = ((d % 360) + 360) % 360;
  return Math.floor((normalized + 22.5) / 45) % 8;
}

/** 箭头指向风的去向（与 wind_deg「来自何方」相差 180°） */
function blowDirectionDegrees(deg) {
  const d = Number(deg);
  if (!Number.isFinite(d)) return null;
  return ((d + 180) % 360 + 360) % 360;
}

function formatWindSpeedForDisplay(speed) {
  const n = Number(speed);
  if (!Number.isFinite(n)) return null;
  return n.toFixed(1);
}

function formatPressureForDisplay(pressure) {
  const n = Number(pressure);
  if (!Number.isFinite(n)) return null;
  return Math.round(n).toString();
}

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
    const fontSizeRatio = displayType === TempHumiDisplayType.INDOOR ? 0.22 : 0.08;
    const adjustedFontSize = `${parseFloat(fontSize) * fontSizeRatio}rem`;

    let windArrowRotate = null;
    let windAriaLabel = undefined;
    let windSpeedLabel = '--';
    let pressureLabel = '--';
    let windyWindColor = null;
    if (displayType === TempHumiDisplayType.OUTDOOR && tempInfo) {
      windArrowRotate = blowDirectionDegrees(tempInfo.wind_deg);
      const idx = sectorIndexFromWindDegrees(tempInfo.wind_deg);
      if (idx !== null) windAriaLabel = t(WIND_DIR_KEYS[idx]);
      const speedNum = Number(tempInfo.wind_speed);
      const speedStr = formatWindSpeedForDisplay(tempInfo.wind_speed);
      windSpeedLabel = speedStr !== null ? `${speedStr} ${t('climate.windSpeedUnit')}` : '--';
      windyWindColor = Number.isFinite(speedNum) ? getWindyWindColorAtMs(speedNum) : null;

      const pressureStr = formatPressureForDisplay(tempInfo.pressure ?? tempInfo.outdoors_pressure);
      pressureLabel = pressureStr !== null ? `${pressureStr} hPa` : '--';
    }

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
            <>
              <div style={{ color: color_weather }}>
                { weather_des }
              </div>
              <div
                className="temp-humi-wind-dir temp-humi-wind-with-icon"
                style={{ color: windyWindColor ?? color_weather }}
                {...(windAriaLabel ? { role: 'img', 'aria-label': windAriaLabel } : {})}
              >
                <span
                  className="temp-humi-wind-prefix-icon"
                  style={{ '--wind-prefix-icon': `url(${windSockIcon})` }}
                  aria-hidden
                />
                {windArrowRotate !== null ? (
                  <span
                    className="temp-humi-wind-arrow"
                    style={{ transform: `rotate(${windArrowRotate}deg)` }}
                    aria-hidden
                  >
                    ↑
                  </span>
                ) : (
                  <span aria-hidden>--</span>
                )}
              </div>
              <div
                className="temp-humi-wind-speed"
                style={{ color: windyWindColor ?? color_weather }}
              >
                {windSpeedLabel} / {pressureLabel}
              </div>
            </>
          )
        }
      </div>
    );
  }
}
