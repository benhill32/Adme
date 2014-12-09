
function droptables(){


    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_LastUpdatesec');
        console.log("MobileApp_LastUpdatesec table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_BusinessNames');
        console.log("MobileApp_BusinessNames table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_Categories');
        console.log("MobileApp_Categories table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_Region');
        console.log("MobileApp_Region table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_Towns');
        console.log("MobileApp_Towns table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_BusinessLocations');
        console.log("MobileApp_BusinessLocations table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobilevwApp_dailydeal');
        console.log("MobilevwApp_dailydeal table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobilevwApp_weeklydeal');
        console.log("MobilevwApp_weeklydeal table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE Mobilescreenimage');
        console.log("Mobilescreenimage table is Dropped");
    });

}

function createDB(tx) {

    tx.executeSql('CREATE TABLE IF NOT EXISTS MobileApp_LastUpdatesec (Datesecs TEXT NULL,token TEXT NOT NULL)');
    console.log("MobileApp_LastUpdatesec table is created");

    tx.executeSql('CREATE TABLE IF NOT EXISTS MobileApp_BusinessNames (ID INTEGER NOT NULL primary key,CreatedateUTC TEXT NOT NULL,UpdatedateUTC TEXT NOT NULL,DeletedateUTC TEXT NOT NULL,BusinessName TEXT NOT NULL,Icon TEXT NOT NULL)');
    console.log("MobileApp_BusinessNames table is created");

    tx.executeSql('CREATE TABLE IF NOT EXISTS MobileApp_Categories (ID INTEGER NOT NULL primary key,CreatedateUTC TEXT NOT NULL,UpdatedateUTC TEXT NOT NULL,DeletedateUTC TEXT NOT NULL,CategoryName TEXT NOT NULL)');
    console.log("MobileApp_Categories table is created");

    tx.executeSql('CREATE TABLE IF NOT EXISTS MobileApp_Region (ID INTEGER NOT NULL primary key,CreatedateUTC TEXT NOT NULL,UpdatedateUTC TEXT NOT NULL,DeletedateUTC TEXT NOT NULL,RegionName TEXT NOT NULL )');
    console.log("MobileApp_Region table is created");

    tx.executeSql('CREATE TABLE IF NOT EXISTS MobileApp_Towns (ID INTEGER NOT NULL primary key,CreatedateUTC TEXT NOT NULL,UpdatedateUTC TEXT NOT NULL,DeletedateUTC TEXT NOT NULL,TownName TEXT NULL,RegionID INTEGER NOT NULL)');
    console.log("MobileApp_Towns table is created");

    tx.executeSql('CREATE TABLE IF NOT EXISTS MobileApp_BusinessLocations (ID INTEGER NOT NULL primary key,CreatedateUTC TEXT NOT NULL,UpdatedateUTC TEXT NOT NULL,DeletedateUTC TEXT NOT NULL,RegionID INTEGER NOT NULL,TownID INTEGER NOT NULL,Lat TEXT NOT NULL,Long TEXT NOT NULL,Address TEXT NOT NULL,Phone TEXT NOT NULL)');
    console.log("MobileApp_BusinessLocations table is created");

    tx.executeSql('CREATE TABLE IF NOT EXISTS MobilevwApp_dailydeal (ID INTEGER NOT NULL primary key,CreatedateUTC TEXT NOT NULL,UpdatedateUTC TEXT NOT NULL,DeletedateUTC TEXT NOT NULL,BusinessID INTEGER NOT NULL,BusinessLocationID INTEGER NOT NULL,StartDate TEXT NOT NULL,EndDate TEXT NOT NULL,ItemName TEXT NOT NULL,Details TEXT NOT NULL,Price TEXT NOT NULL,URL TEXT NOT NULL)');
    console.log("MobilevwApp_dailydeal table is created");


    tx.executeSql('CREATE TABLE IF NOT EXISTS MobilevwApp_weeklydeal (ID INTEGER NOT NULL primary key,CreatedateUTC TEXT NOT NULL,UpdatedateUTC TEXT NOT NULL,DeletedateUTC TEXT NOT NULL,BusinessID INTEGER NOT NULL,BusinessLocationID INTEGER NOT NULL,StartDate TEXT NOT NULL,EndDate TEXT NOT NULL,ItemName TEXT NOT NULL,Details TEXT NOT NULL,Price TEXT NOT NULL,URL TEXT NOT NULL)');
    console.log("MobilevwApp_weeklydeal table is created");

}







