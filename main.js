var timeSinceLastInteractionSec = [
    5,
    10,
    20,
    60
];
var colorSinceTime = {
    5:"red",
    10:"green",
    20:"blue",
    60:"pink"
}
function callback(currentTime) {
    document.body.style.border = "5px solid "+colorSinceTime[currentTime];
    console.log("HI HI "+currentTime);
}
console.log("Started");
document.body.style.border = "5px solid green";

var timers= []

function resetTimers(){
    for (var index in timers){
        clearTimeout(timers[index]);
        console.log("Killed timer at "+index);
    }
    timers = [
        setTimeout(function(){callback(5)},5000),
        setTimeout(function(){callback(10)},10000),
        setTimeout(function(){callback(20)},20000),
        setTimeout(function(){callback(60)},60000)
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
function onGot(tabInfo) {
  console.log(tabInfo);
}

function onError(error) {
  console.log(`Error: ${error}`);
}


function handleVisibilityChange() {
    if (document[hidden]){
        console.log("HIDDEN ");
    } else {
        console.log("REFOCUSED");
        resetTimers();
        console.log("REFOCUSED-1");
        console.log("REFOCUSED END");
    }
}
function tabCloseListener(){
    console.log("fuck");
}
window.addEventListener("TabClose", tabCloseListener,false);
document.addEventListener(visibilityChange, handleVisibilityChange,false);


