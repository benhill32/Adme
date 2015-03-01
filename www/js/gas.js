/**
 * Created by BenH on 1/22/2015.
 */
var db;
var townID = "";
var BusID = "";
document.addEventListener("deviceready", onDeviceReadygas, false);
var IDdaily = "";

function onDeviceReadygas() {
   // randomfunctions();
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
    var current_date = new Date();
    var year = current_date.getFullYear();
    var month = ("0" + (current_date.getMonth()+1)).slice(-2);
    var day = current_date.getDate();
    var hours = ("0" + current_date.getHours()).slice(-2);
    var mins = ("0" + current_date.getMinutes()).slice(-2);

  //  var sql ="Select MGP.ID as ID,MBL.Address as Address,MGP.BusinessID,MBN.Icon as Icon,MBC.Follow as Follow ,MGP.Price91 as Price91,MGP.Price96 as Price96 ,MGP.PriceDiesel as PriceDiesel ,MGP.PriceLPG as PriceLPG,MGP.StartDate as StartDate,MGP.EndDate as EndDate " +
 //       " from MobilevwApp_GasPrices as MGP JOIN MobileApp_BusinessNames as MBN on MGP.BusinessID = MBN.ID " +
 //       " JOIN MobileApp_BusinessCategories as MBC on MGP.Categories = MBC.CategoryID AND MGP.BusinessID = MBC.BusniessID " +
  //      " JOIN MobileApp_BusinessLocations as MBL on MGP.BusinessLocationID = MBL.ID" +
  //      " where MGP.TownID =" + townID + " and MGP.DeletedateUTC = 'null' and datetime(MGP.EndDate) >=  datetime('" + year + "-" + month + "-" + day + " " + hours + ":" + mins + ":00')"  +
 //       "  ORDER BY Follow DESC,MGP.EndDate";

    var sql ="Select MGP.ID as ID,MGP.BusinessID,MBN.Icon as Icon ,MGP.Price91 as Price91,MGP.Price96 as Price96 ,MGP.PriceDiesel as PriceDiesel ,MGP.PriceLPG as PriceLPG,MGP.StartDate as StartDate,MGP.EndDate as EndDate " +
        " from MobilevwApp_GasPrices as MGP JOIN MobileApp_BusinessNames as MBN on MGP.BusinessID = MBN.ID " +
        " where MGP.TownID =" + townID + " and MGP.DeletedateUTC = 'null' and datetime(MGP.EndDate) >=  datetime('" + year + "-" + month + "-" + day + " " + hours + ":" + mins + ":00')"  +
        "  ORDER BY Follow DESC,MGP.EndDate";

    alert(sql);


   //alert(sql);
    tx.executeSql(sql, [], getdata_success);
}

function getdata_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    alert(len);

    var intervalArr = new Array();
    var count = 1;
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var res = (menu.EndDate).split("T");
        var split = res[0].split("-");
        var month2 = split[1];
        var year2 = split[0];
        var day2 = split[2];
        var h = res[1].split(":");
        var name = "countdown" + menu.ID;
        var address = (menu.Address).split(',');


        var target_date = new Date(year2,month2-1,day2,h[0],h[1],h[2]).getTime();

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
            ' <div  style="width:60%;float: left;"> <div>' +
            ' <div align="center"  class="gas4sheader" >91</div> <div align="center" class="gas4sheader"  >96</div> <div align="center" class="gas4sheader"  >D</div> <div align="center" class="gas4sheader"  >LPG</div>' +
            '</div>' +
            '<div>' +
            '<div align="center"  class="gas4s" >' + menu.Price91 + '</div>' +
            '<div align="center" class="gas4s"  >' + menu.Price96 + '</div>' +
            '<div align="center" class="gas4s"  >' + menu.PriceDiesel + '</div>' +
            '<div align="center" class="gas4s"  >' + menu.PriceLPG + '</div>' +
            '</div>' +
            '<div> <div  class="gas4saddress">' + address[0] + "," + address[1] + "," + address[2] +
            ' </div> </div> </div>' +
            '<div align="center"  class="gas4sEnd2"   > <div>' +
            '<div align="center"  class="gas4sheader2" >Time Ends</div>' +
            '</div><div >' +
            '<div align="center"  class="gas4s22" ><span id="' + name + '">' +
            '</span</div></div></div> ' +

            '</Div>');
            count = 0;
       //}

        intervalArr.push(name + "|" + target_date);
    }

    setintervaldailygas(intervalArr);

}

function setintervaldailygas(detailarray){
    //alert(detailarray);

    var current_date = new Date().getTime();

    for (var i in detailarray) {
        var item = detailarray[i];
        // alert(item);
        var res = (item).split("|");

        var seconds_left = (res[1] - current_date) / 1000;

        // do some time calculations
        //days = parseInt(seconds_left / 86400);
        //seconds_left = seconds_left % 86400;

        hours = parseInt(seconds_left / 3600);
        seconds_left = seconds_left % 3600;

        minutes = parseInt(seconds_left / 60);
        seconds = parseInt(seconds_left % 60);

        var countdown = document.getElementById(res[0]);
        // format countdown string + set tag value
        countdown.innerHTML = hours + "h, "
        + minutes + "m";

    }




}





function showgascompanies(BID){

    BusID = BID;

    passscoretoserver("deviceid=" + device.uuid + "&BusinessID=" + BID + "&GasID=" + BID);

    db.transaction(Getgascompanies, errorCBfunc, successCBfunc);
    $('#basicModalgas').modal('show');

}

function Getgascompanies(tx) {
    var sql ="Select MGP.BusinessID,MGP.ID,MBN.Icon as Icon,MGP.Price91,MGP.Price96 ,MGP.PriceDiesel ,MGP.PriceLPG,MBL.Lat,MBL.Long,MBL.Address" +
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
            '<div align="center"  class="gas4sMainheader">Address</div>' +
            '<div align="center"  class="gas4sheader " >91</div>' +
            '<div align="center" class="gas4sheader""  >96</div>' +
            '<div align="center" class="gas4sheader""  >Diesel</div>' +
            '<div align="center" class="gas4sheader""  >LPG</div>' +
            '</Div>');

        }

        var address = (menu.Address).split(',');


        $('#gaslistid').append('<Div align="center" class="gaslistid" onclick="googlemaps(' + menu.Lat + ',' + menu.Long + ')" >' +
        '<div align="center"  class="gas4sMain2"  >' + address[0] + '</div>' +
        '<div align="center"  class="gas4s2 " >' + menu.Price91 + '</div>' +
        '<div align="center" class="gas4s2""  >' + menu.Price96 + '</div>' +
        //'<div align="center"  class="gas4s " >' + menu.Lat + '</div>' +
        //'<div align="center" class="gas4s""  >' + menu.Long + '</div>' +
        '<div align="center" class="gas4s2""  >' + menu.PriceDiesel + '</div>' +
        '<div align="center" class="gas4sEnd""  >' + menu.PriceLPG + '</div>' +
        '</Div>');

        count = 0;
    }
}

function googlemaps(LAt,Long){

    window.open("https://www.google.co.nz/maps/dir/Current+Location/" + LAt + ",+" + Long, "_system");

}