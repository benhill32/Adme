var db;
var regionID = 0;
var townID = 0;
var regionname;
document.addEventListener("deviceready", onDeviceReadysettings, false);

function onDeviceReadysettings() {

    $("#deviceid").empty();
    $("#deviceid").append("<strong>Device ID:</strong> : " + device.uuid);


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
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";


        $('#regionid').append('<Div class="modal-body"  data-dismiss="modal" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="choosetown('+ menu.ID + ',' +  menu.RegionName + ')"  >' +
        '<div class="bold size13"   >' + menu.RegionName  +
        '</div>' +
        '</Div>');
    }

}

function choosetown(ID,Name){
    $('#basicModaltown').modal('show');
    regionID =ID;
    regionname = name;
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
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";

        $('#townid').append('<Div class="modal-body"  data-dismiss="modal" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="townchosen('+ menu.ID + ',' + menu.TownName + ')"  >' +
        '<div class="bold size13"   >' + menu.TownName  +
        '</div>' +
        '</Div>');
    }

}

function townchosen(ID,Name){
    townID = ID;
    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_Towns set Follow = 1 where ID = ' + ID);
        console.log("Update MobileApp_Towns");
    });

    $("#townnameid").empty();
    $("#townnameid").append("<strong>Choose Region :</strong>" + regionname + " - " + Name);

}

