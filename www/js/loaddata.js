var db;


var d = new Date();
//alert(d);
var day = d.getDate();
var month = d.getMonth();
var year = d.getFullYear();
var hours= d.getHours();
var stringresultID = 0;
var datenow = (day + '' + month+ '' + year);
var milliesecs = d.getTime();
var datenowsec = Math.round((milliesecs/1000));
var golbaltoken= "";
var networkconnection = "";
var deviceIDfunc;
var devicePlatformfunc;
var chkrefreshdata = 0;
document.addEventListener("deviceready", onDeviceReadyloaddata, false);

function onDeviceReadyloaddata() {


    deviceIDfunc = device.uuid;
    devicePlatformfunc = device.platform;
    getnetworkdetails();
    pushnotifiy();

    document.addEventListener("offline", onOffline, false);
  //  alert("loaddata");
}

function onOffline()
{


}

function getnetworkdetails(){

    document.addEventListener("online", checkonline, false);
}

function checkonline(){

    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = '0';
    states[Connection.ETHERNET] = '2';
    states[Connection.WIFI]     = '2';
    states[Connection.CELL_2G]  = '1';
    states[Connection.CELL_3G]  = '1';
    states[Connection.CELL_4G]  = '1';
    states[Connection.NONE]     = '0';

    networkconnection = states[networkState];
        //alert(states[networkState]);

}

function refreshdata(){

    $('#indexloadingdata').modal('show');
    db.transaction(populateDB, errorCBfunc, successCBfunc);

}

function populateDB(tx){
    // $('#busy').show();
    var sql = "select Count(Datesecs) as Count,Datesecs from MobileApp_LastUpdatesec";
     // alert(sql);
    tx.executeSql(sql, [], populateDB1,errorCreatetable);

}

function populateDB1(tx,results) {
    checkonline();
    var row = results.rows.item(0);
    //   alert(row);
   //  alert(row.Count);
    if(row.Count ==0){
        if(networkconnection!=0) {
            $.when(blankLastUpdatesec()).done(function () {
               // $.when(pushnotifiy()).done(function () {
                   // db.transaction(populateDB, errorCBfunc, successCBfunc);
                    db.transaction(gettokenregion, errorCBfunc, successCBfunc);
              //  });
            });
        }else{
            $('#indexloadingdata').modal('hide');
            window.plugins.toast.showShortCenter('Sorry couldnt update Server No Internet', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});

        }
    }else{

        var sql = "select Datesecs,token,Region from MobileApp_LastUpdatesec";

        if(networkconnection!=0){

            tx.executeSql(sql, [], getchecksync,errorCBfunc);
        }else{
            $('#indexloadingdata').modal('hide');
            window.plugins.toast.showShortCenter('Sorry couldnt update Server No Internet', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});

        }
    }
}

function errorCreatetable(err) {

    createtables();

}


function createtables(){

    $.when(db.transaction(createDB, errorCBfunc, successCBfunc)).done(function() {

        db.transaction(populateDB, errorCBfunc, successCBfunc);
    });

}

function loadben()
{
    droptables();

    db.transaction(createDB, errorCBfunc, successCBfunc);



    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'http://admin.adme.kiwi/admedataformobile?deviceID=e8300770a9c17df8&token=eb9bb2bb-ad3a-488b-8f2a-a1d1ce727926&sec=0', false);
    xmlHttp.send();
    var json = xmlHttp.responseText;
    var obj = JSON.parse(json);

    syncmaintables(obj);
}

function getchecksync(tx, results) {

    var row = results.rows.item(0);
    var datenowsecsync = row.Datesecs;

    var datenow = new Date();
    var timenow = datenow.getTime();

    var dif = (timenow/1000)-(datenowsecsync);

    var region = row.Region;



        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'http://admin.adme.kiwi/admedataformobile.aspx?deviceID=' + deviceIDfunc + '&token=' + row.token + '&sec=' + datenowsecsync + '&start=0&region=' + region, false);
//alert('http://admin.adme.kiwi/admedataformobile.aspx?deviceID=' + deviceIDfunc + '&token=' + row.token + '&sec=' + datenowsecsync + '&start=0&region=' + region)

    xmlHttp.send();

        var json = xmlHttp.responseText;

        if (json == "{'Error' : [{'Message': 'Something went wrong'}]") {
        //    alert('http://admin.adme.kiwi/admedataformobile.aspx?deviceID=' + deviceIDfunc + '&token=' + row.token + '&sec=' + datenowsecsync + '&start=0&region=' + region);
            errorclosemodel();
        } else {

            var obj = JSON.parse(json);



            syncmaintables(obj);
        }


}


function errorclosemodel(){

    $('#indexloadingdata').modal('hide');
    window.plugins.toast.showLongCenter('Something went wrong! Please sync data again \n If problem persists contact helpdesk@neocom.co.nz', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});
    randomfunctions();
}

function closemodel(){

    $('#indexloadingdata').modal('hide');
    window.plugins.toast.showShortCenter('Your App is Updated!', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});

    if(document.getElementById("catlistdiv")!=null) {
        db.transaction(townregiondatabus1, errorCBfunc, successCBfunc);

    }

    if(document.getElementById("dailydealsDiv")!=null) {

        var showname = getUrlVarsfunc()["showname"];
    //alert(showname);
        if(showname ==1){
            window.setTimeout(function(){
                db.transaction(getnamefordisplay, errorCBfunc, successCBfunc);
            }, 2000);


        }

    }


   // randomfunctions();
}








function getnamefordisplay(tx) {
    var sql = "select Name from MobileApp_LastUpdatesec";
    //alert(sql);
    tx.executeSql(sql, [], getnamefordisplay_success,errorCBfunc);
}

function getnamefordisplay_success(tx, results) {

    var len = results.rows.length;
    var menu = results.rows.item(0);

    $('#txtname').val(menu.Name);
    window.plugins.toast.showShortCenter('Welcome ' + menu.Name, function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});


}




function closemodelRegion(){

    $('#indexloadingdata').modal('hide');
    //  window.plugins.toast.showLongCenter('Your App is Updated!', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});

   // $('#basicDetails').modal('show');

    db.transaction(gettokenlogin, errorCBfunc, successCBfunc);
    db.transaction(getregionslogin, errorCBfunc, successCBfunc);
   // randomfunctions();

}


function successHandler (result) {
    //   alert('result = ' + result);
}

function errorHandler (error) {
    //   alert('error = ' + error);
}

function tokenHandler (result) {
    var xmlHttptt = null;
    xmlHttptt = new XMLHttpRequest();

    // alert('tokenB: '+ result);
    //$('#busy').show();
    var strur = 'http://admin.adme.kiwi/registerdevice.aspx?deviceID=' + deviceIDfunc + '&devicemodel=' + devicemodelfunc + '&deviceCordova=' + deviceCordovafunc + '&devicePlatform=' + devicePlatformfunc + '&deviceVersion=' + deviceVersionfunc + '&regid=' + result;
    //  navigator.notification.alert(strur);
    xmlHttptt.open("GET",strur ,false);
    xmlHttptt.send();
    // $('#busy').hide();
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}


function pushnotifiy() {
    pushNotification = window.plugins.pushNotification;


    if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
        pushNotification.register(
            successHandler,
            errorHandler,
            {
                "senderID":"237299954367",
                "ecb":"onNotification"
            });
    } else if ( device.platform == 'blackberry10'){
        pushNotification.register(
            successHandler,
            errorHandler,
            {
                invokeTargetId : "replace_with_invoke_target_id",
                appId: "replace_with_app_id",
                ppgUrl:"replace_with_ppg_url", //remove for BES pushes
                ecb: "pushNotificationHandler",
                simChangeCallback: replace_with_simChange_callback,
                pushTransportReadyCallback: replace_with_pushTransportReady_callback,
                launchApplicationOnPush: true
            });
    } else {
        pushNotification.register(
            tokenHandler,
            errorHandler,
            {
                "badge":"true",
                "sound":"true",
                "alert":"true",
                "ecb":"onNotificationAPN"
            });
    }
}

function onNotification(e) {
    //   $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
    var xmlHttpt = null;
    xmlHttpt = new XMLHttpRequest();
    //  alert(e.event);
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                //  $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                console.log("regID = " + e.regid);


                //  $('#busy').show();
                var strur = 'http://admin.adme.kiwi/registerdevice.aspx?deviceID=' + deviceIDfunc + '&devicemodel=' + devicemodelfunc + '&deviceCordova=' + deviceCordovafunc + '&devicePlatform=' + devicePlatformfunc + '&deviceVersion=' + deviceVersionfunc + '&regid=' + e.regid;
                xmlHttpt.open("GET",strur ,false);
                //   alert(strur);
                xmlHttpt.send();
                //   $('#busy').hide();

                //   alert(json);
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.



            if ( e.foreground )
            {
               // navigator.notification.alert('foreground');
                weblink('../pages/daily.html');
                //   $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                // on Anroid soundname is outside the payload.
                // On Amazon FireOS all custom attributes are contained within payload
                var soundfile = e.soundname || e.payload.sound;d
                // if the notification contains a soundname, play it.
                var my_media = new Media("/android_asset/www/"+ soundfile);
                my_media.play();
            }
            else
            {


                // otherwise we were launched because the user touched a notification in the notification tray.
                if ( e.coldstart )
                {
                  //  navigator.notification.alert('coldstart1');
                    weblink('../pages/daily.html');
                    //  $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                }
                else
                {
                    weblink('../pages/daily.html');
                 //   navigator.notification.alert('coldstart2');
                    //      $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                }
            }


            //    $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            //Only works for GCM
            //    $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            //Only works on Amazon Fire OS
            //  $status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
            break;

        case 'error':
            //  $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
            break;

        default:
            //   $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
    }
}

function onNotificationAPN(e) {

    if (e.alert) {
        // $("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
// showing an alert also requires the org.apache.cordova.dialogs plugin
       // navigator.notification.alert(e.alert);
        weblink('../pages/daily.html');
    }
    if (e.sound) {
// playing a sound also requires the org.apache.cordova.media plugin
        var snd = new Media(e.sound);
        snd.play();
    }
    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}