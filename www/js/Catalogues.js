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
    var sql = "select * from (" +
        "Select MGP.ID as ID ,MGP.CreatedateUTC ,MGP.UpdatedateUTC ,MGP.DeletedateUTC ,MGP.BusinessID as BusinessID ,MGP.BusinessLocationID as BusinessLocationID,MGP.FileName as FileName,MBN.Icon as Icon,IFNULL(MBC.Follow, 0) as Follow,MBN.BusinessName as BusinessName" +
        " from MobilevwApp_Catalogues as MGP JOIN MobileApp_BusinessNames as MBN on MGP.BusinessID = MBN.ID " +
        " JOIN MobileApp_BusinessCategories as MBC on MGP.Categories = MBC.CategoryID AND MGP.BusinessID = MBC.BusniessID "+
        " where MGP.TownID =" + townID +
        " Union " +
        "Select MGP.ID as ID ,MGP.CreatedateUTC ,MGP.UpdatedateUTC ,MGP.DeletedateUTC ,MGP.BusinessID as BusinessID ,MGP.BusinessLocationID as BusinessLocationID,MGP.FileName as FileName,MBN.Icon as Icon,0 as Follow,MBN.BusinessName as BusinessName" +
        " from MobilevwApp_Catalogues as MGP JOIN MobileApp_BusinessNames as MBN on MGP.BusinessID = MBN.ID " +
        " Where MGP.BusinessLocationID = 0" +
        ") t" +
        " ORDER BY t.Follow DESC,t.BusinessName";


    //alert(sql);
    tx.executeSql(sql, [], getdata_success);
}

function getdata_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
     //alert(len);

    $('#cataloguesdealsdiv').empty();
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


        var strrr = menu.BusinessLocationID + "|||" + menu.FileName + "|||" + menu.BusinessID + "|||" + menu.ID;

        $('#cataloguesdealsdiv').append('<Div align="center"  class="cataloguesdealsdiv" onclick="fileloadcatalogues(\'' + strrr + '\')" ><div style="width:100%;">' + imgg + '</div>' +
        '<div  style="width:100%;position: absolute;bottom: 0;" >Read More</div>' +
        '</Div>');
        count = 0;
    }
}

function fileloadcatalogues(IDstring){
       var fileexten =IDstring.split('|||');
    var urlnow ="";

        passscoretoserver("deviceid=" + device.uuid + "&BusinessID=" + fileexten[2] + "&BusinessLocationID=" + fileexten[0] + "&FileName=" + fileexten[1] + "&CataloguesID=" + fileexten[3]);


    if(fileexten[0] != 0){
        urlnow = 'http://admin.adme.kiwi/CatalogFiles/' + fileexten[0] + '/' + fileexten[1];
    }else{

        urlnow = 'http://admin.adme.kiwi/CatalogFiles/All/' + fileexten[2] + '/' + fileexten[1];
    }






    if( device.platform == 'android' || device.platform == 'Android'){
        if(fileexten[1].substr(-4).toLowerCase() == ".pdf"){

          //  url = "http://docs.google.com/viewer?url= "+ urlnow;
            url = urlnow;
            window.open(encodeURI(url), '_system', 'location=no','closebuttoncaption=back');

        }else{
            url = urlnow;

            window.open(encodeURI(url), '_blank', 'location=no','closebuttoncaption=back');
        }



    }else{

        url = urlnow;
        window.open(encodeURI(url), '_blank', 'location=no','toolbarposition=top','closebuttoncaption=back');
    }




}