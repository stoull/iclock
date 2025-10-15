
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
        colorValue = '#5b00f9ff';
    } else if (temp >= 0 && temp < 5) {
        colorValue = '#0034F5';
    } else if (temp >= 5 && temp < 10) {
        colorValue = '#0084C1';
    } else if (temp >= 10 && temp < 15) {
        colorValue = '#56A63B';
    } else if (temp >= 15 && temp < 20) {
        colorValue = '#5c00faff';
    } else if (temp >= 20 && temp < 22) {
        colorValue = '#0034F5';
    } else if (temp >= 22 && temp < 24) {
        colorValue = '#0084C1';
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