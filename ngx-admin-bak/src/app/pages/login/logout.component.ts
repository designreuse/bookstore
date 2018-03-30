/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit }        from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ng2-webstorage';
import {Principal} from './user/principal.service';
@Component({
    selector: 'nb-logout',
    template:'',
})
export class NbLogoutComponent  implements OnInit {
    constructor(protected router: Router,
        private principal: Principal,
        private $sessionStorage: SessionStorageService,) {
     }
    ngOnInit(): void {
        this.router.navigateByUrl('/#/auth');
      }
  
}
