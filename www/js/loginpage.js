document.addEventListener("deviceready", onDeviceReadylogin, false);
var db;
var regionIDlogin = 0;
var townIDLogin = 0;
var deviceIDlogin =0;
var apptokenlogin = 0;

var editnew = getUrlVarsfunc()["ID"];

function onDeviceReadylogin() {
    deviceIDlogin = device.uuid;
    refreshdata();
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

function getregiontownlogin1(tx) {
    var sql = "select Region,Town,Name, DOB,email  from MobileApp_LastUpdateBackup";
   //  alert(sql);
    tx.executeSql(sql, [], getregiontownlogin1_success);
}

function getregiontownlogin1_success(tx, results) {

    var len = results.rows.length;
    var menu = results.rows.item(0);
 //   alert(len);
    regionIDlogin = menu.Region;
    if(menu.Region != 0){
        loadtownslogin(regionIDlogin)
    }
    townIDLogin = menu.Town;



    var datetime = menu.DOB.split('-');
    // alert(len);
    $('#txtname').val(menu.Name);
    $('#drpday').val(datetime[0]);
    $('#drpmonth').val(datetime[1]);
    $('#drpyear').val(datetime[2]);
    $('#txtEmail').val(menu.email);

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
    townIDLogin = 0;

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set Region =' + ID);
    });

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdateBackup set Region =' + ID);
       // closemodelRegion();
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
        tx.executeSql('Update MobileApp_LastUpdateBackup set Town =' + ID);
    });
    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set Town =' + ID);
        //closemodelRegion();

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

   // alert($('#txtname').val());


    var Name = $('#txtname').val();
    var DOB = $('#drpday').val() + "-" + $('#drpmonth').val() + "-" + $('#drpyear').val();
    var email = $('#txtEmail').val();


    if(device.platform == "Android") {

        if (Name == null || Name == "") {
            navigator.notification.alert("Name must be filled out");
            $("#nextbutton").prop("disabled", false);
            return false;
        }
        if (DOB == null || DOB == "--" || $('#drpday').val() == "" || $('#drpmonth').val() == "" || $('#drpyear').val() == "") {
            navigator.notification.alert("Date of Birth must be filled out");
            $("#nextbutton").prop("disabled", false);
            return false;
        }

        if (email == null || email == "") {
            navigator.notification.alert("Email must be filled out");
            $("#nextbutton").prop("disabled", false);
            return false;
        }

    }

    if (regionIDlogin == 0) {
        navigator.notification.alert("Please Select a Region");
        $("#nextbutton").prop("disabled", false);
        return false;
    }

    if (townIDLogin == 0) {
        navigator.notification.alert("Please Select a Town");
        $("#nextbutton").prop("disabled", false);
        return false;
    }

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set LoginDone =1,Name="' + Name + '", DOB="' + DOB + '",email="' +email + '"');
    });

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdateBackup set LoginDone =1,Name="' + Name + '", DOB="' + DOB + '",email="' +email + '"');
    });



    passscoretoserverlogin("regionid=" + regionIDlogin + "&townid=" + townIDLogin + "&name=" + Name + "&dob=" + DOB + "&email=" + email + "&deviceid=" + deviceIDlogin + "&token=" + apptokenlogin,0);
}









