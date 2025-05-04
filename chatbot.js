let x=document.querySelector("#prompt")
let y=document.querySelector(".chat")
let imgbtn=document.querySelector("#img")
let imginput=document.querySelector("#img input")
const api_url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCzIikDtpeoLOMrHgBbTxcR_4krJhDVGVI" 
let user={
    message:null,
    file:{
        mime_type:null,
        data:null
    }
}
async function generateresponse(aichatbox) {
    let text=aichatbox.querySelector(".aca")
    let requestoption={
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
    "contents": [
      {
        "parts": [
          {
            "text":user.message
          },(user.file.data?[{"inline_data":user.file}]:[])
        ]
      }
    ]
  })
    }
    try{
        let response=await fetch(api_url,requestoption) 
        let data=await response.json()
       let apiresponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
       text.innerHTML=apiresponse
    }
    catch(error){
        console.log(error)
    }
    finally{
        y.scrollTo({top:y.scrollHeight,behavior:"smooth"})
    }
    
    
    
    
}
function createchatbox(html,classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div

}
function handlechatresponse(message1){
    user.message=message1
    

    let imgHtml = ""
    if (user.file.data) {
        imgHtml = `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>`
    }

    let html = `<img src="h.png" alt="" id="ui" width="50"><div class="uca">${message1}${imgHtml}</div>`
    x.value = ""
    let userchatbox=createchatbox(html,"userchat")
    y.appendChild(userchatbox)
    y.scrollTo({top:y.scrollHeight,behavior:"smooth"})
    setTimeout(()=>{
    let html='<img src="a.png" alt="" id="ai" width="50"> <div class="aca"> </div>'
    let aichatbox=createchatbox(html,"aichat")
    y.appendChild(aichatbox)
    generateresponse(aichatbox)
    },600)
            
}
x.addEventListener("keydown",(e)=>{
    if(e.key=="Enter")
        handlechatresponse(x.value)
})
imginput.addEventListener("change",()=>{
    const f=imginput.files[0]
    if(!f)return 
    let r=new FileReader()
    r.onload=(e)=>{
        let base64string=e.target.result.split(",")[1]
        user.file={
            mime_type:f.type,
            data:base64string
        }
    }
    imgbtn.innerHTML=""
    r.readAsDataURL(f)
})
imgbtn.addEventListener("click",()=>{
    imgbtn.querySelector("input").click()
})