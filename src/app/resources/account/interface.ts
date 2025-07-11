
export interface Profile {
    id      : number,
    name    : string,
    email   : string,
    phone?  : string,
    avatar? : string,
    created_at: string,
    user_title :{
        id  : number,
        name: string
    }
    role :{
        is_default : boolean,
        role: {
            id  : number,
            name: string,
            slug: string,
        }  
    }[]

}

export interface ReqProfile {
  user: User;
  access_token: string;
  token_type: string;
  expires_in: string;
  message: string;
}

export interface User {
    id:         number;
    name:       string;
    avatar:     string;
    phone:      string;
    email:      string;
    is_active:  boolean;
    created_at: Date;
    user_title: UserTitle;
    roles:      RoleElement[];
}

export interface RoleElement {
    is_default: boolean;
    role:       RoleRole;
}

export interface RoleRole {
    id:   number;
    name: string;
    slug: string;
}

export interface UserTitle {
    name: string;
}


export interface UpdateProfile extends ReqProfile {
}


export interface ReqUpdateProfile {
    // User Info
    avatar?: string,
    kh_name: string,
    en_name: string,
    username: string,
    vpn_account: string,
    organization_id: number,
    title_id: number,
    office_id: number,
    position_id: number,
    role_id: number,
    about: string,
    // Contact
    email: string,
    phone: string,
    tg_username: string,
}

export interface ResUpdateProfile {
    token: string
    message: string
}

export interface ReqUpdatePassword {
    current_password: string,
    new_password: string,
    confirm_password: string
}

export interface ResUpdatePassword {
    statusCode: string,
    message: string
}

export interface ReqUpdateSignature {
    signature: string,
}

// export interface ResUpdateSignature {
//     message: string,
//     success : boolean,
//     user: User,
//     token: string,
//     expires_at: Date
// }

export interface ResGenerate2FA {
    twoFactorQrCode: string,
}

export interface ReqVerify2FA {
    phone: number,
    twoFactorAuthenticationCode: string,
}

// export interface ResVerify2FA {
//     success : boolean,
//     user: User,
//     token: string,
//     expires_at: Date
// }





export interface ResponseSetup {
    statusCode: boolean,
    data: Setup,
    message: string
}

export interface Setup {
    titles: Organization,
    organizations: Organization,
    offices: Organization,
    positions: Organization,
    roles: Organization
}

interface Organization {
    id: number,
    kh_name: string,
    en_name: string
}
