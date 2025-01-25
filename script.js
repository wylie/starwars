// create the visual display for the data
function itemCard(item) {
  // replace slugs with nicer titles
  let type = "";
  let typeIcon = "";
  switch(item.type) {
    case "movie":
      type = "Movie";
      typeIcon = "movie";
      break;
    case "tvshow":
      type = "TV Show";
      typeIcon = "tv_gen";
      break;
    case "comic":
      type = "Comic";
      typeIcon = "comic_bubble";
      break;
    case "book":
      type = "Book";
      typeIcon = "book_2";
      break;
    case "videogame":
      type = "Video Game";
      typeIcon = "stadia_controller";
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
      byDate = `<strong class="aby-bby-help" title="After the Battle of Yavin">ABY:&nbsp;</strong>${item.chronoDate} standard years`;
      break;
    case false:
      byDate = `<strong class="aby-bby-help" title="Before the Battle of Yavin">BBY:&nbsp;</strong>${bbyDate} standard years`;
      break;
    default:
      byDate = `<strong class="aby-bby-help" title="Before the Battle of Yavin">BBY:&nbsp;</strong>${bbyDate}`;
      break;
  }
  let catTitle = "";
  switch(item.category) {
    case "ON":
      catTitle = "Original novel";
      break;
    case "OJR":
      catTitle = "Original junior novel";
      break;
    case "YA":
      catTitle = "Young adult novel";
      break;
    case "YR":
      catTitle = "Young reader";
      break;
    case "NA":
      catTitle = "Novel adaptation";
      break;
    case "JRA":
      catTitle = "Junior novel adaptation";
      break;
    case "S":
      catTitle = "Script book";
      break;
  }
  // have to confirm these dates, I'm seeing conflicting ones in different places
  // let eraTitle = "";
  // switch(item.era) {
  //   case "Dawn Of The Jedi":
  //     eraTitle = "37,000 - 25,000 BBY";
  //     break;
  //   case "The Old Republic":
  //     eraTitle = "25,000 – 1,000 BBY";
  //     break;
  //   case "The High Republic":
  //     eraTitle = "300 – 82 BBY";
  //     break;
  //   case "Fall of the Jedi":
  //     eraTitle = "82 – 19 BBY";
  //     break;
  //   case "Reign of the Empire":
  //     eraTitle = "82 BBY – 19 BBY";
  //     break;
  //   case "Age of Rebellion":
  //     eraTitle = "0 BBY – 4 ABY";
  //     break;
  //   case "The New Republic":
  //     eraTitle = "5 ABY – 34 ABY";
  //     break;
  //   case "Rise of the First Order":
  //     eraTitle = "34 ABY – 35 ABY";
  //     break;
  //   case "35 ABY and Beyond":
  //     eraTitle = "Script book";
  //     break;
  // }

  // return the card
  return (`
    <div class="card">
      <div class="card-type icon material-symbols-outlined" title=${type}>${typeIcon}</div>
      <div class="card-title">
        <h3>${item.title}</h3>
        ${item.description ? `<p><strong>Description:&nbsp;</strong>${item.description}</p>` : ""}
        ${item.director ? `<p><strong>Director:&nbsp;</strong>${item.director}</p>` : ""}
        ${item.author ? `<p><strong>Author:&nbsp;</strong>${item.author}</p>` : ""}
        ${item.writer ? `<p><strong>Writer:&nbsp;</strong>${item.writer}</p>` : ""}
        ${item.creator ? `<p><strong>Creator:&nbsp;</strong>${item.creator}</p>` : ""}
        ${item.developer ? `<p><strong>Developer:&nbsp;</strong>${item.developer}</p>` : ""}
        ${item.synopsis ? `
        <div class="synopsis">
          <p><strong>Synopsis:&nbsp;</strong>${item.synopsis}</p>
          <button class="material-symbols-outlined resize" title="expand">expand_all</button>
        </div>` : ""}
      </div>
      <div class="card-meta">
        ${item.era ? `<p><strong>Era:&nbsp;</strong>${item.era}</p>` : ""}
        ${item.series ? `<p><strong>Series:&nbsp;</strong>${item.series}</p>` : ""}
        ${item.issues ? `<p><strong>Issues:&nbsp;</strong>${item.issues}</p>` : ""}
        ${item.pages ? `<p><strong>Pages:&nbsp;</strong>${item.pages}</p>` : ""}
        ${item.platforms ? `<p><strong>Platforms:&nbsp;</strong>${item.platforms}</p>` : ""}
        ${item.episodes ? `<p><strong>Episodes:&nbsp;</strong>${item.episodes}</p>` : ""}
        ${item.length ? `<p><strong>Length:&nbsp;</strong>${item.length} minutes</p>` : ""}
        ${item.category ? `<p><strong>Category:&nbsp;</strong><span class="cat-help" title="${catTitle}">${item.category}</span></p>` : ""}
        ${item.rating ? `<p><strong>Rating:&nbsp;</strong>${item.rating}</p>` : ""}
        ${item.releaseDate ? `<p><strong>Release Year:&nbsp;</strong>${new Date(item.releaseDate).getFullYear()}</p>` : ""}
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
// TODO: be able to sort alphabetically by title
// TODO: add reverse to sort button
function sortData(sortBy) {
  // ensure visibility is updated before sorting
  checkboxCheck();
  const sortedData = data.sort((a, b) => {
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

function expandCollapse(elem) {
  const synopsis = elem.parentElement;
  elem.innerHTML = elem.innerHTML === "expand_all" ? "collapse_all" : "expand_all";
  elem.setAttribute('title', elem.innerHTML === "expand_all" ? "expand" : "collapse");
  synopsis.classList.toggle('expanded');
}

// expand/collapse the synopsis
function attachEventListeners() {
  const resize = document.getElementsByClassName('resize');
  Array.from(resize).forEach(function(elem) {
    elem.addEventListener('click', function() {
      expandCollapse(this);
    });
  });
}

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

  document.querySelectorAll('.checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      checkboxCheck(this.id);
      attachEventListeners();
    });
  });

  // expand/collapse the synopsis
  attachEventListeners();
});