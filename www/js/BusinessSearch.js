var db;
document.addEventListener("deviceready", onDeviceReadyseacrh, false);

var catid = getUrlVarsfunc()["CatID"];

var search = getUrlVarsfunc()["search"];


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

        var sql = "select MBN.ID as ID,MBC.ID as BCID, MBN.BusinessName as BusinessName, MBN.Icon as Icon,MBC.Follow as Follow from MobileApp_BusinessCategories as MBC JOIN MobileApp_BusinessNames as MBN on MBC.BusniessID = MBN.ID where MBC.CategoryID = " + catid;
        alert(sql);
        tx.executeSql(sql, [], getbusinesslist_success);
    }else{

        $('#txtsearch').val(search);
        var sql = "select MBN.ID as ID,MBC.ID as BCID, MBN.BusinessName as BusinessName, MBN.Icon as Icon,MBC.Follow as Follow from MobileApp_BusinessCategories as MBC JOIN MobileApp_BusinessNames as MBN on MBC.BusniessID = MBN.ID where MBC.CategoryID = " + catid + " and MBN.BusinessName LIKE '%" + search + "%'";
        alert(sql);
        tx.executeSql(sql, [], getbusinesslist_success);

    }
}

function getbusinesslist_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;

    $('#businesscatid2').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);



        var onclickoption = "";
    var selectid = "";
        if(menu.Follow == 1){
            selectid= "<input type='checkbox' checked id='chk'" + menu.BCID + "' >";
         //   onclickoption = 'onclick="choosebuscatfalse('+ menu.BCID + ')"';

        }else{
            selectid= "<input type='checkbox' id='chk'" + menu.BCID + "' >";
          //  onclickoption = 'onclick="choosebuscattrue('+ menu.BCID + ')"';
        }


        $('#businesscatid2').append('<Div align="center" id="divcatbus' + menu.BCID + '"  class="modal-body" ' + onclickoption + '  >' +
        '<div align="left"  >' + selectid + " " +  menu.BusinessName +
        '</div>' +
        '</Div>');
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