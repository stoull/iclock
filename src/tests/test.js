
function toISOStringWithTimezone(date) {
  const pad = (num) => String(num).padStart(2, '0');
  
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const ms = String(date.getMilliseconds()).padStart(3, '0');
  
  const offset = -date.getTimezoneOffset();
  const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
  const offsetMinutes = pad(Math.abs(offset) % 60);
  const offsetSign = offset >= 0 ? '+' : '-';
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}${offsetSign}${offsetHours}:${offsetMinutes}`;
}

let currentDateTime = new Date();
const before24Hours = new Date(currentDateTime.getTime() - 24 * 60 * 60 * 1000);
console.log('Current DateTime:', currentDateTime.toISOStringWithTimezone());
console.log('24 Hours Before:', before24Hours.toISOStringWithTimezone());

console.log('Current DateTime - ISOStringWithTimezone:', toISOStringWithTimezone(currentDateTime));
console.log('24 Hours Before - ISOStringWithTimezone:', toISOStringWithTimezone(before24Hours));