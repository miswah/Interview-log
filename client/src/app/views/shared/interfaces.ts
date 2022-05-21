export interface Signup {
  email: string;
  password: number;
  confirmpassword: number;
  name: string;
}

// export interface Response {
//   error: boolean;
//   message: string;
//   status?: number;
// }

export interface Login {
  email: string;
  password: number;
}
