var db;
var regionID = 0;
var townID = 0;
var townname =0;
var regionname = 0;
var catid= 0;
var catbusID =0;
document.addEventListener("deviceready", onDeviceReadysettings, false);
var networkconnectionset = 0;

function onDeviceReadysettings() {

    $("#deviceid").empty();
    $("#deviceid").append(device.uuid);
    onOfflinesetting();
    gettownregion();
    getLsyncdate();
}

function onOfflinesetting(){

    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = '0';
    states[Connection.ETHERNET] = '2';
    states[Connection.WIFI]     = '2';
    states[Connection.CELL_2G]  = '1';
    states[Connection.CELL_3G]  = '1';
    states[Connection.CELL_4G]  = '1';
    states[Connection.NONE]     = '0';

    networkconnectionset = states[networkState];
//alert(states[networkState]);

}

function getLsyncdate(){

    db.transaction(getLsyncdatedata, errorCBfunc, successCBfunc);


}
function getLsyncdatedata(tx) {
    var sql = "select Datesecs,token from MobileApp_LastUpdatesec ";
  //  alert(sql);
    tx.executeSql(sql, [], getLsyncdatedata_success);
}

function getLsyncdatedata_success(tx, results) {

    var len = results.rows.length;
    var menu = results.rows.item(0);
   // alert(menu.Datesecs);
    var t = new Date(1970,0,1);
    t.setSeconds(menu.Datesecs);
    var utc = ((t.getTimezoneOffset()*-1))*60
    //alert(utc);
    var ts = new Date(1970,0,1);
    var datesec = Number(menu.Datesecs) + Number(utc);
    ts.setSeconds(datesec);



    var datetime = ts;


    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";



    $("#lastsyncdate").empty();
    $("#lastsyncdate").append(datetime.getDate() + " " + month[datetime.getMonth()] + " " + datetime.getFullYear() + " " + datetime.getHours() + ":" +  ("0" + datetime.getMinutes()).slice(-2) + ":" + ("0" + datetime.getSeconds()).slice(-2) );

}

function showcategories(){

    db.transaction(getcategories, errorCBfunc, successCBfunc);
    $('#basicModacategories').modal('show');

}
function backtocat(){
    db.transaction(getcategories, errorCBfunc, successCBfunc);
    $('#basicModacategories').modal('show');

}

function getcategories(tx) {
    var sql = "select ID ,CreatedateUTC,UpdatedateUTC,DeletedateUTC,CategoryName from MobileApp_Categories order by CategoryName ";
    //alert(sql);
    tx.executeSql(sql, [], getcategories_success);
}

function getcategories_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    $('#Categoriesid').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";


        $('#Categoriesid').append('<Div class="modal-body"  data-dismiss="modal" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="choosecate('+ menu.ID + ')" >' +
        '<div class="bold size13"   >' + menu.CategoryName  +
        '</div>' +
        '</Div>');
    }

}

function choosecate(ID){
    $('#basicModabusiness').modal('show');
    catid =ID;
    db.transaction(getcatname, errorCBfunc, successCBfunc);
    db.transaction(getbusiness, errorCBfunc, successCBfunc);

}

function getcatname(tx) {
    var sql = "select CategoryName from MobileApp_Categories where ID = " + catid;
    //alert(sql);
    tx.executeSql(sql, [], getcatname_success);
}


function getcatname_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
    $('#Categoriesheader').empty();
        var menu = results.rows.item(0);
         $('#Categoriesheader').append('<Div>' + menu.CategoryName  + '</Div>');
}


function getbusiness(tx) {
    var sql = "select MBN.ID as ID,MBC.ID as BCID, MBN.BusinessName as BusinessName, MBN.Icon as Icon,MBC.Follow as Follow from MobileApp_BusinessCategories as MBC JOIN MobileApp_BusinessNames as MBN on MBC.BusniessID = MBN.ID where MBC.CategoryID = " + catid;
   // alert(sql);
    tx.executeSql(sql, [], getbusiness_success);
}

function getbusiness_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;

    $('#Categoriesbus').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";
        if(menu.Icon != "null"){
            imgg = '&nbsp;<img src="data:image/png;base64,' + menu.Icon + '"  align="center" >&nbsp;';
            //imgg = menu.BusinessName;
        }else{

            imgg = menu.BusinessName;
        }

        var backgroundcolour = "";
        var onclickoption = "";
        if(menu.Follow == 1){
            backgroundcolour ="background-color: #71BF44;";
            onclickoption = 'onclick="choosebuscatfalse('+ menu.BCID + ')"';

        }else{
            backgroundcolour ="background-color: #fff;";
            onclickoption = 'onclick="choosebuscattrue('+ menu.BCID + ')"';
        }


        $('#Categoriesbus').append('<Div align="center" id="divcatbus' + menu.BCID + '"  class="modal-body"  style="border-bottom: 1px solid #e5e5e5;' + backgroundcolour + '"  ' + onclickoption + '  >' +
        '<div align="center"  >' + imgg +
        '</div>' +
        '</Div>');
    }

}

function choosebuscattrue(ID){
//alert("Update MobileApp_BusinessCategories set Follow = 1 where ID = " + ID);
    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_BusinessCategories set Follow = 1 where ID = ' + ID);
        console.log("Update MobileApp_BusinessCategories");
    });
    catbusID = ID;
   // sendcattoserver();
    Passcattoserver(ID,1);
    choosecate(catid);



}



function choosebuscatfalse(ID){
//alert("Update MobileApp_BusinessCategories set Follow = 1 where ID = " + ID);

    catbusID = ID;
    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_BusinessCategories set Follow = 0 where ID = ' + ID);
        console.log("Update MobileApp_BusinessCategories");
    });
   // sendcattoserver();
    Passcattoserver(ID,0);
    choosecate(catid);

}

function Passcattoserver(ID,Outcome){

    passscoretoserver("categories=" + ID + "&outcome=" + Outcome + "&deviceid=" + deviceIDfunc + "&token=" + apptoken);
}

function sendcattoserver(){
    db.transaction(sendcattoserver_data, errorCBfunc, successCBfunc);
}

function sendcattoserver_data(tx) {
    var sql = "select ID from MobileApp_BusinessCategories WHERE Follow = 1 order by ID ";

    //alert(sql);
    tx.executeSql(sql, [], sendcattoserver_data_success);
}

function sendcattoserver_data_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
    var cat = "";
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        cat = cat + menu.ID + ",";
    }
    passscoretoserver("categories=" + cat.slice(0,-1) + "&deviceid=" + deviceIDfunc + "&token=" + apptoken);
}


function showregions(){

    db.transaction(getregions, errorCBfunc, successCBfunc);
    $('#basicModalregion').modal('show');

}

function getregions(tx) {
    var sql = "select ID ,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,RegionName from MobileApp_Region order by RegionName ";
    //alert(sql);
    tx.executeSql(sql, [], getregions_success);
}

function getregions_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
//alert(len);
        $('#regionid').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";


        $('#regionid').append('<Div class="modal-body"  data-dismiss="modal" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="choosetown('+ menu.ID + ')"  >' +
        '<div class="bold size13"    >' + menu.RegionName  +
        '</div>' +
        '</Div>');
    }

}

function choosetown(ID){
    $('#basicModaltown').modal('show');
    regionID =ID;
    db.transaction(gettown, errorCBfunc, successCBfunc);
}

function gettown(tx) {
    var sql = "select ID,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,TownName,RegionID from MobileApp_Towns where RegionID = " + regionID;
    //alert(sql);
    tx.executeSql(sql, [], gettown_success);
}

function gettown_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    $('#townid').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";


        $('#townid').append('<Div class="modal-body"  data-dismiss="modal" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="townchosen('+ menu.ID + ')"  >' +
        '<div class="bold size13"   >' + menu.TownName  +
        '</div>' +
        '</Div>');
    }

}

function townchosen(ID){
    townID = ID;

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_Towns set Follow = 0');
        console.log("Update MobileApp_Towns");
    });
    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_Towns set Follow = 1 where ID = ' + ID);
        console.log("Update MobileApp_Towns");
    });

    db.transaction(gettownname, errorCBfunc, successCBfunc);
    passscoretoserver("regionid=" + regionID + "&townid=" + ID + "&deviceid=" + deviceIDfunc + "&token=" + apptoken)

}



function gettownname(tx) {
    var sql = "select TownName from MobileApp_Towns where ID = " + townID;
   // alert(sql);
    tx.executeSql(sql, [], gettownname_success);
}

function gettownname_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
        var menu = results.rows.item(0);
    townname = menu.TownName;


    db.transaction(getregionname, errorCBfunc, successCBfunc);
}

function getregionname(tx) {
    var sql = "select RegionName from MobileApp_Region where ID = " + regionID;
    //alert(sql);
    tx.executeSql(sql, [], getregionname_success);
}

function getregionname_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
//alert(len);

    var menu = results.rows.item(0);

    $("#townnameid").empty();
    $("#townnameid").append(menu.RegionName + ' - ' + townname);


}

function gettownregion() {

    db.transaction(gettownregiondata, errorCBfunc, successCBfunc);
}

function gettownregiondata(tx) {
    var sql = "select ID,RegionID from MobileApp_Towns where Follow =1";
    // alert(sql);
    tx.executeSql(sql, [], gettownregiondata_success);
}

function gettownregiondata_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);
    townID = menu.ID;
    regionID = menu.RegionID;


    db.transaction(gettownname, errorCBfunc, successCBfunc);
}


function cleardata(){

    onOfflinesetting();

    if(networkconnectionset!=0) {
        $('#indexloadingdata').modal('show');
        db.transaction(droptables, errorCBfunc, successCBfunc);
        refreshdata();
    }


}