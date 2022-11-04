export interface User{
    _id:string,
    name:string,
    email:string,
    password:string
}

export interface InitialState{
    user: User | null,
    auth:boolean
}