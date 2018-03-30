import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: '首页',
    icon: 'nb-home',
    link: '/pages/dashboard',
    home: true,
  },
  // {
  //   title: 'FEATURES',
  //   group: true,
  // },
  // {
  //   title: 'UI Features',
  //   icon: 'nb-keypad',
  //   link: '/pages/ui-features',
  //   children: [
  //     {
  //       title: 'Buttons',
  //       link: '/pages/ui-features/buttons',
  //     },
  //     {
  //       title: 'Grid',
  //       link: '/pages/ui-features/grid',
  //     },
  //     {
  //       title: 'Icons',
  //       link: '/pages/ui-features/icons',
  //     },
  //     {
  //       title: 'Modals',
  //       link: '/pages/ui-features/modals',
  //     },
  //     {
  //       title: 'Typography',
  //       link: '/pages/ui-features/typography',
  //     },
  //     {
  //       title: 'Animated Searches',
  //       link: '/pages/ui-features/search-fields',
  //     },
  //     {
  //       title: 'Tabs',
  //       link: '/pages/ui-features/tabs',
  //     },
  //   ],
  // },
  {
    title: '车辆信息',
    icon: 'ion-android-car',
    children: [
      {
        title: '地图监控',
        link: '/pages/maps/CarPosition/' + 'jshx123456JSHX',
      },
      {
        title: '车辆轨迹',
        link: '/pages/maps/CarHisLine',
      },
      {
        title: '实时视频',
        link: '/pages/maps/lbs-video',
      },
      {
        title: '历史视频',
        link: '/pages/maps/lbs-history-video',
      }
    ],
  },
  {
    title: '统计报表',
    icon: 'nb-tables',
    children: [
      // {
      //   title: '告警信息',
      //   link: '/pages/alarmTable/alarm-table',
      // },
      {
        title: '报警处理',
        link: '/pages/charts/alarm-deal',
      },
      {
        title: '报警统计',
        link: '/pages/charts/alarm-trend-chart',
      },
      // {
      //   title: '告警分类统计',
      //   link: '/pages/charts/alarm-type-pie',
      // },
    //  {
    //   title:'驾驶员告警统计',
    //   link:'/pages/charts/driver-report',
    //  },
     {
      title:'驾驶员评分表',
      link:'/pages/charts/driver-score',
     },
     {
      title:'主动安全报警查询日志',
      link:'/pages/charts/alarm-query',
     },
     {
      title:'历史升级记录查询',
      link:'/pages/charts/upgrade-record',
     },
     {
      title:'驾驶员异常处理报表',
      link:'/pages/charts/driver-anormity',
     }
    ],

  },
  {
    title: '系统维护',
    icon: 'ion-wrench',
    children: [
      {
        title:'终端在线升级',
        link: '/pages/charts/sys-up',
        // '/pages/maps/systemupdate',
      },
      {
         title: '用户管理',
        //  link: '/pages/system-manager/user-manager',
       },
       {
         title: '角色管理',
         link: '/pages/system-manager/role-manager',
       },
       {
        title: '系统配置',
        // link: '/pages/maps/CarPosition',
      },
      {
        title: '服务配置',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '用户反馈',
        // link: '/pages/maps/CarPosition',
      },
      {
        title: '用户反馈信息',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '告警栏配置',
        // link: '/pages/maps/CarPosition',
      },
      {
        title: '用户加载配置',
        // link: '/pages/components/CarHisLine',
      },
     ],
  }, 
  {
    title: '地物搜索',
    icon: 'nb-search',
  },
  {
    title: '电子围栏',
    icon: 'ion-android-checkbox-outline-blank',
    children: [
      {
         title: '围栏设置',
         link: '/pages/maps/electronicFence',
      },
      {
        title: '多边区域',
        //  link: '/pages/components/CarHisLine',
      },
      {
        title: '点型区域',
        //  link: '/pages/maps/CarPosition',
      },
      {
        title: '线型区域',
        //  link: '/pages/components/CarHisLine',
      },
      {
        title: '定时定位查车',
        //  link: '/pages/maps/CarPosition',
      },
      {
        title: '行政区划',
        //  link: '/pages/components/CarHisLine',
      },
      {
        title: '围栏维护',
        //  link: '/pages/maps/CarPosition',
      },
      {
        title: '线路设置',
        //  link: '/pages/components/CarHisLine',
      },
      {
        title: '创建轨迹路径',
        //  link: '/pages/components/CarHisLine',
      },
      {
        title: '路径管理',
        //  link: '/pages/components/CarHisLine',
      },
    ],
  },
  {
    title: '基础信息',
    icon: 'ion-ios-list-outline',
    children: [
      {
        title: '车辆终端设置',
        link: '/pages/baseinfo/CarTerminal',
      },
      {
        title: '车辆信息设置',
        //  link: '/pages/components/CarHisLine',
      },
      {
        title: '车型设置',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '押运员设置',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '驾驶员设置',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '定点拍照区域',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '定点拍照设置',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '定时拍照设置',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '调度信息类别设置',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '查看终端参数',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '标记管理',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '告警处理管理',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '车辆调度管理',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '车辆维修管理',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '两点查车',
        // link: '/pages/components/CarHisLine',
      },
    ],
  },
  {
    title: '车辆调度',
    icon: 'ion-ios-loop',
    children: [
      {
        title: '信息发布',
        //  link: '/pages/maps/CarPosition',
      },
      {
        title: '信息播报',
        //  link: '/pages/components/CarHisLine',
      },
      {
        title: '设备操作',
        // link: '/pages/maps/CarPosition',
      },
      {
        title: '点名操作',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '提问下发',
        // link: '/pages/maps/CarPosition',
      },
      {
        title: '终端控制',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '设置电话本',
        // link: '/pages/maps/CarPosition',
      },
      {
        title: '事件设置',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '信息点播',
        // link: '/pages/maps/CarPosition',
      },
    ],
  },
  {
    title: '运营分析',
    icon: 'ion-ios-paper-outline',
    children: [
      {
        title: '油量分析图',
        //  link: '/pages/maps/CarPosition',
      },
      {
        title: '油耗月报表',
        //  link: '/pages/components/CarHisLine',
      },
      {
        title: '行驶轨迹报表',
        // link: '/pages/maps/CarPosition',
      },
      {
        title: '车辆位置报表',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '拍照统计报表',
        // link: '/pages/maps/CarPosition',
      },
      {
        title: '车辆拍照报表',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: '疑点分析图表',
        // link: '/pages/maps/CarPosition',
      },
    ],
  },
  {
    title: '帮助专区',
    icon: 'ion-ios-help-outline',
    children: [
      {
        title: '近期更新',
        //  link: '/pages/maps/CarPosition',
      },
      {
        title: '里程原理',
        //  link: '/pages/components/CarHisLine',
      },
      {
        title: '用户手册',
        // link: '/pages/maps/CarPosition',
      },
      {
        title: '服务承诺',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: 'AE型视频',
        // link: '/pages/maps/CarPosition',
      },
      {
        title: 'AB型视频',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: 'AO型视频',
        // link: '/pages/maps/CarPosition',
      },
      {
        title: '手机客户端',
        // link: '/pages/components/CarHisLine',
      },
      {
        title: 'flash插件下载',
        // link: '/pages/maps/CarPosition',
      },
    ],
  },
];
