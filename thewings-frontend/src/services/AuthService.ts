import axios from "axios";
 
import { UserModel } from "../models/User";
 
class AuthService {
  setUserInLocalStorage(data: UserModel) {
    localStorage.setItem("user", JSON.stringify(data));
  }
 
  async login(username_email: string, password: string): Promise<UserModel> {
    const response = await axios.post("http://127.0.0.1:8000/login/", { username_email, password });
    if (!response.data.token) {
      return response.data;
    }
    this.setUserInLocalStorage(response.data);
    return response.data;
  }
 
  logout() {
    localStorage.removeItem("user");
  }
 
  getCurrentUser() {
    const user = localStorage.getItem("user")!;
    return JSON.parse(user);
  }
}
const authService = new AuthService();
export default authService;