class User extends AbstractUserMenu {
    constructor(name, container) {
        super();
        this.name = name;
        this.container = container;
        this.tweets = [];
        this.topics = {};
        this.htmlElements = [];

        
        this.createUserScreen();

        this.notes = [];
        this.folders = [];
        this.chksPressed = 0;
    }

    createUserScreen() {
        let labelDiv = document.createElement('div');
        labelDiv.classList.add(USER_ITEM_CLASS, TITLE_CLASS);
        labelDiv.innerHTML = `Welcome ${this.name}!`;
        this.container.appendChild(labelDiv);
        this.htmlElements.push(labelDiv);
        
        // // New Note
        // this.newNoteBtn = document.createElement('button');
        // this.newNoteBtn.classList.add(USER_ITEM_CLASS, SUB_ITEM_CLASS);
        // this.newNoteBtn.innerHTML ="New Note";
        // this.container.appendChild(this.newNoteBtn);
        // this.htmlElements.push(this.newNoteBtn);
        // this.newNoteBtn.onclick = () => {
        //     if(!this.topics.hasOwnProperty(DEFAULT_TOPIC)) {
        //         this.topics[DEFAULT_TOPIC] = new TopicFactory(
        //             DEFAULT_TOPIC,
        //             db,
        //             this.container
        //         );
        //         this.topics[DEFAULT_TOPIC].newTweet('My First Tweet!');
        //     } else {
        //         this.topics[DEFAULT_TOPIC].newTweet('Another Tweet!');
        //     }
        //     this.topics[DEFAULT_TOPIC]._toggleSubItems();
        // }
                
        // new topic
        this.newFolderBtn = document.createElement('button');
        this.newFolderBtn.innerHTML = 'New Topic';
        this.newFolderBtn.classList.add(USER_ITEM_CLASS, SUB_ITEM_CLASS)
        this.container.appendChild(this.newFolderBtn);
        this.htmlElements.push(this.newFolderBtn);
        this.topicIDNum = 1;
        this.newFolderBtn.onclick = () => {
            this.createTopic(`New Topic ${this.topicIDNum}`, true);
        }
        getAllTopics((returnObj) => {
            //console.log(returnObj.topicsList)
            if (returnObj.topicsList.length == 0){
            this.topics[DEFAULT_TOPIC] = new TopicFactory(
                DEFAULT_TOPIC,
                db,
                this.container,
                DEFAULT_TOPIC, 
                true);
            }
            //console.log("entered topic");
            //this.readTweetsPerTopic(DEFAULT_TOPIC);
            //this.htmlElements.push(...this.topics[DEFAULT_TOPIC].getHTMLElements());

            //this.readTopics();

            //this._toggleSubItems();
        });
        this.readTopics();

        this._toggleSubItems();

    }

    readTopics() {
        getAllTopics((topicEvent) => {
            console.log(topicEvent.topicsList);
            for(let topic of topicEvent.topicsList) {
                this.createTopic(topic);
                this.readTweetsPerTopic(topic);
                this.htmlElements.push(...this.topics[topic].getHTMLElements());
            }
        });

    }

    createTopic(topic, isNewTopic = false) {
        console.log(topic);
        this.topics[topic] = new TopicFactory(
            topic,
            db,
            this.container,
            topic,
            isNewTopic
        );
        
        // this.readTweetsPerTopic(DEFAULT_TOPIC);
        this.htmlElements.push(...this.topics[topic].getHTMLElements());

        this.topicIDNum+=1;
    }

    readTweetsPerTopic(topic_id) {
        //console.log('topic_id', topic_id)
        let scope = this;
        this.tweets= getTweetsByTopicId(topic_id, 
            function (topicList) {
                scope.displayTweetsByTopics(topic_id, topicList);
        });
    }

    displayTweetsByTopics(topic, tweetList) {
        //console.log('????', topic, tweetList)
        if (tweetList.status === OK_STATUS) {
            for(let tweet of tweetList.data) {
                console.log(tweet)
                this.topics[topic].newTweet({
                    title: tweet.tweetTitle,
                    content: tweet.textContent,
                    newTweet: false
                }, tweet.tweetId);
            }
            this.topics[topic]._toggleSubItems();
        }
    }
}