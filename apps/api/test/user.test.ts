import axios from "axios"
import {describe,expect,it} from "bun:test"
import { BACKEND_URL } from "./config"
const USERNAME = Math.random().toString();
describe("Signup endpoint",()=>{
  it("Isnt able to sign up if body is incorrect",async ()=>{
    try {
          await axios.post(`${BACKEND_URL}/user/signup`, {
            email: USERNAME,
            password: "rudra123"
          })
          expect(false, "control should not reach here")
    }catch(e){
      console.log(e)
    }
  })
  
  
  it("Is able to sign Up  if body is Correct",async ()=>{
    
         const res =  await axios.post(`${BACKEND_URL}/user/signup`, {
            username: USERNAME,
            password: "rudra123"
          })
         expect(res.status).toBe(200);
         expect(res.data.id).toBeDefined();
    
    })
});




describe("Signin endpoint",()=>{
  it("Isnt able to sign in if body is incorrect",async ()=>{
    try {
          await axios.post(`${BACKEND_URL}/user/signin`, {
            email: USERNAME,
            password: "rudra123"
          })
          expect(false, "control should not reach here")
    }catch(e){
      console.log(e)
    }
  })
  
  
  it("Is able to sign in   if body is Correct",async ()=>{
    
         const res =  await axios.post(`${BACKEND_URL}/user/signin`, {
          username: USERNAME,
            password: "rudra123"
          })
         expect(res.status).toBe(200);
    console.log(res.data); 
    // for typescript token 
    // for rust jwt
         expect(res.data.token).toBeDefined();
    
    })
})
