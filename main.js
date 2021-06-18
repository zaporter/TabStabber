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

setTimeout(function(){callback(5)},5000);
setTimeout(function(){callback(10)},10000);
setTimeout(function(){callback(20)},20000);
setTimeout(function(){callback(60)},60000);


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
        console.log("HIDDEN ");
    } else {
        console.log("REFOCUSED");
    }
}

document.addEventListener(visibilityChange, handleVisibilityChange,false);


