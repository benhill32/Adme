var db;
var townID = "";
document.addEventListener("deviceready", onDeviceReadyweekly, false);

function onDeviceReadyweekly() {

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


    db.transaction(getdata, errorCBfunc, successCBfunc);
}




db.transaction(getdata, errorCBfunc, successCBfunc);

function getdata(tx) {
    var current_date = new Date();
    var year = current_date.getFullYear();
    var month = ("0" + (current_date.getMonth()+1)).slice(-2);
    var day = current_date.getDate();
    var hours = ("0" + current_date.getHours()).slice(-2);
    var mins = ("0" + current_date.getMinutes()).slice(-2);

    var sql = "select MAD.ID as ID,MAD.StartDate as StartDate ,MAD.EndDate as EndDate ,MAD.ItemName as ItemName,MAD.Details as Details ,MAD.Price as Price ,MAD.URL as URL, MBN.Icon as Icon,MAD.DeletedateUTC as DeletedateUTC, MBC.Follow as Follow, MAD.RegionID as RegionID,MAD.TownID as TownID " +
        "from MobilevwApp_weeklydeal as MAD JOIN MobileApp_BusinessNames as MBN on MAD.BusinessID = MBN.ID " +
        "JOIN MobileApp_BusinessCategories as MBC on MAD.Categories = MBC.CategoryID AND MAD.BusinessID = MBC.BusniessID " +
        "WHERE MBC.Follow =1 and datetime(MAD.EndDate) >=  datetime('" + year + "-" + month + "-" + day + " " + hours + ":" + mins + ":00') and MAD.DeletedateUTC = 'null' and MBN.DeletedateUTC = 'null' ";
    //alert(sql);
    tx.executeSql(sql, [], getdata_success);
}

function getdata_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;

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
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);


        if (menu.TownID == "0" || menu.TownID == townID) {


            var res = (menu.EndDate).split("T");
            var split = res[0].split("-");
            var month2 = split[1];
            var year2 = split[0];
            var day2 = split[2];
            var h = res[1];
            var name = "countdown" + menu.ID;

            var target_date = new Date(day2 + "/" + month[month2] + "/" + year2 + " " + h).getTime();

            var imgg = "";
            if (menu.Icon != "null") {
                imgg = '&nbsp;<img src="data:image/png;base64,' + menu.Icon + '" style="width:100%;"  align="center"  >&nbsp;';
                //imgg = menu.BusinessName;
            } else {

                imgg = menu.BusinessName;
            }

            $('#weeklydealsDiv').append('<Div align="center"  class="weeklydealsDiv"    >' +
            '<div align="center" class="floatleft3remix1 padding22 paddingtop25"  >' +
            '' +
            'Closes' +
            '<div id="timediv" align="center"><span id="' + name + '">' +
            '</span></div>' +
            '</div>' +
            '<div align="center"  class="floatleft3remix2"  >' + imgg + '</div>' +
            '<div align="center"  class="floatleft3remix1 padding22 paddingtop35"  >Read more</div>' +
            '<div align="center" class="dailydivbottom"  >' + menu.Price + " " + menu.ItemName +
            '</div>' +
            '</Div>');

            var days, hours, minutes, seconds;


            var countdown = document.getElementById(name);


            intervalArr.push(name + "|" + target_date);


        }
    }

    setintervaldaily(intervalArr);
}


function setintervaldaily(detailarray){
    // alert(detailarray);



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