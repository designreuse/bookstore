import { BaseEntity } from './../../shared';

export class SysRole implements BaseEntity {
    constructor(
        public id?: number,
        public roleName?: string,
        public rolePid?: string,
        public companyId?: string,
        public roleDesc?: string,
        public issys?: number,
        public roleCode?: number,
        public roleDeep?: string,
    ) {
    }
}
