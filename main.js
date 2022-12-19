let closeButtonInsert = document.querySelector('#btn-close-insert');
let insert = document.querySelector('.insert');
let insertButton = document.querySelector('.btn-insert');

closeButtonInsert.addEventListener('click', function () {
    insert.style.display = 'none';
});

insertButton.addEventListener('click', function () {
    insert.style.display = 'flex';
});

const bookshelf = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.querySelector('.insert-form');
    submitForm.addEventListener('submit', function (event) {

        event.preventDefault();
        addbook();
        Swal.fire(
            'Success',
            'Data berhasil ditambahkan!',
            'success'
        );
        insert.style.display = 'none';
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            bookshelf.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
    return +new Date();
}

function generatebookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'bookshelf_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bookshelf);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}



const buttonSearch = document.querySelector('.btn-search');

function findBook(bookTitle) {
    let bookList = document.querySelectorAll('.book-list');
    for (var i = 0; i < bookList.length; i++) {
        let bookName = document.querySelectorAll(".book-name")[i];
        if (bookName.innerText.toLowerCase().includes(bookTitle.toLowerCase())) {
            bookList[i].style.display = "flex";
        } else {
            bookList[i].style.display = "none";
        }
    }
}

buttonSearch.addEventListener('click', function () {
    let inputSearch = document.querySelector('#input-search').value;
    console.log(inputSearch);
    findBook(inputSearch);
});

function addbook() {
    const bookTitle = document.getElementById('title').value;
    const bookAuthor = document.getElementById('author').value;
    const bookYear = document.getElementById('year').value;

    const generatedID = generateId();
    const bookObject = generatebookObject(generatedID, bookTitle, bookAuthor, bookYear, false);
    bookshelf.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function makebook(bookObject) {
    const bookListLeft = document.createElement('div');
    bookListLeft.classList.add('book-list-left');

    const bookListRight = document.createElement('div');
    bookListRight.classList.add('book-list-right');

    const bookTitle = document.createElement('h5');
    bookTitle.classList.add('book-name');
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.classList.add('book-author');
    const iconAuthor = document.createElement('i');
    iconAuthor.classList.add('fa-solid', 'fa-user-pen');
    bookAuthor.innerText = bookObject.author;
    bookAuthor.append(iconAuthor);

    const bookDate = document.createElement('p');
    bookDate.classList.add('book-date');
    const iconDate = document.createElement('i');
    iconDate.classList.add('fa-solid', 'fa-calendar');
    bookDate.innerText = bookObject.year;
    bookDate.append(iconDate);

    const container = document.createElement('div');
    container.classList.add('book-list');

    container.append(bookListLeft, bookListRight);
    bookListLeft.append(bookTitle, bookAuthor, bookDate);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const buttonUndo = document.createElement('button');
        buttonUndo.classList.add('btn-undo');
        const iconUndo = document.createElement('i');
        iconUndo.classList.add('fa-solid', 'fa-undo');
        buttonUndo.append(iconUndo);

        buttonUndo.addEventListener('click', function () {
            undoTaskFromCompleted(bookObject.id);
        });

        const buttonRemove = document.createElement('button');;
        buttonRemove.classList.add('btn-remove');
        const iconRemove = document.createElement('i');
        iconRemove.classList.add('fa-solid', 'fa-x');
        buttonRemove.append(iconRemove);

        buttonRemove.addEventListener('click', function () {
            Swal.fire({
                title: 'Anda Yakin?',
                text: "Data yang sudah dihapus tidak dapat dikembalikan",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Hapus Data!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    removeTaskFromCompleted(bookObject.id);
                    Swal.fire(
                        'Terhapus!',
                        'Data Buku berhasil dihapus!.',
                        'success'
                    )
                }
            });
        });

        bookListRight.append(buttonUndo, buttonRemove);
    } else {
        const buttonComplete = document.createElement('button');
        buttonComplete.classList.add('btn-complete');
        const iconComplete = document.createElement('i');
        iconComplete.classList.add('fa-solid', 'fa-check');
        buttonComplete.append(iconComplete);

        buttonComplete.addEventListener('click', function () {
            addTaskToCompleted(bookObject.id);
        });

        const buttonRemove = document.createElement('button');;
        buttonRemove.classList.add('btn-remove');
        const iconRemove = document.createElement('i');
        iconRemove.classList.add('fa-solid', 'fa-x');
        buttonRemove.append(iconRemove);

        buttonRemove.addEventListener('click', function () {
            Swal.fire({
                title: 'Anda Yakin?',
                text: "Data yang sudah dihapus tidak dapat dikembalikan",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Hapus Data!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    removeTaskFromCompleted(bookObject.id);
                    Swal.fire(
                        'Terhapus!',
                        'Data Buku berhasil dihapus!.',
                        'success'
                    )
                }
            });
        });

        bookListRight.append(buttonComplete, buttonRemove);
    }

    return container;
}

function addTaskToCompleted(bookId) {
    const bookTarget = findbook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findbook(bookId) {
    for (const bookItem of bookshelf) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

document.addEventListener(RENDER_EVENT, function () {
    const header1 = document.createElement('h2');
    const header2 = document.createElement('h2');
    header1.innerText = 'Belum Selesai Dibaca';
    header2.innerText = 'Selesai Dibaca';

    const uncompletedbookList = document.querySelector('#incomplete-book');
    uncompletedbookList.innerHTML = '';
    uncompletedbookList.append(header1);

    const completedbookList = document.querySelector('#complete-book');
    completedbookList.innerHTML = '';
    completedbookList.append(header2);

    for (const bookItem of bookshelf) {
        const bookElement = makebook(bookItem);
        if (!bookItem.isCompleted)
            uncompletedbookList.append(bookElement);
        else
            completedbookList.append(bookElement);
    }
});

function removeTaskFromCompleted(bookId) {
    const bookTarget = findbookIndex(bookId);

    if (bookTarget === -1) return;

    bookshelf.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromCompleted(bookId) {
    const bookTarget = findbook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findbookIndex(bookId) {
    for (const index in bookshelf) {
        if (bookshelf[index].id === bookId) {
            return index;
        }
    }

    return -1;
}