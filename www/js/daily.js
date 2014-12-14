var db;

document.addEventListener("deviceready", onDeviceReadydaily, false);

function onDeviceReadydaily() {
    db.transaction(getdata, errorCBfunc, successCBfunc);
}

function getdata(tx) {
    var sql = "select MAD.ID as ID,MAD.StartDate as StartDate ,MAD.EndDate as EndDate ,MAD.ItemName as ItemName,MAD.Details as Details ,MAD.Price as Price ,MAD.URL as URL, MBN.Icon as Icon from MobilevwApp_dailydeal as MAD JOIN MobileApp_BusinessNames as MBN on MAD.BusniessID = MBN.ID ";
    // alert(sql);
    tx.executeSql(sql, [], getdata_success);
}

function getdata_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;

    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";
        if(menu.Icon != "null"){
            imgg = '&nbsp;<img src="data:image/png;base64,' + menu.Icon + '"  align="center" width="200" >&nbsp;';
            //imgg = menu.BusinessName;
        }else{

            imgg = menu.BusinessName;
        }

        $('#Categoriesbus').append('<Div align="center"  class="modal-body"  style="border-bottom: 1px solid #e5e5e5;"    >' +
        '<div align="center"  >' + imgg +
        '</div>' +
        '</Div>');
    }

}