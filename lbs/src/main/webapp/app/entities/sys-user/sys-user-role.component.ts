import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SysUser } from './sys-user.model';
import { SysUserService } from './sys-user.service';
import {SysRole} from '../sys-role/sys-role.model';
import {ResponseWrapper} from '../../shared/model/response-wrapper.model';
import {SysRoleService} from '../sys-role/sys-role.service';

@Component({
    selector: 'jhi-sys-user-role',
    templateUrl: './sys-user-role.component.html'
})
export class SysUserRoleComponent implements OnInit {

    sysUser: SysUser;
    isSaving: boolean;
    sysRoles: SysRole[];
    choseRole: string;
    roleName: string;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private sysUserService: SysUserService,
        private eventManager: JhiEventManager,
        private sysRoleService: SysRoleService,

    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.sysRoles = new Array();
        this.roleName = '';
        this.findCurRole();
        this.findAllRole();

    }

    findCurRole() {
        this.sysUserService.findUserRole(this.sysUser.id + '')
            .subscribe((res: ResponseWrapper) => this.roleName = res.json().result,
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }

    findAllRole()  {
        this.sysRoleService.query({}).subscribe(
            (res: ResponseWrapper) =>   this.sysRoles = res.json,
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.choseRole !== undefined && this.choseRole !== '') {
            // this.subscribeToSaveResponse(
            //     this.sysUserService.update(this.sysUser));
            this.sysUserService.updateUserRole(this.sysUser.id + '', this.choseRole)
                .subscribe((res: ResponseWrapper) =>
                    {this.alertService.success(res.json().result, null, null); },
                (res: ResponseWrapper) => {this.alertService.success(res.json().result, null, null); });
            this.isSaving = false;

        } else {
            // this.subscribeToSaveResponse(
            //     this.sysUserService.create(this.sysUser));
            this.alertService.success('请选择一个角色!', null, null);
        }
    }

    deleteUserRole()
    {
        if (this.choseRole !== undefined && this.choseRole !== '') {
            this.sysUserService.deleteUserRole(this.sysUser.id + '', this.choseRole)
                .subscribe((res: ResponseWrapper) =>
                    {this.alertService.success(res.json().result, null, null);this.findCurRole(); },
                    (res: ResponseWrapper) => {this.alertService.success(res.json().result, null, null); });
            this.isSaving = false;

        } else {
            this.alertService.success('请选择一个角色进行删除!', null, null);
        }
    }

    private subscribeToSaveResponse(result: Observable<SysUser>) {
        result.subscribe((res: SysUser) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: SysUser) {
        this.eventManager.broadcast({ name: 'sysUserListModification', content: 'OK'});
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
