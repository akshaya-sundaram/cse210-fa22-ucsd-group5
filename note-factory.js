class NoteFactory extends AbstractObserverPattern {
    constructor() {
        super('_newNote');
    }

    addNote() {
        // add new note

        // instantiate note object
        // add note object to user screen
        console.log('create note');
        let note = document.createElement('div');
        note.style = "background-color: aqua;"
        note.innerHTML = 'New Note!'
        this.notify(note)
    }
}