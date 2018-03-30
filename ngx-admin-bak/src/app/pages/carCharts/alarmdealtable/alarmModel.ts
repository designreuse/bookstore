//报警数据
export interface AlarmData {
    ID,
    ALARMDATE,
    ALARMINFO_LATITUDE,
    ALARMINFO_LONGITUDE,
    ALARM_DESC,
    ALARM_ENDDATE,
    ALARM_LEVEL,
    ALARM_LEVEL_STR,
    ALARM_SPEED,
    ALARM_TREAT,
    ALARM_TREATTIME,
    ALARM_TREATCONTENT,
    ALARM_TREAT_STR,
    ALARM_TYPE,
    CAR_AND_PLATECOLOR,
    CAR_DRIVER_NAME,
    CAR_ID,
    CAR_NO,
    DURATION,
    DURATION_SECEND,
    GROUPNAME,
    KEY_ID,
    PLATECOLOR,
    TREAT_PERSON,
    alarmName,
    alarmAdress
};


export interface AlarmType {
    alarmType,
    duration,
    name
}

//报警等级
export interface AlarmLevel {
    levelName,
    levelCode
};

//处理状态
export interface DealState {
    stateName,
    dealType
};

//处理状态
export interface DealResult {
    message,
    result
};