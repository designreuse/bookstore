import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { SessionStorageService } from 'ng2-webstorage';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { Tree } from 'ng2-tree';
import { TreeComponent, TreeModel, TreeNode, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { HttpModule, Http } from '@angular/http';
import { environment } from 'environments/environment';
@Component({
  selector: 'role-auth-tree',
  templateUrl: './role-auth-tree.component.html',
  styleUrls: ['./role-auth-tree.component.scss'],
})
export class RoleAuthTreeComponent implements OnInit {

  constructor(private http: Http, private httpclient: HttpClient, private $sessionStorage: SessionStorageService, private toasterService: ToasterService) { }
  @ViewChild('tree') treeComponent: TreeComponent;

  groupListData = [];

  searchGroupName = '';
  nodes = [];
  groupName = '';
  actionMapping: IActionMapping = {
    mouse: {
      click: (tree, node, $event) => {
        this.confirm(node);
        TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event);
      },
      dblClick: (tree, node, $event) => {
        if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
      }
    }
  };

  options: ITreeOptions = {
    displayField: 'PRIVILEGE_NAME',
    idField: 'PRIVILEGE_ID',
    isExpandedField: 'expand',
    actionMapping: this.actionMapping,
  };

  config: ToasterConfig;
  types: string[] = ['default', 'info', 'success', 'warning', 'error'];
  display = false;

  //先更新父子节点的check状态 然后子组件自定义的事件onCheck触发，执行父组件的onCheck方法
    public check(node, checked) {
        this.updateChildNodeCheckbox(node, checked);
        this.updateParentNodeCheckbox(node.realParent);
    }


    // 修改节点及子节点的勾选状态
    public updateChildNodeCheckbox(node, checked) {
        node.data.checked = checked;
        if (node.hasChildren) {
            node.children.forEach((child) => this.updateChildNodeCheckbox(child, checked));
        }
    }

    // 修改父节点的勾选状态
    public updateParentNodeCheckbox(node) {
        if (!node) {
            return;
        }

        let allChildrenChecked = true;
        let noChildChecked = true;

        for (const child of node.children) {
            if (!child.data.checked || child.data.indeterminate) {
                allChildrenChecked = false;
            }
            if (child.data.checked) {
                noChildChecked = false;
            }
        }

        if (allChildrenChecked) {
            node.data.checked = true;
            node.data.indeterminate = false;
        } else if (noChildChecked) {
            node.data.checked = false;
            node.data.indeterminate = false;
        } else {
            node.data.checked = true;
            node.data.indeterminate = true;
        }
        this.updateParentNodeCheckbox(node.parent);
    }

    // 修改节点及子节点的勾选状态
    public noteInitialization(node) {
        node.forEach((every) => {
            every.checked = true;
            if (every.children) {
                this.noteInitialization(every.children);
            }
        });
    }

  public resetTree() {
    if (this.searchGroupName === '') {
      this.treeComponent.treeModel.filterNodes('', true);
    }
  }

  // 点击节点确认选择的组名
  public confirm(node) {
    this.groupName = node.data.name;
  }

  //获取选择的车牌号
  public getGroupName() {
    return this.groupName;
  }

  // 消息弹框
  showToast(type: string, title: string, msg: string) {
    this.config = new ToasterConfig({
      positionClass: 'toast-center',
      timeout: 5000,
      newestOnTop: true,
      tapToDismiss: true,
      preventDuplicates: false,
      animation: 'fade',
      limit: 1,
    });

    const toast: Toast = {
      type: type,
      title: title,
      body: msg,
      timeout: 5000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
  }
  public searchGroup() {
    if (this.searchGroupName !== '') {
      this.treeComponent.treeModel.filterNodes(this.searchGroupName, true);
    } else {
      this.showToast(this.types[3], null, '请输入组名！');
    }
  }


  ngOnInit() {
    // 初始化树的数据
    const params = new HttpParams().set('groupFlag', 'group');

    // this.httpclient.request('POST', 'http://localhost:8080/rolemanager/roleauth',
    this.httpclient.request('POST', environment.INTERFACE_URL+'/api/getallPris',
      {
        responseType: 'json', params,
      })
      .do(console.log).shareReplay().subscribe(data => {
        console.log(data);
        this.groupListData = data;
        for (let i = 0; i < data.length; i++) {
          if (data[i].pId == 0) {
            this.groupListData[i]["expand"] = true;
            break;
          }
        }
        //转换树的数据
        this.nodes = toTree(this.groupListData);
        console.log(this.nodes);
      });
  }
  private transformtoTree(data: any) {
    let i, l;
    const key = 'PRIVILEGE_ID', childKey = 'children';
    const parentKey = 'PRIVILEGE_PID';
    if (!key || !data) return [];

    if (this.isArray(data)) {
      const r = [];
      const tmpMap = [];
      for (i = 0, l = data.length; i < l; i++) {
        if (!data[i]['checked'])
          data[i]['checked'] = false;
        tmpMap[data[i][key]] = data[i];
      }

      for (i = 0, l = data.length; i < l; i++) {
        if (tmpMap[data[i][parentKey]] && data[i][key] != data[i][parentKey]) {
          if (!tmpMap[data[i][parentKey]][childKey])
            tmpMap[data[i][parentKey]][childKey] = [];
          tmpMap[data[i][parentKey]][childKey].push(data[i]);
        } else {
          r.push(data[i]);
        }
      }
      return r;
    } else {
      return [data];
    }
  }
  
  isArray(arr: any) {
    return Object.prototype.toString.apply(arr) === '[object Array]';
  }

  // 获取勾选中的节点,需要初始化时获取所有节点
  public getAllcheckedNode() {
    const nodeArray = new Array();
    if (this.nodes.length > 0) {
        this.nodes.forEach((node) => {
            this.getCheckedNodeKeyId(node, nodeArray);
        });
    }
    return nodeArray;
  }

  // 循环遍历勾选中的节点
  // node:树的节点集合, nodeArray：符合条件的结果集合, allOrCheck:true时仅获取勾选的节点,false的话获取所有节点数据
  public getCheckedNodeKeyId(node, nodeArray) {
    if (node.checked) {
        nodeArray.push(node);
    }

    if (node.children !== undefined && node.children.length > 0) {
        node.children.forEach((child) => this.getCheckedNodeKeyId(child, nodeArray));
    }
  }
  getNodes() {
    return this.nodes;
  }
}


function toTree(data) {

  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  var map = {};
  data.forEach(function (item) {
      map[item.PRIVILEGE_ID] = item;
  });
//        console.log(map);

  var val = [];
  data.forEach(function (item) {

      // 以当前遍历项，的pid,去map对象中找到索引的id
      var parent = map[item.PRIVILEGE_PID];

      // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
      if (parent) {

          (parent.children || ( parent.children = [] )).push(item);

      } else {
          //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
          val.push(item);
      }
  });

  return val;
}