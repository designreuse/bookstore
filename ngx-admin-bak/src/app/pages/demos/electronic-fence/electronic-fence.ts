export class ElecFenceInfo {
        //id
        elecFenceId: number;
        //图形形状
        layerType: string;
        //所有经纬度
        latlng: JSON;
        //圆半径(圆形形状)
        radius: number;
        //围栏开始时间
        startTime: string;
        //围栏结束时间
        endTime: string;
        //开启电子围栏
        open: boolean;
        //是否再地图上显示
        show: boolean;
        //启用全天
        allday: boolean;
        //围栏名称
        fenceName: string;
        //告警类型
        alarmType: number;
        //区域范围(m)
        areaRange: number;
        //速度区间(示例10-20)
        speedRange: string;
        //时长限制(分钟)
        timeLimit: number;

        constructor(){
                this.open = true;
                this.show = false;
                this.allday = false;
        }

}
