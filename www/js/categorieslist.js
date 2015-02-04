var db;
document.addEventListener("deviceready", onDeviceReadylistcat, false);
var catid =0;
function onDeviceReadylistcat() {

    refreshdata();

}




function getcategorieslist(tx) {
    var sql = "select ID ,CreatedateUTC,UpdatedateUTC,DeletedateUTC,CategoryName from MobileApp_Categories order by CategoryName ";
    //alert(sql);
    tx.executeSql(sql, [], getcategorieslist_success);
}

function getcategorieslist_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    $('#catlistdiv').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";


        $('#catlistdiv').append('<Div class="modal-body" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="choosecatelist('+ menu.ID + ')" >' +
        '<div class="bold size13"   >' + menu.CategoryName  +
        '</div>' +
        '</Div>');
    }

}

function choosecatelist(ID){

    catid =ID;
  //  db.transaction(getcatname, errorCBfunc, successCBfunc);
  //  db.transaction(getbusiness, errorCBfunc, successCBfunc);

}