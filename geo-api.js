let newsButton = document.getElementById('get_news');
let currentCountry = document.getElementById('currentCountry');
newsButton.addEventListener('click', ()=> {navigator.geolocation.getCurrentPosition(showNews)});
let countries_arr = ['ae', 'ar', 'at', 'au', 'be', 'bg', 'br', 'ca', 'ch', 'cn', 'co', 'cu', 'cz', 'de', 'eg', 'fr', 'gb', 'gr', 'hk', 'hu', 'id', 'ie', 'il', 'in', 'it', 'jp', 'kr', 'lt', 'lv', 'ma', 'mx', 'my', 'ng', 'nl', 'no', 'nz', 'ph', 'pl', 'pt', 'ro', 'rs', 'ru', 'sa', 'se', 'sg', 'si', 'sk', 'th', 'tr', 'tw', 'ua', 'us', 've', 'za'];

``
function showNews(pos) {
	let crd = pos.coords;
	// let data = getCountry(crd);
	// fetch(data)
	// .then(data => console.log(data));
	let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&result_type=country&key=AIzaSyD8UePQnlJgy5tTJdYsnwVUtKE47ixtPEs`;
	console.log(url);
	const req = new Request(url);
	let country = undefined;
	fetch(req)
		.then(response => response.json())
		.then(res => {currentCountry.innerHTML = res.results[0].address_components[0].long_name;
			// add news to list
			let country_code = res.results[0].address_components[0].short_name.toLowerCase()
			if (country_code in countries_arr) {
				let url_news = `https://newsapi.org/v2/top-headlines?country=${country_code}&apiKey=46db7fdbc25e4be89dee6b0f4cbef90b`
				news_req = new Request(url_news);
				fetch(news_req)
					.then(news_json => news_json.json())
					.then(news => {
						let news_arr = news.articles;
						for (let i = 0; i < 5; i++) {
							let node = document.createElement('LI');                 // Create a <li> node
							// let textnode = document.createTextNode('Water');         // Create a text node
							// node.appendChild(textnode);                              // Append the text to <li>
							let link = document.createElement('A');
							let textnode = document.createTextNode(news_arr[i].title);
							link.appendChild(textnode);
							link.href = news_arr[i].url;
							node.appendChild(link);
							document.getElementById('news').appendChild(node);
						}
					});
			} else {
				let url_news_req = new Request(`https://newsapi.org/v2/top-headlines?country=se&apiKey=46db7fdbc25e4be89dee6b0f4cbef90b`);
				console.log('country code not in arr ' + country_code);
				document.getElementById('warning').innerHTML += 'Sorry, NewsAPI does not support news for ' + res.results[0].address_components[0].long_name;
				fetch(url_news_req)
					.then(news_json => news_json.json())
					.then(news => {
						let news_arr = news.articles;
						for (let i = 0; i < 5; i++) {
							let node = document.createElement('LI');                 // Create a <li> node
							// let textnode = document.createTextNode('Water');         // Create a text node
							// node.appendChild(textnode);                              // Append the text to <li>
							let link = document.createElement('A');
							let textnode = document.createTextNode(news_arr[i].title);
							link.appendChild(textnode);
							link.href = news_arr[i].url;
							node.appendChild(link);
							document.getElementById('news').appendChild(node);
						}
					});
			}
		});
}
