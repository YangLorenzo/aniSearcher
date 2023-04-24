import * as AnimeApi from "./anime-api.js";

// contenitore delle anime card
const animeListContainer = document.querySelector("#anime-list-container");

const COUNT = AnimeApi.MAX_LIMIT;

const airing = { animeList: [], page: 1, hasNextPage: true };
const upcoming = { animeList: [], page: 1, hasNextPage: true };
const favorite = { animeList: [], page: 1, hasNextPage: true };
const bypopularity = { animeList: [], page: 1, hasNextPage: true };

const animeFilter = {
    airing: airing,
    upcoming: upcoming,
    favorite: favorite,
    bypopularity: bypopularity,
};

export function createDefault() {
    removeAnimeCardsFrom(0);
    appendAnimeCardsFor(COUNT);
}

export async function populateAnimeCardsForFilter(filter) {
    if (animeFilter[filter].animeList.length === 0) {
        const result = await AnimeApi.getTopAnimes(
            animeFilter[filter].page,
            filter
        );
        animeFilter[filter].animeList = result.data;
        animeFilter[filter].page++;
        animeFilter[filter].hasNextPage = result.hasNextPage;
    }
    populateAnimeCards(animeFilter[filter].animeList);
}

export function populateAnimeCardsForArray(animeList) {
    populateAnimeCards(animeList);
}

export async function expandAnimeCardsForFilter(filter) {
    if (animeFilter[filter].hasNextPage) {
        appendAnimeCardsFor(COUNT);

        let result = await AnimeApi.getTopAnimes(
            animeFilter[filter].page,
            filter
        );

        animeFilter[filter].animeList = animeFilter[filter].animeList.concat(
            result.data
        );
        animeFilter[filter].page++;
        animeFilter[filter].hasNextPage = result.hasNextPage;

        populateAnimeCards(
            animeFilter[filter].animeList,
            animeFilter[filter].animeList.length - COUNT
        );
    }
}

// ****************************************************************************************************
// ****************************************************************************************************
// helper functions
// ****************************************************************************************************
// ****************************************************************************************************

function populateAnimeCards(animeList, start = 0) {
    removeAnimeCardsFrom(animeList.length);

    // populate anime cards
    const animeCards = animeListContainer.querySelectorAll(".card");
    const MAX_TITLE_LENGTH = 18;

    let cardIndex = start;

    console.log(
        `cardIndex/start: ${cardIndex}, animeList.length: ${animeList.length}, animeCards.length: ${animeCards.length}`
    );

    animeList.slice(start, animeList.length).forEach((anime) => {
        const card = animeCards[cardIndex++];
        const img = card.querySelector("img");
        const title = card.querySelector(".card-text");

        img.src = anime.images.jpg.large_image_url;
        img.alt = anime.title;

        anime.title =
            anime.title.length > MAX_TITLE_LENGTH
                ? anime.title.substring(0, MAX_TITLE_LENGTH) + "..."
                : anime.title;
        title.innerHTML = `<strong>${anime.title}</strong>`;
    });
}

function appendAnimeCardsFor(count = COUNT) {
    // HTML TEMPLATE
    // <div class="col">
    //     <div class="card shadow-sm h-100">
    //         <img src="" alt="" class="card-img-top" />
    //         <div class="card-body">
    //             <p class="card-text"></p>
    //         </div>
    //     </div>
    // </div>
    for (let i = 0; i < count; i++) {
        const parentContainer = document.createElement("div");
        parentContainer.classList.add("col");

        parentContainer.innerHTML = `
        <div class="card shadow-sm h-100">
            <img src="" alt="" class="card-img-top" />
            <div class="card-body">
                <p class="card-text"></p>
            </div>
        </div>
        `;
        animeListContainer.appendChild(parentContainer);
    }
}

function removeAnimeCardsFrom(start) {
    const animeCards = animeListContainer.querySelectorAll(".col");

    console.log(`remove from ${start} to ${animeCards.length}`);

    for (let i = start; i < animeCards.length; i++) {
        animeCards[i].remove();
    }
}
