import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SysUser } from './sys-user.model';
import { SysUserService } from './sys-user.service';

@Injectable()
export class SysUserPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private sysUserService: SysUserService

    ) {
        this.ngbModalRef = null;
    }

    openNewPopup(component: Component, id?: number | any) {
        this.modalService.open(component , { size: 'lg', backdrop: 'static'});
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.sysUserService.find(id).subscribe((sysUser) => {
                    if (sysUser.lastlogindate) {
                        sysUser.lastlogindate = {
                            year: sysUser.lastlogindate.getFullYear(),
                            month: sysUser.lastlogindate.getMonth() + 1,
                            day: sysUser.lastlogindate.getDate()
                        };
                    }
                    if (sysUser.createdon) {
                        sysUser.createdon = {
                            year: sysUser.createdon.getFullYear(),
                            month: sysUser.createdon.getMonth() + 1,
                            day: sysUser.createdon.getDate()
                        };
                    }
                    if (sysUser.modifedon) {
                        sysUser.modifedon = {
                            year: sysUser.modifedon.getFullYear(),
                            month: sysUser.modifedon.getMonth() + 1,
                            day: sysUser.modifedon.getDate()
                        };
                    }
                    if (sysUser.modifiedon) {
                        sysUser.modifiedon = {
                            year: sysUser.modifiedon.getFullYear(),
                            month: sysUser.modifiedon.getMonth() + 1,
                            day: sysUser.modifiedon.getDate()
                        };
                    }
                    this.ngbModalRef = this.sysUserModalRef(component, sysUser);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.sysUserModalRef(component, new SysUser());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    sysUserModalRef(component: Component, sysUser: SysUser): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.sysUser = sysUser;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
