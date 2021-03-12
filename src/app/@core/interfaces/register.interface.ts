export interface IRegisterForm{
    name: string;
    lastname: string;
    birthDay: string;
    email: string;
    password: string;
    role?: string;
    active?: boolean;
}

export interface IResultRegister{
    status: boolean;
    message: string;
}
