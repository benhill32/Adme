var db;
var deviceplatformdb;
document.addEventListener("deviceready", onDeviceReadydbconn, false);


function onDeviceReadydbconn() {
    deviceplatformdb = device.platform;

    if(deviceplatformdb == "iOS"){

        db = window.sqlitePlugin.openDatabase("../Library/Caches/Neocom_Adme", "1.1", "Neocom_Adme", 200000);
    }else if(deviceplatformdb == "Android"){

        db = window.sqlitePlugin.openDatabase("Neocom_Adme", "1.1", "Neocom_Adme", 200000);
    }
}





db = window.openDatabase("Neocom_Adme", "1.1", "Neocom_Adme", 200000);