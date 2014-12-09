var db;

document.addEventListener("deviceready", onDeviceReadydaily, false);

function onDeviceReadydaily() {
    db.transaction(getdata, errorCBfunc, successCBfunc);
}

function getdata(tx) {
    var sql = "select ID ,CreatedateUTC ,UpdatedateUTC ,DeletedateUTC ,BusinessID ,BusinessLocationID,StartDate ,EndDate ,ItemName,Details ,Price ,URL from MobilevwApp_weeklydeal ";
    // alert(sql);
    tx.executeSql(sql, [], getdata_success);
}

function getdata_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;

    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        alert(menu.ItemName);
    }

}