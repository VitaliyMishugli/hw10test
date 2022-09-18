import debounce from 'lodash.debounce';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;


const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener(
  'input',
  debounce(searchCountries, DEBOUNCE_DELAY)
);

function searchCountries(e) {
  e.preventDefault();
  let inputValue = refs.searchInput.value.trim();
  if (inputValue) {
    fetchCountries(inputValue)
      .then(res => {
        let resLen = res.length;

        if (resLen > 10) {
          Notiflix.Notify.info(
            `Too many matches found. Please enter a more specific name.`
          );
          refs.countryList.innerHTML = '';
        } else if (resLen <= 10 && resLen >= 2) {
          countriesListRender(res);
        } else if (resLen === 1) {
          // qwe(res);
          // console.log(resLen);
          // console.log(res);
          // console.log(countryRender);   
          oneCountryRender(res);
        } else if (resLen === 0) {
          refs.countryList.innerHTML = '';
          refs.countryInfo.innerHTML = '';
        }
      })
      .catch(err => {
         refs.countryList.innerHTML = '';
         refs.countryInfo.innerHTML = '';
        Notiflix.Notify.failure(`Oops, there is no country with that name.`);
      })
  }
  else {
    refs.countryList.innerHTML = '';
     refs.countryInfo.innerHTML = '';
    Notiflix.Notify.info(
      `Введіть кілька символів для пошуку країни.`
    );
  }
}

function oneCountryRender(data) {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
  let info = data[0];
  // console.log(info);
  const languages = info.languages;
  let langStr = ``;

  for (key in languages){
    langStr += `${languages[key]}, `;
  }

  let string = `<div><img src="${info.flags.svg}" width="50"/><h1>${info.name.official}</h1></div><div><h3>Capital: </h3><p>${info.capital[0]}</p></div><div><h3>Population: </h3><p>${info.population}</p></div><div><h3>Languages: </h3><p>${langStr}</p></div>`;

  console.log(string);

  refs.countryInfo.innerHTML = string;

  console.log(string);

  console.log("Розмітка зроблена");
}

function countriesListRender(data) {
  console.log("Запуск countries");
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
   let countries = data;
   const markUp = countries
     .map(country => {
       return `<li><img src="${country.flags.svg}" width="50"/><h3 class="list-h">${country.name.official}</h3></li>`;
     })
     .join('');
   refs.countryList.innerHTML = markUp;
}


