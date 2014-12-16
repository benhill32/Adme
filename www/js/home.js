var db;



function randomfunctions(){
  //  alert("random");
    db.transaction(checktowncount, errorCBfunc, successCBfunc);
}


function checktowncount(tx){
    // $('#busy').show();
    var sql = "select Count(ID) as Count from MobileApp_Towns";
    alert(sql);
    tx.executeSql(sql, [], checktowncount_success);
}

function checktowncount_success(tx, results) {
    var menu = results.rows.item(0);
    alert(menu.Count);
    if(menu.Count != 0) {
        db.transaction(checktownfollow, errorCBfunc, successCBfunc);
    }
}


function checktownfollow(tx){
    // $('#busy').show();
    var sql = "select Count(ID) as Count from MobileApp_Towns where Follow = 1 ";
    //  alert(sql);
    tx.executeSql(sql, [], checktownfollow_success);
}


function checktownfollow_success(tx, results) {
    var menu = results.rows.item(0);
    if(menu.Count == 0) {
        db.transaction(getregions, errorCBfunc, successCBfunc);
        $('#basicModalregion').modal('show');
    }
}

function getregions(tx) {
    var sql = "select ID ,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,RegionName from MobileApp_Region order by RegionName ";
    alert(sql);
    tx.executeSql(sql, [], getregions_success);
}

function getregions_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    $('#regionid').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";


        $('#regionid').append('<Div class="modal-body"  data-dismiss="modal" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="choosetown('+ menu.ID + ')"  >' +
        '<div class="bold size13"    >' + menu.RegionName  +
        '</div>' +
        '</Div>');
    }

}

function choosetown(ID){
    $('#basicModaltown').modal('show');
    regionID =ID;
    db.transaction(gettown, errorCBfunc, successCBfunc);
}

function gettown(tx) {
    var sql = "select ID,CreatedateUTC,UpdatedateUTC,DeletedateUTC ,TownName,RegionID from MobileApp_Towns where RegionID = " + regionID;
    //alert(sql);
    tx.executeSql(sql, [], gettown_success);
}

function gettown_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    $('#townid').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";


        $('#townid').append('<Div class="modal-body"  data-dismiss="modal" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="townchosen('+ menu.ID + ')"  >' +
        '<div class="bold size13"   >' + menu.TownName  +
        '</div>' +
        '</Div>');
    }

}

function townchosen(ID){
    townID = ID;

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_Towns set Follow = 0');
        console.log("Update MobileApp_Towns");
    });
    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_Towns set Follow = 1 where ID = ' + ID);
        console.log("Update MobileApp_Towns");
    });

    passscoretoserver("regionid=" + regionID + "&townid=" + ID + "&deviceid=" + deviceIDfunc + "&token=" + apptoken)

}
