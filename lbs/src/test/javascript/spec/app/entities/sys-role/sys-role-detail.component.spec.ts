/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { LbsTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { SysRoleDetailComponent } from '../../../../../../main/webapp/app/entities/sys-role/sys-role-detail.component';
import { SysRoleService } from '../../../../../../main/webapp/app/entities/sys-role/sys-role.service';
import { SysRole } from '../../../../../../main/webapp/app/entities/sys-role/sys-role.model';

describe('Component Tests', () => {

    describe('SysRole Management Detail Component', () => {
        let comp: SysRoleDetailComponent;
        let fixture: ComponentFixture<SysRoleDetailComponent>;
        let service: SysRoleService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LbsTestModule],
                declarations: [SysRoleDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    SysRoleService,
                    JhiEventManager
                ]
            }).overrideTemplate(SysRoleDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SysRoleDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SysRoleService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new SysRole(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.sysRole).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
