document.addEventListener("deviceready", onDeviceReadylogin, false);
var db;
var regionIDlogin = 0;
var townIDLogin = 0;
var deviceIDlogin =0;
var apptokenlogin = 0;

var editnew = getUrlVarsfunc()["ID"];

function onDeviceReadylogin() {

    $("#nextbutton").prop("disabled", true);
    refreshdata();

    deviceIDlogin = device.uuid;

}





function checkdataload(){


    db.transaction(gettokenlogincheck, errorCBfunc, successCBfunc);

}


function gettokenlogincheck(tx) {
    var sql = "select LoginDone from MobileApp_LastUpdatesec";
    //   alert(sql);
    tx.executeSql(sql, [], gettokenlogincheck_success,errorCBfuncben);
}

function gettokenlogincheck_success(tx, results) {

    var len = results.rows.length;

    var menu = results.rows.item(0);

    if(menu.LoginDone == 1){

        window.location.href='../pages/daily.html';
    }

}

function errorCBfuncben(err) {
    refreshdata();
}

function gettokenlogin(tx) {
    var sql = "select token from MobileApp_LastUpdatesec";
  //   alert(sql);
    tx.executeSql(sql, [], gettokenlogin_success,errorCBfuncben);
}

function gettokenlogin_success(tx, results) {

    var len = results.rows.length;

    var menu = results.rows.item(0);

    apptokenlogin = menu.token;

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

        if(regionIDlogin == menu.ID) {

            $('#divregionnames').append('<Div class="modal-body" align="left" style="border-bottom: 1px solid #e5e5e5"  onclick="loadtownslogin(' + menu.ID + ')">' +
            '<div class="bold size13">' + menu.RegionName +
            '</div>' +
            '</Div>');
        }else{
            $('#divregionnames').append('<Div class="modal-body" align="left"  onclick="loadtownslogin(' + menu.ID + ')">' +
            '<div class="bold size13">' + menu.RegionName +
            '</div>' +
            '</Div>');

        }
    }


}



function loadtownslogin(ID) {
    regionIDlogin = ID;
    $("#nextbutton").removeAttr('disabled');

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set Region =' + ID);
        closemodelRegion();

    });
    db.transaction(getregionslogin, errorCBfunc, successCBfunc);


    db.transaction(gettownlogin2, errorCBfunc, successCBfunc);

}

function gettownlogin2(tx) {

    var sql = "select ID,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,TownName,RegionID from MobileApp_Towns where RegionID = " + regionIDlogin;
   // alert(sql);
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

        if(townIDLogin == menu.ID) {
            $('#divtownnames').append('<Div class="modal-body" style="border-bottom: 1px solid #e5e5e5" align="left" onclick="setuptownlogin(' + menu.ID + ')"   >' +
            '<div class="bold size13 colourblueish"   >' + menu.TownName +
            '</div>' +
            '</Div>');
        }else{
            $('#divtownnames').append('<Div class="modal-body" align="left" onclick="setuptownlogin(' + menu.ID + ')"   >' +
            '<div class="bold size13 colourblueish"   >' + menu.TownName +
            '</div>' +
            '</Div>');

        }
    }
}

function setuptownlogin(ID) {
    townIDLogin = ID;

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set Town =' + ID);
        closemodelRegion();

    });

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_Towns set Follow = 0');
        console.log("Update MobileApp_Towns");
    });
    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_Towns set Follow = 1 where ID = ' + ID);
        console.log("Update MobileApp_Towns");
    });


    db.transaction(gettownlogin2, errorCBfunc, successCBfunc);

}


function nextbuttonclick(){

    $("#nextbutton").prop("disabled", true);

    var Name = $('#txtname').val();
    var DOB = $('#drpday').val() + "-" + $('#drpmonth').val() + "-" + $('#drpyear').val();
    var email = $('#txtEmail').val();

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set LoginDone =1,Name=' + Name + ', DOB=' + DOB + ',email=' +email);
    });

    passscoretoserverlogin("regionid=" + regionIDlogin + "&townid=" + townIDLogin + "&name=" + Name + "&dob=" + DOB + "&email=" + email + "&deviceid=" + deviceIDlogin + "&token=" + apptokenlogin);

}






