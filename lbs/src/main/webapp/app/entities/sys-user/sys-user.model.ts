import { BaseEntity } from './../../shared';

export class SysUser implements BaseEntity {
    constructor(
        public id?: number,
        public companyId?: string,
        public userName?: string,
        public userPwd?: string,
        public userDesc?: string,
        public lastlogindate?: any,
        public createdby?: string,
        public createdon?: any,
        public modifedby?: string,
        public modifedon?: any,
        public modifiedby?: string,
        public modifiedon?: any,
        public userphone?: string,
        public email?: string,
        public lastlogingroup?: string,
        public groupid?: string,
        public realname?: string,
        public status?: number,
        public userCarid?: string,
        public headicon?: string,
        public positions?: string,
        public departmentauthor?: string,
        public userSex?: string,
        public lejiaNum?: string,
        public hasupdated?: number,
        public userSort?: number,
    ) {
    }
}
