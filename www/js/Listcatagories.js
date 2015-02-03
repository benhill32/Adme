document.addEventListener("deviceready", onDeviceReadylist, false);
var regionIDlist= 0;
var townIDlist= 0;

function onDeviceReadylist() {
    //refreshdata();
    db.transaction(getregionslogin, errorCBfunc, successCBfunc);
}



function getregionslogin(tx) {
    var sql = "select ID ,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,RegionName from MobileApp_Region order by RegionName ";
    // alert(sql);
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

        $('#divregionnames').append('<Div class="modal-body" align="left" style="border-bottom: 1px solid #e5e5e5;">' +
        '<div class="bold size13">' + menu.RegionName  +
        '</div>' +
        '</Div>');
    }
}


function adddetails(){
    var Name = $('#txtname').val();
    var DOB = $('#txtDescription').val();
    var email = $('#txtEmail').val();


    passscoretoserver("regionid=" + regionID + "&townid=" + ID + "&deviceid=" + deviceIDfunc + "&token=" + apptoken);


    randomfunctions();

}






