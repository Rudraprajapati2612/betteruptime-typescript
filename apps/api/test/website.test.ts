import "dotenv/config"
import {describe ,it,expect } from  "bun:test"
import axios  from "axios"
import { resolve } from "bun"
import { response } from "express"


const baseurl = "http://localhost:3000"
describe ("Website not created",()=>{
    it("Webite not created if url  is not present " ,async ()=>{
        try{
             await axios.post(`${baseurl}/website`,{

            })

            expect(false,"website created when it shouldtn")
        }catch(e){

        }
        
    })


    it("Webite  created if url  is  present " ,async ()=>{
        
             const response  = await axios.post(`${baseurl}/website`,{
                url : "https://google.com"
            })
            expect(response.data.id).not.toBeNull();
    })
})