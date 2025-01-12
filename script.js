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
      byDate = `<strong>ABY:&nbsp;</strong>${item.chronoDate} standard years`;
      break;
    case false:
      byDate = `<strong>BBY:&nbsp;</strong>${bbyDate} standard years`;
      break;
    default:
      byDate = `<strong>BBY:&nbsp;</strong>${bbyDate}`;
  }
  // return the card
  return (`
    <div class="card">
      <div class="card-type" title=${type}></div>
      <div class="card-title">
        <h3>${item.title}</h3>
      </div>
      <div class="card-meta">
        <p><strong>Era:&nbsp;</strong>${item.era}</p>
        ${item.pages ? `<p><strong>Pages:&nbsp;</strong>${item.pages}</p>` : ""}
        ${item.category ? `<p><strong>Category:&nbsp;</strong>${item.category}</p>` : ""}
        ${item.platforms ? `<p><strong>Platforms:&nbsp;</strong>${item.platforms}</p>` : ""}
        ${item.director ? `<p><strong>Director:&nbsp;</strong>${item.director}</p>` : ""}
        ${item.developer ? `<p><strong>Developer:&nbsp;</strong>${item.developer}</p>` : ""}
        <p><strong>Release Year:&nbsp;</strong>${item.releaseDate}</p>
        <p>${byDate}</p>
      </div>
    </div>
  `)
};

// fetch the data from the json file
let data = [];
async function fetchData() {
  try {
    const response = await fetch('./data.json');
    const jsonData = await response.json();
    
    data = [...data, ...jsonData];
    // console.log('Fetched data:', data); // Log fetched data
  }
  catch (error) {
    console.error(error);
  }
}

// check the checkboxes
function checkboxCheck() {
  let checked = [];
  const checkboxes = document.querySelectorAll('.checkbox');
  checkboxes.forEach(function(elem) {
    checked.push({ id: elem.id, checked: elem.checked });
  });
  data.forEach(item => {
    const checkbox = checked.find(elem => elem.id === item.type);
    item.visible = checkbox ? checkbox.checked : false;
  });
  drawPage(data);
  return checked;
}

// sort the data by release or chronological date
// TODO: when you filter, then sort, then add another filter, the new
// data is not sorted correctly, it's applied to the end of the list
function sortData(sortBy) {
  checkboxCheck(); // Ensure visibility is updated before sorting
  const sortedData = data.filter(item => item.visible).sort((a, b) => {
    if (sortBy === 'releaseDate') {
      return new Date(a[sortBy]) - new Date(b[sortBy]);
    } else {
      return a[sortBy] - b[sortBy];
    }
  });
  drawPage(sortedData);
}

// display the data on the page
const drawPage = (data) => {
  const starwarsElement = document.getElementById('starwars');
  starwarsElement.innerHTML = '';
  data.forEach(item => {
    const div = document.createElement('div');
    div.className = `sw-item ${item.type} ${item.visible ? 'visible' : ''}`;
    div.innerHTML = itemCard(item);
    starwarsElement.appendChild(div);
  });
};

// initial call to fetch and display data
fetchData().then(() => {
  // read from the HTML so we don't have to change this in two places
  let sortBy = "";
  const radios = document.querySelectorAll('.radio');
  radios.forEach(radio => {
    if(radio.checked) {
      sortBy = radio.id;
    }
  });
  sortData(sortBy);
  // event listeners
  document.getElementById('releaseDate').addEventListener('change', () => sortData("releaseDate"));
  document.getElementById('chronoDate').addEventListener('change', () => sortData("chronoDate"));
  document.getElementById('movie').addEventListener('change', () => checkboxCheck("movie"));
  document.getElementById('tvshow').addEventListener('change', () => checkboxCheck("tvshow"));
  document.getElementById('book').addEventListener('change', () => checkboxCheck("book"));
  document.getElementById('comic').addEventListener('change', () => checkboxCheck("comic"));
  document.getElementById('videogame').addEventListener('change', () => checkboxCheck("videogame"));
});