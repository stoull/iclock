/**
 * Windy 风场默认配色（风速 m/s → RGB），与地图上「Wind」图层标尺一致；
 * 可在 Windy：Settings → Customize color scale 查看或导出。
 * @see https://www.windy.com/colors
 */
const WINDY_WIND_MS_RGB_STOPS = [
  [0, [197, 214, 216]],
  [2, [166, 215, 218]],
  [4, [61, 162, 214]],
  [6, [38, 73, 186]],
  [7, [55, 114, 55]],
  [9, [43, 172, 43]],
  [10, [130, 190, 134]],
  [11, [222, 226, 105]],
  [14, [236, 165, 54]],
  [16, [228, 117, 63]],
  [18, [212, 77, 92]],
  [19, [152, 14, 14]],
  [20, [113, 27, 114]],
  [24, [180, 153, 176]],
  [25, [220, 220, 220]],
  [35, [148, 148, 148]],
];

function rgbTupleToCss([r, g, b]) {
  return `rgb(${r},${g},${b})`;
}

/** @param {number} speedMs 风速 (m/s)，与接口 wind_speed 一致 */
export function getWindyWindColorAtMs(speedMs) {
  const v = Number(speedMs);
  if (!Number.isFinite(v)) return '#888888';
  const stops = WINDY_WIND_MS_RGB_STOPS;
  if (v <= stops[0][0]) return rgbTupleToCss(stops[0][1]);
  const last = stops[stops.length - 1];
  if (v >= last[0]) return rgbTupleToCss(last[1]);
  let i = 0;
  while (i < stops.length - 1 && stops[i + 1][0] < v) i += 1;
  const [s0, c0] = stops[i];
  const [s1, c1] = stops[i + 1];
  const t = (v - s0) / (s1 - s0);
  const r = Math.round(c0[0] + (c1[0] - c0[0]) * t);
  const g = Math.round(c0[1] + (c1[1] - c0[1]) * t);
  const b = Math.round(c0[2] + (c1[2] - c0[2]) * t);
  return `rgb(${r},${g},${b})`;
}

export function getHumiColorValue(humi) {
    // #E39C57 30 #FFD38B  45 #8FE759 65 #008CB5 80  #0071B5 100
    let colorValue = '#FD663D';
    if (humi < 15) {
        colorValue = '#E7A401';
    } else if (humi >= 15 && humi < 30) {
        colorValue = '#E39C57';
    } else if (humi >= 30 && humi < 45) {
        colorValue = '#D6C300';
    } else if (humi >= 45 && humi < 65) {
        colorValue = '#8FE759';
    } else if (humi >= 65 && humi < 75) {
        colorValue = '#62D4CF';
    } else if (humi >= 75 && humi < 80) {
        colorValue = '#52BBF3';
    } else if (humi >= 80 && humi < 100) {
        colorValue = '#0096FA';
    }
    return colorValue;
}

export function getTempColorValue(temp) {
    let colorValue;
    if (temp < 0) {
        colorValue = '#8169d7ff'; 
    } else if (temp >= 0 && temp < 5) {
        colorValue = '#6874f1ff'; 
    } else if (temp >= 5 && temp < 10) {
        colorValue = '#5982f4ff'; 
    } else if (temp >= 10 && temp < 15) {
        colorValue = '#4c9bfbff';
    } else if (temp >= 15 && temp < 20) {
        colorValue = '#3b94a6ff';  
    } else if (temp >= 20 && temp < 22) {
        colorValue = '#3ba686ff';  
    } else if (temp >= 22 && temp < 24) {
        colorValue = '#3ba64bff';
    } else if (temp >= 24 && temp < 27) {
        colorValue = '#56A63B';
    } else if (temp >= 27 && temp < 28) {
        colorValue = '#CAE644';
    } else if (temp >= 28 && temp < 29) {
        colorValue = '#FFFF4D';
    } else if (temp >= 29 && temp < 30) {
        colorValue = '#FFB430';
    } else if (temp >= 30 && temp < 31) {
        colorValue = '#FF912A';
    } else if (temp >= 31 && temp < 32) {
        colorValue = '#FF4122';
    } else if (temp >= 32 && temp < 33) {
        colorValue = '#FF2B22';
    } else if (temp >= 33) {
        colorValue = '#FF2B22';
    } else {
        colorValue = '#999';
    }
    return colorValue; 
}

export function getWheatherColorValue(weather_code) {
    // https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
    /**
        Group 2xx: Thunderstorm
        Group 3xx: Drizzle
        Group 5xx: Rain
        Group 6xx: Snow
        Group 7xx: Atmosphere
        Group 800: Clear
        Group 80x: Clouds
     */
    let wetherColor = '#333333'; // 默认颜色
    
    if (weather_code >= 200 && weather_code < 300) {
        // Group 2xx: Thunderstorm - 紫色/深紫色
        wetherColor = '#c904c9ff'; // 深洋红 - 雷暴
    } else if (weather_code >= 300 && weather_code < 400) {
        // Group 3xx: Drizzle - 浅蓝色
        wetherColor = '#87CEEB'; // 天蓝色 - 毛毛雨
    } else if (weather_code >= 500 && weather_code < 600) {
        // Group 5xx: Rain - 蓝色
        wetherColor = '#1E90FF'; // 道奇蓝 - 雨
    } else if (weather_code >= 600 && weather_code < 700) {
        // Group 6xx: Snow - 白色/浅灰色
        wetherColor = '#B0C4DE'; // 淡钢蓝 - 雪
    } else if (weather_code >= 700 && weather_code < 800) {
        // Group 7xx: Atmosphere (雾、霾等) - 灰色
        wetherColor = '#808080'; // 灰色 - 大气现象
    } else if (weather_code === 800 || weather_code === 801 || weather_code === 802) {
        // Group 800: Clear - 金黄色/橙色
        wetherColor = '#FFD700'; // 金色 - 晴朗
    } else if (weather_code >= 801 && weather_code < 900) {
        // Group 80x: Clouds - 浅灰色
        wetherColor = '#A9A9A9'; // 深灰色 - 多云
    } else {
        // 未知天气代码
        wetherColor = '#424242ff'; // 默认深灰色
    }
    
    return wetherColor;
}