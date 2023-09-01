const category_items = document.getElementById('category_items')
const cardsEl = document.getElementById('cards');
const emptyContentEl = document.getElementById('empty-content')



// Fetch all categories data from JSON file
const fetchData = () => {
    fetch('https://openapi.programming-hero.com/api/videos/categories')
        .then((res) => res.json())
        .then((data) => {
            data?.data?.forEach((item) => {
                const li = document.createElement('li');
                const span = document.createElement('span');
                span.className = 'text-lg font-semibold btn btn-sm bg-rbg capitalize hover:bg-primary hover:text-white rounded-md';
                span.id = item.category_id;
                span.textContent = item.category;
                li.appendChild(span);

                // add click event to that particular span element
                span.addEventListener('click', () => {
                    const categoryId = item.category_id;
                    fetchDataByCategories(categoryId);
                });

                category_items.appendChild(li); // Append the created li to category_items
            });
        });
};




const fetchDataByCategories = (id) => {

    const categoryId = id ? id : 1000;
    fetch(
        `https://openapi.programming-hero.com/api/videos/category/${ categoryId }`,
    )
        .then((res) => res.json())
        .then((data) => {
            data?.data.sort((a, b) => {
                const totalViewsStrFirst = a.others?.views;
                const totalViewsStrSecond = b.others?.views;
                const viewFirst = parseFloat(totalViewsStrFirst.replace("K", "")) || 0;
                const viewSecond = parseFloat(totalViewsStrSecond.replace("K", "")) || 0;
                return viewSecond - viewFirst;
            })

            let allCardsHTML = '';
            if (data?.data.length === 0) {
                emptyContentEl.classList.remove('hidden')
            } else {
                emptyContentEl.classList.add('hidden')
            }


            data?.data?.forEach((item) => {



                const { verified, title, thumbnail, authors, others } = item;

                let convertedTime;
                if (others?.posted_date) {
                    convertedTime = convertSecondsToTime(others?.posted_date);
                }
                // Conditionally render verified badge
                const verifiedBadge = verified
                    ? `<img src="./assets/verified.svg" alt="Verified" />`
                    : ''

                // Build the HTML for a single card
                const cardHTML = `
            <div class="card w-full bg-base-100 shadow-2xl relative">
                <img src="${ thumbnail }" class="max-h-40 rounded-md" alt="" />
                ${ convertedTime ? `
                <div
                    class="badge badge-lg rounded-lg px-3 border-black badge-primary text-white bg-black absolute top-32 right-2">
                    ${ convertedTime }
                </div>` : '' }
                <div class="card-body flex-row gap-5 px-5">
                    <div>
                        <img class="w-16 h-16 rounded-full" src="${ authors[0].profile_picture }" alt="">
                    </div>
                    <div>
                        <h2 class="text-base font-semibold">
                            ${ title }
                        </h2>
                        <h3 class="flex gap-2 items-center py-2">
                            <span>${ authors[0].profile_name }</span>
                            ${ verifiedBadge }
                        </h3>
                        <p>${ others.views } Views</p>
                    </div>
                </div>
            </div>
            `
                allCardsHTML += cardHTML
            })
            cardsEl.innerHTML = allCardsHTML
        })
}

fetchDataByCategories()


// convert time to formatted way
function convertSecondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const hoursText = hours > 0 ? `${ hours }hr${ hours > 1 ? 's' : '' }` : '';
    const minutesText = minutes > 0 ? `${ minutes }min` : '';

    return `${ hoursText } ${ minutesText } ago`;
}

// Sort By View Button function
const sortViewBtn = document.querySelector("#sortViewBtn");
sortViewBtn.addEventListener('click', () => {
    let sortByDate = false;
    sortByDate = !sortByDate;
    // fetchDataByCategories(null, sortByDate);
})



fetchData();
