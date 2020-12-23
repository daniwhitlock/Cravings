var recipeSubmitEl = document.getElementById("recipe-btn"); //querySelector grabs the first one- getElementById is more specific- don't need hashtag for getElementById- you do for querySelector
var resultsEl = document.getElementById("recipe-results");

//dropdown menu functionality
$(document).ready(function(){
    $('select').formSelect();
 });

// function getZamatoLocation() {
//     let apiUrl =
//         "https://developers.zomato.com/api/v2.1/locations?query=Provo&count=10";

//     fetch(apiUrl, {
//         headers: {
//             "user-key": "d1e1f6cd33def7c3ba28f54a2d380f20",
//         },
//     })
//         .then(function (response) {
//             if (response.ok) {
//                 return response.json();
//             }
//         })
//         .then(function (data) {
//             console.log(data);
//         });
// };

function getTastyRecipes(food) {
    fetch(
        "https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&tags=" + food,
        {
            method: "GET",
            headers: {
                "x-rapidapi-key": "09af83b4a4mshb4829f998e9809fp13521fjsn62893ece2ab2",
                "x-rapidapi-host": "tasty.p.rapidapi.com",
            },
        }
    )
        .then((response) => {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var results = data.results;
            console.log(results);
            for (var i = 0; i < results.length; i++) {
                console.log(results[i].name);
                console.log(results[i].description);
                console.log(results[i].id);
                var col = document.createElement("div");
                col.setAttribute("class", "col");

                var card = document.createElement("div");
                card.setAttribute("class", "card");

                var cardContent = document.createElement("div");
                cardContent.setAttribute("class", "card-content");
                var spanCardContent = document.createElement("span");
                spanCardContent.setAttribute("class", "card-title");
                spanCardContent.textContent = results[i].name;

                var pCardContent = document.createElement("p");
                // pCardContent.setAttribute(""); //need to set a class?
                pCardContent.textContent = results[i].description;

                cardContent.appendChild(spanCardContent);
                cardContent.appendChild(pCardContent);
                card.appendChild(cardContent);

                var cardAction = document.createElement("div");
                cardAction.setAttribute("class", "card-title");
                var resultBtn = document.createElement("button");
                resultBtn.classList.add("recipe-id", "waves-effect", "red", "darken-4", "btn");
                resultBtn.textContent = "Click to go to recipe";
                resultBtn.value = results[i].id;
                cardAction.appendChild(resultBtn);

                card.appendChild(cardAction);

                col.appendChild(card);
                resultsEl.appendChild(col);
            };
        })
        .catch(err => {
            console.error(err);
        });
};

function getDetailsRecipe(id) {
    fetch("https://tasty.p.rapidapi.com/recipes/detail?id=" + id,
        {
            method: "GET",
            headers: {
                "x-rapidapi-key": "09af83b4a4mshb4829f998e9809fp13521fjsn62893ece2ab2",
                "x-rapidapi-host": "tasty.p.rapidapi.com"
            },
        })
        .then((response) => {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

        })
        .catch(err => {
            console.error(err);
        });
}

recipeSubmitEl.addEventListener("click", function (e) {
    e.preventDefault(); //prevent the default
    var recipeType = document.getElementById("food-type").value;
    console.log(recipeType);
    getTastyRecipes(recipeType); //we are giving getTastyRecipe the recipe Type, getTastyRecipes reads it as food. 

});

//add event listener for the pick up element by id
resultBtn.addEventListener("click", function(id){
    console.log(this);
})
    //console.log of this.value= value of button should be id //#end
    //that id number needs to feed to 
    //fetDetailsRecipe();



// getZamatoLocation();

