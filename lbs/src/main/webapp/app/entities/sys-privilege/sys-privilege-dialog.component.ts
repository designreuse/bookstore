import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SysPrivilege } from './sys-privilege.model';
import { SysPrivilegePopupService } from './sys-privilege-popup.service';
import { SysPrivilegeService } from './sys-privilege.service';

@Component({
    selector: 'jhi-sys-privilege-dialog',
    templateUrl: './sys-privilege-dialog.component.html'
})
export class SysPrivilegeDialogComponent implements OnInit {

    sysPrivilege: SysPrivilege;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private sysPrivilegeService: SysPrivilegeService,
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
        if (this.sysPrivilege.id !== undefined) {
            this.subscribeToSaveResponse(
                this.sysPrivilegeService.update(this.sysPrivilege));
        } else {
            this.subscribeToSaveResponse(
                this.sysPrivilegeService.create(this.sysPrivilege));
        }
    }

    private subscribeToSaveResponse(result: Observable<SysPrivilege>) {
        result.subscribe((res: SysPrivilege) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: SysPrivilege) {
        this.eventManager.broadcast({ name: 'sysPrivilegeListModification', content: 'OK'});
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
    selector: 'jhi-sys-privilege-popup',
    template: ''
})
export class SysPrivilegePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sysPrivilegePopupService: SysPrivilegePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.sysPrivilegePopupService
                    .open(SysPrivilegeDialogComponent as Component, params['id']);
            } else {
                this.sysPrivilegePopupService
                    .open(SysPrivilegeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
