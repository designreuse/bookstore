/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { LbsTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { SysUserDetailComponent } from '../../../../../../main/webapp/app/entities/sys-user/sys-user-detail.component';
import { SysUserService } from '../../../../../../main/webapp/app/entities/sys-user/sys-user.service';
import { SysUser } from '../../../../../../main/webapp/app/entities/sys-user/sys-user.model';

describe('Component Tests', () => {

    describe('SysUser Management Detail Component', () => {
        let comp: SysUserDetailComponent;
        let fixture: ComponentFixture<SysUserDetailComponent>;
        let service: SysUserService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LbsTestModule],
                declarations: [SysUserDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    SysUserService,
                    JhiEventManager
                ]
            }).overrideTemplate(SysUserDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SysUserDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SysUserService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new SysUser(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.sysUser).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
