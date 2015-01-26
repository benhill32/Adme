/**
 * Created by BenH on 1/22/2015.
 */
var db;
var townID = "";
var BusID = "";
document.addEventListener("deviceready", onDeviceReadycoupons, false);
var IDdaily = "";

function onDeviceReadycoupons() {
    randomfunctions();
    db.transaction(gettownname, errorCBfunc, successCBfunc);
}

function gettownname(tx) {
    var sql = "select ID from MobileApp_Towns where Follow=1";
    // alert(sql);
    tx.executeSql(sql, [], gettownname_success);
}

function gettownname_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
    //  alert(len);
    var menu = results.rows.item(0);
    townID = menu.ID;

    db.transaction(getdata, errorCBfunc, successCBfunc);
}


function getdata(tx) {
    var sql ="Select MGP.ID ,MGP.CreatedateUTC ,MGP.UpdatedateUTC ,MGP.DeletedateUTC ,MGP.BusinessID ,MGP.BusinessLocationID,MGP.FileName,MBN.Icon as Icon" +
        " from MobilevwApp_Coupons as MGP JOIN MobileApp_BusinessNames as MBN on MGP.BusinessID = MBN.ID " +
        " JOIN MobileApp_BusinessCategories as MBC on MGP.Categories = MBC.CategoryID AND MGP.BusinessID = MBC.BusniessID ";
        " where MGP.TownID =" + townID +  " and MBC.Follow =1";


    alert(sql);
    tx.executeSql(sql, [], getdata_success);
}

function getdata_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
     alert(len);


    var count = 1;
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);






            var imgg = "";
            if (menu.Icon != "null") {
                imgg = '&nbsp;<img src="data:image/png;base64,' + menu.Icon + '" style="width:50px;"  align="center"  >&nbsp;';
                //imgg = menu.BusinessName;
            } else {
                imgg = "";
            }
//data-toggle="modal" data-target="#basicmodaldaily"
            $('#gasdealsdivbody').append('<Div align="center"  class="gasdealsdiv" >' +
            '<div align="center"  class="gas4sMain"   >' + imgg + '</div>' +

            '</Div>');
            count = 0;
        }





}