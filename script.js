document.addEventListener('DOMContentLoaded', function() {
    function fetchBeerData() {
        return fetch('beers.html')
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(data, 'text/html');
                const beerData = htmlDoc.querySelectorAll('.beer');
                return Array.from(beerData).map(beer => ({
                    name: beer.dataset.name,
                    img: beer.dataset.img,
                    style: beer.dataset.style,
                    flavour: beer.dataset.flavour,
                    ABV: beer.dataset.abv,
                    details: beer.dataset.details
                }));
            });
    }

    const beerList = document.getElementById('beer-list');
    const detailsSection = document.getElementById('details');
    const beerDetails = document.getElementById('beer-details');

    function displayBeers(beers) {
        beerList.innerHTML = '';
        beers.forEach(beer => {
            const beerItem = document.createElement('div');
            beerItem.classList.add('beer-item');
            beerItem.innerHTML = `
                <img src="${beer.img}" alt="${beer.name}">
                <h3>${beer.name}</h3>
                <p>${beer.flavour}</p>
                <button onclick="showDetails('${beer.name}')">View More</button>
            `;
            beerList.appendChild(beerItem);
        });
    }

    window.showDetails = function(beerName) {
        const beer = allBeers.find(b => b.name === beerName);
        beerDetails.innerHTML = `
            <img src="${beer.img}" alt="${beer.name}">
            <h3>${beer.name}</h3>
            <p>Style: ${beer.style}</p>
            <p>Flavour: ${beer.flavour}</p>
            <p>ABV: ${beer.ABV}</p>
            <p>${beer.details}</p>
        `;
        detailsSection.style.display = 'block';
        beerList.style.display = 'none';
    }

    window.goBack = function() {
        detailsSection.style.display = 'none';
        beerList.style.display = 'flex';
    }

    // Fetch beer data and display on page load
    fetchBeerData().then(beers => {
        allBeers = beers;
        // Check if on Home page or Discover page
        const homePage = window.location.pathname.includes('index.html');
        if (homePage) {
            // Display only top-selling beers on Home page
            const topSellingBeers = allBeers.filter(beer => beer.name === 'Golden Lager' || beer.name === 'Chocolate Stout');
            displayBeers(topSellingBeers);
        } else {
            // Display all beers on Discover page
            displayBeers(allBeers);
        }
    }).catch(error => {
        console.error('Error fetching beer data:', error);
    });


    
});
