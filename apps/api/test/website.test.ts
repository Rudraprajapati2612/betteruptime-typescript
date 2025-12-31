import "dotenv/config"
import {describe ,it,expect, beforeAll } from  "bun:test"
import axios  from "axios"
import { CreateUser } from "./createUserUtils"
import { BACKEND_URL } from "./config"



// describe ("Website not created",()=>{
//   let id:string  , token:string;
//   beforeAll(async ()=>{
//     const data = await CreateUser();
//     id = data.id;
//     token = data.Jwt
//   })
//   it("Webite not created if url  is not present " ,async ()=>{
//         try{
//           await axios.post(`${BACKEND_URL}/website`, {},{
             
//              headers : {
//                Authorization : token
//              }
//              })
             
//           expect(false,"website created when it shouldtn")
//         }catch(e){
          
//         } 
        
//     })


//     it("Webite  created if url  is  present " ,async ()=>{
        
//              const response  = await axios.post(`${BACKEND_URL}/website`,{
//                 url : "https://google.com"
//             },{
//               headers :{
//                 Authorization : token
//               }
//             })
//             expect(response.data.id).not.toBeNull();
//     })
    
    
//     it("Webite is not created if header is not present" ,async ()=>{
//       try {
//         const response = await axios.post(`${BACKEND_URL}/website`, {
//           url: "https://google.com"
//         }
//         )
//         expect(false,"website is not created if header is not present")
//       }catch(e){
        
//       }
//     })
// })
// 
// 
// 

describe("Website not created", () => {
  let id: string, token: string;

  beforeAll(async () => {
    const data = await CreateUser();
    id = data.id;
    token = data.Jwt;
  });

  it("Website not created if url is not present", async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/website`,
        {},
        {
          headers: {
            Authorization: token
          }
        }
      );
      expect(false, "website created when it shouldn't");
    } catch (e) {
      expect(true).toBe(true);
    }
  });

  it("Website created if url is present", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/website`,
      { url: "https://google.com" },
      {
        headers: {
          Authorization: token
        }
      }
      
    );
    console.log(token);
    expect(response.data.id).not.toBeNull();
  });

  it("Website is not created if header is not present", async () => {
    try {
      await axios.post(`${BACKEND_URL}/website`, {
        url: "https://google.com"
      });
      expect(false, "website created without auth");
    } catch (e) {
      expect(true).toBe(true);
    }
  });
});
