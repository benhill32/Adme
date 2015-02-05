/**
 * Created by BenH on 1/22/2015.
 */
var db;
var townID = "";
var BusID = "";
document.addEventListener("deviceready", onDeviceReadycatalogues, false);
var IDdaily = "";

function onDeviceReadycatalogues() {
    randomfunctions();
    db.transaction(gettownname, errorCBfunc, successCBfunc);
}

function gettownname(tx) {
    var sql = "select ID from MobileApp_Towns where Follow=1";
    // alert(sql);
    tx.executeSql(sql, [], gettownname_success);
}

function gettownname_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
    //  alert(len);
    var menu = results.rows.item(0);
    townID = menu.ID;

    db.transaction(getdata, errorCBfunc, successCBfunc);
}


function getdata(tx) {
    var sql ="Select MGP.ID ,MGP.CreatedateUTC ,MGP.UpdatedateUTC ,MGP.DeletedateUTC ,MGP.BusinessID ,MGP.BusinessLocationID as BusinessLocationID,MGP.FileName as FileName,MBN.Icon as Icon" +
        " from MobilevwApp_Catalogues as MGP JOIN MobileApp_BusinessNames as MBN on MGP.BusinessID = MBN.ID " +
        " JOIN MobileApp_BusinessCategories as MBC on MGP.Categories = MBC.CategoryID AND MGP.BusinessID = MBC.BusniessID "+
        " where MGP.TownID =" + townID +  " ORDER BY MBC.Follow DESC,MBN.BusinessName DESC";


  //  alert(sql);
    tx.executeSql(sql, [], getdata_success);
}

function getdata_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    // alert(len);


    var count = 1;
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);

//alert(menu.BusinessLocationID + '-' + menu.FileName);

        var imgg = "";
        if (menu.Icon != "null") {
            imgg = '&nbsp;<img src="data:image/png;base64,' + menu.Icon + '" align="center"  >&nbsp;';
            //imgg = menu.BusinessName;
        } else {
            imgg = "";
        }




        var strrr = menu.BusinessLocationID + "|||" + menu.FileName;

        // alert(strrr);

        $('#cataloguesdealsdiv').append('<Div align="center"  class="cataloguesdealsdiv" onclick="fileloadcatalogues(\'' + strrr + '\')" >' + imgg +
        '<br>Read More' +
        '</Div>');
        count = 0;
    }
}

function fileloadcatalogues(IDstring){
       var fileexten =IDstring.split('|||');
  //  alert(IDstring);
    // alert("http://admin.adme.kiwi/CouponFiles/" + fileexten[0] + "/" + fileexten[1]);
    URLredirect("http://admin.adme.kiwi/CatalogFiles/" + fileexten[0] + "/" + fileexten[1]);




}