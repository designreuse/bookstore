import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SysRole } from './sys-role.model';
import { SysRoleService } from './sys-role.service';
import {ResponseWrapper} from '../../shared/model/response-wrapper.model';
import {SysPrivilege} from '../sys-privilege/sys-privilege.model';
import {SysPrivilegeService} from '../sys-privilege/sys-privilege.service';

@Component({
    selector: 'jhi-sys-role-privilege',
    templateUrl: './sys-role-privilege.component.html'
})
export class SysRolePrivilegeComponent implements OnInit {

    sysRole: SysRole;
    isSaving: boolean;
    sysPrivileges: SysPrivilege[];
    chosePrivilege: string;
    privilegeName: string;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private sysRoleService: SysRoleService,
        private eventManager: JhiEventManager,
        private sysPrivilegeService: SysPrivilegeService,
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.sysPrivileges= new Array();
        this.privilegeName= '';
        this.findCurPrivilege();
        this.findAllPrivilege();
    }

    findCurPrivilege() {
        this.sysRoleService.findRolePrivilege(this.sysRole.id + '')
            .subscribe((res: ResponseWrapper) => this.privilegeName = res.json().result,
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }

    findAllPrivilege()  {
        this.sysPrivilegeService.query({}).subscribe(
            (res: ResponseWrapper) =>   this.sysPrivileges = res.json,
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.chosePrivilege !== undefined && this.chosePrivilege !== '') {
            this.sysRoleService.updateRolePrivilege(this.sysRole.id + '', this.chosePrivilege)
                .subscribe((res: ResponseWrapper) =>
                    {this.alertService.success(res.json().result, null, null); },
                    (res: ResponseWrapper) => {this.alertService.success(res.json().result, null, null); });
            this.isSaving = false;

        } else {
            // this.subscribeToSaveResponse(
            //     this.sysUserService.create(this.sysUser));
            this.alertService.success('请至少选择一个权限!', null, null);
        }
    }

    deleteRolePrivilege()
    {
        if (this.chosePrivilege !== undefined && this.chosePrivilege !== '') {
            this.sysRoleService.deleteRolePrivilege(this.sysRole.id + '', this.chosePrivilege)
                .subscribe((res: ResponseWrapper) =>
                    {this.alertService.success(res.json().result, null, null);  this.findCurPrivilege();},
                    (res: ResponseWrapper) => {this.alertService.success(res.json().result, null, null); });
            this.isSaving = false;

        } else {
            this.alertService.success('请选择一个权限进行删除!', null, null);
        }
    }

    private subscribeToSaveResponse(result: Observable<SysRole>) {
        result.subscribe((res: SysRole) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: SysRole) {
        this.eventManager.broadcast({ name: 'sysRoleListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}

