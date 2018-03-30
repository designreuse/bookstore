import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeComponent, TreeModel, TreeNode, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';

import { HttpModule, Http } from '@angular/http';
import { Tree } from 'ng2-tree';

@Component({
    selector: 'ngtree2',
    template: `
            <div class="row">
            <div class="col-md-6">
            <nb-card>
            <nb-card-header>ngTree2</nb-card-header>
            <nb-card-body>
            <div>
                <button (click)="tree.treeModel.expandAll()">ExpandAll</button>
                <button (click)="tree.treeModel.collapseAll()">CollapseAll</button>
            </div>
            <div>
                <input id="filter" #filter (keyup)="tree.treeModel.filterNodes(filter.value,true)" placeholder="search node"/>
               <!-- <input id="filter2" #filter2 (keyup)="filterFn(filter2.value, tree.treeModel)" placeholder="filter nodes by fuzzy search"/>-->
            </div>
            <div class="tree-content">
                <tree-root #tree [nodes]="nodes" [options]="options">                   
                </tree-root>
            </div>           
            </nb-card-body>
            </nb-card>
            </div>
            </div>
    `,
    styles: [`
      .tree-content {
        margin-top:5px;
        height:400px;
        display: flex;
        flex-direction: column;
      }

`]
})

// <ng-template #treeNodeTemplate let-node="node" let-index="index" >
// <input
// (change)="check(node, !node.data.checked)"
// type="checkbox"
// [indeterminate]="node.data.indeterminate"
// [checked]="node.data.checked">

// {{ node.data.name }}
// </ng-template>

export class NgTreeDemoComponent implements OnInit {

    constructor(private http: Http) { }

    @ViewChild('tree') treeComponent: TreeComponent;

    nodes = [];

    actionMapping: IActionMapping = {
        mouse: {
            // click: (tree, node) => this.check(node, !node.data.checked),
            dblClick: (tree, node, $event) => {
                if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
            }

        }
    };

    options: ITreeOptions = {
        displayField: 'name',
        idField: 'id',
        isExpandedField: 'expanded',
        actionMapping: this.actionMapping,
        // animateExpand: true,
        // animateSpeed: 30,
        // animateAcceleration: 1.2

    };

    public check(node, checked) {
        this.updateChildNodeCheckbox(node, checked);
        this.updateParentNodeCheckbox(node.realParent);
    }

    public updateChildNodeCheckbox(node, checked) {
        node.data.checked = checked;
        if (node.hasChildren) {
            node.children.forEach((child) => this.updateChildNodeCheckbox(child, checked));
        }
    }

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

    filterFn(value, treeModel: TreeModel) {
        treeModel.filterNodes((node) => nodesearch(value, node.data.name));
    }



    ngAfterInit() {
        const treeModel: TreeModel = this.treeComponent.treeModel;
        const firstNode: TreeNode = treeModel.getFirstRoot();

        firstNode.setActiveAndVisible();
    }


    isArray(arr: any) {
        return Object.prototype.toString.apply(arr) === "[object Array]";
    }

    private transformtoTree(data: any) {
        var i, l;
        var key = 'id', childKey = 'children';
        var parentKey = 'pId';

        if (!key || key == "" || !data) return [];

        if (this.isArray(data)) {
            var r = [];
            var tmpMap = [];
            for (i = 0, l = data.length; i < l; i++) {
                if (!data[i]["checked"])
                    data[i]["checked"] = false;
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

    ngOnInit() {
        //setTimeout(() => {
        this.http.get('assets/mock-data/treedata.json').map(data => data.json()).subscribe(data => {
            console.log(data);
            this.nodes = this.transformtoTree(data);
        });
        //}, 5000);
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


