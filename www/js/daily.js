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

    $('#dailydealsDiv').empty();

    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var res = (menu.EndDate).split("T");
     //   alert(res[0]);
      //  alert(res[1]);
        var split = res[0].split("-");
        var month2 = split[1];
        var year = split[0];
        var day = split[2];
        var h = res[1].substring(0,2)

        var target_date = new Date(day + "/" - month[month2] + "/" + year + " " + h).getTime();
    alert(day + "/" - month[month2] + "/" + year + " " + h);
        var countdown = document.getElementById("countdown");
        alert(target_date);

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
        '<div id="timediv"><span id="countdown"></span></div>' +
        '</div>' +
        '<div align="center"  class="floatleft3"  >' + imgg + '</div>' +
        '<div align="center"  class="floatleft3 padding55"  >Read more</div>' +
        '</Div>');
    }

}