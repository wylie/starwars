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
      <p><strong>${type}</strong></p>
      <p>${item.title}</p>
      <p><strong>Era</strong>: ${item.era}</p>
      <p><strong>Release Year</strong>: ${item.releaseDate}</p>
      <p>${byDate}</p>
    </div>
  `)
};

// fetch the data from the json file
async function fetchData() {
  const response = await fetch('./data.json');
  const data = await response.json();
  return data;
}

// TODO: consolidate sortByReleaseDate and sortByDate functions?
// sort the data by release date
async function sortByReleaseDate() {
  const data = await fetchData();
  const sortedData = data.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
  displayData(sortedData);
}

// sort the data by BBY/ABY date
async function sortByDate() {
  const data = await fetchData();
  const sortedData = data.sort((a, b) => new Date(a.chronoDate) - new Date(b.chronoDate));
  displayData(sortedData);
}

// check the checkboxes
function checkboxCheck() {
  const starwarsElement = document.getElementById('starwars');
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
function filterData(data) {
  const swItem = document.getElementsByClassName(`sw-item ${data}`);
  checkboxCheck();
    Array.from(swItem).forEach(item => {
      item.classList.toggle("visible");
    });
}

// display the data on the page
const displayData = (data) => {
  const container = document.getElementById('starwars');
  container.innerHTML = '';
  data.forEach(item => {
    const div = document.createElement('div');
    div.className = `sw-item ${item.type}`;
    div.innerHTML = itemCard(item);
    container.appendChild(div);
  });
};

// add event listeners to the buttons
document.getElementById('release').addEventListener('click', sortByReleaseDate);
document.getElementById('chronological').addEventListener('click', sortByDate);

document.getElementById('movie').addEventListener('click', () => filterData("movie"));
document.getElementById('tvshow').addEventListener('click', () => filterData("tvshow"));
document.getElementById('book').addEventListener('click', () => filterData("book"));
document.getElementById('comic').addEventListener('click', () => filterData("comic"));
document.getElementById('videogame').addEventListener('click', () => filterData("videogame"));

// initial call to fetch and display the data
fetchData().then(sortByDate);