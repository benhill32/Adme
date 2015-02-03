document.addEventListener("deviceready", onDeviceReadylist, false);
var regionIDlogin = 0;

function onDeviceReadylist() {
    refreshdata();

}



function getregionslogin(tx) {
    var sql = "select ID ,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,RegionName from MobileApp_Region order by RegionName ";
   //  alert(sql);
    tx.executeSql(sql, [], getregionslogin_success);
}

function getregionslogin_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    $('#divregionnames').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";

        $('#divregionnames').append('<Div class="modal-body" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="loadtownslogin(' + menu.ID + ')">' +
        '<div class="bold size13">' + menu.RegionName  +
        '</div>' +
        '</Div>');
    }
}



function loadtownslogin(ID) {
    db.transaction(gettownlogin2, errorCBfunc, successCBfunc);
    regionIDlogin = ID;
}

function gettownlogin2(tx) {

    var sql = "select ID,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,TownName,RegionID from MobileApp_Towns where RegionID = " + regionIDlogin;
    alert(sql);
    tx.executeSql(sql, [], gettownlogin2_success);
}

function gettownlogin2_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    $('#divtownnames').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";


        $('#divtownnames').append('<Div class="modal-body"  data-dismiss="modal" align="left" style="border-bottom: 1px solid #e5e5e5;"  >' +
        '<div class="bold size13"   >' + menu.TownName  +
        '</div>' +
        '</Div>');
    }

}





function adddetails(){
    var Name = $('#txtname').val();
    var DOB = $('#txtDescription').val();
    var email = $('#txtEmail').val();


    passscoretoserver("regionid=" + regionID + "&townid=" + ID + "&deviceid=" + deviceIDfunc + "&token=" + apptoken);


    randomfunctions();

}






