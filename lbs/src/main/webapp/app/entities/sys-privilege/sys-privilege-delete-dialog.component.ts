import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SysPrivilege } from './sys-privilege.model';
import { SysPrivilegePopupService } from './sys-privilege-popup.service';
import { SysPrivilegeService } from './sys-privilege.service';

@Component({
    selector: 'jhi-sys-privilege-delete-dialog',
    templateUrl: './sys-privilege-delete-dialog.component.html'
})
export class SysPrivilegeDeleteDialogComponent {

    sysPrivilege: SysPrivilege;

    constructor(
        private sysPrivilegeService: SysPrivilegeService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.sysPrivilegeService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'sysPrivilegeListModification',
                content: 'Deleted an sysPrivilege'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-sys-privilege-delete-popup',
    template: ''
})
export class SysPrivilegeDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sysPrivilegePopupService: SysPrivilegePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.sysPrivilegePopupService
                .open(SysPrivilegeDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
