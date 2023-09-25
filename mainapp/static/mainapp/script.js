document.addEventListener('DOMContentLoaded', function() {
    let csrftoken = Cookies.get('csrftoken');

    // Load table data by default on index page
    if (document.querySelector('#tablebody')){
        getpersons();
    }

    // Listen for search buttons
    if (document.querySelector('#searchtable')){

        btns = document.querySelectorAll('.searchbtn')
        btns.forEach((btn) => {
            btn.addEventListener('click', function(event) {
                element = event.target;
                let person_id = element.parentElement.parentElement.querySelector('.person_id').value;
                window.location.href = `/profile/${person_id}`;
            });
        })

    }

    // Uncollapse nav menu when user submits visit or person
    if (document.querySelector('#targetbtn')&&document.querySelector('#sourcebtn')){
    const sourcebtn = document.getElementById('sourcebtn');
    const targetbtn = document.getElementById('targetbtn');

    sourcebtn.addEventListener('click', function() {
    targetbtn.click();
    })
    };

    // Load person visits by default on profile page
    if (document.querySelector('#profiletable')){
        id = document.querySelector('#person_id').value;
        getvisits(id);
    }

    // Desktop person form
    if (document.querySelector('#desktop-person-form')){
    document.querySelector('#desktop-person-form').onsubmit = function() {
        fetch('/addperson', {
            method: 'POST',
            headers: { "X-CSRFToken": csrftoken },
            body: JSON.stringify({
                name: document.querySelector('#namedesktop').value,
                phonenumber: document.querySelector('#phonenumberdesktop').value,
                location: document.querySelector('#locationdesktop').value,
                classification: document.querySelector('#classificationdesktop').value,
                googlemaps: document.querySelector('#googlemapsdesktop').value,
                parking: document.querySelector('#parkingdesktop').value,
                startdate: document.querySelector('#startdatedesktop').value,
                enddate: document.querySelector('#enddatedesktop').value,
                starttime: document.querySelector('#starttimedesktop').value,
                endtime: document.querySelector('#endtimedesktop').value,
                comments: document.querySelector('#commentsdesktop').value,
            })
            })
            .then(response => response.json())
            .then(result => {
                // Print result
                console.log(result);
                if(result.message){
                    alert(result.message, 'success')
                }else{
                    alert(result.error, 'danger')
                }
                getpersons();
            });
            
            // Clear fields
            document.querySelector('#namedesktop').value ='';
            document.querySelector('#phonenumberdesktop').value ='';
            document.querySelector('#locationdesktop').value ='';
            document.querySelector('#classificationdesktop').value ='',
            document.querySelector('#googlemapsdesktop').value ='';
            document.querySelector('#parkingdesktop').value ='';
            document.querySelector('#startdatedesktop').value ='';
            document.querySelector('#enddatedesktop').value ='';
            document.querySelector('#starttimedesktop').value ='00:00';
            document.querySelector('#endtimedesktop').value ='12:00';
            document.querySelector('#commentsdesktop').value ='';

            return false;
    }
    }

    // Mobile person form
    if (document.querySelector('#mobile-person-form')){
    document.querySelector('#mobile-person-form').onsubmit = function() {
        fetch('/addperson', {
            method: 'POST',
            headers: { "X-CSRFToken": csrftoken },
            body: JSON.stringify({
                name: document.querySelector('#namemobile').value,
                phonenumber: document.querySelector('#phonenumbermobile').value,
                location: document.querySelector('#locationmobile').value,
                classification: document.querySelector('#classificationmobile').value,
                googlemaps: document.querySelector('#googlemapsmobile').value,
                parking: document.querySelector('#parkingmobile').value,
                startdate: document.querySelector('#startdatemobile').value,
                enddate: document.querySelector('#enddatemobile').value,
                starttime: document.querySelector('#starttimemobile').value,
                endtime: document.querySelector('#endtimemobile').value,
                comments: document.querySelector('#commentsmobile').value,
            })
            })
            .then(response => response.json())
            .then(result => {
                // Print result
                console.log(result);
                if(result.message){
                    alert(result.message, 'success')
                }else{
                    alert(result.error, 'danger')
                }
                getpersons();
            });

            // Clear fields
            document.querySelector('#namemobile').value ='';
            document.querySelector('#phonenumbermobile').value ='';
            document.querySelector('#locationmobile').value ='';
            document.querySelector('#classificationmobile').value='',
            document.querySelector('#googlemapsmobile').value ='';
            document.querySelector('#parkingmobile').value ='';
            document.querySelector('#startdatemobile').value ='';
            document.querySelector('#enddatemobile').value ='';
            document.querySelector('#starttimemobile').value ='00:00';
            document.querySelector('#endtimemobile').value ='12:00';
            document.querySelector('#commentsmobile').value ='';

            return false;
    }
    }

    // Desktop visit form
    if (document.querySelector('#desktop-visit-form')){
    document.querySelector('#desktop-visit-form').onsubmit = function() {
        fetch('/addvisit', {
            method: 'POST',
            headers: { "X-CSRFToken": csrftoken },
            body: JSON.stringify({
                personVisitedId: document.querySelector('#person_id').value,
                date: document.querySelector('#datedesktop').value,
                note: document.querySelector('#notedesktop').value,
            })
            })
            .then(response => response.json())
            .then(result => {
                // Print result
                console.log(result);
                if(result.message){
                    alert(result.message, 'success')
                }else{
                    alert(result.error, 'danger')
                }
                id = document.querySelector('#person_id').value;
                getvisits(id);
            });

            // Clear fields
            document.querySelector('#datedesktop').value ='';
            document.querySelector('#notedesktop').value ='';

            return false;
    }
    }

    // Mobile visit form
    if (document.querySelector('#mobile-visit-form')){
        document.querySelector('#mobile-visit-form').onsubmit = function() {
            fetch('/addvisit', {
                method: 'POST',
                headers: { "X-CSRFToken": csrftoken },
                body: JSON.stringify({
                    personVisitedId: document.querySelector('#person_id').value,
                    date: document.querySelector('#datemobile').value,
                    note: document.querySelector('#notemobile').value,
                })
                })
                .then(response => response.json())
                .then(result => {
                    // Print result
                    console.log(result);
                    if(result.message){
                        alert(result.message, 'success')
                    }else{
                        alert(result.error, 'danger')
                    }
                    id = document.querySelector('#person_id').value;
                    getvisits(id);
                });
    
                // Clear fields
                document.querySelector('#datemobile').value ='';
                document.querySelector('#notemobile').value ='';
    
                return false;
        }
        }
    
    // Listen for edit button
    if (document.querySelector('#editbtn')){
        editbtn = document.querySelector('#editbtn');

        editbtn.addEventListener('click', (event) =>{

            // Catch the necessary elements of the post
            const element = event.target;
            let profileinfodiv = element.parentElement.parentElement;
            let profileeditdiv =  document.querySelector("#profileedit");
            
            // fetch the person of the clicked profile
            let person_id = document.querySelector("#person_id").value;
            fetch(`/getperson/${person_id}`)
            .then(response => response.json())
            .then(person => {
                //console log persons
                console.log(person);

                profileinfodiv.setAttribute("class", "d-none");
                profileeditdiv.setAttribute("class", "");

                document.querySelector('#editname').value = person.name;
                document.querySelector('#editlocation').value = person.location;
                document.querySelector('#editclassification').value = person.classification;
                document.querySelector('#editphonenumber').value = person.phone;
                document.querySelector('#editgooglemaps').value = person.googlemaps;
                document.querySelector('#editparking').value = person.parking;
                document.querySelector('#editstarttime').value = person.starttime;
                document.querySelector('#editendtime').value = person.endtime;
                document.querySelector('#editstartdate').value = person.startdate;
                document.querySelector('#editenddate').value = person.enddate;
                document.querySelector('#editcomments').value = person.comments;

                if (document.querySelector('#profile-edit-form')){
                    document.querySelector('#profile-edit-form').onsubmit = function() {
                        if(confirm('Are you sure?')){
                            fetch('/editperson', {
                                method: 'PUT',
                                headers: { "X-CSRFToken": csrftoken },
                                body: JSON.stringify({
                                    name: document.querySelector('#editname').value,
                                    phonenumber: document.querySelector('#editphonenumber').value,
                                    location: document.querySelector('#editlocation').value,
                                    classification: document.querySelector('#editclassification').value,
                                    googlemaps: document.querySelector('#editgooglemaps').value,
                                    parking: document.querySelector('#editparking').value,
                                    startdate: document.querySelector('#editstartdate').value,
                                    enddate: document.querySelector('#editenddate').value,
                                    starttime: document.querySelector('#editstarttime').value,
                                    endtime: document.querySelector('#editendtime').value,
                                    comments: document.querySelector('#editcomments').value,
                                    id: person.id,
                                })
                            })
                            .then(response => response.json())
                            .then(editedperson => {
                                // Print result
                                console.log(editedperson);

                                if(editedperson.error){
                                    alert(editedperson.error, 'danger')
                                    return
                                }
    
                                profileinfodiv.innerHTML=`
                                <div class="row">
                                    <div class="col-12 col-sm-5"><h5 id="location">Location: ${editedperson.location}</h5></div>
                                    <div class="col-12 col-sm-6"><h5 id="classification">Classification: ${editedperson.classification}</h5></div>
                                </div>
                                <div class="row">
                                    <div  class="col-12 col-sm-5"><h5>Phone No.: <span id="phonenumber" class="text-primary">${editedperson.phone}</span></h5></div>
                                    <div  class="col-12 col-sm-6"><h5>Google Map: <a id="googlemaps" href="${editedperson.googlemaps}" target="_blank" rel="noopener noreferrer">${editedperson.name}'s Map</a></h5></div>
                                </div>
                                <div class="row">
                                    <div class="col-12 col-sm-5"><h5 id="parking">Parking: ${editedperson.parking}</h5></div>
                                    <div  class="col-12 col-sm-6"><h5 id="time">Time Schedule: From <span id="timestart" >${editedperson.starttime}</span> till ${editedperson.endtime}</h5></div>
                                </div>
                                <div class="row">
                                    <div class="col-12 col-sm-5"><h5 id="visits">Visits: ${editedperson.visits}</h5></div>
                                    <div class="col-12 col-sm-6"><h5 id="availability">Availability: From ${editedperson.startdate} to ${editedperson.enddate}</h5></div>
                                </div>
                                <div id="commentrow" class="row">
                                    <div class="col-12 col-sm-10"><h5 id="comments">Comments: ${editedperson.comments}</h5></div>
                                </div>
                                `
                                profileinfodiv.setAttribute("class", "");
                                profileeditdiv.setAttribute("class", "d-none");
    
                                document.querySelector("#desktopprofilename").firstElementChild.innerHTML=`Dr. ${editedperson.name}'s Profile`
                                document.querySelector("#mobileprofilename").firstElementChild.innerHTML=`Dr. ${editedperson.name}'s Profile`
                                
                                parentElementOfEditbtn = document.querySelector("#commentrow")
                                parentElementOfEditbtn.appendChild(element);
    
                            });
    
                            return false;
                        } else{
                            console.log("User cancelled save request.")
                            return false;
                        }
                        
                    }
                }
            })
        })
    }

    // Listen for delete profile button
    if (document.querySelector('#deletebtn')){
        deletebtn = document.querySelector('#deletebtn');

        deletebtn.addEventListener('click', () =>{
            if(confirm('This will permanently delete the person, continue?')){
                fetch('/deleteperson', {
                    method: 'DELETE',
                    headers: { "X-CSRFToken": csrftoken },
                    body: JSON.stringify({
                        id: document.querySelector('#person_id').value,
                    })
                    })
                    .then(response => response.json())
                    .then(result => {
                        // Print result
                        console.log(result);
                        window.location.href = `/`;
                    });
            } else{
                return false;
            }
        })
    }

});


function getpersons() {
    
    // fetch the persons of the current logged in user
    fetch(`/getpersons`)
    .then(response => response.json())
    .then(persons => {
        //console log persons
        console.log(persons);

        // Get div where all person rows will fall into and empty it
        tbody = document.querySelector('#tablebody');
        tbody.innerHTML = '';

        // Making rows for each person
        persons.forEach((person, i) => {
            const tr = document.createElement('tr'); 

            // Make buttons for the profiles
            const button = document.createElement('button');
            button.setAttribute("class", "btn btn-secondary profilebtn m-0 p-0");

            // Writing HTML of each email/profilediv and adding it
            let trHTML = `
            <th scope="row">${i+1}</th>
            <td class="namerow" ></td>
            <td>${person.location}</td>
            <td>${person.parking}</td>
            <td>${person.visits}</td>
            <input type="hidden" class="person_id" value="${person.id}">
            `;
            tr.innerHTML = trHTML;

            button.innerHTML = `
                ${person.name}
            `

            //Add event listeners for the profile btns
            button.addEventListener('click', function() {
                window.location.href = `/profile/${person.id}`;
            });


            //Append all new elements
            document.querySelector('#tablebody').appendChild(tr);

            //Use the parent element(each tr) to find the namerow class to append to it
            tr.querySelector('.namerow').appendChild(button);

            
        })
    })
};


function getperson(id) {
    
    // fetch the person of the clicked profile
    fetch(`/getperson/${id}`)
    .then(response => response.json())
    .then(person => {
        //console log persons
        console.log(person);
    })
}

function getvisits(id) {
    let csrftoken = Cookies.get('csrftoken');
    
    // fetch the visits of the person
    fetch(`/getvisits/${id}`)
    .then(response => response.json())
    .then(visits => {
        console.log(visits);

        // Get div where all person rows will fall into and empty it
        tbody = document.querySelector('#profiletablebody');
        tbody.innerHTML = '';

        // Making rows for each person
        visits.forEach((visit, i) => {
            const tr = document.createElement('tr');

            // Writing HTML of each visitdiv and adding it
            let trHTML = `
            <th class="col-1" scope="row">${i+1}</th>
            <td class="col-3">${visit.date}</td>
            <td class="col-6">${visit.note}</td>
            <td class="col-2"></td>
            <input type="hidden" class="visit_id" value="${visit.id}">
            `;
            tr.innerHTML = trHTML;

            const deletebtn = document.createElement('button');
            deletebtn.setAttribute("id",`${visit.id}`)
            deletebtn.setAttribute("class","deletebtns btn btn-danger")
            deletebtn.innerHTML = "Delete"

            deletebtn.addEventListener('click', () =>{
                if(confirm('This will permanently delete the visit, continue?')){
                    fetch('/deletevisit', {
                        method: 'DELETE',
                        headers: { "X-CSRFToken": csrftoken },
                        body: JSON.stringify({
                            id: visit.id,
                        })
                        })
                        .then(response => response.json())
                        .then(result => {
                            // Print result
                            console.log(result);
                            window.location.href = `/profile/${id}`;
                        });
                } else{
                    return false;
                }
            })

            //Append all new elements
            document.querySelector('#profiletablebody').appendChild(tr);
            tr.children[3].appendChild(deletebtn);

        })
    })
};

function uploadFile() {
    let csrftoken = Cookies.get('csrftoken');

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
  
    // Create a FormData object
    const formData = new FormData();
    formData.append('file', file);
  
    // Make the fetch request
    fetch('/upload', {
      method: 'POST',
      headers: {'X-CSRFToken': csrftoken},
      body: formData
    })
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if (result.message) {
          alert(result.message, 'success')
          getpersons();
        } else {
          alert(result.error, 'danger')
          console.error();
        }
      })
      .catch(error => {
        console.error('An error occurred during the file upload', error);
        alert('An error occurred during the file upload', 'danger')
      });
  }

  

const alert = (message, type) => {
let overlay = document.getElementById("alert-overlay");

overlay.style.display = "block";
const alertPlaceholder = document.querySelector('#liveAlertPlaceholder')
const wrapper = document.createElement('div')
wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible m-0" role="alert">`,
    `   <div>${message}</div>`,
    '   <button onclick="hideAlert()" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
].join('')

alertPlaceholder.append(wrapper)
}

function hideAlert() {
    var overlay = document.getElementById("alert-overlay");
  
    overlay.style.display = "none";
  }


/* Experimental Scrolling code

let cycle = 2; // Initial page number

window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        loadscroll(cycle);
    }
};

function loadscroll(cycle){
    // Get new posts and add posts
    console.log("loading!")
    fetch(`/loadscroll/${cycle}`)
    .then(response => response.json())
    .then(data => {
        let persons = data.persons;
        let hasMoreData = data.has_next;

        persons.forEach((person, i) => {
            const tr = document.createElement('tr'); 

            // Make buttons for the profiles
            const button = document.createElement('button');
            button.setAttribute("class", "btn btn-secondary profilebtn m-0 p-0");

            // Writing HTML of each email/profilediv and adding it
            let trHTML = `
            <th scope="row">${i+1}</th>
            <td class="namerow" ></td>
            <td>${person.location}</td>
            <td>${person.parking}</td>
            <td>${person.visits}</td>
            <input type="hidden" class="person_id" value="${person.id}">
            `;
            tr.innerHTML = trHTML;

            button.innerHTML = `
                ${person.name}
            `

            //Add event listeners for the profile btns
            button.addEventListener('click', function() {
                window.location.href = `/profile/${person.id}`;
            });

            //Append all new elements
            document.querySelector('#tablebody').appendChild(tr);

            //Use the parent element(each tr) to find the namerow class to append to it
            tr.querySelector('.namerow').appendChild(button);
        })
        if (hasMoreData) {
            cycle++;
            console.log(cycle)
        }else{
            console.log("removed!")
            window.removeEventListener('scroll', loadscroll(cycle) );
        }
    })
}

*/