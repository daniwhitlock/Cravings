let restaurantBoxEl = document.querySelector("#restaurant-box");
let restaurantSubmitEl = document.querySelector("#restaurant-form");
let cityInputEl = document.querySelector("#city");
let foodTypeEl = document.querySelector("#foodtype");
let resFoodType;
var recipeSubmitEl = document.getElementById("recipe-btn"); //querySelector grabs the first one- getElementById is more specific- don't need hashtag for getElementById- you do for querySelector
var resultsEl = document.getElementById("recipe-box");
var favoriteRecipes = [];
var savedFavoriteRecipesEl = document.getElementById("favorite-recipes");
var myFavoriteRecipesEl = document.getElementById("fav-recipes");

let modalEl = document.querySelector("#modal1");
let modalBodyEl = document.querySelector("#modal-body");
let instance = M.Modal.init(modalEl);

function getZamatoLocation() {
  let apiUrl =
    "https://developers.zomato.com/api/v2.1/locations?query=" +
    cityInputEl.value +
    "&count=10";

  fetch(apiUrl, {
    headers: {
      "user-key": "d1e1f6cd33def7c3ba28f54a2d380f20",
    },
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      console.log(data);

      let locSearchResults = data.location_suggestions;
      console.log(locSearchResults);

      // this endpoint responds with 10 matches for the location search; this for-loop creates a button for all 10 so users can select a specific one; the entity_id for each location is stored in the HTML data-entity-id attribute for later use (needed for other endpoints)

      if (locSearchResults.length > 1) {
        if (restaurantSubmitEl.children[5]) {
          restaurantSubmitEl.children[5].remove();
        }
        modalBodyEl.innerHTML = "";
        for (let i = 0; i < locSearchResults.length; i++) {
          let locButton = document.createElement("button");
          locButton.textContent = locSearchResults[i].title;
          locButton.classList = "btn-flat loc-button";
          locButton.setAttribute(
            "data-entity-type",
            locSearchResults[i].entity_type
          );

          if (
            locSearchResults[i].entity_type === "subzone" ||
            locSearchResults[i].entity_type === "group" ||
            locSearchResults[i].entity_type === "zone"
          ) {
            locButton.setAttribute(
              "data-entity-id",
              locSearchResults[i].entity_id
            );
          } else if (locSearchResults[i].entity_type === "city") {
            locButton.setAttribute(
              "data-entity-id",
              locSearchResults[i].city_id
            );
          } else {
            console.log("entity_type unaccounted for (Option " + i + ")");
          }

          modalBodyEl.appendChild(locButton);
        }
        instance.open();
      } else if (locSearchResults.length === 1) {
        if (restaurantSubmitEl.children[5]) {
          restaurantSubmitEl.children[5].remove();
        }
        if (
          locSearchResults[0].entity_type === "subzone" ||
          locSearchResults[0].entity_type === "group" ||
          locSearchResults[0].entity_type === "zone"
        ) {
          var entityId = locSearchResults[0].entity_id;
          var entityType = locSearchResults[0].entity_type;
        } else {
          var entityId = locSearchResults[i].city_id;
          var entityType = locSearchResults[i].entity_type;
        }

        let restaurantUrl =
          "https://developers.zomato.com/api/v2.1/search?entity_id=" +
          entityId +
          "&entity_type=" +
          entityType +
          "&count=10&cuisines=" +
          resFoodType +
          "&sort=rating&order=desc";

        getZamatoRestaurants(restaurantUrl);
      } else {
        let searchError = document.createElement("p");
        searchError.textContent =
          "No locations found. Please try another search.";
        restaurantSubmitEl.appendChild(searchError);
      }
    });
}

function getZamatoRestaurants(restaurantUrl) {
  fetch(restaurantUrl, {
    headers: {
      "user-key": "d1e1f6cd33def7c3ba28f54a2d380f20",
    },
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      console.log(data);

      let resInfo = [];

      // pertinent data here is buried deep in nested objects, this merely eases future references to this data
      // Zamato provides quite a bit of info for each restaurant, we can figure out what data to display on the cards
      for (let i = 0; i < data.restaurants.length; i++) {
        resInfo.push({
          resName: data.restaurants[i].restaurant.name,
          address: data.restaurants[i].restaurant.location.address,
          phone: data.restaurants[i].restaurant.phone_numbers,
          website: data.restaurants[i].restaurant.url,
          score: data.restaurants[i].restaurant.user_rating.aggregate_rating,
          rating: data.restaurants[i].restaurant.user_rating.rating_text,
          hours: data.restaurants[i].restaurant.timings,
          menu: data.restaurants[i].restaurant.menu_url,
        });
      }

      console.log(resInfo);

      restaurantBoxEl.innerHTML = "";
      // this for loop creates a materialize.css card for each restaurant and appends it to the page
      if (resInfo.length === 0) {
        let resSearchError = document.createElement("p");
        resSearchError.textContent = "No restaurants found in this area.";
        restaurantBoxEl.appendChild(resSearchError);
      } else {
        for (let i = 0; i < resInfo.length; i++) {
          let resCardEl = document.createElement("div");
          resCardEl.classList = "card res-card";
          console.log(resInfo.redId);

          let cardTitleEl = document.createElement("span");
          cardTitleEl.classList = "card-title";
          cardTitleEl.textContent = resInfo[i].resName;

          let cardBodyEl = document.createElement("div");
          cardBodyEl.classList = "card-content";

          let cardListEl = document.createElement("ul");
          cardListEl.innerHTML =
            "<li>" +
            resInfo[i].address +
            "</li><li>" +
            resInfo[i].phone +
            "</li><li>Rating: " +
            resInfo[i].score +
            ", " +
            resInfo[i].rating +
            "</li>";

          let cardActionEl = document.createElement("div");
          cardActionEl.classList = "card-action";

          let menuLinkEl = document.createElement("a");
          menuLinkEl.classList = "res-link teal lighten-2 btn";
          menuLinkEl.setAttribute("href", resInfo[i].menu);
          menuLinkEl.setAttribute("target", "_blank");
          menuLinkEl.innerHTML =
            "<i class='material-icons'>restaurant_menu</i>&nbsp;View Menu";

          let directionEl = document.createElement("a");
          directionEl.classList = "res-link red lighten-2 btn";
          directionEl.setAttribute(
            "href",
            new URL(
              "https://www.google.com/maps/dir/?api=1&destination=" +
                resInfo[i].address
            )
          );
          directionEl.setAttribute("target", "_blank");
          directionEl.innerHTML =
            "<i class='material-icons'>directions</i>&nbsp;Get Directions";

          resCardEl.appendChild(cardTitleEl);
          cardBodyEl.appendChild(cardListEl);
          cardActionEl.appendChild(menuLinkEl);
          cardActionEl.appendChild(directionEl);
          resCardEl.appendChild(cardBodyEl);
          resCardEl.appendChild(cardActionEl);
          restaurantBoxEl.appendChild(resCardEl);
        }
        restaurantBoxEl.scrollIntoView();
      }
    });
}

function locationClickHandler(event) {
  if (
    event.target.className === "btn-flat loc-button" &&
    event.target.getAttribute("data-entity-id")
  ) {
    let entityId = event.target.getAttribute("data-entity-id");
    let entityType = event.target.getAttribute("data-entity-type");

    let restaurantUrl =
      "https://developers.zomato.com/api/v2.1/search?entity_id=" +
      entityId +
      "&entity_type=" +
      entityType +
      "&count=10&cuisines=" +
      resFoodType +
      "&sort=rating&order=desc";

    instance.close();
    getZamatoRestaurants(restaurantUrl);
    getTastyRecipes(resFoodType);
  }
}

// end zamato API function

//start tasty API functions

function getTastyRecipes() {
  fetch(
    "https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&tags=italian",
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
    });
}

getTastyRecipes();

// event listener for location list buttons
restaurantBoxEl.addEventListener("click", locationClickHandler);

//dropdown menu functionality
$(document).ready(function () {
  $("select").formSelect();
});

function getTastyRecipes(food) {
  fetch(
    "https://tasty.p.rapidapi.com/recipes/list?from=0&size=10&tags=" + food,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": "985a36d33dmshfdc1a7657391b13p1bfc40jsn5520680f306f",
        "x-rapidapi-host": "tasty.p.rapidapi.com",
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      var results = data.results;
      // console.log(results);
      resultsEl.innerHTML = ""; //remove search on page
      for (var i = 0; i < results.length; i++) {
        // console.log(results);
        var recipeId = results[i].id;
        // console.log(recipeId);

        var videoUrl = results[i].original_video_url;
        var col = document.createElement("div");
        col.setAttribute("class", "col");

        var card = document.createElement("div");
        card.setAttribute("class", "card");

        // add title = recipe name
        var cardContent = document.createElement("div");
        cardContent.setAttribute("class", "card-content");
        var spanCardContent = document.createElement("span");
        spanCardContent.setAttribute("class", "card-title");
        var recipeName = results[i].name;
        spanCardContent.textContent = recipeName;

        // add image of recipe
        var imageCard = document.createElement("img");
        imageCard.setAttribute("src", results[i].thumbnail_url);
        imageCard.setAttribute("width", "150px");

        // append image and recipe name/title to card
        cardContent.appendChild(spanCardContent);
        card.appendChild(cardContent);
        card.appendChild(imageCard);

        // make button for go to recipe and add to favorites and append to page
        var goToDiv = document.createElement("div");
        var resultBtn = document.createElement("button");
        resultBtn.classList.add(
          "recipe-id",
          "waves-effect",
          "waves-light",
          "btn",
          "button-margins"
        );
        resultBtn.textContent = "Go to recipe video";
        resultBtn.value = recipeId;
        resultBtn.setAttribute("data-url", videoUrl); //assigning videoUrl to button
        goToDiv.appendChild(resultBtn);
        card.appendChild(goToDiv);

        var cardBtnDiv2 = document.createElement("div");
        var addFavoritesBtn = document.createElement("button");
        addFavoritesBtn.classList.add(
          "recipe-id",
          "waves-effect",
          "waves-light",
          "btn",
          "button-margins"
        );
        addFavoritesBtn.setAttribute("data-name", results[i].name);
        addFavoritesBtn.setAttribute("data-img", results[i].thumbnail_url);
        addFavoritesBtn.setAttribute("data-video", videoUrl);
        addFavoritesBtn.setAttribute("data-id", results[i].id);
        addFavoritesBtn.textContent = "Add to Favorites";
        cardBtnDiv2.appendChild(addFavoritesBtn);
        card.appendChild(cardBtnDiv2);

        col.appendChild(card);
        resultsEl.appendChild(col);

        resultBtn.addEventListener("click", (e) => {
          // console.log(e.target.value);
          // console.log(e);
          // console.log(e.target.getAttribute("data-url")); //need getAttribute with data-url
          window.open(e.target.getAttribute("data-url"), "_blank");
        });

        // add to favorites event listener
        addFavoritesBtn.addEventListener("click", function (e) {
          var object = {
            recipeName: e.target.dataset.name,
            recipeImage: e.target.dataset.img,
            recipeVideo: e.target.dataset.video,
            recipeId: e.target.dataset.id,
          };
          console.log(object);
          var index = favoriteRecipes.findIndex(
            (obj) => obj.recipeId === object.recipeId
          );
          console.log(index);
          favoriteRecipes =
            JSON.parse(localStorage.getItem("savedRecipes")) || [];
          console.log(favoriteRecipes);

          console.log(favoriteRecipes.indexOf(object));
          if (object === favoriteRecipes[0]) {
            console.log("YES");
          } else {
            console.log("NO");
          }
          if (favoriteRecipes.indexOf(object) === -1) {
            console.log("It wasn't in there");
            favoriteRecipes.push(object);
            console.log(favoriteRecipes);
            var recipeString = JSON.stringify(favoriteRecipes);
            localStorage.setItem("savedRecipes", recipeString);
          }
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

recipeSubmitEl.addEventListener("click", function (e) {
  e.preventDefault(); //prevent the default
  var recipeTypeInput = document.getElementById("food-type").value;
  // console.log(recipeTypeInput);
  var recipeType = recipeTypeInput.toLowerCase();
  getTastyRecipes(recipeType); // we are giving getTastyRecipe the recipeType, getTastyRecipes reads it as food.
});

restaurantSubmitEl.addEventListener("submit", function (e) {
  e.preventDefault();
  resFoodType = foodTypeEl.value;
  getZamatoLocation();
});

// add to My Favorites Page
function displayRecipeLocalStorage() {
  // Get items from local storage
  var recipes = JSON.parse(localStorage.getItem("savedRecipes"));
  console.log(recipes);

  for (var i = 0; i < recipes.length; i++) {
    //make variables for recipe name, image, and video url
    var recipeFavName = recipes[i].recipeName;
    // console.log(recipeFavName);
    var recipeFavImage = recipes[i].recipeImage;
    // console.log(recipeFavImage);
    var recipeFavVideo = recipes[i].recipeVideo;
    // console.log(recipeFavVideo);

    // Make
    var col = document.createElement("div");
    col.setAttribute("class", "col");
    var card = document.createElement("div");
    card.setAttribute("class", "card");

    // add title/name
    var cardContent = document.createElement("div");
    cardContent.setAttribute("class", "card-content");
    var spanCardContent = document.createElement("span");
    spanCardContent.setAttribute("class", "card-title");
    spanCardContent.textContent = recipeFavName;

    // add image of recipe
    var imageCard = document.createElement("img");
    imageCard.setAttribute("src", recipeFavImage);
    imageCard.setAttribute("width", "150px");

    // append image and recipe name/title to card
    cardContent.appendChild(spanCardContent);
    card.appendChild(cardContent);
    card.appendChild(imageCard);

    // make button for go to recipe and add to favorites and append to page
    var goToDiv = document.createElement("div");
    var resultBtn = document.createElement("button");
    resultBtn.classList.add(
      "recipe-id",
      "waves-effect",
      "waves-light",
      "btn",
      "button-margins"
    );
    resultBtn.textContent = "Go to recipe video";
    resultBtn.setAttribute("data-url", recipeFavVideo);
    goToDiv.appendChild(resultBtn);
    card.appendChild(goToDiv);

    col.appendChild(card);
    myFavoriteRecipesEl.appendChild(col);
  }
}

// event listener for location list buttons
modalEl.addEventListener("click", locationClickHandler);
displayRecipeLocalStorage();
