// global variables for important DOM elements, feel free to extend list as needed
let restaurantBoxEl = document.querySelector("#restaurant-box");

function getZamatoLocation() {
  let apiUrl =
    "https://developers.zomato.com/api/v2.1/locations?query=Provo&count=10";

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
      // buttons are currently put under top restaurants for testing, best UI may be in a modal?
      for (let i = 0; i < locSearchResults.length; i++) {
        let locButton = document.createElement("button");
        locButton.textContent = locSearchResults[i].title;
        locButton.classList = "btn";
        locButton.setAttribute("data-entity-id", locSearchResults[i].entity_id);

        restaurantBoxEl.appendChild(locButton);
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
          resId: data.restaurants[i].restaurant.R.res_id, // needed to get menu
        });
      }

      console.log(resInfo);

      restaurantBoxEl.innerHTML = "";
      // this for loop creates a materialize.css card for each restaurant and appends it to the page
      for (let i = 0; i < resInfo.length; i++) {
        let resCardEl = document.createElement("div");
        resCardEl.classList = "card blue-grey darken-1 card-content white-text";

        let cardTitleEl = document.createElement("span");
        cardTitleEl.classList = "card-title";
        cardTitleEl.textContent = resInfo[i].resName;

        let cardBodyEl = document.createElement("ul");
        cardBodyEl.innerHTML =
          "<li>" +
          resInfo[i].address +
          "</li><li>" +
          resInfo[i].phone +
          "</li><li>Rating: " +
          resInfo[i].score +
          ", " +
          resInfo[i].rating +
          "</li>";

        resCardEl.appendChild(cardTitleEl);
        resCardEl.appendChild(cardBodyEl);
        restaurantBoxEl.appendChild(resCardEl);
      }
    });
}

function locationClickHandler(event) {
  if (
    event.target.className !== "btn" ||
    !event.target.getAttribute("data-entity-id")
  ) {
    return;
  }

  let entityId = event.target.getAttribute("data-entity-id");

  let restaurantUrl =
    "https://developers.zomato.com/api/v2.1/search?entity_id=" +
    entityId +
    "&entity_type=subzone&count=10&cuisines=55&sort=rating&order=desc";

  getZamatoRestaurants(restaurantUrl);
}

// end zamato API functions

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

getZamatoLocation();
getTastyRecipes();

// event listener for location list buttons
restaurantBoxEl.addEventListener("click", locationClickHandler);
