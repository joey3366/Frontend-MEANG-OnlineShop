export interface IRegisterForm{
    name: string;
    lastname: string;
    birthDay: string;
    email: string;
    password: string;
}

export interface IResultRegister{
    status: boolean;
    message: string;
}
