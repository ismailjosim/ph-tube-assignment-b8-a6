const category_items = document.getElementById('category_items')
const cardsEl = document.getElementById('cards')

// Fetch all categories data from JSON file
const fetchData = () => {
    fetch('https://openapi.programming-hero.com/api/videos/categories')
        .then((res) => res.json())
        .then((data) => {
            data?.data?.forEach((item) => {
                const li = document.createElement('li')
                li.innerHTML = `
                    <span class="text-lg font-semibold btn btn-sm bg-rbg capitalize hover:bg-primary hover:text-white rounded-md"
                        id=${ item.category_id }
                    >
                        ${ item.category }
                    </span>
                `
                // add click event to that particular li element
                li.querySelector('span').addEventListener('click', () => {
                    const categoryId = item.category_id
                    fetchDataByCategories(categoryId)
                })
                category_items.appendChild(li) // Append the created li to category_items
            })
        })
}
fetchData()

const fetchDataByCategories = (id) => {
    const categoryId = id ? id : 1000

    fetch(
        `https://openapi.programming-hero.com/api/videos/category/${ categoryId }`,
    )
        .then((res) => res.json())
        .then((data) => {




            let allCardsHTML = '' // Accumulator for all cards' HTML

            if (data?.data.length === 0) {
                return cardsEl.innerHTML = `
        <div class="flex flex-col gap-5 justify-center items-center mt-[10%]">
            <img src="./assets/error-icon.svg" alt="">
            <h3 class="text-3xl font-bold w-1/2 mx-auto text-center">
                Oops!! Sorry, There is no content here
            </h3>
        </div>`
            }



            data?.data?.forEach((item) => {
                const { verified, title, thumbnail, authors, others } = item;

                const convertedTime = convertSecondsToTime(others?.posted_date);

                // Conditionally render verified badge
                const verifiedBadge = verified
                    ? `<img src="./assets/verified.svg" alt="Verified" />`
                    : ''

                // Build the HTML for a single card
                const cardHTML = `
                    <div class="card w-full bg-base-100 shadow-2xl relative">
                            <img src="${ thumbnail }" class="max-h-40 rounded-md" alt="" />
                                 <div class="badge badge-lg rounded-lg px-3 border-black badge-primary text-white bg-black absolute top-32 right-2 ">
                                 ${ others.posted_date && convertedTime }
                                 </div>

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

                allCardsHTML += cardHTML // Accumulate card HTML
            })

            // Set the accumulated HTML to the cardsEl
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
