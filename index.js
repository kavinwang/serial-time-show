const moment = require('moment');
const SerialPort = require('serialport')
const port = new SerialPort('/dev/ttyS3', {
    baudRate: 19200,
    dataBits: 8,
    parity: 'odd',
    stopBits: 1
});
// port.on('error', (err) => console.log('Error: ', err.message))
// port.on('data', data => console.log('Data:', data))

const nums = [0x77, 0x24, 0x5D, 0x6D, 0x2E, 0x6B, 0x7B, 0x25, 0x7F, 0x6F, 0x77];
const showLedHi = Buffer.from([0x18, 0xFE]);
const showLedMi = Buffer.from([0x18, 0x12]);
const showLedLo = Buffer.from([0x18, 0x48]);
let dot = 0x00;
setInterval(() => {
    let now = moment().format("HHmm");
    dot ^= 0x03;
    port.write(Buffer.from([0x08, nums[now[0]], nums[now[1]], nums[now[2]], nums[now[3]], dot]));
    setTimeout(() => {
        let hour = moment().hour();
        port.write(hour > 18 ? showLedMi : hour < 8 ? showLedLo : showLedHi);
    }, 10)
}, 1000);
