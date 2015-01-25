/**
 * Created by BenH on 1/22/2015.
 */
var db;
var townID = "";
document.addEventListener("deviceready", onDeviceReadygas, false);
var IDdaily = "";

function onDeviceReadygas() {
    randomfunctions();
    db.transaction(gettownname, errorCBfunc, successCBfunc);
}

//db.transaction(gettownname, errorCBfunc, successCBfunc);


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



    var sql ="Select MGP.BusinessID,MBN.Icon as Icon,MAX(MBC.Follow) as Follow ,MIN(MGP.Price91) as Price91,MIN(MGP.Price96) as Price96 ,MIN(MGP.PriceDiesel) as PriceDiesel ,MIN(MGP.PriceLPG) as PriceLPG" +
        " from MobilevwApp_GasPrices as MGP JOIN MobileApp_BusinessNames as MBN on MGP.BusinessID = MBN.ID " +
        " JOIN MobileApp_BusinessCategories as MBC on MGP.Categories = MBC.CategoryID AND MGP.BusinessID = MBC.BusniessID " +
        " where MGP.TownID =" + townID +
        " GROUP BY MGP.BusinessID";


   alert(sql);
    tx.executeSql(sql, [], getdata_success);
}

function getdata_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    alert(len);


    $('#gasdealsdivheader').append('<Div align="center"  class="gasdealsdivheader"    >' +
    '<div align="center"  class="gas4sMainheader"   >&nbsp;</div>' +
    '<div align="center"  class="gas4sheader " >91</div>' +
    '<div align="center" class="gas4sheader""  >96</div>' +
    '<div align="center" class="gas4sheader""  >Diesel</div>' +
    '<div align="center" class="gas4sheader""  >LPG</div>' +
    '</Div>');



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
            $('#gasdealsdivbody').append('<Div align="center"  class="gasdealsdiv"    >' +
            '<div align="center"  class="gas4sMain"   >' + imgg + '</div>' +
            '<div align="center"  class="gas4s " >' + menu.Price91 + '</div>' +
            '<div align="center" class="gas4s""  >' + menu.Price96 + '</div>' +
            '<div align="center" class="gas4s""  >' + menu.PriceDiesel + '</div>' +
            '<div align="center" class="gas4s""  >' + menu.PriceLPG + '</div>' +
            '</Div>');


    }
}

