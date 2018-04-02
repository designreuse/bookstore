import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { SysUser } from './sys-user.model';
import { SysUserService } from './sys-user.service';

@Component({
    selector: 'jhi-sys-user-detail',
    templateUrl: './sys-user-detail.component.html'
})
export class SysUserDetailComponent implements OnInit, OnDestroy {

    sysUser: SysUser;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private sysUserService: SysUserService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSysUsers();
    }

    load(id) {
        this.sysUserService.find(id).subscribe((sysUser) => {
            this.sysUser = sysUser;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSysUsers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'sysUserListModification',
            (response) => this.load(this.sysUser.id)
        );
    }
}
