/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { LbsTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { SysPrivilegeDetailComponent } from '../../../../../../main/webapp/app/entities/sys-privilege/sys-privilege-detail.component';
import { SysPrivilegeService } from '../../../../../../main/webapp/app/entities/sys-privilege/sys-privilege.service';
import { SysPrivilege } from '../../../../../../main/webapp/app/entities/sys-privilege/sys-privilege.model';

describe('Component Tests', () => {

    describe('SysPrivilege Management Detail Component', () => {
        let comp: SysPrivilegeDetailComponent;
        let fixture: ComponentFixture<SysPrivilegeDetailComponent>;
        let service: SysPrivilegeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LbsTestModule],
                declarations: [SysPrivilegeDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    SysPrivilegeService,
                    JhiEventManager
                ]
            }).overrideTemplate(SysPrivilegeDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SysPrivilegeDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SysPrivilegeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new SysPrivilege(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.sysPrivilege).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
