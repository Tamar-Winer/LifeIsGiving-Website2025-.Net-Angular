export interface User {
  id: number; 
  userName: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 1 | 2 | 3; // 1 - משתמש רגיל, 2 - מנהל , 3 - תורם
}
