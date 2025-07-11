// ================================================================================>> Core Library

// ================================================================================>> Thrid Party Library

// ================================================================================>> Custom Library
// Local
import { User } from "../user/interface";

export interface Role {
    name: string;
    slug: string;
    is_default : boolean;
}

export interface ResponseLogin {
    success     : boolean;
    access_token: string;
    expires_in  : Date;
    user        : User;
    roles       : Role[];
}
