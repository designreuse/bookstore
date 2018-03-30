import { RoleAuthTreeComponent } from './../../lbs-common/role-auth-tree/role-auth-tree.component';
import { RoleManagerService } from './role-manager.service';
import { RoleData } from './roleModel';
import { Component } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { environment } from 'environments/environment';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { OnInit, ViewChild, OnDestroy, SimpleChange, Input } from '@angular/core';
import { Message } from 'primeng/primeng';

@Component({
  selector: 'role-manager',
  // styleUrls: ['role-manager.component.scss'],
  templateUrl: 'role-manager.component.html',
  providers: [ RoleManagerService ],
})

export class RoleManagerComponent implements OnInit{

    addDialog: boolean = false;
    editDialog: boolean = false;
    authDialog: boolean = false;
    deleteDialog: boolean = false;

    roleData: RoleData;
    roleDatas: RoleData[] = [];
    cols: any[];

    nodes = [];
    msgs: Message[] = [];
    idList = [];
    idListForEmpty = [];
    
    @ViewChild('roleAuthTree') roleAuthTree: RoleAuthTreeComponent;
    constructor(private http: Http, private httpclient: HttpClient, private roleManagerService: RoleManagerService) {
      this.roleData = {
        ROLE_ID: '',
        ROLE_NAME: '',
        ROLE_DESC: ''
      };
      // this.roleDatas = [
      //   {'ROLE_ID':1,'ROLE_NAME':'管理员','ROLE_DESC':'管理员'},
      //   {'ROLE_ID':2,'ROLE_NAME':'用户','ROLE_DESC':'用户'}
      // ];
  }

  ngOnInit() {

    this.cols = [
      { field: 'ROLE_NAME', header: '角色', sort: true },
      { field: 'ROLE_DESC', header: '描述', sort: true },
    ];
    this.searchRoles();
  }

  initRoleData(){
    this.roleData = {
      ROLE_ID: '',
      ROLE_NAME: '',
      ROLE_DESC: ''
    };
  }

  showAddDialog() {
    this.initRoleData();
    this.addDialog = true;
  }

  showEditDialog(roleData: RoleData) {
    this.roleData = {
      ROLE_ID: roleData.ROLE_ID,
      ROLE_NAME: roleData.ROLE_NAME,
      ROLE_DESC:  roleData.ROLE_DESC
    };
    this.editDialog = true;
  }

  showAuthDialog(roleData: RoleData) {
    this.roleData = roleData;
    if(this.nodes.length == 0){
      this.nodes = this.roleAuthTree.getNodes();
    }
    this.getRoleAuth();
    this.authDialog = true;
  }
  
  showDeleteDialog(roleData: RoleData) {
    this.roleData = roleData;
    this.deleteDialog = true;
  }

 
  showMessage(_severity,_detail,_summary?) {
    this.msgs = [];
    this.msgs.push({severity:_severity, detail:_detail, summary:_summary});
  }
  
  showSuccessMessage(_detail) {
    this.showMessage('success',_detail);
  }

  showErrorMessage(_detail) {
    this.showMessage('error',_detail);
  }

  showWarnMessage(_detail) {
    this.showMessage('warn',_detail);
  }

  addCancel() {
    this.addDialog = false;
  }
  editCancel() {
    this.editDialog = false;
  }

  authCancel() {
    this.authDialog = false;
    if(this.roleAuthTree.searchGroupName != ''){
      this.roleAuthTree.searchGroupName = '';
      this.roleAuthTree.resetTree();
    }
  }

  deleteCancel() {
    this.deleteDialog = false;
  }
  /**
   * 新增角色
   */
  addRole() {
    let roleName = this.roleData.ROLE_NAME;
    if(roleName == undefined || roleName == null || roleName.length == 0){
      this.showWarnMessage("角色名不能为空");
    }else{
      this.roleManagerService.addRoleData(this.roleData)
      .subscribe(
        (data) => {
            console.log("Add role call successful value returned in body", data);
            if(data != null && data.result == 0){
              this.showSuccessMessage(data.message);
              this.searchRoles();
            }else{
              this.showErrorMessage(data.message);
            }
        },
        error => {
            console.log("Add role call in error", error);
            this.showErrorMessage("新增角色失败");
        });
      this.addDialog = false;
    }
  }
  /**
   * 查询角色列表
   */
  searchRoles(){
    this.roleManagerService.searchRoles()
    .subscribe(
      (data) => {
          console.log("Search roles call successful value returned in body", data);
          this.roleDatas = data;
      },
      error => {
          console.log("Search roles call in error", error);
          this.showErrorMessage("查询角色列表失败");
      });
  }
  /**
   * 修改角色详情
   */
  editRoleInfo(){
    let roleName = this.roleData.ROLE_NAME;
    if(roleName == undefined || roleName == null || roleName.length == 0){
      this.showWarnMessage("角色名不能为空");
    }else{
    this.roleManagerService.editRoleData(this.roleData)
    .subscribe(
      (data) => {
          console.log("Edit role call successful value returned in body", data);
          if(data != null && data.result == 0){
            this.showSuccessMessage(data.message);
            this.searchRoles();
          }else{
            this.showErrorMessage(data.message);
          }
      },
      error => {
          console.log("Edit role call in error", error);
          this.showErrorMessage("修改角色失败");
      });
    this.editDialog = false;
    }
  }
  /**
   * 删除角色
   */
  deleteRole() {
    this.roleManagerService.deleteRoleData(this.roleData.ROLE_ID)
    .subscribe(
      (data) => {
          console.log("Delete role call successful value returned in body", data);
          if(data != null && data.result == 0){
            this.showSuccessMessage(data.message);
            this.searchRoles();
          }else{
            this.showErrorMessage(data.message);
          }
      },
      error => {
          console.log("Delete role call in error", error);
          this.showErrorMessage("删除角色失败");
      });
      this.deleteDialog = false;
  }

  /**
   * 获取角色权限
   */
  getRoleAuth() {
    this.roleManagerService.getRoleAuth(this.roleData.ROLE_ID)
    .subscribe(
      (data) => {
          console.log("Get role auth call successful value returned in body", data);
          this.idList = [];
          data.forEach((every) => {
            this.idList.push(every.PRIVILEGE_ID);
          });
          this.autoCheckTreeNode(this.nodes,this.idList);
      },
      error => {
          console.log("Get role auth call in error", error);
          this.showErrorMessage("查询角色权限失败");
      });
  }

  /**
   * 设置角色权限
   */
  setRoleAuth() {
    this.getKeyIdFromTree();
    this.roleManagerService.setRoleAuth(this.roleData.ROLE_ID, this.idList)
    .subscribe(
      (data) => {
          console.log("Set role auth call successful value returned in body", data);
          if(data != null && data.result == 0){
            this.showSuccessMessage(data.message);
          }else{
            this.showErrorMessage(data.message);
          }
      },
      error => {
          console.log("Set role auth call in error", error);
          this.showErrorMessage("修改角色权限失败");
      });
    this.authDialog = false;
  }

  /**
   * 获取所有权限
   */
  getAllAuth() {
    this.roleManagerService.getAllAuth()
    .subscribe(
      (data) => {
          console.log("Get all auth call successful value returned in body", data); 
      },
      error => {
          console.log("Get all auth call in error", error);
          this.showErrorMessage("查询所有角色权限失败");
      });
  }

  
  //自动勾选树的终端
  autoCheckTreeNode(node,idList) {
    node.forEach((every) => {
        let id = every.PRIVILEGE_ID;
        if (id != null && id != undefined && id != '' && idList.indexOf(id) != -1) {
          every.checked = true;
      } else {
          every.checked = false;
      }   

      if (every.children) {
          this.autoCheckTreeNode(every.children,idList);
      }
    });
  }

  //获取keyId集合
  getKeyIdFromTree() {
    this.idList = [];
    let nodeArray = this.roleAuthTree.getAllcheckedNode();
    if (nodeArray.length > 0) {
      nodeArray.forEach((checkedNode) => {
        this.idList.push(checkedNode.PRIVILEGE_ID);
      });
    }
  }
}
