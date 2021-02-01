const electron=require('electron');
const path=require('path');
const indexPath=path.join('file://',__dirname,'./modal.html');
var win;
function createWindow(){
    electron.Menu.setApplicationMenu(null);
    win=new electron.BrowserWindow({
        width:400,
        height:320,
        webPreferences:{
            nodeIntegration:true
        }
    });
    win.on('close',()=>win=null);
    win.loadURL(indexPath);
    win.show();
}
electron.app.whenReady().then(createWindow);
electron.app.on('window-all-closed',()=>{
    if(process.platform!=='darwin'){
        electron.app.quit();
    }
})