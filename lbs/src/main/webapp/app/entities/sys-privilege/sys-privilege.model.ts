import { BaseEntity } from './../../shared';

export class SysPrivilege implements BaseEntity {
    constructor(
        public id?: number,
        public privilegePid?: string,
        public privilegeName?: string,
        public companyid?: string,
        public priviligeDesc?: string,
        public isflag?: number,
    ) {
    }
}
