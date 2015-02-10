var db;
document.addEventListener("deviceready", onDeviceReadylistcat, false);
var catid =0;
function onDeviceReadylistcat() {


    db.transaction(getcategorieslist, errorCBfunc, successCBfunc);



}




function getcategorieslist(tx) {
    var sql = "select ID ,CreatedateUTC,UpdatedateUTC,DeletedateUTC,CategoryName from MobileApp_Categories order by CategoryName ";
    //alert(sql);
    tx.executeSql(sql, [], getcategorieslist_success);
}

function getcategorieslist_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
//alert(len);indexloadingdata
    if(len==0){
        $('#indexloadingdata').modal('show');
        refreshdata();

    }else {
        $('#catlistdiv2').empty();
        for (var i = 0; i < len; i++) {
            var menu = results.rows.item(i);
            var imgg = "";


            $('#catlistdiv2').append('<Div class="modal-body" align="left" style="clear:both;"  onclick="choosecatelist(' + menu.ID + ')" >' +
            '<div class="bold size13" style="float:left;border-bottom: 1px solid #66cc33;width:90%;"  >' + menu.CategoryName +
            '<img src="../img/triend.png" style="float:right"; >' +
            '</div>' +
            '</Div>');
        }
    }
}

function choosecatelist(ID){


    window.location.href='../pages/BusinessSearch.html?CatID=' + ID;
}

function goforward() {

    window.location.href='../pages/daily.html?showname=1';
}