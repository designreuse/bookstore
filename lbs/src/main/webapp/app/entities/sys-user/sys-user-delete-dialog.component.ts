import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SysUser } from './sys-user.model';
import { SysUserPopupService } from './sys-user-popup.service';
import { SysUserService } from './sys-user.service';

@Component({
    selector: 'jhi-sys-user-delete-dialog',
    templateUrl: './sys-user-delete-dialog.component.html'
})
export class SysUserDeleteDialogComponent {

    sysUser: SysUser;

    constructor(
        private sysUserService: SysUserService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.sysUserService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'sysUserListModification',
                content: 'Deleted an sysUser'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-sys-user-delete-popup',
    template: ''
})
export class SysUserDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sysUserPopupService: SysUserPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.sysUserPopupService
                .open(SysUserDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
