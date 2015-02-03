document.addEventListener("deviceready", onDeviceReadylogin, false);
var regionIDlogin = 0;
var townIDLogin = 0;
function onDeviceReadylogin() {
    $('#nextbutton').hide();
    refreshdata();

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

    $('#nextbutton').show();
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
            '<div class="bold size13"   >' + menu.TownName +
            '</div>' +
            '</Div>');
        }else{
            $('#divtownnames').append('<Div class="modal-body" align="left" onclick="setuptownlogin(' + menu.ID + ')"   >' +
            '<div class="bold size13"   >' + menu.TownName +
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

    db.transaction(gettownlogin2, errorCBfunc, successCBfunc);

}




function adddetails(){
    var Name = $('#txtname').val();
    var DOB = $('#txtDescription').val();
    var email = $('#txtEmail').val();


    passscoretoserver("regionid=" + regionID + "&townid=" + ID + "&deviceid=" + deviceIDfunc + "&token=" + apptoken);


    randomfunctions();

}

function nextbuttonclick(){

    window.location.href='../pages/categorieslist.html';

}






