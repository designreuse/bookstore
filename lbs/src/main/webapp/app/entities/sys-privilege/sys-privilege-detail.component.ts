import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { SysPrivilege } from './sys-privilege.model';
import { SysPrivilegeService } from './sys-privilege.service';

@Component({
    selector: 'jhi-sys-privilege-detail',
    templateUrl: './sys-privilege-detail.component.html'
})
export class SysPrivilegeDetailComponent implements OnInit, OnDestroy {

    sysPrivilege: SysPrivilege;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private sysPrivilegeService: SysPrivilegeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSysPrivileges();
    }

    load(id) {
        this.sysPrivilegeService.find(id).subscribe((sysPrivilege) => {
            this.sysPrivilege = sysPrivilege;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSysPrivileges() {
        this.eventSubscriber = this.eventManager.subscribe(
            'sysPrivilegeListModification',
            (response) => this.load(this.sysPrivilege.id)
        );
    }
}
