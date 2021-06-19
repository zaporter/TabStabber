console.log("STARTED BACKGROUND SCRIPT");

function onCloseListener(eventObj){
    console.log(eventObj);
}

browser.tabs.onRemoved.addListener(onCloseListener);

browser.runtime.onMessage.addListener(function(request,sender,sendResponse){
    if (request.action == "Get-Id"){
        console.log("Handled get-id for "+sender.tab.id);
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
