const nav=document.querySelector(".navigation");

const  searchBox =nav.firstElementChild.nextElementSibling
const searchBoxIcon=searchBox.firstElementChild.nextElementSibling;
const searchBoxInput=searchBox.firstElementChild;
searchBoxIcon.addEventListener("click",()=>{
    searchBoxInput.value="";
    const checkBox=document.querySelector("#pc");
        if(checkBox.checked===true){
            pcLabel.click();
        }
        const checkBox1=document.querySelector("#pc1");
        if(checkBox1.checked===true){
            pcLabel1.click();
        }
        const checkBox2=document.querySelector("#pc2");
        if(checkBox2.checked===true){
            pcLabel2.click();
        }
});
searchBoxInput.addEventListener("input",(event)=>{
    if(searchBoxInput.value===""){
        drop.childNodes.forEach((el)=>{
            if(el.nodeName==="LI"){
                el.style.display="flex";
            }
        });
        drop1.childNodes.forEach((el)=>{
            if(el.nodeName==="LI"){
                el.style.display="flex";
            }
        });
        return;
    }
    const checkBox=document.querySelector("#pc");
    if(checkBox.checked===false){
        pcLabel.click();
    }
    const checkBox1=document.querySelector("#pc1");
    drop1.childNodes.forEach((el)=>{
        if(el.nodeName==="LI"){
            const text= el.firstElementChild.nextElementSibling.innerHTML;
            console.log(text);
            if(text.toLowerCase().indexOf(searchBoxInput.value.toLowerCase())>-1){
                el.style.display="flex";
            }
            else{

                el.style.display="none";
            }
        }
        
    });
    
    if(checkBox1.checked===false){
        pcLabel1.click();
    }
    drop.childNodes.forEach((el)=>{
        
        if(el.nodeName==="LI"){
            const text= el.firstElementChild.nextElementSibling.innerHTML;
            console.log(text);
            if(text.toLowerCase().indexOf(searchBoxInput.value.toLowerCase())>-1){
                el.style.display="flex";
            }
            else{
                el.style.display="none";
            }
        }
    });
    
});
nav.firstElementChild.addEventListener("click",()=>{
    if(nav.firstElementChild.innerHTML==="arrow_back"){
        const left=document.querySelector(".left");
        nav.firstElementChild.innerHTML="dashboard";
        nav.firstElementChild.nextElementSibling.style.display="none";
        nav.nextElementSibling.style.display="none";
        left.style.transition="width 0.5s";
        left.style.width="50px";
        searchBoxInput.value="";
    }
    else if(nav.firstElementChild.innerHTML==="dashboard"){
        const left=document.querySelector(".left");
        left.style.transition = "width 0.0s ease-in-out";
        left.style.width="250px";
        nav.firstElementChild.innerHTML="arrow_back";
        nav.firstElementChild.nextElementSibling.style.display="flex";
        nav.nextElementSibling.style.display="block";
        const checkBox=document.querySelector("#pc");
        const checkBox1=document.querySelector("#pc1");
        if(checkBox.checked===true){
            pcLabel.click();
        }
        if(checkBox1.checked===true){
            pcLabel1.click();
        }
        const checkBox2=document.querySelector("#pc2");
        if(checkBox2.checked===true){
            pcLabel2.click();
        }
    }
});
const drop=document.querySelector("#drop");
const pcLabel=document.querySelector("#pcLabel");
pcLabel.addEventListener("click",()=>{
    if(drop.style.overflowY==="scroll"){
        drop.style.overflowY="hidden";
    }
    else
    drop.style.overflowY="scroll";
});
const pcLabel1=document.querySelector("#pcLabel1");
const drop1=document.querySelector("#drop1");
const pcLabel2=document.querySelector("#pcLabel2");
const drop2=document.querySelector("#drop2");
pcLabel2.addEventListener("click",()=>{
    if(drop2.style.overflowY==="scroll"){
        drop2.style.overflowY="hidden";
    }
    else
    drop2.style.overflowY="scroll";
});
pcLabel1.addEventListener("click",()=>{
    if(drop1.style.overflowY==="scroll"){
        drop1.style.overflowY="hidden";
    }
    else
    drop1.style.overflowY="scroll";
});
drop2.childNodes.forEach((el)=>{
    if(el.nodeName==="LI"){
        el.addEventListener("click",()=>{
            for(let i=0;i<drop2.childNodes.length;i++){
                if(drop2.childNodes[i].nodeName==="LI"){
                    drop2.childNodes[i].classList.remove("active");
                }
            }
            el.classList.add("active");
        });
    }
});
drop1.childNodes.forEach((el)=>{
    if(el.nodeName==="LI"){
        el.addEventListener("click",()=>{
            for(let i=0;i<drop1.childNodes.length;i++){
                if(drop1.childNodes[i].nodeName==="LI"){
                    drop1.childNodes[i].classList.remove("active");
                }
            }
            el.classList.add("active");
        });
    }
});
drop.childNodes.forEach((el)=>{
    if(el.nodeName==="LI"){
        el.addEventListener("click",()=>{
            for(let i=0;i<drop.childNodes.length;i++){
                if(drop.childNodes[i].nodeName==="LI"){
                    drop.childNodes[i].classList.remove("active");
                }
            }
            el.classList.add("active");
        });
    }
});
