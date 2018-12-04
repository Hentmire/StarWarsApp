document.body.innerHTML = "<div class='app-name'>StarHero...</div><div class='btn-container'><button type='submit' class='start-app-btn'>... find yourself!</button></div>";

document.querySelector('.start-app-btn').addEventListener('click', (e) => loadApplication(e));
function loadApplication(e) {
	e.preventDefault();

	document.querySelector('.start-app-btn').removeEventListener('click', (e) => loadApplication(e));
	document.body.innerHTML = "<div class='search-form'><form><button type='submit' id='btn'></button><input type='search' placeholder='Search your hero' id='search'></form></div><section class='heroes-section' id='heroes-section'><div class='first-hero-box'></div><div class='second-hero-box'></div><div class='slider'></div></section>";

	document.getElementById("btn").onclick = seachHero;

	getHeroesRequest('https://swapi.co/api/people/')
	.then(data => {
		console.log(data);
		let heroCount = data.count;
		let pageCount = Math.ceil(heroCount / 10);
		const heroInfo = getHeroInfo(data, 1);
		for (let i = 0; i < 5; i++) {
		  let hero = createHeroes(heroInfo, i);
		  renderHero(hero, 'first-hero-box');
		}
		for (let i = 5; i < 10; i++) {
		  let hero = createHeroes(heroInfo, i);
		  renderHero(hero, 'second-hero-box');
		}
		addSlider(pageCount);
		toggleInfo();
		return heroInfo;
	})
}

function seachHero(e) {
	e.preventDefault();
  let request = document.getElementById("search").value;

	getHeroesRequest(`https://swapi.co/api/people/?search=${request}`)
	.then(data => {
		document.querySelector('.heroes-section').innerHTML = "<div class='first-hero-box'></div><div class='second-hero-box'></div><div class='slider'></div>";
		console.log(data.count);
		if(data.count == 0) {
			console.log("bbb");
			console.log(document.querySelector('.first-hero-box'));
			document.querySelector('.first-hero-box').innerHTML = "<div><span class='error-message'>There is no hero with such name</span></div>";
		} else {
			let heroCount = data.count;
	    let pageCount = Math.ceil(heroCount / 10);
	    const heroInfo = getHeroInfo(data, 0);
	    for (let i = 0; i < heroInfo.param.length; i++) {
	      let hero = createHeroes(heroInfo, i);
	      renderHero(hero, 'first-hero-box');
	    }
			toggleInfo();
	    addSlider(pageCount);
	    return heroInfo;
		}

	})
}

function getHeroesRequest(url) {
	return fetch(url)
		.then(response => response.json())
}


function getHeroInfo(data, i) {
	const heroInfo = {
		param: data.results
	};
	let infoForStorage = JSON.stringify(heroInfo);
	localStorage.setItem(`${i}`, infoForStorage);
	return heroInfo;
}

class HeroType {
	constructor(name, gender, height, mass) {
		this.name = name;
		this.gender = gender;
		this.height = height;
		this.mass = mass;
	}
}

function createHeroes(heroInfo, i) {
	let hero = new HeroType(heroInfo.param[i].name, heroInfo.param[i].gender, heroInfo.param[i].height, heroInfo.param[i].mass);
	return hero;
}

function renderHero(hero, boxName) {
	let newHeroCard = document.createElement('div');
	newHeroCard.className = 'hero-type';
	let newHeroName = document.createElement('div');
	newHeroName.className = 'hero-name';
	newHeroName.innerHTML = `${hero.name}`;
	newHeroCard.appendChild(newHeroName);
	let newHeroInfo = document.createElement('div');
	newHeroInfo.className = 'hero-info hidden';
	newHeroInfo.innerHTML = `<table><tr><td>gender:</td><td>${hero.gender}</td></tr><tr><td>height:</td><td>${hero.height}</td></tr><tr><td>mass:</td><td>${hero.mass}</td></tr></table>`;
	newHeroCard.appendChild(newHeroInfo);
	document.querySelector(`.${boxName}`).appendChild(newHeroCard);
}

function toggleInfo() {
	const allHeroesName = document.querySelectorAll('.hero-name');
	const allHeroesCard = document.querySelectorAll('.hero-type');
	for (let i = 0; i < allHeroesName.length; i++) {
		allHeroesName[i].addEventListener('click', (e) => showInfo(i));
	}
	function showInfo(i) {
		allHeroesCard[i].querySelector('.hero-info').classList.toggle('hidden');
	}
}


function addSlider(pageCount) {
  for (let i = 1; i <= pageCount; i++) {
    let pageNumber = document.createElement('a');
    pageNumber.classList = 'page-nav';
    pageNumber.innerHTML = `${i}`;
    document.querySelector('.slider').appendChild(pageNumber);
  }
	document.querySelector('.page-nav').classList.add('current');
	let heroPages = document.querySelectorAll('.page-nav');
	for (let i = 0; i < heroPages.length; i++) {
		heroPages[i].addEventListener('click', e => {
			heroPages.forEach(item => item.classList.remove('current'));
			heroPages[i].classList.add('current');
			if (localStorage.getItem(`${i}`)) {
				let heroInfo = JSON.parse(localStorage.getItem(`${i}`));
				document.querySelector('.first-hero-box').innerHTML = '';
				document.querySelector('.second-hero-box').innerHTML = '';
				for (let i = 0; i < 5; i++) {
					let hero = createHeroes(heroInfo, i);
					renderHero(hero, 'first-hero-box');
				}
				for (let i = 5; i < 10; i++) {
					let hero = createHeroes(heroInfo, i);
					renderHero(hero, 'second-hero-box');
			}
			} else {
				getHeroesRequest(`https://swapi.co/api/people/?page=${i+1}`)
					.then(data => {
						document.querySelector('.first-hero-box').innerHTML = '';
						document.querySelector('.second-hero-box').innerHTML = '';
						const heroInfo = getHeroInfo(data, i);
						for (let i = 0; i < 5; i++) {
							let hero = createHeroes(heroInfo, i);
							renderHero(hero, 'first-hero-box');
						}
						for (let i = 5; i < 10; i++) {
							let hero = createHeroes(heroInfo, i);
							renderHero(hero, 'second-hero-box');
						}
						toggleInfo();
					})
				}
    });
  }
}
