import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeComponent, TreeModel, TreeNode, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { SessionStorageService, LocalStorageService } from 'ng2-webstorage';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
@Component({
  selector: 'car-tree',
  templateUrl: './car-tree.component.html',
  styleUrls: ['./car-tree.component.scss']
})
export class CarTreeComponent implements OnInit {

  constructor(private $sessionStorage: SessionStorageService, private toasterService: ToasterService, private $localStorage: LocalStorageService) { }
  @ViewChild('tree') treeComponent: TreeComponent;

  private searchCarNo = '';
  nodes = [];
  carNo = '';
  actionMapping: IActionMapping = {
    mouse: {
      click: (tree, node, $event) => {
        if (this.confirm(node)) {
          TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event);
        }
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

  ngOnInit() {
    this.nodes = this.$sessionStorage.retrieve('carTreeData')||this.$localStorage.retrieve('carTreeData');
  }

  public searchCar() {
    if (this.searchCarNo !== '') {
      this.treeComponent.treeModel.filterNodes(this.searchCarNo, true);
    } else {
      this.showToast(this.types[3], null, '请输入车牌号！');
    }
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

    this.toasterService.popAsync(toast);
  }

  public resetTree() {
    if (this.searchCarNo === '') {
      this.treeComponent.treeModel.filterNodes('', true);
    }
  }

  // 点击节点确认选择的车牌号
  public confirm(node) {
    //只有车辆的iconSkin才是off或on 如果选择的不是车辆，弹出warning并且告诉下一步不把节点设置为选中
    if (node.data.iconSkin == "off" || node.data.iconSkin == "on") {
      this.carNo = node.data.name;
      return true;
    } else {
      this.showToast(this.types[3], null, '请选择正确车牌号码！');
      return false;
    }
  }

  //carhisline.component调用该方法获取选择的车牌号
  public getCarNo() {
    return this.carNo;
  }
}
