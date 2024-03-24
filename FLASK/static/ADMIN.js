// implementing search functionality
const searchBox=document.getElementsByClassName('search-box')[0];
const searchInputBox=searchBox.getElementsByTagName('input')[0];
console.log(searchInputBox);
searchInputBox.addEventListener('input',function(){
    count=0;
    let index=[];
    if(searchInputBox.value==""){
        // window.location.reload();
        const allItems=document.getElementsByClassName('sales-details');
        for(let i=0;i<allItems.length;i++){
            allItems[i].style.display="";   
        }
        result.style.display="none";
        for(let i=0;i<allItems.length;i++){
            const details=allItems[i].getElementsByClassName('details'); 
                // console.log(index)
                for(let k=1;k<details[0].children.length;k++){
                    details[0].children[k].style.display="";
                    details[1].children[k].style.display="";
                    details[2].children[k].style.display="";  
                }
        }
        return;
    }
    const searchValue=searchInputBox.value.toLowerCase().trim();
    const allItems=document.getElementsByClassName('sales-details');
    
    for(let i=0;i<allItems.length;i++){
        const details=allItems[i].getElementsByClassName('details');
        for(let j=0;j<details.length;j++){
            for(let k=1;k<details[j].children.length;k++){
                if(details[j].children[k].innerText.toLowerCase().includes(searchValue)){
                    console.log(details[j].children[k].innerText);
                    if(index.includes(k)){
                        continue;
                    }
                    index.push(k);
                    count++;
                    // break;
                }
                  
                
            }
        }
    }
    for(let i=0;i<allItems.length;i++){
        const details=allItems[i].getElementsByClassName('details'); 
            console.log(index)
            for(let k=1;k<details[0].children.length;k++){
                if(index.includes(k)){
                    details[0].children[k].style.display="";
                    details[1].children[k].style.display="";
                    details[2].children[k].style.display=""; 
                    
                }
                else{
                    details[0].children[k].style.display="none";
                    details[1].children[k].style.display="none";
                    details[2].children[k].style.display="none"; 
                }
            }
    }
    if(index.length==0){
        result.style.display="";
        result.style.color="red";
        result.innerText="No results found";
    }
    else{
        result.style.display="";
        if(index.length==1){
            result.innerText=`${index.length} result found`;
        }
        else
        result.innerText=`${index.length} results found`;
        result.style.color="green";
        
    }
    index.length=0;
   
});
const searchButton=searchBox.getElementsByTagName('i')[0];
searchButton.addEventListener('click',function(){
    searchInputBox.value="";
    const allItems=document.getElementsByClassName('sales-details');
    for(let i=0;i<allItems.length;i++){
        allItems[i].style.display="";
    }
    result.style.display="none";
    for(let i=0;i<allItems.length;i++){
        const details=allItems[i].getElementsByClassName('details'); 
            for(let k=1;k<details[0].children.length;k++){
                details[0].children[k].style.display="";
                details[1].children[k].style.display="";
                details[2].children[k].style.display="";  
            }
    }
});
const result=document.getElementById('result');
result.style.display="none";
result.style.color="red";
result.style.fontSize="20px";

