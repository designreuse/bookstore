import { Component, OnInit,ViewChild } from '@angular/core';


import 'style-loader!../../../../../node_modules/ztree/css/metroStyle/metroStyle.css';
import {ZtreeComponent} from '../../components/ztree/ztree.component';
//import 'style-loader!../../../../../node_modules/ztree/css/zTreeStyle/zTreeStyle.css';

@Component({
    selector:'ztreedemo',
    templateUrl:'./ztreedemo.html'
})

export class ZtreeDemoComponent {
    @ViewChild('ztreeInstance') ztreeInstance: ZtreeComponent;

    setting: any = {
        check: {
            enable: true
        },
        view: {
            showLine: true,
            showIcon: false
        },
        callback: {
            onClick: function (event, treeId, treeNode, clickFlag) {
                console.info(treeNode);
            },
            onCheck: function (e, treeId, treeNode) {
                console.info(treeNode);
            }
        }
    }

    nodes: any = [
        {
            id: "1",
            name: "父节点1", children: [
                { id: "2", name: "子节点1" },
                { id: "3", name: "子节点2" },
                { id: "4", name: "子节点3" }
            ]
        }
    ];
    

    getCheckedData() {
        //通过ZtreeComponent抛出来的getZtreeInstance()方法访问ztree函数
        console.info(this.ztreeInstance.getTreeInstance().getCheckedNodes(true));       
    }


    reloadData(){

      this.nodes=[
        {
            id: "1",
            name: "父节点2", children: [
                { id: "2", name: "子节点11" },
                { id: "3", name: "子节点12" },
                { id: "4", name: "子节点13" }
            ]
        }
    ];
    
    }



    onApprove(nodes){
        console.info(nodes);
    }
}

