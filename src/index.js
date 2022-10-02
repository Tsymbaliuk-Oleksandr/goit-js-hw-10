import './css/styles.css';

import debounce from "lodash.debounce";
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

searchBox.addEventListener("input", debounce(inputLoad, DEBOUNCE_DELAY ));

function inputLoad(evt){
    const inputValue = evt.target.value.trim();

    if (inputValue === "") {
        clearContent ();
        return;
    }
    fetchCountries(inputValue)
    .then(data => {
        clearContent ();
        if (data.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (data.length > 2 && data.length <= 10) {
        clearContent ();
        renderUserList(data)
    } else {
        clearContent ();
        renderUserCountry(data)
    }
        // Data handling
      })
      .catch(error => {
        clearContent ();
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
};

function renderUserList(countrys) {
    const markup = countrys
      .map((country) => {
        return `<li class="country-list"><div class="country-flag-position">
        <img class="country-flag" src=${country.flags.svg} alt="flag" width='40'
        <p class="country-name">${country.name.official}</p></div>
        </li>`;
      })
      .join("");
    countryList.innerHTML = markup;
  }

  function renderUserCountry([country]) {
    const markup = `<div>
        <div class="country-flag-position">
        <img class="country-flag" src=${country.flags.svg} alt="flag" width='40'>
        <p><h1 class="country-name">${country.name.official}</h1></p>
        </div>
        <p><b>Capital: </b>${country.capital}</p>
        <p><b>Population: </b>${country.population}</p>
        <p><b>Languages: </b>${Object.values(country.languages)}</p>
        </div>`;
      
    countryInfo.innerHTML = markup;
  }

  function clearContent () {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
  