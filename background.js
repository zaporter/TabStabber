console.log("STARTED BACKGROUND SCRIPT");

var clearIds = [];
var killedIds = [];

// O(n) growth with size of data
// This needs to be rewritten. It will be wayyyyy too slow.
//
// This also has a super obvious race condition. 
// Simple solution: mutex. 
// Correct solution: Per-id query with proper killing;
//
function processDataWithKilledIds(data){
    for (var key in data){
        var value = JSON.parse(data[key]);
        var tabId = value["tab_id"];
        if (killedIds.includes(tabId)){
            if (!value["should_close_known"]){
                value["should_close"]=true;
                value["should_close_known"] = true;
                var kvpair = {};
                kvpair[key] = JSON.stringify(value);
                browser.storage.local.set(kvpair);
            }

        }
    }
    killedIds=[];
}

// probably should go through all the data
function processDataWithClearedIds(data){
    for (var key in data){
        var value = JSON.parse(data[key]);
        var tabId = value["tab_id"];
        if (clearIds.includes(tabId)){
            if (!value["should_close_known"]){
                value["should_close"]=false;
                value["should_close_known"] = true;
                var kvpair = {};
                kvpair[key] = JSON.stringify(value);
                browser.storage.local.set(kvpair);
            }

        }
    }
    clearIds=[];
}


function onError(error){
    console.log(`Error: ${error}`);
}

function onCloseListener(eventObj){
    console.log(eventObj);
    killedIds.push(eventObj);
    let gettingItem = browser.storage.local.get();
    gettingItem.then(processDataWithKilledIds, onError);
}

browser.tabs.onRemoved.addListener(onCloseListener);

// 
// RESPONSE LISTENER / DISPACHER
//

browser.runtime.onMessage.addListener(function(request,sender,sendResponse){
    // actually more of an init rather than get-id;
    if (request.action == "Get-Id"){
        console.log("Handled get-id for "+sender.tab.id);

        // clear previous data associated with this id. 
        // should_close = false
        // should_close_known = true
        //
        clearIds.push(sender.tab.id);
        let gettingItem = browser.storage.local.get();
        gettingItem.then(processDataWithClearedIds, onError);


        sendResponse({"id":sender.tab.id});
        

    }else if (request.action == "Get-State"){
  //      sendResponse({sender:sender});
    }else{
        console.log("Invalid message recieved {");
        console.log(request);
        console.log(sender);
        console.log("}");
    }
})
