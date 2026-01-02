import "dotenv/config"
import {describe ,it,expect, beforeAll } from  "bun:test"
import axios  from "axios"
import { CreateUser } from "./createUserUtils"
import { BACKEND_URL } from "./config"


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
      { url: "https://youtube.com" },
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



describe("can fetch a website",()=>{
  let token1: string, id1: string;
  let token2: string, id2: string;
  
  beforeAll(async () => {
    const user1 = await CreateUser();
    id1 = user1.id;
    token1 = user1.Jwt
    const user2 = await CreateUser();
    id2: user2.id;
    token2 = user2.Jwt
   
  });
  
  it("is is able to fetch the website that is created",async ()=>{
    const WebsiteRepsone = await axios.post(
      `${BACKEND_URL}/website`,
      { url: "https://github.com" },
      {
        headers: {
          Authorization: token1
        }
      }
      
    );
    
    const getWebsiteResponse = await axios.get(`${BACKEND_URL}/status/${WebsiteRepsone.data.id}`,
      {
        headers: {
          Authorization: token1
        }
      }
    )

    expect(getWebsiteResponse.data.id).toBe(WebsiteRepsone.data.id)
    expect(getWebsiteResponse.data.user_id).toBe(id1)
  })
  
  it("Cant Fetch website created by another user",async ()=>{
    const WebsiteRepsone = await axios.post(
      `${BACKEND_URL}/website`,
      { url: "https://youtube.com" },
      {
        headers: {
          Authorization: token1
        }
      }
      
    );
    try {
      await axios.get(`${BACKEND_URL}/status/${WebsiteRepsone.data.id}`,
        {
          headers: {
            Authorization: token2
          }
        }
      )
      expect(false,"not fetch webite created by another user")
    }catch(e){
      
    }
  })
})