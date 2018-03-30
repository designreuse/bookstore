import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { SessionStorageService } from 'ng2-webstorage';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { Tree } from 'ng2-tree';
import { TreeComponent, TreeModel, TreeNode, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { HttpModule, Http } from '@angular/http';
import { environment } from 'environments/environment';
@Component({
  selector: 'group-tree',
  templateUrl: './group-tree.component.html',
  styleUrls: ['./group-tree.component.scss'],
})
export class GroupTreeComponent implements OnInit {

  constructor(private http: Http, private httpclient: HttpClient, private $sessionStorage: SessionStorageService, private toasterService: ToasterService) { }
  @ViewChild('tree') treeComponent: TreeComponent;

  private groupListData = [];

  private searchGroupName = '';
  nodes = [];
  groupName = '';
  groupId = '';
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
    displayField: 'name',
    idField: 'id',
    isExpandedField: 'expand',
    actionMapping: this.actionMapping,
  };

  config: ToasterConfig;
  types: string[] = ['default', 'info', 'success', 'warning', 'error'];
  display = false;

  public resetTree() {
    if (this.searchGroupName === '') {
      this.treeComponent.treeModel.filterNodes('', true);
    }
  }

  // 点击节点确认选择的组名
  public confirm(node) {
    this.groupName = node.data.name;
    this.groupId = node.data.id;
  }

  //获取选择的组名
  public getGroupName() {
    return this.groupName;
  }

  //获取选择的组id
  public getGroupId(){
    return this.groupId;
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

    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getTreeArrayData',
      {
        responseType: 'json', params,
      })
      .subscribe((data:any) => {
        this.groupListData = data;
        for (let i = 0; i < data.length; i++) {
          if (data[i].pId == 0) {
            this.groupListData[i]["expand"] = true;
            break;
          }
        }
        //转换树的数据
        this.nodes = this.transformtoTree(this.groupListData);

      });
  }
  private transformtoTree(data: any) {
    let i, l;
    const key = 'id', childKey = 'children';
    const parentKey = 'pId';
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
}
