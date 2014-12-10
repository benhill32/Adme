var db;
var regionID = 0;
var townID = 0;
var townname =0;
var regionname = 0;
document.addEventListener("deviceready", onDeviceReadysettings, false);

function onDeviceReadysettings() {

    $("#deviceid").empty();
    $("#deviceid").append("<strong>Device ID:</strong> : " + device.uuid);

    gettownregion();
    getLsyncdate();
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



    $("#syncdate").empty();
    $("#syncdate").append("<strong>Last Sync Date:</strong> : " + datetime.getDate() + " " + month[datetime.getMonth()] + " " + datetime.getFullYear() + " " + datetime.getHours() + ":" +  ("0" + datetime.getMinutes()).slice(-2) + ":" + ("0" + datetime.getSeconds()).slice(-2) );




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
        '<div class="bold size13"   >' + menu.RegionName  +
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
        tx.executeSql('Update MobileApp_Towns set Follow = 1 where ID = ' + ID);
        console.log("Update MobileApp_Towns");
    });

    db.transaction(gettownname, errorCBfunc, successCBfunc);

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
    $("#townnameid").append("<strong>Choose Region : </strong>" + menu.RegionName + ' - ' + townname);


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