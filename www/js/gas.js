/**
 * Created by BenH on 1/22/2015.
 */
var db;
var townID = "";
var BusID = "";
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

   //alert(sql);
    tx.executeSql(sql, [], getdata_success);
}

function getdata_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
  //  alert(len);


    var count = 1;
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);



        if(menu.Follow ==1) {

            if(count == 1){
                $('#gasdealsdivheader').append('<Div align="center"  class="gasdealsdivheader"    >' +
                '<div align="center"  class="gas4sMainheader"   >&nbsp;</div>' +
                '<div align="center"  class="gas4sheader " >91</div>' +
                '<div align="center" class="gas4sheader""  >96</div>' +
                '<div align="center" class="gas4sheader""  >Diesel</div>' +
                '<div align="center" class="gas4sheader""  >LPG</div>' +
                '</Div>');

            }




            var imgg = "";
            if (menu.Icon != "null") {
                imgg = '&nbsp;<img src="data:image/png;base64,' + menu.Icon + '" style="width:50px;"  align="center"  >&nbsp;';
                //imgg = menu.BusinessName;
            } else {
                imgg = "";
            }
//data-toggle="modal" data-target="#basicmodaldaily"
            $('#gasdealsdivbody').append('<Div align="center"  class="gasdealsdiv" onclick="showgascompanies('+ menu.BusinessID + ')"    >' +
            '<div align="center"  class="gas4sMain"   >' + imgg + '</div>' +
            '<div align="center"  class="gas4s " >' + menu.Price91 + '</div>' +
            '<div align="center" class="gas4s""  >' + menu.Price96 + '</div>' +
            '<div align="center" class="gas4s""  >' + menu.PriceDiesel + '</div>' +
            '<div align="center" class="gas4s""  >' + menu.PriceLPG + '</div>' +
            '</Div>');
            count = 0;
        }

    }



}



function showgascompanies(BID){

    BusID = BID;
    db.transaction(Getgascompanies, errorCBfunc, successCBfunc);
    $('#basicModalgas').modal('show');

}

function Getgascompanies(tx) {
    var sql ="Select MGP.BusinessID,MGP.BusinessLocationID,MBN.Icon as Icon,MGP.Price91,MGP.Price96 ,MGP.PriceDiesel ,MGP.PriceLPG,MBL.Lat,MBL.Long,MBL.Address" +
        " from MobilevwApp_GasPrices as MGP JOIN MobileApp_BusinessNames as MBN on MGP.BusinessID = MBN.ID " +
        " JOIN MobileApp_BusinessLocations as MBL on MGP.BusinessLocationID = MBL.ID AND MGP.BusinessID = MBL.BusinessID " +
        " where MGP.BusinessID =" + BusID + " and MGP.TownID =" + townID +
        " order by MGP.Price91";
    tx.executeSql(sql, [], Getgascompanies_success);
}

function Getgascompanies_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
   // alert(len);
    var menu2 = results.rows.item(0);

    $('#divimgcom').empty();
    $('#gaslistid').empty();
    $('#gaslistidheader').empty();
    if (menu2.Icon != "null") {
        imgg = '&nbsp;<img src="data:image/png;base64,' + menu2.Icon + '" style="width:50px;"  align="center"  >&nbsp;';
        //imgg = menu.BusinessName;
    } else {
        imgg = "";
    }
    $('#divimgcom').append(imgg);

    var count = 1;

    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";

        if(count == 1){
            $('#gaslistidheader').append('<Div align="center"  class="gasdealsdivheader2"    >' +
            '<div align="center"  class="gas4sMainheader">&nbsp;</div>' +
            '<div align="center"  class="gas4sheader " >91</div>' +
            '<div align="center" class="gas4sheader""  >96</div>' +
            '<div align="center" class="gas4sheader""  >Diesel</div>' +
            '<div align="center" class="gas4sheader""  >LPG</div>' +
            '</Div>');

        }
        $('#gaslistid').append('<Div align="center" id="gasmaplink' + menu.BusinessLocationID + '"  class="gaslistid" >' +
        '<div align="center"  class="gas4sMain"   >' + menu.Address.replace(', New Zealand',' ') + '</div>' +
        '<div align="center"  class="gas4s " >' + menu.Price91 + '</div>' +
        '<div align="center" class="gas4s""  >' + menu.Price96 + '</div>' +
        '<div align="center" class="gas4s""  >' + menu.PriceDiesel + '</div>' +
        '<div align="center" class="gas4sEnd""  >' + menu.PriceLPG + '</div>' +
        '</Div>');

        $("#gasmaplink" + menu.BusinessLocationID).click(function () {
            window.open("https://www.google.co.nz/maps/dir/Current+Location/" + menu.Lat + ",+" + menu.Long, "_system")
        });
        count = 0;
    }
}