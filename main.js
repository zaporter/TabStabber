console.log("Started");
document.body.style.border = "5px solid green";

//
// VARIABLE DEFINITIONS
//

// temp dictionary for dev purposes. 
var colorSinceTime = {
    5:"red",
    10:"green",
    20:"blue",
    60:"yellow"
}
// data to export to database. Stores current tab info
var data = {

};
// References to the current timeouts that will determine whether to kill the tab
var timers= []

// Time that the tab was opened
var openingTime = new Date();


// Variable to indicate time at which the page was just recently brought into focus
var timeRefocused = Date.now();

var unfinishedDataEntries = [];


//
// METHODS
//

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateRandomString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function callback(currentTime) {
    document.body.style.border = "5px solid "+colorSinceTime[currentTime];
    addComputedFieldsToData(currentTime);
    // if (decideToKillTabWithML){
        // Kill the tab
    // } else{
    
    addComputedFieldsToData(currentTime);
    // This is a bit hectic but so it goes
    let key = generateRandomString(15);
    var kvpair = {};
    kvpair[key] = JSON.stringify(data);
    browser.storage.local.set(kvpair);
    unfinishedDataEntries.append(key);

    // }
    
    console.log("Passed Value: "+currentTime);
}

function initializeData(){
    data["url"] = document.location.href.split("/")[2];
    data["total_time_on_page_ms"] = 0;
    data["times_visited"] = 0;
    data["first_time_spent_on_page_ms"] = 0;
}

// Initialize the data after 2 seconds to help with page loading / redirection 
setTimeout(initializeData,2000);

function addComputedFieldsToData(timeSinceLastFocus) {
    data["time_since_open_ms"] = Date.now() - openingTime;
    data["mean_time_on_page_ms"] = data["total_time_on_page_ms"]/data["times_visited"];
    data["percentage_focused"] = data["total_time_on_page_ms"] / data["time_since_open_ms"];
    data["time_since_last_focus"] = timeSinceLastFocus;
    data["should_close"] = false; // temporary value. Will be used for training and set later 
    data["should_close_known"] = false; // will be changed once we know whether we should have closed this tab at this point in time. 
}


function killTimers(){
    for (var index in timers){
        clearTimeout(timers[index]);
        console.log("Killed timer at "+index);
    }
}

function resetTimers(){
    timers = [
        setTimeout(function(){callback(5000)},5000),
        setTimeout(function(){callback(10000)},10000),
        setTimeout(function(){callback(20000)},20000),
        setTimeout(function(){callback(60000)},60000)
    ];
}
resetTimers();


// VISIBILITY
//https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API

// set event names for different browsers
//
var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}


function handleVisibilityChange() {
    if (document[hidden]){
        console.log("Page hidden");
        // get the timers going again
        resetTimers();

        // Dont log visits of time less than 2 seconds
        if (Date.now() - timeRefocused > 2000){
            data["times_visited"] += 1;
            if (data["total_time_on_page_ms"] == 0){
                data["first_time_spent_on_page_ms"] = Date.now() - timeRefocused;
            }
            data["total_time_on_page_ms"] += Date.now() - timeRefocused;

        }
    } else {
        // kill timers to prevent page close while open
        killTimers();
        timeRefocused = Date.now();
        console.log("Page refocused " + localStorage.length );
        console.log("Refocus end");
    }
}

function tabCloseListener(eventa){
    browser.storage.local.set({killed:"true" });
}
window.addEventListener("TabClose", tabCloseListener,false);
document.addEventListener(visibilityChange, handleVisibilityChange,false);


