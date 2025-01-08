// create the visual display for the data
function itemCard(item) {
  return (`
    <p>${item.type}</p>
    <p>${item.title}</p>
    <p>Era: ${item.era}</p>
    <p>Release Year: ${item.releaseDate}</p>
    <p>${item.byDate >= 0 ? "ABY: " : "BBY: "}${item.byDate}</p>
  `)
};

// fetch the data from the json file
async function fetchData() {
  const response = await fetch('./data.json');
  const data = await response.json();
  return data;
}

// sort the data by release date
async function sortByReleaseDate() {
  const data = await fetchData();
  const sortedData = data.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
  displayData(sortedData);
}

// sort the data by BBY/ABY date
async function sortByDate() {
  const data = await fetchData();
  const sortedData = data.sort((a, b) => new Date(a.byDate) - new Date(b.byDate));
  displayData(sortedData);
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

// initial call to fetch and display the data
fetchData().then(sortByReleaseDate);