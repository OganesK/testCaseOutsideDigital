export interface RegisterNewUserTypes {
  email: string,
  password: string,
  nickname: string
}

export interface ValidateLoginTypes {
  email: string,
  password: string
}

export interface UpdateUserTypes {
  email?: string,
  nickName?: string,
  password?: string
}
