// create the visual display for the data
function itemCard(item) {
  // replace slugs with nicer titles
  let type = "";
  switch(item.type) {
    case "movie":
      type = "Movie";
      break;
    case "tvshow":
      type = "TV Show";
      break;
    case "comic":
      type = "Comic";
      break;
    case "book":
      type = "Book";
      break;
    case "videogame":
      type = "Video Game";
      break;
  }
  // remove negative sign from the BBY date
  let bbyDate = item.chronoDate;
  if(item.chronoDate < 0) {
    bbyDate = bbyDate * -1;
  }
  // format date nicer
  let byDate = "";
  switch(item.chronoDate > 0) {
    case true:
      byDate = `<strong>ABY</strong>: ${item.chronoDate} standard years`;
      break;
    case false:
      byDate = `<strong>BBY</strong>: ${bbyDate} standard years`;
      break;
    default:
      byDate = `<strong>BBY</strong>: ${bbyDate}`;
  }
  // return the card
  return (`
    <div class="card">
      <div class="card-type" title=${type}></div>
      <div class="card-title">
        <h3>${item.title}</h3>
      </div>
      <div class="card-meta">
        <p><strong>Era</strong>: ${item.era}</p>
        <p><strong>Release Year</strong>: ${item.releaseDate}</p>
        <p>${byDate}</p>
      </div>
    </div>
  `)
};

let starWarsData = [];

// fetch the data from the json file
async function fetchData() {
  const response = await fetch('./data.json');
  const data = await response.json();
  return starWarsData = data;
}

// TODO: when filtering, and you choose to resort by chrono/date, this function removes the 'visible' class, which it shouldn't do. add a check for the filters on each resort
// sort the data by release date or chronological date
async function sort(sortBy) {
  const sortedData = starWarsData.sort((a, b) => {
    if (sortBy === 'releaseDate') {
      return new Date(a[sortBy]) - new Date(b[sortBy]);
    } else {
      return a[sortBy] - b[sortBy];
    }
  });
  displayData(sortedData);
}

// check the checkboxes
const starwarsElement = document.getElementById('starwars');
function checkboxCheck() {
  const checkboxes = document.querySelectorAll('.checkbox');
  let checked = [];
  checkboxes.forEach(function(elem) {
    checked.push(elem.checked);
  });
  // TODO: refactor to be cleaner
  if(!checked.includes(true)) {
    starwarsElement.classList.remove('filtered');
  } else {
    starwarsElement.classList.add('filtered');
  }
}

// do the filtering
function filterData(filterBy) {
  const swItem = document.getElementsByClassName(`sw-item ${filterBy}`);
  checkboxCheck();
  Array.from(swItem).forEach(item => {
    item.classList.toggle("visible");
  });
}

// display the data on the page
const displayData = (starWarsData) => {
  starwarsElement.innerHTML = '';
  starWarsData.forEach(item => {
    const div = document.createElement('div');
    div.className = `sw-item ${item.type}`;
    div.innerHTML = itemCard(item);
    starwarsElement.appendChild(div);
  });
};

// add event listeners
document.getElementById('release').addEventListener('click', () => sort("releaseDate"));
document.getElementById('chronological').addEventListener('click', () => sort("chronoDate"));
document.getElementById('movie').addEventListener('click', () => filterData("movie"));
document.getElementById('tvshow').addEventListener('click', () => filterData("tvshow"));
document.getElementById('book').addEventListener('click', () => filterData("book"));
document.getElementById('comic').addEventListener('click', () => filterData("comic"));
document.getElementById('videogame').addEventListener('click', () => filterData("videogame"));

// initial call to fetch and display data
fetchData().then(() => sort("chronoDate"));