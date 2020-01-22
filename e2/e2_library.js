/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
	const bookname = document.querySelector("#newBookName").value
	const bookauthor = document.querySelector("#newBookAuthor").value
	const bookgenre = document.querySelector("#newBookGenre").value
	const newbook = new Book(bookname, bookauthor, bookgenre)
	libraryBooks.push(newbook)
	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(newbook)
	
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
	const bookid = parseInt(document.querySelector("#loanBookId").value)
	const cardnumber = parseInt(document.querySelector("#loanCardNum").value)

	// Add patron to the book's patron property
	libraryBooks[bookid].patron = patrons[cardnumber]

	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(libraryBooks[bookid])

	// Start the book loan timer.
	libraryBooks[bookid].setLoanTime()

}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
	if (e.target.classList.contains("return")){
		const bookid = parseInt(e.target.parentElement.parentElement.firstElementChild.innerText)
		removeBookFromPatronTable(libraryBooks[bookid])
		libraryBooks[bookid].patron = null
	}
	// Call removeBookFromPatronTable()


	// Change the book object to have a patron of 'null'


}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	const newpatron = new Patron(document.querySelector("#newPatronName").value)
	patrons.push(newpatron)
	addNewPatronEntry(newpatron)
	// Call addNewPatronEntry() to add patron to the DOM

}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
	const bookid = parseInt(document.querySelector("#bookInfoId").value)
	displayBookInfo(libraryBooks[bookid])
	// Call displayBookInfo()	

}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
	const newbooktable = document.createElement("tr")
	const bookid = document.createElement("td")
	bookid.appendChild(document.createTextNode(book.bookId))
	const booktitle = document.createElement("td")
	const strongbook = document.createElement("strong")
	strongbook.appendChild(document.createTextNode(book.title))
	booktitle.appendChild(strongbook)
	const patroncard = document.createElement("td")
	const bookinfo = document.querySelector("#bookTable").firstElementChild
	newbooktable.appendChild(bookid)
	newbooktable.appendChild(booktitle)
	newbooktable.appendChild(patroncard)
	bookinfo.appendChild(newbooktable)
}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	const bookInfo = document.querySelector("#bookInfo")
	const information = ["Book Id: ", "Title: ", "Author: ", "Genre: ", "Currently loaned out to: "]
	let rentor;
	if (book.patron == null){
		rentor = "N/A"
	}
	else{
		rentor = book.patron.name
	}
	const tmp = [book.bookId, book.title, book.author, book.genre, rentor]
	for (let i = 0; i < bookInfo.children.length; i++){
		bookInfo.children[i].innerText = information[i]
		let spanel = document.createElement("span")
		spanel.appendChild(document.createTextNode(tmp[i]))
		bookInfo.children[i].appendChild(spanel)
	}
}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	const tablerow2 = document.createElement("tr")
	const bookid = document.createElement("td")
	bookid.appendChild(document.createTextNode(book.bookId))
	tablerow2.appendChild(bookid)
	const bookname = document.createElement("td")
	const booknamebold = document.createElement("strong")
	booknamebold.appendChild(document.createTextNode(book.title))
	bookname.appendChild(booknamebold)
	tablerow2.appendChild(bookname)
	const duedate = document.createElement("td")
	const greendue = document.createElement("span")
	greendue.classList.add("green")
	greendue.appendChild(document.createTextNode("Within due date"))
	duedate.appendChild(greendue)
	tablerow2.appendChild(duedate)
	const buttoncont = document.createElement("td")
	const returnbu = document.createElement("button")
	returnbu.classList.add("return")
	returnbu.appendChild(document.createTextNode("return"))
	buttoncont.appendChild(returnbu)
	tablerow2.appendChild(buttoncont)
	document.querySelector("#patrons").children[book.patron.cardNumber].children[3].children[0].appendChild(tablerow2)
	const tableinfo = document.querySelector("#bookTable").children[0]
	for (let i = 0; i < tableinfo.children.length; i++){
		if (parseInt(tableinfo.children[i].children[0].innerText) == book.bookId){
			tableinfo.children[i].lastElementChild.innerText = book.patron.cardNumber
		}
	}

}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	// Add code here
	const divholder = document.createElement("div")
	divholder.classList.add("patron")
	//
	const info1 = document.createElement("p")
	info1.appendChild(document.createTextNode("Name: "))
	const span1 = document.createElement("span")
	span1.appendChild(document.createTextNode(patron.name))
	info1.appendChild(span1)
	divholder.appendChild(info1)
	//name
	const info2 = document.createElement("p")
	info2.appendChild(document.createTextNode("Card Number: "))
	const span2 = document.createElement("span")
	span2.appendChild(document.createTextNode(patron.cardNumber))
	info2.appendChild(span2)
	divholder.appendChild(info2)
	//further info
	const info3 = document.createElement("h4")
	info3.appendChild(document.createTextNode("Books on loan:"))
	divholder.appendChild(info3)
	//table info
	const tableinfo = document.createElement("table")
	tableinfo.appendChild(document.createElement("tbody"))
	tableinfo.classList.add("patronLoansTable")
	//
	const tablerow = document.createElement("tr")
	const header = ["BookID", "Title", "Status", "Return"]
	for (let i = 0; i < 4; i++){
		let tmp = document.createElement("th")
		tmp.appendChild(document.createTextNode(header[i]))
		tablerow.appendChild(tmp)
	}
	tableinfo.children[0].appendChild(tablerow)
	divholder.appendChild(tableinfo)
	document.querySelector("#patrons").appendChild(divholder)
}

// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here	
	const patrontoreturn = document.querySelector("#patrons").children[book.patron.cardNumber]
	const bookshelf = patrontoreturn.children[3].children[0]
	for (let i = 1; i < bookshelf.children.length; i++){
		if (parseInt(bookshelf.children[i].firstElementChild.innerText) == book.bookId){
			bookshelf.removeChild(bookshelf.children[i])
		}
	}
	const bookinfo = document.querySelector("#bookTable").firstElementChild
	for (let i = 1; i < bookinfo.children.length; i++){
		if (bookinfo.children[i].firstElementChild.innerText == book.bookId){
			bookinfo.children[i].lastElementChild.innerText = ""
		}
	}
}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
	const patrons = document.querySelector("#patrons").children[book.patron.cardNumber]
	const buttonobj = patrons.children[3].children[0]
	for (let i = 1; i < buttonobj.children.length; i++){
		if (parseInt(buttonobj.children[i].firstElementChild.innerText) == book.bookId){
			buttonobj.children[i].firstElementChild.nextElementSibling.nextElementSibling.children[0].classList.remove("green")
			buttonobj.children[i].firstElementChild.nextElementSibling.nextElementSibling.children[0].classList.add("red")
		}
	}
	
}

