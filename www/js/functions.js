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

    getnetworkdetailsfunc();

}

function getnetworkdetailsfunc(){

    document.addEventListener("online", checkonlinefunc, false);
}

function checkonlinefunc(){

    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = '0';
    states[Connection.ETHERNET] = '2';
    states[Connection.WIFI]     = '2';
    states[Connection.CELL_2G]  = '1';
    states[Connection.CELL_3G]  = '1';
    states[Connection.CELL_4G]  = '1';
    states[Connection.NONE]     = '0';

    networkconnectionfun = states[networkState];
    //alert(states[networkState]);

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

function errorCBfuncweekly(err) {
    console.log("Error processing SQL: "+err.code);
    alert("Error processing SQL loaddata: "+err.code);
}

function errorCBfunc(err) {
    console.log("Error processing SQL: "+err.code);
 //   alert("Error processing SQL loaddata: "+err.code);
}

function errorCBfuncsql(transaction, error) {
    alert('Oops. Error was ' + error.message + ' (Code ' + error.code + ')');

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
    xmlHttp.open("GET", 'http://admin.adme.kiwi/registerdevice.aspx?deviceID=' + deviceIDfunc + '&devicemodel=' + devicemodelfunc + '&deviceCordova=' + deviceCordovafunc + '&devicePlatform=' + devicePlatformfunc + '&deviceVersion=' + deviceVersionfunc + '&databasever=' + databaseversion + '&appver=' + appversion,false);
    xmlHttp.send();
     // alert('http://adme.neocom.co.nz/registerdevice.aspx?deviceID=' + deviceIDfunc + '&devicemodel=' + devicemodelfunc + '&deviceCordova=' + deviceCordovafunc + '&devicePlatform=' + devicePlatformfunc + '&deviceVersion=' + deviceVersionfunc + '&databasever=' + databaseversion + '&appver=' + appversion);
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
                tx.executeSql('INSERT OR IGNORE INTO MobileApp_Categories(ID,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,CategoryName) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '","' + obj.CategoryName + '" )');
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
                tx.executeSql('INSERT OR IGNORE INTO MobileApp_Region(ID ,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,RegionName) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '","' + obj.RegionName + '" )');
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
                tx.executeSql('INSERT OR IGNORE INTO MobileApp_Towns(ID,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,TownName,RegionID ) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '","' + obj.TownName + '",' + obj.RegionID + ' )');
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
                tx.executeSql('INSERT OR IGNORE INTO MobileApp_BusinessLocations(ID,CreatedateUTC,UpdatedateUTC ,DeletedateUTC,RegionID,TownID ,Lat ,Long ,Address ,Phone,BusinessID ) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '",' + obj.RegionID + ',' + obj.TownID + ',"' + obj.Lat + '","' + obj.Long + '","' + obj.Address + '","' + obj.Phone + '",' + obj.BusinessID + ')');
                //    console.log("INSERT INTO MobileApp_clubsimages is created");
            });
            db.transaction(function (tx) {
                var sql = 'UPDATE MobileApp_BusinessLocations SET CreatedateUTC = "' + obj.CreatedateUTC + '", UpdatedateUTC = "' + obj.UpdatedateUTC + '", DeletedateUTC = "' + obj.DeletedateUTC + '", RegionID = ' + obj.RegionID + ', TownID =' + obj.TownID + ', Lat = "' + obj.Lat + '", Long = "' + obj.Long + '", Address = "' + obj.Address + '", Phone = "' + obj.Phone + '", BusinessID = ' + obj.BusinessID + ' where ID = ' + obj.ID;
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


    $.each(obj.BusinessCategories, function (idx, obj) {
        if (obj.DeletedateUTC == null) {
        db.transaction(function (tx) {
            tx.executeSql('INSERT OR IGNORE INTO MobileApp_BusinessCategories(ID,CreatedateUTC,UpdatedateUTC ,DeletedateUTC,CategoryID,BusniessID ) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '",' + obj.CategoryID + ',' + obj.BusniessID + ')');
            //    console.log("INSERT INTO MobileApp_clubsimages is created");
        });
        db.transaction(function (tx) {
            var sql = 'UPDATE MobileApp_BusinessCategories SET CreatedateUTC = "' + obj.CreatedateUTC + '", UpdatedateUTC = "' + obj.UpdatedateUTC + '", DeletedateUTC = "' + obj.DeletedateUTC + '", CategoryID =' + obj.CategoryID + ', BusniessID = "' + obj.BusniessID + '" where ID = ' + obj.ID;
            tx.executeSql(sql);
            // console.log(sql);
        });
        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobileApp_BusinessCategories where ID =' + obj.ID);
                //   console.log('Delete MobileApp_Schedule where ID');
            });
        }
    });

    $.each(obj.dailydeal, function (idx, obj) {
        if (obj.DeletedateUTC == null) {

            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO MobilevwApp_dailydeal(ID ,CreatedateUTC ,UpdatedateUTC ,DeletedateUTC ,BusinessID ,BusinessLocationID,StartDate ,EndDate ,ItemName,Details ,Price ,URL,Categories,RegionID,TownID  ) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '",' + obj.BusinessID + ',' + obj.BusinessLocationID + ',"' + obj.StartDate + '","' + obj.EndDate + '","' + obj.ItemName + '","' + obj.Details + '","' + obj.Price + '","' + obj.URL + '", ' + obj.Categories + ',' + obj.RegionID + ',' + obj.TownID + ')');
                //    console.log("INSERT INTO MobileApp_vwApp_Teams is created");
            });

            db.transaction(function (tx) {
                var sql = 'UPDATE MobilevwApp_dailydeal  SET CreatedateUTC = "' + obj.CreatedateUTC + '", UpdatedateUTC = "' + obj.UpdatedateUTC + '", DeletedateUTC = "' + obj.DeletedateUTC + '", BusinessID = ' + obj.BusinessID + ',BusinessLocationID = ' + obj.BusinessLocationID + ',StartDate = "' + obj.StartDate + '",EndDate = "' + obj.EndDate + '",ItemName = "' + obj.ItemName + '",Details = "' + obj.Details + '",Price = "' + obj.Price + '",URL = "' + obj.URL + '",Categories = ' + obj.Categories + ', RegionID = ' + obj.RegionID + ', TownID = ' + obj.TownID + ' where ID = ' + obj.ID;
                tx.executeSql(sql);
            });

        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobilevwApp_dailydeal where ID =' + obj.ID);
                //    console.log('Delete MobileApp_vwApp_Teams where ID');
            });
        }
    });

    $.each(obj.gasprices, function (idx, obj) {
        if (obj.DeletedateUTC == null) {

            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO MobilevwApp_GasPrices (ID ,CreatedateUTC ,UpdatedateUTC ,DeletedateUTC ,BusinessID ,BusinessLocationID,Price91 ,Price96 ,PriceDiesel,PriceLPG,TownID,RegionID,Categories) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '",' + obj.BusinessID + ',' + obj.BusinesslocationID + ',"' + obj.Price91 + '","' + obj.Price96 + '","' + obj.PriceDiesel + '","' + obj.PriceLPG + '",' + obj.TownID + ',' + obj.RegionID + ',11)');
                //    console.log("INSERT INTO MobileApp_vwApp_Teams is created");
            });

            db.transaction(function (tx) {
                var sql = 'UPDATE MobilevwApp_GasPrices  SET CreatedateUTC = "' + obj.CreatedateUTC + '", UpdatedateUTC = "' + obj.UpdatedateUTC + '", DeletedateUTC = "' + obj.DeletedateUTC + '", BusinessID = ' + obj.BusinessID + ',BusinessLocationID = ' + obj.BusinesslocationID + ',Price91 = "' + obj.Price91 + '",Price96 = "' + obj.Price96 + '",PriceDiesel = "' + obj.PriceDiesel + '",PriceLPG = "' + obj.PriceLPG + '",TownID = ' + obj.TownID + ',RegionID = ' + obj.RegionID + ' where ID = ' + obj.ID;
                tx.executeSql(sql)
            });

        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobilevwApp_GasPrices where ID =' + obj.ID);
                //    console.log('Delete MobileApp_vwApp_Teams where ID');
            });
        }

    });


    $.each(obj.Coupons, function (idx, obj) {
        if (obj.DeletedateUTC == null) {

            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO MobilevwApp_Coupons (ID ,CreatedateUTC ,UpdatedateUTC ,DeletedateUTC ,BusinessID ,BusinessLocationID,FileName,TownID,RegionID,Categories ) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '",' + obj.BusinessID + ',' + obj.BusinesslocationID + ',"' + obj.FileName + '",' + obj.TownID + ',' + obj.RegionID + ',12)');
                //    console.log("INSERT INTO MobileApp_vwApp_Teams is created");
            });

            db.transaction(function (tx) {
                var sql = 'UPDATE MobilevwApp_Coupons SET CreatedateUTC = "' + obj.CreatedateUTC + '",  UpdatedateUTC = "' + obj.UpdatedateUTC + '", DeletedateUTC = "' + obj.DeletedateUTC + '", BusinessID = ' + obj.BusinessID + ',BusinessLocationID = ' + obj.BusinesslocationID + ',FileName = "' + obj.FileName + '",TownID = ' + obj.TownID + ',RegionID = ' + obj.RegionID + ' where ID = ' + obj.ID;
                tx.executeSql(sql);
            });

        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobilevwApp_Coupons where ID =' + obj.ID);
                //    console.log('Delete MobileApp_vwApp_Teams where ID');
            });
        }

    });


    $.each(obj.Catalogues, function (idx, obj) {
        if (obj.DeletedateUTC == null) {

            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO MobilevwApp_Catalogues (ID ,CreatedateUTC ,UpdatedateUTC ,DeletedateUTC ,BusinessID ,BusinessLocationID,FileName,TownID,RegionID,Categories ) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '",' + obj.BusinessID + ',' + obj.BusinesslocationID + ',"' + obj.FileName + '",' + obj.TownID + ',' + obj.RegionID + ',13)');
                //    console.log("INSERT INTO MobileApp_vwApp_Teams is created");
            });

            db.transaction(function (tx) {
                var sql = 'UPDATE MobilevwApp_Catalogues SET CreatedateUTC = "' + obj.CreatedateUTC + '", UpdatedateUTC = "' + obj.UpdatedateUTC + '", DeletedateUTC = "' + obj.DeletedateUTC + '", BusinessID = ' + obj.BusinessID + ',BusinessLocationID = ' + obj.BusinesslocationID + ',FileName = "' + obj.FileName + '",TownID = ' + obj.TownID + ',RegionID = ' + obj.RegionID + ' where ID = ' + obj.ID;
                tx.executeSql(sql);
            });

        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobilevwApp_Catalogues where ID =' + obj.ID);
                //    console.log('Delete MobileApp_vwApp_Teams where ID');
            });
        }

    });



    var datenow1 = new Date();
    var timenow = datenow1.getTime();

    $.each(obj.Isadmin, function (idx, obj) {

            db.transaction(function(tx) {
                tx.executeSql('Update MobileApp_LastUpdatesec set Datesecs = "' + Math.round((timenow/1000)) + '"');
                closemodel();

            });
    });
}


function passscoretoserver(testvar){
    checkonline();

    if(networkconnection!=0) {
        var http = new XMLHttpRequest();
        var url = "http://admin.adme.kiwi/loaddatafromapp.aspx";
        var params = "?" + testvar;

        http.open("POST", url + params, true);
        console.log(url + params);

        http.onreadystatechange = function () {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                // alert(http.responseText);
            }
        }
        http.send();
    }else{
        window.plugins.toast.showShortCenter('Sorry couldnt update Server No Internet', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});

    }
}

function randomfunctions(){
    //  alert("random");
    db.transaction(checktowncountfunc, errorCBfunc, successCBfunc);
}



function checktowncountfunc(tx){
    // $('#busy').show();
    var sql = "select Count(ID) as Count from MobileApp_Towns";
    //alert(sql);
    tx.executeSql(sql, [], checktowncountfunc_success);
}

function checktowncountfunc_success(tx, results) {
    var menu = results.rows.item(0);
    //alert(menu.Count);
    if(menu.Count != 0) {
        db.transaction(checktownfollowfunc, errorCBfunc, successCBfunc);
    }
}


function checktownfollowfunc(tx){
    // $('#busy').show();
    var sql = "select Count(ID) as Count from MobileApp_Towns where Follow = 1 ";
    //  alert(sql);
    tx.executeSql(sql, [], checktownfollowfunc_success);
}


function checktownfollowfunc_success(tx, results) {
    var menu = results.rows.item(0);
    if(menu.Count == 0) {
        db.transaction(getregionsfunc, errorCBfunc, successCBfunc);
        $('#basicModalregion').modal('show');
    }else{

        db.transaction(getbuscatsfunc, errorCBfunc, successCBfunc);
    }
}

function getregionsfunc(tx) {
    var sql = "select ID ,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,RegionName from MobileApp_Region order by RegionName ";
    // alert(sql);
    tx.executeSql(sql, [], getregionsfunc_success);
}

function getregionsfunc_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    $('#regionid').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";


        $('#regionid').append('<Div class="modal-body"  data-dismiss="modal" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="choosetownfunc('+ menu.ID + ')"  >' +
        '<div class="bold size13"    >' + menu.RegionName  +
        '</div>' +
        '</Div>');
    }

}

function choosetownfunc(ID){
    $('#basicModaltown').modal('show');
    regionIDfunc =ID;
    db.transaction(gettownfunc, errorCBfunc, successCBfunc);
}

function gettownfunc(tx) {
    var sql = "select ID,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,TownName,RegionID from MobileApp_Towns where RegionID = " + regionIDfunc;
    //alert(sql);
    tx.executeSql(sql, [], gettownfunc_success);
}

function gettownfunc_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    $('#townid').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";


        $('#townid').append('<Div class="modal-body"  data-dismiss="modal" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="townchosenfunc('+ menu.ID + ')"  >' +
        '<div class="bold size13"   >' + menu.TownName  +
        '</div>' +
        '</Div>');
    }

}

function townchosenfunc(ID){


    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_Towns set Follow = 0');
        console.log("Update MobileApp_Towns");
    });
    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_Towns set Follow = 1 where ID = ' + ID);
        console.log("Update MobileApp_Towns");
    });

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set  Region= ' + regionID + ', Town = ' + ID);
        console.log("Update MobileApp_LastUpdatesec");
    });


    passscoretoserver("regionid=" + regionID + "&townid=" + ID + "&deviceid=" + deviceIDfunc + "&token=" + apptoken);

   // db.transaction(getbuscatsfunc, errorCBfunc, successCBfunc);

}


function getbuscatsfunc(tx) {
    var sql = "select COUNT(ID) as Count from MobileApp_BusinessCategories where Follow = 1";
   // alert(sql);
    tx.executeSql(sql, [], getbuscatsfunc_success);
}

function getbuscatsfunc_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);
    if(menu.Count == 0){
        if(document.getElementById("divindex")==null) {

            window.plugins.toast.showLongCenter('You need to select Categories you would like to view. Please go to the Setting page and Click on Select Categories', function (a) {
                console.log('toast success: ' + a)
            }, function (b) {
                alert('toast error: ' + b)
            });

        }
    }

}

function gettokenregion(tx) {
    var sql =  "select Datesecs,token from MobileApp_LastUpdatesec";
   // alert(sql);
    tx.executeSql(sql, [], getregionsdata,errorCBfunc);
}

function getregionsdata(tx, results) {

    var row = results.rows.item(0);
    var datenowsecsync2 = row.Datesecs;
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'http://admin.adme.kiwi/admedataformobile.aspx?deviceID=' + deviceIDfunc + '&token=' + row.token + '&sec=0&start=1', false);
    // alert('http://admin.adme.kiwi/admedataformobile.aspx?deviceID=' + deviceIDfunc + '&token=' + row.token + '&sec=0&start=1');
    xmlHttp.send();

    var json = xmlHttp.responseText;

    var obj = JSON.parse(json);
    syncmaintablesregions(obj);

}

function syncmaintablesregions(obj){

    $.each(obj.Region, function (idx, obj) {
        if(obj.DeletedateUTC == null){

            // console.log('Delete MobileApp_clubs where ID');
            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO MobileApp_Region(ID ,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,RegionName) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '","' + obj.RegionName + '" )');
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
                tx.executeSql('INSERT OR IGNORE INTO MobileApp_Towns(ID,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,TownName,RegionID ) VALUES (' + obj.ID + ',"' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '","' + obj.TownName + '",' + obj.RegionID + ' )');
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





    $.each(obj.Isadmin, function (idx, obj) {

        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set Datesecs = "0",Region=0,Town=0');
            closemodelRegion();

        });
    });

}
