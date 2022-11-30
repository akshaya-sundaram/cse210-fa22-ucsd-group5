let tweetStoreName = "tweets";
let topicStoreName = "topics";
let topicIndexName = "topicIndex";

let OK_STATUS = 200;
let FAILURE_STATUS = 500;

let db;

function setupDB(namespace, callback) {
    //console.log("Hello");

    if (db) {
        //console.log("DB already present");
        callback();
        return;
    }

    const request = indexedDB.open(`${namespace}`, 1);

    request.onsuccess = (event) => {
        db = event.target.result;
        callback();
    }

    request.onupgradeneeded = (event) => {
        const db = event.target.result;

        const tweetStore = db.createObjectStore("tweets", {"keyPath": "tweetId"});
        tweetStore.createIndex("topicIndex", "topicId", {unique: false});

        const topicStore = db.createObjectStore("topics", {"keyPath": "topicId"});
    }
}

// Function: createTweet
//
// Creates an entry corresponding to a tweet in the database
//
// Parameters:
//
//  tweetText       - The text contained in the tweet.
//  topicName       - Name of the topic to file the tweet under.
//  statusCallback  - Listener function from frontend to be executed
// 
// Returns:
//
//      Nothing

function createTweet(tweetText, tweetTitle, topicId, statusCallback) {
    const tweetId = `tweet-${Date.now()}`;
    const tweetObj = {tweetId: tweetId, textContent: tweetText, topicId: topicId, tweetTitle: tweetTitle};
    const objStore = db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
    const request = objStore.add(tweetObj);

    request.onsuccess = (_) => {
        statusCallback({status: OK_STATUS, data: {id: tweetId}});
    }

    request.onerror = (event) => {
        statusCallback({status: FAILURE_STATUS, errorMessage: `Failed adding tweet ${tweetId} to store with error code ${event.target.errorCode}`});
    }
}

// Function: updateTweet
//
// Updates tweet content in the database / moves tweet within topics
//
// Parameters:
//
//  tweetId         - The unique id of the tweet.
//  tweetText       - Updated text contained in the tweet.
//  topicId       - Updated TopicId if moving tweet
//  statusCallback  - Listener function from frontend to be executed
// 
// Returns:
//
//      Nothing

function updateTweet(tweetId, tweetText, topicId, statusCallback) {
    const objStore = db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
    const fetchRequest = objStore.get(tweetId);

    fetchRequest.onsuccess = (event) => {
        const tweet = event.target.result;
        if (tweetText > 0){
            tweet.textContent = tweetText;
        }
        if (topicId.length > 0) {
            tweet.topicId = topicId;
        }

        const updateReq = db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName).update(tweet);
        updateReq.onsuccess = (_) => {
            statusCallback({status: OK_STATUS});
        }

        updateReq.onerror = (event) => {
            statusCallback({status: FAILURE_STATUS, errorMessage: `Failed to update ${tweetId} in store with error code ${event.target.errorCode}`});
        }
    }

    fetchRequest.onerror = (event) => {
        statusCallback({status: FAILURE_STATUS, errorMessage: `Failed to fetch ${tweetId} from store with error code ${event.target.errorCode}`});
    }
}

// Function: deleteTweet
//
// Delete tweet entry from DB
//
// Parameters:
//
//  tweetId         - The unique id of the tweet.
//  statusCallback  - Listener function from frontend to be executed
// 
// Returns:
//
//      Nothing

function deleteTweet(tweetId, statusCallback) {
    const objStore = db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
    const request = objStore.delete(tweetId);

    request.onsuccess = (_) => {
        statusCallback({status: OK_STATUS});
    }
    request.onerror = (event) => {
            statusCallback({status: FAILURE_STATUS, errorMessage: `Could not delete ${tweetId} from records. Failed with ${event.target.errorCode}`});
    }
}

// Function: createTopic
//
// Creates an entry corresponding to a new topic in the database
//
// Parameters:
//
//  topicName       - Name of the topic to store tweets within
//  statusCallback  - Listener function from frontend to be executed
// 
// Returns:
//
//      Nothing

function createTopic(topicName, statusCallback) {
    const topicId = `topic-${Date.now()}`;
    const topicObj = {topicId: topicId, topicName: topicName};
    const objStore = db.transaction([topicStoreName], "readwrite").objectStore(topicStoreName);
    const request = objStore.add(topicObj);

    request.onsuccess = (_) => {
        statusCallback({status: OK_STATUS, data: {id: topicId}});
    }

    request.onerror = (event) => {
        statusCallback({status: FAILURE_STATUS, errorMessage: `Failed adding topic ${topicId} to store with error code ${event.target.errorCode}`});
    }
}

// Function: updateTopic
//
// Updates topic Name
//
// Parameters:
//
//  topicId         - Unique topic ID corresponding to the topic (Primary Key)
//  topicName       - Updated topic name
//  statusCallback  - Listener function from frontend to be executed
// 
// Returns:
//
//      Nothing

function updateTopic(topicId, topicName, statusCallback) {
    console.log(topicId);
    const objStore = db.transaction([topicStoreName], "readwrite").objectStore(topicStoreName);
    const fetchRequest = objStore.get(topicId);

    fetchRequest.onsuccess = (event) => {
        const topic = event.target.result;
        topic.topicName = topicName;

        const updateReq = db.transaction([topicStoreName], "readwrite").objectStore(topicStoreName).update(topic); 
        updateReq.onsuccess = (_) => {
            statusCallback({status: OK_STATUS});
        }

        updateReq.onerror = (event) => {
            statusCallback({status: FAILURE_STATUS, errorMessage: `Failed to update ${topicId} in store with error code ${event.target.errorCode}`});
        }
    }

    fetchRequest.onerror = (event) => {
        statusCallback({status: FAILURE_STATUS, errorMessage: `Failed to fetch ${topicId} from store with error code ${event.target.errorCode}`});
    }
}

// Function: getTweetsByTopicId
//
// Gets all tweets corresponding to a given topic ID
//
// Parameters:
//
//  topicId         - Unique ID corresponding to the topic
//  displayTweetsCallback  - Listener function from frontend to be executed
// 
// Returns:
//
//      Nothing

function getTweetsByTopicId(topicId, displayTweetsCallback) {
    const objStore = db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
    const request = objStore.index(topicIndexName).getAll(topicId);

    request.onsuccess = (event) => {
        const data = event.target.result;
        displayTweetsCallback({status: OK_STATUS, data: data});
        };

    request.onerror = (event) => {
        displayTweetsCallback({status: FAILURE_STATUS, errorMessage: `Failed fetch tweets request by topic ID ${topicId} with error code ${event.target.result}`});
        }
}

// Function: getAllTopics
//
// Gets a list of all topics in the topics store
//
// Parameters:
//
//  displayTopicsCallback - Listener fucntion from fontend to be executed
// 
// Returns:
//

function getAllTopics(displayTopicsCallback) {

    const topicStore = db.transaction([topicStoreName], "readonly").objectStore(topicStoreName);

    var allRecords = topicStore.getAll();

    allRecords.onsuccess = (event) => {
        let data = event.target.result;
        let topicList = new Set();
        for (var topic of data) {
            topicList.add(topic.topicId);
        }
        const returnObj = {status: true, topicsList: [...topicList]};
        displayTopicsCallback(returnObj);
    }

    allRecords.onerror = (event) => {
        const returnObj = {status: false, topicsList: []};
        displayTopicsCallback(returnObj);
    }

}

// module.exports = {setupDB, createTweet, getTweetsByTopicId, updateTweet};

