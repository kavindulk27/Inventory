import { BaseEntity } from '../../types/common';

export interface Supplier extends BaseEntity {
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
}
