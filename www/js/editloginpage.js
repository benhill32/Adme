document.addEventListener("deviceready", onDeviceReadylogin, false);
var db;
var regionIDlogin = 0;
var townIDLogin = 0;
var deviceIDlogin =0;
var apptokenlogin = 0;

var editnew = getUrlVarsfunc()["ID"];

function onDeviceReadylogin() {


    deviceIDlogin = device.uuid;
    db.transaction(getregiontown, errorCBfunc, successCBfunc);
    db.transaction(gettokenlogin1, errorCBfunc, successCBfunc);
    if(editnew == 1){
        $('#logindiv').show();
        $('#logindivregion').hide()
        checkdataload();
    }else if (editnew == 0){
        $('#logindiv').hide();
        $('#logindivregion').show()
        db.transaction(getregionsloginedit, errorCBfunc, successCBfunc);
        loadtownslogin2(regionIDlogin);
    }


}

function getregiontown(tx) {
    var sql = "select Region,Town from MobileApp_LastUpdatesec";
      // alert(sql);
    tx.executeSql(sql, [], getregiontown_success);
}

function getregiontown_success(tx, results) {

    var len = results.rows.length;
    var menu = results.rows.item(0);

    regionIDlogin = menu.Region;

    townIDLogin = menu.Town;

}

function checkdataload(){

    db.transaction(gettokenlogincheck, errorCBfunc, successCBfunc);

}


function gettokenlogincheck(tx) {
    var sql = "select Name, DOB,email from MobileApp_LastUpdatesec";
       //alert(sql);
    tx.executeSql(sql, [], gettokenlogincheck_success,errorCBfunc);
}

function gettokenlogincheck_success(tx, results) {

    var len = results.rows.length;
    var menu = results.rows.item(0);
    var datetime = menu.DOB.split('-');
   // alert(len);
    $('#txtname').val(menu.Name);
    $('#drpday').val(datetime[0]);
    $('#drpmonth').val(datetime[1]);
    $('#drpyear').val(datetime[2]);
    $('#txtEmail').val(menu.email);

}



function gettokenlogin1(tx) {
    var sql = "select token from MobileApp_LastUpdatesec";
  //   alert(sql);
    tx.executeSql(sql, [], gettokenlogin1_success,errorCBfunc);
}

function gettokenlogin1_success(tx, results) {

    var len = results.rows.length;

    var menu = results.rows.item(0);

    apptokenlogin = menu.token;

}



function getregionsloginedit(tx) {
    var sql = "select ID ,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,RegionName from MobileApp_Region order by RegionName ";
   //  alert(sql);
    tx.executeSql(sql, [], getregionsloginedit_success);
}

function getregionsloginedit_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
 //   alert(len);
    $('#divregionnames').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";

        if(regionIDlogin == menu.ID) {

            $('#divregionnames').append('<Div class="modal-body" align="left" style="border-bottom: 1px solid #e5e5e5"  onclick="loadtownslogin2(' + menu.ID + ')">' +
            '<div class="bold size13">' + menu.RegionName +
            '</div>' +
            '</Div>');
        }else{
            $('#divregionnames').append('<Div class="modal-body" align="left"  onclick="loadtownslogin2(' + menu.ID + ')">' +
            '<div class="bold size13">' + menu.RegionName +
            '</div>' +
            '</Div>');

        }
    }


}



function loadtownslogin2(ID) {
    regionIDlogin = ID;


    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set Region =' + ID);

    });
    db.transaction(getregionsloginedit, errorCBfunc, successCBfunc);


    db.transaction(gettownlogin2, errorCBfunc, successCBfunc);

}

function gettownlogin2(tx) {

    var sql = "select ID,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,TownName,RegionID from MobileApp_Towns where RegionID = " + regionIDlogin;
    //alert(sql);
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
            $('#divtownnames').append('<Div class="modal-body" align="left" onclick="setuptownlogin1(' + menu.ID + ')"   >' +
            '<div class="bold size13 colourblueish"   >' + menu.TownName +
            '</div>' +
            '</Div>');

        }
    }
}

function setuptownlogin1(ID) {
    townIDLogin = ID;

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set Town =' + ID);
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
    editnew = getUrlVarsfunc()["ID"];
    var Name = $('#txtname').val();
    var DOB = $('#drpday').val() + "-" + $('#drpmonth').val() + "-" + $('#drpyear').val();
    var email = $('#txtEmail').val();


    if(editnew == 1){
        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set Name="' + Name + '", DOB="' + DOB + '",email="' +email + '"');
        });
        passscoretoserverlogin("name=" + Name + "&dob=" + DOB + "&email=" + email + "&deviceid=" + deviceIDlogin + "&token=" + apptokenlogin,1);

    }else  if(editnew == 0){
        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set Town=' + townIDLogin + ',Region=' + regionIDlogin);
        });
       // alert('Update MobileApp_LastUpdatesec set Town=' + townIDLogin + ',Region=' + regionIDlogin);
        passscoretoserverlogin("regionid=" + regionIDlogin + "&townid=" + townIDLogin + "&deviceid=" + deviceIDlogin + "&token=" + apptokenlogin,1);


    }


}






