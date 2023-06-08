document.addEventListener('DOMContentLoaded', () => {
  
  loadPage();

  document.getElementById('goButton').addEventListener('click', () => {

    loadPage();

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
    });


    async function loadPage () {

      const selected =  document.getElementById('selectLeague');
      const league = selected.value;
      const title = (league === 'premierleague') ? 'Premier League' :
      (league === 'laliga') ? 'La Liga' :
      (league === 'seriea') ? 'Serie A' : league
      document.getElementById('mainTitle').innerHTML = `${title} <span>
        <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg></span>`;
    
      await getTable(league);
      await getNews(league);
    
      document.getElementById('mainTitle').innerHTML = title;
    
    }
    
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
    
        tableBody.innerHTML = ''
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

});

