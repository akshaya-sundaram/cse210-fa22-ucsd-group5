let DEFAULT_TOPIC = 'General';
class TopicFactory extends AbstractUserMenu {
    constructor(title, db, container, topicId=null, isNewEntry = false) {
        super();

        this.title = title;
    	this.tweets = [];
    	this.topicId = topicId;
    	this.container = container;

    	this.initializeHTML();
        this.textEditor = new TextEditor(this.container);
        this.textEditor.registerObserver(this);
        if (isNewEntry) {
    	    this.initializeDB();
            this.tweets = [];
        }
	}

    _tweetClickEvent(tweetData) {
        this.textEditor.start(false, tweetData.content);
    }
    _textEditorUpdate(tweetData) {
        this.newTweet(tweetData); 
        this._toggleSubItems();   
    }
	initializeHTML() {
		// add folder to folder object
        this.topicContainer = document.createElement('div');
        this.topicContainer.classList.add(USER_ITEM_CLASS, SUB_ITEM_CLASS, TOPIC_ITEM_CLASS);
        this.topicContainer.innerHTML = this.title;
        
        // Edit Topic Name Button
        this.updateTopicNameButton = document.createElement('div');
        this.updateTopicNameButton.innerHTML = 'Edit Topic Name';
        this.updateTopicNameButton.classList.add(USER_ITEM_CLASS, SUB_ITEM_CLASS)
        this.topicContainer.appendChild(this.updateTopicNameButton);
        this.updateTopicNameButton.onclick = () => {
            this.promptNewTopicName()
        }
        

        
        // New Note
        this.newNoteBtn = document.createElement('button');
        this.newNoteBtn.classList.add(USER_ITEM_CLASS, SUB_ITEM_CLASS);
        this.newNoteBtn.innerHTML ="New Note";
        this.topicContainer.appendChild(this.newNoteBtn);
        this.newNoteBtn.onclick = () => {
            this.textEditor.start();
        }
        
        this.container.append(this.topicContainer);

        this._toggleSubItems();
	}

    promptNewTopicName() {
        
        let text;
        let newTopicName = prompt("New name for topic");
        updateTopic(this.topicId, newTopicName);
        this.title = newTopicName;
          
    }

    newTweet(tweetData, id=null) {
        //console.log(tweetData)
        let tweet = new TweetFactory(
            this.title,
            tweetData.title,
            db,
            this.topicContainer,
            tweetData.content,
            tweetData.title,
            tweetData.newTweet
        );
        tweet.registerObserver(this);
        this.tweets.push(tweet);
    }


	initializeDB() {
        createTopic(this.title, function (data){
            this.topicId = data.id;
        });

    }
	

    getTopicDiv() {
        return this.topicContainer;
    }
}