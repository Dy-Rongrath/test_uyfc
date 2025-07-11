
interface Role {
    id:         number;
    name:       string;
    slug:       string;
    is_default: number;
}

export interface User {
    id:         number;
    name:       string;
    avatar:     string;
    phone:      string;
    email:      string;
    user_title: string;
    roles:      Role[];
    branch:     Branch;
    groupwork: {
        name: string;
    }
}

interface Branch {
    id:      number;
    kh_name: string;
    en_name: string;
}




