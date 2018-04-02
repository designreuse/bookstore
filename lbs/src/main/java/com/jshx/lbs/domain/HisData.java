package com.jshx.lbs.domain;

import java.util.HashMap;
import java.util.List;

public class HisData {

    private static final long serialVersionUID = 1L;

    private String message;

    private int resultCode;

    private List<HashMap<String, Object>> carHisList;

    private List<HashMap<String, Object>> stopData;

    private List<HashMap<String, Object>> alarmData;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getResultCode() {
        return resultCode;
    }

    public void setResultCode(int resultCode) {
        this.resultCode = resultCode;
    }

    public List<HashMap<String, Object>> getCarHisList() {
        return carHisList;
    }

    public void setCarHisList(List<HashMap<String, Object>> carHisList) {
        this.carHisList = carHisList;
    }

    public List<HashMap<String, Object>> getStopData() {
        return stopData;
    }

    public void setStopData(List<HashMap<String, Object>> stopData) {
        this.stopData = stopData;
    }

    public List<HashMap<String, Object>> getAlarmData() {
        return alarmData;
    }

    public void setAlarmData(List<HashMap<String, Object>> alarmData) {
        this.alarmData = alarmData;
    }

    @Override
    public String toString() {
        return "HisData{" +
            "message='" + message + '\'' +
            ", resultCode=" + resultCode +
            ", carHisList=" + carHisList +
            ", stopData=" + stopData +
            ", alarmData=" + alarmData +
            '}';
    }
}
