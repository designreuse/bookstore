import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { TreeComponent, TreeModel, TreeNode, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { HttpModule, Http } from '@angular/http';
import { Tree } from 'ng2-tree';
import { SessionStorageService, LocalStorageService } from 'ng2-webstorage';

@Component({
    selector: 'lbstree',
    templateUrl: './lbstree.component.html',
    styleUrls: ['./lbstree.component.scss'],
    providers: [],
})

export class LbsTreeComponent implements OnInit {

    constructor(private http: Http, private $sessionStorage: SessionStorageService, private $localStorage: LocalStorageService) { }

    @ViewChild('tree') treeComponent: TreeComponent;

    @Output() onCheck = new EventEmitter<boolean>();

    @Output() sendToasterMsg = new EventEmitter<any>();

    @Output() ondblClick = new EventEmitter<any>();

    @Output() onrightClick = new EventEmitter<any>();

    private searchCarNo: string = "";

    nodes = [];

    actionMapping: IActionMapping = {
        mouse: {
            // click: (tree, node) => this.check(node, !node.data.checked),
            //right click
            contextMenu: (tree, node, $event) => {
                TREE_ACTIONS.SELECT(tree, node, $event);
                this.onrightClick.emit({ node, $event });
            },
            dblClick: (tree, node, $event) => {
                if (node.hasChildren) {
                    TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
                } else {
                    this.ondblClick.emit(node);
                }
            }

        }
    };

    options: ITreeOptions = {
        displayField: 'name',
        idField: 'id',
        isExpandedField: 'expand',
        actionMapping: this.actionMapping,
        // animateExpand: true,
        // animateSpeed: 30,
        // animateAcceleration: 1.2

    };
    showSearch = true;

    types: string[] = ['default', 'info', 'success', 'warning', 'error'];

    public searchCar(isInit) {
        if (this.searchCarNo.length > 0 || isInit == true) {
            //carposition初始化时 或者 有查询条件时
            this.treeComponent.treeModel.filterNodes(this.searchCarNo, true);
            if (!isInit) {
                //点查询按钮时
                this.changeALLNodeToFalse(this.treeComponent.treeModel.getFirstRoot().data);
            }
        } else {
            //无查询条件时
            this.sendToasterMsg.emit({ type: this.types[3], title: null, msg: '请输入车牌号！' });
        }
    }

    //全局查询跳转 勾选
    public noteSearchInitialization(node) {
        node.forEach((every) => {
            if (every.name != null && every.name != undefined && every.name != '' && every.name.indexOf(this.searchCarNo == undefined ? "" : this.searchCarNo) != -1) {
                every.checked = true;
            } else {
                every.checked = false;
            }
            if (every.children) {
                this.noteSearchInitialization(every.children);
            }
        });
    }

    //先更新父子节点的check状态 然后子组件自定义的事件onCheck触发，执行父组件的onCheck方法，用emits(向上弹射)弹射变量
    public check(node, checked) {
        this.updateChildNodeCheckbox(node, checked);
        this.updateParentNodeCheckbox(node.realParent);
        this.onCheck.emit(true);
    }


    // 修改节点及子节点的勾选状态
    public updateChildNodeCheckbox(node, checked) {
        if (node.isHidden && node.isHidden == true) {
            node.data.checked = false;
        } else {
            node.data.checked = checked;
        }
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

    // 修改节点及子节点为不勾选
    public nodeInitializationFalse(nodeArr: Array<any>) {
        nodeArr.forEach((every) => {
            every.checked = false;
            if (every.children) {
                this.nodeInitializationFalse(every.children);
            }
        });
    }

    // 修改节点及子节点勾选状态为false
    public changeALLNodeToFalse(node) {
        node.checked = false;
        if (node.children) {
            node.children.forEach((child) => {
                this.changeALLNodeToFalse(child);
            });
        }
    }
    public resetTree() {
        if (this.searchCarNo === '') {
            this.treeComponent.treeModel.filterNodes('', true);
        }
    }

    filterFn(value, treeModel: TreeModel) {
        treeModel.filterNodes((node) => nodesearch(value, node.data.name));
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
        return this.$sessionStorage.retrieve('carTreeData') || this.$localStorage.retrieve('carTreeData');
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
        return Object.prototype.toString.apply(arr) === "[object Array]";
    }

    ngOnInit() {
        this.nodes = this.$sessionStorage.retrieve('carTreeData') || this.$localStorage.retrieve('carTreeData');
        return this.nodes;
    }

    ngAfterViewInit() {
        const treeModel: TreeModel = this.treeComponent.treeModel;
        const firstNode: TreeNode = treeModel.getFirstRoot();
        // firstNode.setActiveAndVisible();
    }
}

function nodesearch(needle, haystack) {
    const haystackLC = haystack.toLowerCase();
    const needleLC = needle.toLowerCase();

    const hlen = haystack.length;
    const nlen = needleLC.length;

    if (nlen > hlen) {
        return false;
    }
    if (nlen === hlen) {
        return needleLC === haystackLC;
    }
    outer: for (let i = 0, j = 0; i < nlen; i++) {
        const nch = needleLC.charCodeAt(i);

        while (j < hlen) {
            if (haystackLC.charCodeAt(j++) === nch) {
                continue outer;
            }
        }
        return false;
    }
    return true;
}


