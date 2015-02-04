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
    $('#catlistdiv2').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";


        $('#catlistdiv2').append('<Div class="modal-body" align="left" style="clear:both;"  onclick="choosecatelist('+ menu.ID + ')" >' +
        '<div class="bold size13" style="float:left;border-bottom: 1px solid #66cc33;"  >' + menu.CategoryName  +
        '</div>' +
        '<div  style="float:right;font-size: 0px; line-height: 0%; width: 0px;border-top: 20px solid red;border-bottom: none;border-right: 20px solid green;"  ></div>' +
        '</Div>');
    }

}

function choosecatelist(ID){

    catid =ID;
  //  db.transaction(getcatname, errorCBfunc, successCBfunc);
  //  db.transaction(getbusiness, errorCBfunc, successCBfunc);

}