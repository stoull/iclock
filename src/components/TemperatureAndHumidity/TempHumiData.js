
// https://host/api/smart-clock/temperature-humidity

import TempHumiBoard from "./TempHumiBoard";

/**
 * {
    "cpu_used_rate": 8.9,
    "createDate": "2025-10-14 02:45:04",
    "cup_temp": 58.91,
    "humidity": 70,
    "id": 113573,
    "location": "HOME",
    "outdoors_feels_like": 38.45,
    "outdoors_humidity": 72,
    "outdoors_pressure": 1014,
    "outdoors_temp": 31.45,
    "outdoors_temp_max": 32.05,
    "outdoors_temp_min": 31.37,
    "sys_runtime": 4719870,
    "sys_uptime": "2025-08-20 19:40:33",
    "temperature": 29.7,
    "weather": "Clouds",
    "weather_code": 803,
    "weather_des": "多云",
    "weather_icon": "04d"
}
 */

// export const defaultTempInfo = {
//     "temperature": 0,
//     "humidity": 0,
//     "outdoors_temp": 0,
//     "outdoors_humidity": 0,
//     "id": 0,
//     "sys_runtime": "--",
//     "sys_uptime": "--",
//     "temperature": 0
//   }
  
// export TempHumiData = {
//     "cpu_used_rate": 0,
//     "createDate": "--",
//     "cup_temp": 0,
//     "humidity": 0,
//     "id": 0,
//     "sys_runtime": "--",
//     "sys_uptime": "--",
//     "temperature": 0
//     setShowValues(preValue => ({
//             ...preValue,
//             temp: tempInfo.temperature,
//             humi: tempInfo.humidity,
//             weather: tempInfo.weather,
//             weather_des: tempInfo.weather_des,
//             weather_temp: tempInfo.outdoors_temp,
//             cpu_temp: tempInfo.cup_temp,
//             temp_color: tempColor,
//             humi_color: humiColor
//         }))
// }
// https://host/api/smart-clock/temperature-humidity/history