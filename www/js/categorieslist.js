var db;
var townIDcat = 0;
var regionIDcat = 0;
var followbusiness2 =  [];
document.addEventListener("deviceready", onDeviceReadylistcat, false);
var catid =0;
function onDeviceReadylistcat() {
    db.transaction(townregiondatabus1, errorCBfunc, successCBfunc);
}


function Checkviewingbusiness(categ){
    for (j in followbusiness2) {
        if (categ == followbusiness2[j]) {
            return "1";
        }
    }

}

function townregiondatabus1(tx) {
    var sql = "select ID,RegionID from MobileApp_Towns where Follow =1";
     alert(sql);
    tx.executeSql(sql, [], townregiondatabus1_success);
}


function townregiondatabus1_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);
    townIDcat = menu.ID;
    regionIDcat = menu.RegionID;

    db.transaction(getregionfrombuslocation1, errorCBfunc, successCBfunc);
}

function getregionfrombuslocation1(tx) {
    var sql = "select MBC.CategoryID " +
        "from MobileApp_BusinessLocations  as MBL" +
        " JOIN MobileApp_BusinessCategories as MBC on MBL.BusinessID = MBC.BusniessID " +
        "where MBL.RegionID=" + regionIDbus;
     alert(sql);
    tx.executeSql(sql, [], getregionfrombuslocation1_success);
}


function getregionfrombuslocation1_success(tx, results) {
    var len = results.rows.length;
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        followbusiness2.push(menu.BusinessID);
    }
    alert(followbusiness2);
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
    //alert(len);
    if(len==0){
        window.setTimeout(function(){
            refreshdata();
        }, 1000);



    }else {
        var check = 0;
        var menu = results.rows.item(i);
        check = Checkviewingbusiness(menu.ID);

        if(check ==1) {
            $('#catlistdiv2').empty();
            for (var i = 0; i < len; i++) {
                var menu = results.rows.item(i);

                $('#catlistdiv2').append('<Div class="modal-body" align="left" style="clear:both;"  onclick="choosecatelist(' + menu.ID + ')" >' +
                '<div class="bold size13" style="float:left;border-bottom: 1px solid #66cc33;width:90%;"  >' + menu.CategoryName +
                '<img src="../img/triend.png" style="float:right"; >' +
                '</div>' +
                '</Div>');
            }
        }

    }
}

function choosecatelist(ID)
{
    window.location.href='../pages/BusinessSearch.html?CatID=' + ID;
}

function goforward()
{
    window.location.href='../pages/daily.html?showname=1';
}

function openmodel(){
    $('#indexloadingdata').modal('show');

}