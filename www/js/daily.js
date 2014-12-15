var db;

document.addEventListener("deviceready", onDeviceReadydaily, false);

function onDeviceReadydaily() {
    db.transaction(getdata, errorCBfunc, successCBfunc);
}

function getdata(tx) {
    var sql = "select MAD.ID as ID,MAD.StartDate as StartDate ,MAD.EndDate as EndDate ,MAD.ItemName as ItemName,MAD.Details as Details ,MAD.Price as Price ,MAD.URL as URL, MBN.Icon as Icon from MobilevwApp_dailydeal as MAD JOIN MobileApp_BusinessNames as MBN on MAD.BusinessID = MBN.ID ";
    // alert(sql);
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
        var res = (menu.EndDate).split("T");
        var split = res[0].split("-");
        var month2 = split[1];
        var year2 = split[0];
        var day2 = split[2];
        var h = res[1];
        var name = "countdown" + menu.ID;

       var target_date = new Date(day2 + "/" + month[month2] + "/" + year2 + " " + h).getTime();

        var imgg = "";
        if(menu.Icon != "null"){
            imgg = '&nbsp;<img src="data:image/png;base64,' + menu.Icon + '"  align="center" width="200" >&nbsp;';
            //imgg = menu.BusinessName;
        }else{

            imgg = menu.BusinessName;
        }

        $('#dailydealsDiv').append('<Div align="center"  class="modal-body dailydealsdiv"    >' +


        '<div align="center" class="floatleft3 padding55"  >' +
        '' +
        'Time Remaining' +
        '<div id="timediv"><span id="' + name + '">' +
        '</span></div>' +
        '</div>' +
        '<div align="center"  class="floatleft3"  >' + imgg + '</div>' +
        '<div align="center"  class="floatleft3 padding55"  >Read more</div>' +
        '</Div>');

        var days, hours, minutes, seconds;


       var countdown = document.getElementById(name);


        intervalArr.push(name + "|" + target_date);



    }


    setintervaldaily(intervalArr);
}


function setintervaldaily(detailarray){
    alert(detailarray);



    var current_date = new Date().getTime();

    for (var i in detailarray) {
        var item = detailarray[i];
        alert(item);
        var res = (item).split("|");




    }










}