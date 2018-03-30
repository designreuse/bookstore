export class CarHisTrace {
    timeToBegin: number;
    distance: string;
    keyId: string;
    lon: string;
    lat: string;
    stopTime: string;
    time: string;
    speed: string;
    direction: string;
}

export class CarHisTraceAlarm {
    alarm_date: string;
    alarm_desc: string;
    alarm_type: string;
    alarminfo_latitude: string;
    alarminfo_longitude: string;
}

export class CarHisTraceStop {
    stopTime: string;
    lat: string;
    lon: string;
}
