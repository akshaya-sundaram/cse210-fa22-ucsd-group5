let TWEET_ID = 1;

class TweetFactory extends AbstractUserMenu {
    constructor(topicid, title, db, container, content, tweetid=null, newTweet=true) {
        super('_tweetClickEvent');
        this.title = title;
        this.content = content;
        this.topicid = topicid;
        this.tweetid = (tweetid) ? tweetid : TWEET_ID++;
        this.container = container;
        this.db = db;
        this.contentManager = new ContentManagemnt(this.db);
        
        this.initializeHTML();
        if(newTweet) {
            this.initializeDB();
        } else {
            TWEET_ID = tweetid + 1;
        }
    }

    initializeHTML() {
        this.tweet = document.createElement('div');
        this.tweet.classList.add(USER_ITEM_CLASS, SUB_ITEM_CLASS, TWEET_ITEM_CLASS)
        this.tweet.innerHTML = this.title;
        this.tweet.onclick = () => {
            this.notify({
                content: this.content
            })
        }
        this._toggleSubItem(this.tweet);
        this.container.appendChild(this.tweet);
    }

    initializeDB() {
        this.contentManager.createTweet(this.content, this.topicid, console.log);
    }

    getId() {}
}