import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { SysRole } from './sys-role.model';
import { SysRoleService } from './sys-role.service';

@Component({
    selector: 'jhi-sys-role-detail',
    templateUrl: './sys-role-detail.component.html'
})
export class SysRoleDetailComponent implements OnInit, OnDestroy {

    sysRole: SysRole;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private sysRoleService: SysRoleService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSysRoles();
    }

    load(id) {
        this.sysRoleService.find(id).subscribe((sysRole) => {
            this.sysRole = sysRole;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSysRoles() {
        this.eventSubscriber = this.eventManager.subscribe(
            'sysRoleListModification',
            (response) => this.load(this.sysRole.id)
        );
    }
}
