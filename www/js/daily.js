var db;
var townID = "";
document.addEventListener("deviceready", onDeviceReadydaily, false);
var IDdaily = "";
var followbusiness =  [];
function onDeviceReadydaily() {
    refreshdata();

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
    var menu = results.rows.item(0);
    townID = menu.ID;


    db.transaction(getCategoriesselected, errorCBfunc, successCBfunc);
}


function getCategoriesselected(tx) {
    var sql = "select ID from MobileApp_BusinessCategories where Follow=1";
   //  alert(sql);
    tx.executeSql(sql, [], getCategoriesselected_success);
}


function getCategoriesselected_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
  //  alert(len);
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        followbusiness.push(menu.ID);
    }

    db.transaction(getdata, errorCBfunc, successCBfunc);
}

function getdata(tx) {


    var current_date = new Date();
    var year = current_date.getFullYear();
    var month = ("0" + (current_date.getMonth()+1)).slice(-2);
    var day = ("0" + (current_date.getDate())).slice(-2);
    var hours = ("0" + current_date.getHours()).slice(-2);
    var mins = ("0" + current_date.getMinutes()).slice(-2);

    var sql = "select MAD.ID as ID,MAD.Categories as Categories,MAD.BusinessID as BusinessID,MAD.BusinessLocationID as BusinessLocationID,MAD.StartDate as StartDate ,MAD.EndDate as EndDate ,MAD.ItemName as ItemName,MAD.Details as Details ,MAD.Price as Price ,MAD.URL as URL, MBN.Icon as Icon,MAD.DeletedateUTC as DeletedateUTC, MAD.RegionID as RegionID,MAD.TownID as TownID,datetime(MAD.EndDate) as Ben1,datetime('" + year + "-" + month + "-" + day + " " + hours + ":" + mins + ":00') as Ben2 " +
        "from MobilevwApp_dailydeal as MAD JOIN MobileApp_BusinessNames as MBN on MAD.BusinessID = MBN.ID " +
        "WHERE MAD.TownID = " + townID + "  and MAD.DeletedateUTC = 'null' and MBN.DeletedateUTC = 'null' and datetime(MAD.EndDate) >=  datetime('" + year + "-" + month + "-" + day + " " + hours + ":" + mins + ":00') order by MAD.EndDate  ";
  //   alert(sql);
    //
    tx.executeSql(sql, [], getdata_success);
}

function getdata_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;

  //  alert("Number of Deals" + len);
   // alert(followbusiness);



    var month = new Array();
    month[1] = "January";
    month[2] = "February";
    month[3] = "March";
    month[4] = "April";
    month[5] = "May";
    month[6] = "June";
    month[7] = "July";
    month[8] = "August";
    month[9] = "September";
    month[10] = "October";
    month[11] = "November";
    month[12] = "December";

    $('#dailydealsDiv').empty();
    var intervalArr = new Array();
    var check = "0";
    for (var i=0; i<len; i++) {

        var menu = results.rows.item(i);
     //       alert((menu.Ben1 + " - " + menu.Ben2));
        var categ = menu.Categories.split(",");

        check = "0";

        check = Checkviewing(categ);

   //     alert(check);
      //  alert(menu.TownID  + "==" +  townID);

            if (check== "1") {


                var res = (menu.EndDate).split("T");
                var split = res[0].split("-");
                var month2 = split[1];
                var year2 = split[0];
                var day2 = split[2];
                var h = res[1].split(":");
                var name = "countdown" + menu.ID;


                var target_date = new Date(year2, month2 - 1, day2, h[0], h[1], h[2]).getTime();

                var imgg = "";
                if (menu.Icon != "null") {
                    imgg = '&nbsp;<img src="data:image/png;base64,' + menu.Icon + '" style="width:80%;"  align="center"  >&nbsp;';
                    //imgg = menu.BusinessName;
                } else {

                    imgg = menu.BusinessName;
                }



                    $('#dailydealsDiv').append('<Div align="center"  class=" dailydealsdiv col-xs-12" data-toggle="modal" data-target="#basicmodaldaily" onclick="loaddailydiv(' + menu.ID + ')"  >'     +
                    '<div align="center" class="col-xs-3  paddingright0 paddingleft0 "  >' +
                    '' +
                    '<div id="timeremain">Time Ends</div>' +
                    '<div id="timediv" align="center"><span id="' + name + '"></span></div>' +
                    '</div>' +
                    '<div align="center"  class="font12 col-xs-6"  >' + imgg + '</div>' +
                    '<div align="center"  class="col-xs-3 paddingright0 paddingleft0"    >Read more</div>' +
                    '</Div>');

                var days, hours, minutes, seconds;

                intervalArr.push(name + "|" + target_date);


            }

    }
   setintervaldaily(intervalArr);
}

function Checkviewing(categ){
    for (i in categ) {
        for (j in followbusiness) {
            if (categ[i] == followbusiness[j]) {
                return "1";
            }
        }
    }

}




function setintervaldaily(detailarray){
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

function loaddailydiv(ID) {
    IDdaily = ID;
    db.transaction(loaddailyinfo, errorCBfunc, successCBfunc);
}


function loaddailyinfo(tx) {

    var sql = "select MAD.ID as ID,MAD.BusinessID as BusinessID,MAD.BusinessLocationID as BusinessLocationID,MAD.StartDate as StartDate,MAD.BusinessLocationID as BusinessLocationID,MAD.BusinessID  as BusinessID ,MAD.EndDate as EndDate ,MAD.ItemName as ItemName,MAD.Details as Details ,MAD.Price as Price ,MAD.URL as URL, MBN.Icon as Icon,MAD.DeletedateUTC as DeletedateUTC,  MAD.RegionID as RegionID,MAD.TownID as TownID " +
        "from MobilevwApp_dailydeal as MAD JOIN MobileApp_BusinessNames as MBN on MAD.BusinessID = MBN.ID " +
        "WHERE MAD.ID = " + IDdaily;
     //alert(sql);
    tx.executeSql(sql, [], loaddailyinfo_success);


}

function loaddailyinfo_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    var menu = results.rows.item(0);


    if(menu.BusinessLocationID == "0"){
        businessID = menu.BusinessID;
        db.transaction(townregiondata, errorCBfunc, successCBfunc);
    }else{
        db.transaction(getBCloctionlisting, errorCBfunc, successCBfunc);
        BusinessLocationID = menu.BusinessLocationID;
    }

    $("#divdaily4").hide();
    $('#imgplayer').empty();
    $('#divdaily1').empty();
    $('#divdaily2').empty();
    $('#divdaily3').empty();
    $('#divdaily4').empty();


    if(menu.Icon != "null"){
        $('#imgicon').attr("src","data:image/png;base64," + menu.Icon);
    }

    $('#divdaily1').append("<strong>Item:</strong><br>" + menu.Price + " " + menu.ItemName);
    $('#divdaily2').append("<strong>Details:</strong><br>" + menu.Details);
    $('#divdaily3').append('<div onclick="URLredirectdaily(\'' + menu.URL + '\',' + menu.BusinessID  + ',' + menu.BusinessLocationID  + ',' + menu.ID + ')"><strong>Website Link</strong></div>');
    $('#divdaily4').append("<strong>Directions</strong>");



}

function townregiondata(tx) {
    var sql = "select ID,RegionID from MobileApp_Towns where Follow =1";
    tx.executeSql(sql, [], townregiondata_success);
}


function townregiondata_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);
    townID2 = menu.ID;
    regionID2 = menu.RegionID;


    db.transaction(getBCloction, errorCBfunc, successCBfunc);
}

function getBCloction(tx) {
    var sql = "select ID,Lat,Long from MobileApp_BusinessLocations where TownID= " + townID2 + " and RegionID = " + regionID2 + " and BusinessID = " + businessID;
    //alert(sql);
    tx.executeSql(sql, [], getBCloction_success);
}

function getBCloction_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);

    if(len == "0"){
        $("#divdaily4").hide();

    }else{
        $("#divdaily4").show();
        $("#divdaily4").click(function () {
            window.open("https://www.google.co.nz/maps/dir/Current+Location/" + menu.Lat + ",+" + menu.Long, "_system")
        });
    }
}

function getBCloctionlisting(tx) {
    var sql = "select ID,Lat,Long from MobileApp_BusinessLocations where ID= " + BusinessLocationID;
    //alert(sql);
    tx.executeSql(sql, [], getBCloctionlisting_success);
}

function getBCloctionlisting_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);
//alert(len);
    if(len == "0"){
        $("#divdaily4").hide();

    }else{
        $("#divdaily4").show();
        $("#divdaily4").click(function () {
            window.open("https://www.google.co.nz/maps/dir/Current+Location/" + menu.Lat + ",+" + menu.Long, "_system")
        });
    }
}