document.addEventListener("deviceready", onDeviceReadyFunc, false);
var db;
var deviceIDfunc;
var devicemodelfunc;
var deviceCordovafunc;
var devicePlatformfunc;
var deviceVersionfunc;
var databaseversion;
var appversion = -1;
var apptoken = 0;
var networkconnectionfun= 0;

function onDeviceReadyFunc() {



    deviceIDfunc = device.uuid;

    devicemodelfunc = device.model;
    deviceCordovafunc = device.cordova;
    devicePlatformfunc = device.platform;
    deviceVersionfunc = device.version;
    databaseversion = db.database_version;
    db.transaction(gettoken1, errorCBfunc, successCBfunc);
    document.addEventListener("backbutton", onBackKeyDown, false);

alert("function");

}

function onBackKeyDown() {
    var page = $(location).attr('pathname');
    if(page =="/android_asset/www/index.html"){
        navigator.app.exitApp();
    }else{
        parent.history.back();
    }
}

function weblink(htmllink){
    window.location.href=htmllink;
}

function goBack() {
    window.history.back()
}


function errorCBfunc(err) {
    console.log("Error processing SQL: "+err.code);
    //alert("Error processing SQL loaddata: "+err.code);
}

function successCBfunc() {
    //  alert("success!");
}

function getUrlVarsfunc() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function blankLastUpdatesec(){

    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();

    // $('#busy').show();
    xmlHttp.open("GET", 'http://adme.neocom.co.nz/registerdevice.aspx?deviceID=' + deviceIDfunc + '&devicemodel=' + devicemodelfunc + '&deviceCordova=' + deviceCordovafunc + '&devicePlatform=' + devicePlatformfunc + '&deviceVersion=' + deviceVersionfunc + '&databasever=' + databaseversion + '&appver=' + appversion,false);
    xmlHttp.send();
    //  alert('http://centralfootball.neosportz.com/registerdevice.aspx?deviceID=' + deviceIDfunc + '&devicemodel=' + devicemodelfunc + '&deviceCordova=' + deviceCordovafunc + '&devicePlatform=' + devicePlatformfunc + '&deviceVersion=' + deviceVersionfunc + '&databasever=' + databaseversion + '&appver=' + appversion);
    var json = xmlHttp.responseText;

    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO MobileApp_LastUpdatesec (Datesecs,token) VALUES ("0","' + json + '")');
        console.log("INSERT INTO MobileApp_LastUpdatesec");
        //   alert('INSERT INTO MobileApp_LastUpdatesec (Datesecs,datemenus,syncwifi,isadmin,token,hasclub,fliterON) VALUES ("0", "0",0,0,"' + json + '",0,0)');
    });



}


var checkintvalue = function (val){

    if(val == 'undefined'){

        return 0;
    }else{

        return val;
    }

}

function URLredirect(ID){


    window.open(ID, '_system');
}

function URLredirectFacebook(ID){


    window.open(ID, '_system','location=yes');
}

function gettoken1(tx) {
    var sql = "select token from MobileApp_LastUpdatesec";
    // alert(sql);
    tx.executeSql(sql, [], gettoken1_success);
}

function gettoken1_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);

    apptoken = menu.token;

}

function syncmaintables(obj){
    $('#busy').hide();
    // var totalnew =0;

    $.each(obj.BusinessNames, function (idx, obj) {

        if(obj.DeletedateUTC == null){

            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO MobileApp_BusinessNames(ID,CreatedateUTC,UpdatedateUTC,DeletedateUTC,BusinessName,Icon) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '","' + obj.BusinessName + '","' + obj.Icon + '" )');
                //  console.log('INSERT OR IGNORE INTO MobileApp_Results(ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID,HomeScore ,AwayScore ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,DeletedateUTC ) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.DatetimeStart + '","' + obj.HomeName + '","' + obj.AwayName + '","' + obj.Field + '","' + obj.Latitude + '","' + obj.Longitude + '", ' + obj.DivisionID + ',"' + obj.DivisionName + '", ' + obj.HomeClubID + ', ' + obj.AwayClubID + ', ' + obj.HomeTeamID + ', ' + obj.AwayTeamID + ', ' + obj.HomeScore + ',' + obj.AwayScore + ' , "' + obj.UpdateDateUTC + '", "' + obj.TournamentName + '",' + obj.TournamentID + ', "' + obj.DatetimeStartSeconds + '",' + obj.DivisionOrderID + ',' + obj.ShowToAll + ',' + obj.Final + ',"' + obj.DeletedateUTC + '" )');
            });
            db.transaction(function (tx) {
                var sql = 'UPDATE MobileApp_BusinessNames SET CreatedateUTC = "' + obj.CreatedateUTC + '", UpdatedateUTC = "' + obj.UpdatedateUTC + '", DeletedateUTC = "' + obj.DeletedateUTC + '", BusinessName ="' + obj.BusinessName + '", Icon = "' + obj.Icon + '" where ID = ' + obj.ID;
                tx.executeSql(sql);
                // console.log(sql);
            });
        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobileApp_BusinessNames where ID =' + obj.ID);
                // console.log('Delete MobileApp_Results where ID =' + obj.ID);
            });
        }
    });

    $.each(obj.Categories, function (idx, obj) {

        if(obj.DeletedateUTC == null){

            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO MobileApp_Categories(ID INTEGER NOT NULL primary key,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,CategoryName) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '","' + obj.CategoryName + '" )');
                //  console.log('INSERT OR IGNORE INTO MobileApp_Results(ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID,HomeScore ,AwayScore ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,DeletedateUTC ) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.DatetimeStart + '","' + obj.HomeName + '","' + obj.AwayName + '","' + obj.Field + '","' + obj.Latitude + '","' + obj.Longitude + '", ' + obj.DivisionID + ',"' + obj.DivisionName + '", ' + obj.HomeClubID + ', ' + obj.AwayClubID + ', ' + obj.HomeTeamID + ', ' + obj.AwayTeamID + ', ' + obj.HomeScore + ',' + obj.AwayScore + ' , "' + obj.UpdateDateUTC + '", "' + obj.TournamentName + '",' + obj.TournamentID + ', "' + obj.DatetimeStartSeconds + '",' + obj.DivisionOrderID + ',' + obj.ShowToAll + ',' + obj.Final + ',"' + obj.DeletedateUTC + '" )');
            });
            db.transaction(function (tx) {
                var sql = 'UPDATE MobileApp_Categories SET CreatedateUTC = "' + obj.CreatedateUTC + '", UpdatedateUTC = "' + obj.UpdatedateUTC + '", DeletedateUTC = "' + obj.DeletedateUTC + '", CategoryName ="' + obj.CategoryName + '" where ID = ' + obj.ID;
                tx.executeSql(sql);
                // console.log(sql);
            });
        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobileApp_Categories where ID =' + obj.ID);
                // console.log('Delete MobileApp_Results where ID =' + obj.ID);
            });
        }
    });


    $.each(obj.Region, function (idx, obj) {
        if(obj.DeletedateUTC == null){

            // console.log('Delete MobileApp_clubs where ID');
            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO MobileApp_Region(ID INTEGER NOT NULL primary key,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,RegionName) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '","' + obj.RegionName + '" )');
                //    console.log("INSERT INTO MobileApp_clubs is created");
            });

            db.transaction(function (tx) {
                var sql = 'UPDATE MobileApp_Region SET CreatedateUTC = "' + obj.CreatedateUTC + '", UpdatedateUTC = "' + obj.UpdatedateUTC + '", DeletedateUTC = "' + obj.DeletedateUTC + '", RegionName ="' + obj.RegionName + '" where ID = ' + obj.ID;
                // console.log(sql);
            });

        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobileApp_Region where ID =' + obj.ID);
            });

        }
    });

    $.each(obj.Towns, function (idx, obj) {
        if (obj.DeletedateUTC == null) {
            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO MobileApp_Towns(ID INTEGER NOT NULL primary key,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,TownName,RegionID ) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '","' + obj.TownName + '",' + obj.RegionID + ' )');
                //   console.log("INSERT INTO MobileApp_Schedule is created");
            });
            db.transaction(function (tx) {
                var sql = 'UPDATE MobileApp_Towns SET CreatedateUTC = "' + obj.CreatedateUTC + '", UpdatedateUTC = "' + obj.UpdatedateUTC + '", DeletedateUTC = "' + obj.DeletedateUTC + '", TownName ="' + obj.TownName + '",RegionID = ' + obj.RegionID + ' where ID = ' + obj.ID;
                tx.executeSql(sql);
            });
        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobileApp_Towns where ID =' + obj.ID);
                //   console.log('Delete MobileApp_Schedule where ID');
            });
        }
    });


    $.each(obj.BusinessLocations, function (idx, obj) {
        if (obj.DeletedateUTC == null) {
        db.transaction(function (tx) {
            tx.executeSql('INSERT OR IGNORE INTO MobileApp_BusinessLocations(ID,CreatedateUTC,UpdatedateUTC ,DeletedateUTC,RegionID,TownID ,Lat ,Long ,Address ,Phone ) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '",' + obj.RegionID + ',' + obj.TownID + ',"' + obj.Lat + '","' + obj.Long + '","' + obj.Address + '","' + obj.Phone + '")');
            //    console.log("INSERT INTO MobileApp_clubsimages is created");
        });
        db.transaction(function (tx) {
            var sql = 'UPDATE MobileApp_BusinessLocations SET CreatedateUTC = "' + obj.CreatedateUTC + '", UpdatedateUTC = "' + obj.UpdatedateUTC + '", DeletedateUTC = "' + obj.DeletedateUTC + '", RegionID = ' + obj.RegionID + ', TownID =' + obj.TownID + ', Lat = "' + obj.Lat + '", Long = "' + obj.Long + '", Address = "' + obj.Address + '", Phone = "' + obj.Phone + '" where ID = ' + obj.ID;
            tx.executeSql(sql);
            // console.log(sql);
        });
        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobileApp_BusinessLocations where ID =' + obj.ID);
                //   console.log('Delete MobileApp_Schedule where ID');
            });
        }
    });

    $.each(obj.dailydeal, function (idx, obj) {
        if (obj.DeletedateUTC == null) {

            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO MobilevwApp_dailydeal(ID ,CreatedateUTC ,UpdatedateUTC ,DeletedateUTC ,BusinessID ,BusinessLocationID,StartDate ,EndDate ,ItemName,Details ,Price ,URL  ) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '",' + obj.BusinessID + ',' + obj.BusinessLocationID + ',"' + obj.StartDate + '","' + obj.EndDate + '","' + obj.ItemName + '","' + obj.Details + '","' + obj.Price + '","' + obj.URL + '")');
                //    console.log("INSERT INTO MobileApp_vwApp_Teams is created");
            });

            db.transaction(function (tx) {
                var sql = 'UPDATE MobilevwApp_dailydeal SET CreatedateUTC = "' + obj.CreatedateUTC + '", UpdatedateUTC = "' + obj.UpdatedateUTC + '", DeletedateUTC = "' + obj.DeletedateUTC + '", BusinessID = ' + obj.BusinessID + ',BusinessLocationID = ' + obj.BusinessLocationID + ',StartDate = "' + obj.StartDate + '",EndDate = "' + obj.EndDate + '",ItemName = "' + obj.ItemName + '",Details = "' + obj.Details + '",Price = "' + obj.Price + '",URL = "' + obj.URL + '" where ID = ' + obj.ID;
                tx.executeSql(sql);
            });

        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobilevwApp_dailydeal where ID =' + obj.ID);
                //    console.log('Delete MobileApp_vwApp_Teams where ID');
            });
        }
    });
//    window.plugins.toast.showShortCenter('Updating Tables!', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});

    $.each(obj.weeklydeal, function (idx, obj) {
        if (obj.DeletedateUTC == null) {

            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO MobilevwApp_weeklydeal(ID ,CreatedateUTC ,UpdatedateUTC ,DeletedateUTC ,BusinessID ,BusinessLocationID,StartDate ,EndDate ,ItemName,Details ,Price ,URL  ) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '",' + obj.BusinessID + ',' + obj.BusinessLocationID + ',"' + obj.StartDate + '","' + obj.EndDate + '","' + obj.ItemName + '","' + obj.Details + '","' + obj.Price + '","' + obj.URL + '")');
                //    console.log("INSERT INTO MobileApp_vwApp_Teams is created");
            });

            db.transaction(function (tx) {
                var sql = 'UPDATE MobilevwApp_weeklydeal SET CreatedateUTC = "' + obj.CreatedateUTC + '", UpdatedateUTC = "' + obj.UpdatedateUTC + '", DeletedateUTC = "' + obj.DeletedateUTC + '", BusinessID = ' + obj.BusinessID + ',BusinessLocationID = ' + obj.BusinessLocationID + ',StartDate = "' + obj.StartDate + '",EndDate = "' + obj.EndDate + '",ItemName = "' + obj.ItemName + '",Details = "' + obj.Details + '",Price = "' + obj.Price + '",URL = "' + obj.URL + '" where ID = ' + obj.ID;
                tx.executeSql(sql);
            });

        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobilevwApp_weeklydeal where ID =' + obj.ID);
                //    console.log('Delete MobileApp_vwApp_Teams where ID');
            });
        }

    });



    var datenow1 = new Date();
    var timenow = datenow1.getTime();


        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set , Datesecs = "' + Math.round((timenow/1000)) + '"');
             closemodel();

        });





}