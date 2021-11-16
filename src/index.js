document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000/quotes?_embed=likes" 
    const quoteList = document.getElementById("quote-list")
    const quoteForm = document.getElementById("new-quote-form")
    
    //get info from API
    function getQuotes() {
        fetch(baseURL)
            .then(response => response.json())
            .then(quotesArray => {
                quotesArray.forEach((quoteObj) => {
                renderQuotes(quoteObj)
                })
            })
    }

    //make form work
    quoteForm.addEventListener("submit", (e) => {
        e.preventDefault()
        let author = e.target.author.value //find author in HTML
        let quoteContent = e.target["new-quote"].value

        //add new quote to API
        fetch("http://localhost:3000/quotes", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                author: author,
                quote: quoteContent,
            })
                
        })
            .then(r => r.json())
            .then((newQuote) => {
                newQuote.likes = [] //add likes to new quote in API
                renderQuotes(newQuote)
            })
    })
    //make information from API appear on page
    function renderQuotes(quoteObj) {

        //create all elements
        const item = document.createElement("li")
        item.className = "quote-card"

        //fill the element using innerHTML
        item.innerHTML = `
                <blockquote class="blockquote">
                <p class="mb-0">${quoteObj.quote}</p>
                <footer class="blockquote-footer">${quoteObj.author}</footer>
                <br>
                <button class='btn-success'>Likes: <span>${quoteObj.likes.length}</span></button>
                <button class='btn-danger'>Delete</button>
                </blockquote>    
            `
        //append element to the DOM
        quoteList.append(item)

        //grab the elements from the element
        const deleteButton = item.querySelector(".btn-danger")
        const likeButton = item.querySelector(".btn-success")
        let likeSpan = item.querySelector("span")

        //add event listeners

        //make delete button work
        deleteButton.addEventListener("click", () => {
            fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
                method: "DELETE"
            })
            .then(r => r.json())
            .then((response) => {
                item.remove()
            })
        })

        //make like button work
        likeButton.addEventListener("click", () => {
            fetch(`http://localhost:3000/likes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    quoteId: quoteObj.id //returns like number from API
                }),
            })
            .then(r => r.json())
            .then((newLike) => {
                
                quoteObj.likes.push(newLike) //adds like to the DOM
                likeSpan.innerText = quoteObj.likes.length //displays new likes number on button
            })
        })
    }
    
    getQuotes()
})