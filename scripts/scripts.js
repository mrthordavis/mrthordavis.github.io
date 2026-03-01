function myFunction() {
    const password = document.getElementById("password").value;
    if (password == "Thor") {
        window.location.href = "thors-it-grotte.html";
    } else {
        document.getElementById("password").value = "";
        document.getElementById("password").placeholder = "Try again";
    }
}

function getMonthRange() {
    const months = new Map();

    months.set(0, encodeURIComponent("'Januar 26'!A11:AE31"));
    months.set(1, encodeURIComponent("'Februar 26'!A11:AE31"));
    months.set(2, encodeURIComponent("'Marts 26'!A11:AE31"));
    months.set(3, encodeURIComponent("'April 26'!A11:AE31"));
    months.set(4, encodeURIComponent("'Maj 26'!A11:AE31"))
    months.set(5, encodeURIComponent("'Juni 26'!A11:AE31"));
    months.set(6, encodeURIComponent("'Juli 26'!A11:AE31"));
    months.set(7, encodeURIComponent("'August 26'!A11:AE31"));
    months.set(8, encodeURIComponent("'September 26'!A11:AE31"));
    months.set(9, encodeURIComponent("'Oktober 26'!A11:AE31"));
    months.set(10, encodeURIComponent("'November 26'!A11:AE31"));
    months.set(11, encodeURIComponent("'December 26'!A11:AE31"));

    const date = new Date();
    const month = date.getMonth();
    return months.get(month);
}

async function readSheet() {
    const spreadsheetID = "1GYe7UtTsZEgB4V4kOd_hTGG1DAnmLLK3P6xsl7uJN3o";

    const apiKey = "AIzaSyD9FBj8frnBTB4dNa_RLFmEIEphsDTZVJ0";

    const range = getMonthRange();

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/${range}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const date = new Date();
        const day = date.getDate();

        let row = data.values.find(row => row[0]?.match(/d\. (\d+)/)?.[1] == day); //Tak Chat!

        if (!row) {
            row = data.values.find(row => row[0]?.match(/d\. (\d+)/)?.[1] == (day + 2));
            if (!row) {
                throw "Row not found";
            }
            document.getElementById("date").innerHTML = "Ingen madklub i dag";
            document.getElementById("food").innerHTML = "Næste madklub: <br>" + row[2];
            document.getElementById("altdate").innerHTML = "Der bliver serveret " + row[0];
            document.getElementById("chef").textContent = "Kok: " + row[1];
            document.getElementById("time").textContent = "Spisetid: " + row[7];
            document.getElementById("amount").textContent = "Antal (indtil videre): " + row[30];
        } else {
            document.getElementById("date").textContent = "I dag " + row[0] + " bliver der serveret:"
            document.getElementById("food").textContent = row[2];
            document.getElementById("chef").textContent = "Kok: " + row[1];
            document.getElementById("time").textContent = "Spisetid: " + row[7];
            document.getElementById("amount").textContent = "Antal: " + row[30];
        }
    } catch (err) {
        document.getElementById("food").textContent = "Ingen madklubsdata for i dag";
    }
}

async function stravaTest() {

    const accessToken = "e0e7dc1171ad33a2354bfe1fe78496f153040775"; 
    const clubId = 1959294;

    try {
        const response = await fetch(`https://www.strava.com/api/v3/clubs/${clubId}/activities?per_page=5&page=1`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const activities = await response.json();

        activities.forEach(activity => {
            const athleteName = `${activity.athlete.firstname} ${activity.athlete.lastname}`;
            const activityName = activity.name;
            const distance = (activity.distance / 1000).toFixed(2);

            document.getElementById("activities").innerHTML += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${athleteName} har løbet ${distance}km: ${activityName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
        });

    } catch (err) {
        console.error("ERROR:", err);
    }
}
