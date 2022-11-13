class User {
    constructor(name, container) {
        this.name = name;
        this.container = container;

        // this.noteFactory = new NoteFactory();
        // this.noteFactory = new FolderFactor();
        // this.noteFactory.registerObserver(this);
        
        this.createUserScreen();
        this.notes = [];
        this.folders = [];
        this.chksPressed = 0;
    }

    _newNote(container) {
        // add new note

        // instantiate note object
        // add note object to user screen
        console.log('create note');
        let note = document.createElement('div');
        note.style = 'display: flex; flex-direction: row;'

        let noteCheck = document.createElement('input');
        note.style = "background-color: aqua;"
        note.innerHTML = 'New Note!'
        container.appendChild(note);
    }

    _newFolder() {
        // add folder to folder object
       // create folder container
        let folderContainer = document.createElement('div');

        let folder = document.createElement('div');
        folderContainer.append(folder);
        folder.style = 'display: flex; flex-direction: row;'

        let title = document.createElement('h1');
        title.innerHTML = `new_folder${Object.keys(this.folders).length + 1}`;

        let renameTxt = document.createElement('input');
        renameTxt.classList.add('hidden');

        // double click to change folder name
        title.ondblclick = (e) => {
            title.classList.add('hidden');
            renameTxt.classList.remove('hidden');
            renameTxt.focus();
        }
        renameTxt.addEventListener('focusout', () => {
            if (renameTxt.value){
                title.innerHTML = renameTxt.value;
            }
            title.classList.remove('hidden');
            renameTxt.classList.add('hidden');
            renameTxt.value = '';
            console.log(renameTxt)
        });
        
        let newNodeBtn = document.createElement('button');
        newNodeBtn.innerHTML ="New Note        📝";

        let notesDiv = document.createElement('div');
        newNodeBtn.onclick = () => {
            let noteDiv = document.createElement('div');
            noteDiv.style = 'display: flex; flex-direction: row;'

            let noteCheck = document.createElement('input');
            noteCheck.setAttribute('type', 'checkbox');
            noteCheck.onclick = () => {
                if(noteCheck.checked) {
                    this.chksPressed += 1;
                } else {
                    this.chksPressed -= 1;
                }

                if (this.chksPressed > 0) {
                     // hide new buttons and show the delete/move buttons
                    this.delMovDiv.classList.remove('hidden');
                    this.noteDiv.classList.add('hidden');
                    this.folderDiv.classList.add('hidden');
                } else {
                     // hide new buttons and show the delete/move buttons
                    this.delMovDiv.classList.add('hidden');
                    this.noteDiv.classList.remove('hidden');
                    this.folderDiv.classList.remove('hidden');
                }
            }

            let noteLbl = document.createElement('label');
            noteLbl.innerHTML = 'New Note!'

            noteDiv.append(noteCheck);
            noteDiv.append(noteLbl);

            notesDiv.append(noteDiv);
        }

        // add it to our panel
        folder.append(title);
        folder.append(renameTxt);
        folder.append(newNodeBtn);
        folderContainer.append(notesDiv);
        this.folders.push(folder);
        this.container.append(folderContainer);
   }

    createUserScreen() {
        let labelDiv = document.createElement('div');
        let userLabel = document.createElement('h2');
        labelDiv.appendChild(userLabel);
        userLabel.innerHTML = `Welcome ${this.name}!`;
        this.container.appendChild(labelDiv);
        

        this.noteDiv = document.createElement('div');
        this.newNoteBtn = document.createElement('button');
        this.noteDiv.appendChild(this.newNoteBtn);
        this.newNoteBtn.innerHTML ="New Note        📝";
        this.newNoteBtn.classList.add("note_button");
        this.container.appendChild(this.noteDiv);

        let scope = this;
        this.newNoteBtn.onclick = () => {
            scope._newNote(this.container);
        }

        this.folderDiv = document.createElement('div');
        this.newFolderBtn = document.createElement('button');
        this.folderDiv.appendChild(this.newFolderBtn);
        this.newFolderBtn.innerHTML ="New Folder      📁";
        this.newFolderBtn.classList.add("note_button")
        this.container.appendChild(this.folderDiv);

        this.newFolderBtn.onclick = () => {
            scope._newFolder();
        }

        this.delMovDiv = document.createElement('div');
        this.delMovDiv.classList.add('hidden');
        
        this.deleteBtn = document.createElement('button');
        this.deleteBtn.innerHTML = 'Delete note(s)';
        this.delMovDiv.append(this.deleteBtn);

        this.moveBtn = document.createElement('button');
        this.moveBtn.innerHTML = 'Move note(s) to...';
        this.delMovDiv.append(this.moveBtn);
        this.container.append(this.delMovDiv);



        let chk = document.createElement('input');
        chk.setAttribute('type', 'checkbox');
        chk.onclick = (e) => {
            if (e.target.checked) {
                // hide new buttons and show the delete/move buttons
                this.delMovDiv.classList.remove('hidden');
                this.noteDiv.classList.add('hidden');
                this.folderDiv.classList.add('hidden');
            } else {
                // do the opposite
                this.delMovDiv.classList.add('hidden');
                this.noteDiv.classList.remove('hidden');
                this.folderDiv.classList.remove('hidden');
            }
        }


        this.container.append(chk);


        // add existing folders/notes

    }
}