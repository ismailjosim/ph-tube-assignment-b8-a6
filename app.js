const category_items = document.getElementById('category_items');
const cardsEl = document.getElementById('cards');




// Fetch all categories data from JSON file
const fetchData = () => {
    fetch('./U-tube-categories.json')
        .then(res => res.json())
        .then(data => {
            data.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="text-lg font-semibold btn btn-sm bg-rbg capitalize hover:bg-primary hover:text-white rounded-md"
                        id=${ item.Catrgory_Id }
                    >
                        ${ item.Category }
                    </span>
                `;
                category_items.appendChild(li); // Append the created li to category_items
            });
        })
}
fetchData()


// Fetch all data
const fetchCardData = () => {
    fetch('./comedy.json')
        .then(res => res.json())
        .then(data => {
            let allCardsHTML = ''; // Accumulator for all cards' HTML

            data.forEach(item => {
                const { views, verified, title, thumbnail, profilePicture, profileName } = item;

                // Conditionally render verified badge
                const verifiedBadge = verified ? `<img src="./assets/verified.svg" alt="Verified" />` : '';


                // Build the HTML for a single card
                const cardHTML = `
                    <div class="card w-full bg-base-100 shadow-2xl">
                            <img src="${ thumbnail }" class="max-h-40 rounded-md" alt="" />
                        <div class="card-body flex-row gap-5 px-5">
                            <div>
                                <img class="w-16 h-16 rounded-full" src="${ profilePicture }" alt="">
                            </div>
                            <div>
                                <h2 class="text-base font-semibold">
                                    ${ title }
                                </h2>
                                <h3 class="flex gap-2 items-center py-2">
                                    <span>${ profileName }</span>
                                    ${ verifiedBadge }

                                </h3>
                                <p>${ views } Views</p>
                            </div>
                        </div>
                    </div>
                `;

                allCardsHTML += cardHTML; // Accumulate card HTML
            });

            // Set the accumulated HTML to the cardsEl
            cardsEl.innerHTML = allCardsHTML;
        });
};

fetchCardData();
