const {copy} =require('iclipboard');
const fs=require('fs');
const COS=require("cos-js-sdk-v5");
var config=JSON.parse(fs.readFileSync('./config.json'));
var cos=new COS({
    SecretId: config.SecretId,
    SecretKey: config.SecretKey
});
const Dictionary=[
    'a','b','c','d','e','f','g','h','i','j','k','l',
    'm','n','o','p','q','r','s','t','u','v','w','x',
    'y','z','0','1','2','3','4','5','6','7','8','9'];
var input,field;
function initalize(){
    input=document.querySelector('#BrowseFile');
    field=$('#field');
    input.addEventListener('change',()=>{
        field.empty();
        for(let i=0;i<input.files.length;i++)
            Upload(input.files[i]);
    })
}
window.onload=initalize;
function Upload(file){
    let key=util_genKey(8);
    let suf=file.name.match(/\.(\S*)/)!==null?'.'+file.name.match(/\.(\S*)/)[1]:"";
    field.append(`<div id="${key}" class="resu_">${file.name} : ${key+suf}</div>`);
    document.getElementById(`${key}`).oncontextmenu=(e)=>e.preventDefault();
    document.getElementById(`${key}`).onmouseup=(oEvent)=>{
        if(oEvent.button==2){
            copy(`${config['CDN_URL']}${key+suf}`);
        }
    }
    cos.putObject({
        Bucket:config.Bucket,
        Region: config.Region,
        Key:key+suf,
        StorageClass:'STANDARD',
        Body:file,
        onProgress:(progressData)=>{
            $('#'+key).html(`${file.name} : ${key+suf} : ${(progressData.loaded/progressData.total*100).toFixed(2)}%`);
        }
    },(err,data)=>{
        if(err)
            $('#'+key).html(`${file.name} : ${key+suf} : <span style="color:red;">Failed</span>`)
        else $('#'+key).html(`${file.name} : ${key+suf} : <span style="color:green;">Succeeded</span>`)
    });
}
function util_genKey(len){
    let res='';
    while(len--)
        res+=Dictionary[Math.floor(Math.random()*Dictionary.length)];
    return res;
}
var oDragWrap = document.body;
oDragWrap.addEventListener(
    "dragenter",
    function(e) {
        e.preventDefault();
    },
    false
);
oDragWrap.addEventListener(
    "dragleave",
    function(e) {
        e.preventDefault();
    },
    false
);
oDragWrap.addEventListener(
    "dragover",
    function(e) {
        e.preventDefault();
    },
    false
);
oDragWrap.addEventListener(
    "drop",
    function(e) {
        dropHandler(e);
    },
    false
);
var dropHandler = function(files) {
    files=files.dataTransfer.files;
    if(files.length===0)
        return;
    field.empty();
    for(let i=0;i<files.length;i++)
        Upload(files[i]);
};