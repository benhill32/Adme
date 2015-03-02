var db;
document.addEventListener("deviceready", onDeviceReadyseacrh, false);

var catid = getUrlVarsfunc()["CatID"];

var search = getUrlVarsfunc()["search"];
var catbusID = 0;

function onDeviceReadyseacrh() {

    db.transaction(getbusinesslist, errorCBfunc, successCBfunc);
    db.transaction(getcatnamelist, errorCBfunc, successCBfunc);
}

function getcatnamelist(tx) {
    var sql = "select CategoryName from MobileApp_Categories where ID = " + catid;
    //alert(sql);
    tx.executeSql(sql, [], getcatnamelist_success);
}


function getcatnamelist_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
    $('#catNameid').empty();
    var menu = results.rows.item(0);
    $('#catNameid').append('<Div>' + menu.CategoryName  + '</Div>');
}




function getbusinesslist(tx) {

    if(search == null) {

        var sql = "select MBN.ID as ID,MBC.ID as BCID, MBN.BusinessName as BusinessName,MBC.Follow as Follow from MobileApp_BusinessCategories as MBC JOIN MobileApp_BusinessNames as MBN on MBC.BusniessID = MBN.ID where MBC.CategoryID = " + catid + " ORDER BY MBN.BusinessName";
     //   alert(sql);
        if(catid ==11){
         //   alert(sql);
        }

        tx.executeSql(sql, [], getbusinesslist_success);
    }else{

        $('#txtsearch').val(search);
        var sql = "select MBN.ID as ID,MBC.ID as BCID, MBN.BusinessName as BusinessName,MBC.Follow as Follow from MobileApp_BusinessCategories as MBC JOIN MobileApp_BusinessNames as MBN on MBC.BusniessID = MBN.ID where MBC.CategoryID = " + catid + " and MBN.BusinessName LIKE '%" + search + "%' ORDER BY MBN.BusinessName";
      //  alert(sql);
        tx.executeSql(sql, [], getbusinesslist_success);

    }
}

function getbusinesslist_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
    if(catid ==11){
     //   alert(len);
    }
//alert(len);
    $('#businesscatid2').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);


        var onclickoption = "";
    var selectid = "";

        if(menu.Follow == 1){
            selectid= "<input type='checkbox' checked  >";
            onclickoption = 'onclick="choosebuscatfalse('+ menu.BCID + ')"';

        }else{
            selectid= "<input type='checkbox'  >";
            onclickoption = 'onclick="choosebuscattrue('+ menu.BCID + ')"';
        }


        $('#businesscatid2').append('<Div align="center"   class="businessIDcat" ' + onclickoption + '  >' +
        '<div align="left"  >' + selectid + " " +  menu.BusinessName +
        '</div>' +
        '</Div>');

        if(catid ==11){
           // alert(menu.BusinessName);
        }
    }

}

function goback() {

    window.location.href='../pages/categorieslist.html';
}

function reloadpage(){


    var search1 = $('#txtsearch').val();

    window.location.href='../pages/BusinessSearch.html?CatID=' + catid + "&search=" + search1;
}

function make_blank()
{
    $('#txtsearch').val('');
}

function choosebuscattrue(ID){
//alert("Update MobileApp_BusinessCategories set Follow = 1 where ID = " + ID);
    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_BusinessCategories set Follow = 1 where ID = ' + ID);
        console.log("Update MobileApp_BusinessCategories");
    });
    catbusID = ID;
    // sendcattoserver();

    passscoretoserver("categories=" + ID + "&outcome=1&deviceid=" + deviceIDfunc + "&token=" + apptoken);
    db.transaction(getbusinesslist, errorCBfunc, successCBfunc);



}



function choosebuscatfalse(ID){
//alert("Update MobileApp_BusinessCategories set Follow = 1 where ID = " + ID);

    catbusID = ID;
    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_BusinessCategories set Follow = 0 where ID = ' + ID);
        console.log("Update MobileApp_BusinessCategories");
    });
    // sendcattoserver();
    passscoretoserver("categories=" + ID + "&outcome=0&deviceid=" + deviceIDfunc + "&token=" + apptoken);
    db.transaction(getbusinesslist, errorCBfunc, successCBfunc);

}

