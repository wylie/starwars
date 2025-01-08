async function fetchData() {
  const response = await fetch('./data.json');
  const data = await response.json();
  return data;
}

async function sortByReleaseDate() {
  const data = await fetchData();
  const sortedData = data.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
  displayData(sortedData);
}

async function sortByDate() {
  const data = await fetchData();
  const sortedData = data.sort((a, b) => new Date(a.byDate) - new Date(b.byDate));
  displayData(sortedData);
}

const displayData = (data) => {
  const container = document.getElementById('starwars');
  container.innerHTML = '';
  data.forEach(item => {
    const div = document.createElement('div');
    div.className = `sw-item ${item.type}`;
    div.innerHTML = `<p>${item.title}</p><p>${item.releaseDate}</p>`;
    container.appendChild(div);
  });
};

document.getElementById('release').addEventListener('click', sortByReleaseDate);
document.getElementById('chronological').addEventListener('click', sortByDate);

fetchData().then(sortByReleaseDate);