document.addEventListener('DOMContentLoaded', () => {
    const filterIcons = document.querySelectorAll('.filter a');
  
    filterIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        const category = icon.id;
        fetch(`/listings?category=${category}`)
          .then(response => response.json())
          .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';
  
            data.forEach(listing => {
              const listingDiv = document.createElement('div');
              listingDiv.classList.add('card-boxes');
              listingDiv.innerHTML = `
                <a href="/listings/${listing._id}" class="list-link">
                  <div class="card col listing-card" style="width:auto;">
                    <img src="${listing.image.url}" class="card-img-top" alt="listing_img" style="height: 18rem;"/>
                    <div class="card-img-overlay"></div>
                    <div class="card-body">
                      <p class="card-title"><b>${listing.title}</b> <br>
                      &#8377;${listing.price.toLocaleString("en-IN")}/day
                      <b class="tax-information"> &nbsp; &nbsp; x% GST</b>
                      </p>
                    </div>
                  </div>
                </a>
              `;
              resultsDiv.appendChild(listingDiv);
            });
          })
          .catch(error => {
            console.error('Error:', error);
          });
      });
    });
  
    let taxButton = document.getElementById("flexSwitchCheckDefault");
    taxButton.addEventListener("click", () => {
      let taxInformation = document.getElementsByClassName("tax-information");
      for (let info of taxInformation) {
        if (info.style.display !== "inline") {
          info.style.display = "inline";
        } else {
          info.style.display = "none";
        }
      }
    });
  });
  