import axios from "axios";
import { BACKEND_URL } from "./config";
const USERNAME = Math.random().toString();
export async function CreateUser(): Promise<{ id: string, Jwt: string }>{
  const res = await axios.post(`${BACKEND_URL}/user/signup`,{
    username : USERNAME,
    password : "rudra123"
  })
  
  const SignInResponse = await axios.post(`${BACKEND_URL}/user/signin`, {
    username : USERNAME,
    password : "rudra123"
  })
  
  return{
    id :res.data.id,
    Jwt :SignInResponse.data.token
  }
  
  
}