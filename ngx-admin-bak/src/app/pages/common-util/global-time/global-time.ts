import { PagesService } from 'app/pages/pages.service';
import { Component, OnInit } from '@angular/core';

export const globalTime = {
    cn:{
        firstDayOfWeek: 0,
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        today: '今天',
        clear: '清除',
    },
    dataRageOption: {
        "timePicker": true,
        "timePicker24Hour": true,
        "drops": "down",
        "opens": "center",
        "showDropdowns": true,
        "locale": {
          "format": "YYYY-MM-DD HH:mm",
          "separator": " -- ",
          "applyLabel": "确认",
          "cancelLabel": "取消",
          "fromLabel": "From",
          "toLabel": "To",
          "customRangeLabel": "Custom",
          "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
          "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
          "firstDay": 1
        },
        "startDate": PagesService.prototype.fmtDateToStr(new Date()) + ' 00:00',
        "endDate": PagesService.prototype.fmtDateToStr(new Date()) + ' 23:59'
      }
};
