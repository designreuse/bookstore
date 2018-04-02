import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SysRole } from './sys-role.model';
import { SysRolePopupService } from './sys-role-popup.service';
import { SysRoleService } from './sys-role.service';

@Component({
    selector: 'jhi-sys-role-delete-dialog',
    templateUrl: './sys-role-delete-dialog.component.html'
})
export class SysRoleDeleteDialogComponent {

    sysRole: SysRole;

    constructor(
        private sysRoleService: SysRoleService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.sysRoleService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'sysRoleListModification',
                content: 'Deleted an sysRole'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-sys-role-delete-popup',
    template: ''
})
export class SysRoleDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sysRolePopupService: SysRolePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.sysRolePopupService
                .open(SysRoleDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
