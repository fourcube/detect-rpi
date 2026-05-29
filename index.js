var fs = require('fs');

var PI_MODEL_NO = [
    // https://www.raspberrypi.com/documentation/computers/processors.html
    'BCM2708',
    'BCM2709',
    'BCM2710',
    'BCM2835',   // Raspberry Pi 1 and Zero
    'BCM2836',   // Raspberry Pi 2
    'BCM2837',   // Raspberry Pi 3 (and later Raspberry Pi 2)
    'BCM2837B0', // Raspberry Pi 3B+ and 3A+
    'BCM2711',   // Raspberry Pi 4B and Compute Module 4
    'BCM2712',   // Raspberry Pi 5
    'RP3A0'      // Raspberry Pi Zero 2 W (SiP)
];

function isPiModel(model) {
    return PI_MODEL_NO.includes(model);
}

function modelLooksLikePi(text) {
    return (
        text.includes('Raspberry Pi') ||
        text.includes('Compute Module')
    );
}

function parseCpuInfo() {
    let cpuInfo;
    try {
        cpuInfo = fs.readFileSync('/proc/cpuinfo', { encoding: 'utf8' });
    } catch (e) {
        return null;
    }

    const result = {
        model: null,
        hardware: null,
        revision: null
    };

    const lines = cpuInfo.split('\n');
    for (const line of lines) {
        const [key, value] = line.split(':').map(part => part?.trim());
        if (key === 'Hardware') result.hardware = value;
        if (key === 'Model') result.model = value;
        if (key === 'Revision') result.revision = value;
    }

    return result;
}

function detect() {
    const info = parseCpuInfo();
    if (!info) return false;

    if (info.hardware && isPiModel(info.hardware)) return true;
    if (info.model && modelLooksLikePi(info.model)) return true;

    return false;
}

// Extra helpers
detect.model = function () {
    const info = parseCpuInfo();
    return info?.model || null;
};

detect.revision = function () {
    const info = parseCpuInfo();
    return info?.revision || null;
};

detect.info = function () {
    const info = parseCpuInfo();
    if (!info) {
        return {
            isPi: false,
            model: null,
            hardware: null,
            revision: null
        };
    }

    const isPi = (
        (info.hardware && isPiModel(info.hardware)) ||
        (info.model && modelLooksLikePi(info.model))
    );

    return {
        isPi,
        model: info.model,
        hardware: info.hardware,
        revision: info.revision
    };
};

module.exports = detect;
