document.addEventListener('DOMContentLoaded', () => {

getNews("premierleague");

getTable("premierleague");


document.getElementById('goButton').addEventListener('click', () => {

  const selected =  document.getElementById('selectLeague');
  const league = selected.value;
  document.getElementById('mainTitle').innerText =
  (league === 'premierleague') ? 'Premier League' :
  (league === 'laliga') ? 'La Liga' :
  (league === 'seriea') ? 'Serie A' : league;

  getNews(league);
  getTable(league);
});

document.getElementById('subscriptionForm').addEventListener('submit', async (event) =>  {
  event.preventDefault();

  try {
    const response = await subscriptionReq(event.target.emailAddress.value);
    console.log(response.status)
    if (response.status === 200) {
      alert(`CONGRATULATION: ${event.target.emailAddress.value} has been successfully signed for our newsletter!`)
    }
  } catch (error) {
    console.error(error);
  }
})
});

async function getNews (league) {
  const url = `https://football98.p.rapidapi.com/${league}/news`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'a3e84bd330msheda336f89d90189p100b74jsn157ced0ce4ed',
      'X-RapidAPI-Host': 'football98.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    await createCards(result);
  } catch (error) {
    console.error(error);
  }
}

async function getTable (league) {
  const url = `https://football98.p.rapidapi.com/${league}/table`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'a3e84bd330msheda336f89d90189p100b74jsn157ced0ce4ed',
      'X-RapidAPI-Host': 'football98.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result.length);
    await createTable(result);
  } catch (error) {
    console.error(error);
  }
}

async function createTable (data) {
  
  const tableBody = document.getElementById("tableBody");
  let tableRow 
  if (data && tableBody) {
    data.forEach((row, index) => {
      tableRow = document.createElement('tr');
      tableRow.classList= (index % 2) ? "bg-gray-50 border-b" : "bg-white border-b"
      tableRow.innerHTML = `
      <td class="px-3 py-4">
      <img
        src=${row.SquadLogo}
        width="20px"
      />
    </td>
      <th
          scope="row"
          class="px-3 py-4 font-medium text-gray-900 whitespace-nowrap"
        >
          ${row.Name}
        </th>
        
        <td class="px-3 py-4 text-center">${row.Points}</td>
        <td class="px-3 py-4 text-center">${row.Played}</td>
        <td class="px-3 py-4 text-center">${row.Winned}</td>
        <td class="px-3 py-4 text-center">${row.Loosed}</td>
        <td class="px-3 py-4 text-center">${row.Tie}</td>
        <td class="px-3 py-4 text-center">${row["Goal Difference"]}</td>

      `
      tableBody.append(tableRow);
    });

    
  }

}

async function createCards (news) {

  const newsSection = document.getElementById('news')

  newsSection.innerHTML = '';

  news.forEach((row, index) => {

    newsSection.innerHTML +=  `
    <div class="border border-gray-500 hover:bg-gray-100 rounded-lg shadow">
      <a href=${row.NewsLink}>
        <img class="rounded-t-lg w-full aspect-square object-cover	" src=${row.Image} alt="" />
      </a>
    <div class="p-5">
      <a href=${row.NewsLink}>
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">${row.Title}</h5>
      </a>
      <div class="block mb-2">
        <img width="20px" height="20px" class="inline" src=${row.PublisherLogo} />
        <p class="mb-3 font-normal text-gray-700 inline">${row.PublisherName} - ${row.PublisherDate}</p>
      </div>
        <a href=${row.NewsLink}
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-center hover:text-white text-orange-600 bg-transparnt hover:bg-orange-600 rounded-lg border border-orange-600">
          Read more
          <svg aria-hidden="true" class="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
      </a>
      </div>
    </div>
    `;

  }); 
  
  
  
  }

  async function subscriptionReq(emailAddress) {
    const headers = new Headers()
  headers.append("Content-Type", "application/json")

  const body = {
    "email": emailAddress
  }

  const options = {
    method: "POST",
    headers,
    mode: "cors",
    body: JSON.stringify(body),
  }

  try {
    const res = await fetch("https://eoqtcbkhfwy3xrj.m.pipedream.net", options)
    return res  
} catch (err) {
    console.error(err)
  }
    }
