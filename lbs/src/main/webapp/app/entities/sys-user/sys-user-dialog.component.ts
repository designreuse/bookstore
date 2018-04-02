import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SysUser } from './sys-user.model';
import { SysUserPopupService } from './sys-user-popup.service';
import { SysUserService } from './sys-user.service';
import {SysUserRoleComponent} from './sys-user-role.component';

@Component({
    selector: 'jhi-sys-user-dialog',
    templateUrl: './sys-user-dialog.component.html'
})
export class SysUserDialogComponent implements OnInit {

    sysUser: SysUser;
    isSaving: boolean;
    lastlogindateDp: any;
    createdonDp: any;
    modifedonDp: any;
    modifiedonDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private sysUserService: SysUserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.sysUser.id !== undefined) {
            this.subscribeToSaveResponse(
                this.sysUserService.update(this.sysUser));
        } else {
            this.subscribeToSaveResponse(
                this.sysUserService.create(this.sysUser));
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

@Component({
    selector: 'jhi-sys-user-popup',
    template: ''
})
export class SysUserPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sysUserPopupService: SysUserPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.sysUserPopupService
                    .open(SysUserDialogComponent as Component, params['id']);
            } else if ( params['userId'] ) {
                this.sysUserPopupService
                    .open(SysUserRoleComponent as Component, params['userId']);
            }else {
                this.sysUserPopupService
                    .open(SysUserDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
