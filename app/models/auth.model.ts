export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface RegisterData extends LoginData {
    name: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      address?: string;
      favorites?: string[];
      orders?: any[];
    };
  }
  
  export interface UpdateUserData {
    phone?: string;
    address?: string;
  } 
  