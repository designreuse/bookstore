import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SysRole } from './sys-role.model';
import { SysRolePopupService } from './sys-role-popup.service';
import { SysRoleService } from './sys-role.service';
import {SysRolePrivilegeComponent} from './sys-role-privilege.component';

@Component({
    selector: 'jhi-sys-role-dialog',
    templateUrl: './sys-role-dialog.component.html'
})
export class SysRoleDialogComponent implements OnInit {

    sysRole: SysRole;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private sysRoleService: SysRoleService,
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
        if (this.sysRole.id !== undefined) {
            this.subscribeToSaveResponse(
                this.sysRoleService.update(this.sysRole));
        } else {
            this.subscribeToSaveResponse(
                this.sysRoleService.create(this.sysRole));
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

@Component({
    selector: 'jhi-sys-role-popup',
    template: ''
})
export class SysRolePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sysRolePopupService: SysRolePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.sysRolePopupService
                    .open(SysRoleDialogComponent as Component, params['id']);
            } else if ( params['roleId'] ) {
                this.sysRolePopupService
                    .open(SysRolePrivilegeComponent as Component, params['roleId']);
            } else {
                this.sysRolePopupService
                    .open(SysRoleDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
