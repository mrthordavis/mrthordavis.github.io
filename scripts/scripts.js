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

    console.log(url);

    try {
        const response = await fetch(url);
        const data = await response.json();

        const date = new Date();
        const day = date.getDate();
        const dayOfWeek = date.getDay();

        if (dayOfWeek <= 4) {
            let row = data.values.find(row => row[0]?.match(/d\. (\d+)/)?.[1] == day);

            document.getElementById("date").textContent = "I dag " + row[0] + " bliver der serveret:"
            document.getElementById("food").textContent = row[2];
            document.getElementById("chef").textContent = "Kok: " + row[1];
            document.getElementById("time").textContent = "Spisetid: " + row[7];
            document.getElementById("amount").textContent = "Antal: " + row[30];

        } else if (dayOfWeek == 5) {
            let row = data.values.find(row => row[0]?.match(/d\. (\d+)/)?.[1] == (day + 2));

            document.getElementById("date").innerHTML = "Ingen madklub i dag";
            document.getElementById("food").innerHTML = "Næste madklub: <br>" + row[2];
            document.getElementById("altdate").innerHTML = "Der bliver serveret " + row[0];
            document.getElementById("chef").textContent = "Kok: " + row[1];
            document.getElementById("time").textContent = "Spisetid: " + row[7];
            document.getElementById("amount").textContent = "Antal (indtil videre): " + row[30];

        } else if (dayOfWeek == 6) {
            let row = data.values.find(row => row[0]?.match(/d\. (\d+)/)?.[1] == (day + 1));

            document.getElementById("date").innerHTML = "Ingen madklub i dag";
            document.getElementById("food").innerHTML = "Næste madklub: <br>" + row[2];
            document.getElementById("altdate").innerHTML = "Der bliver serveret " + row[0];
            document.getElementById("chef").textContent = "Kok: " + row[1];
            document.getElementById("time").textContent = "Spisetid: " + row[7];
            document.getElementById("amount").textContent = "Antal (indtil videre): " + row[30];
        }
    } catch (err) {
        document.getElementById("food").textContent = "Ingen madklubsdata for i dag";
    }
}

async function refreshStravaToken(refreshToken) {
    const response = await fetch('https://www.strava.com/api/v3/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: "200710",
            client_secret: "a8fcf4b5271c1c0cd56d8d9f1d0bfa4e16770d34",
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }

    return response.json();
}

async function getValidAccessToken() {
    const now = Math.floor(Date.now() / 1000);

    if (now >= stravaAuth.expires_at - 60) {
        console.log("Refreshing Strava token...");

        const newTokens = await refreshStravaToken(stravaAuth.refresh_token);

        // IMPORTANT: overwrite everything
        stravaAuth = {
            access_token: newTokens.access_token,
            refresh_token: newTokens.refresh_token,
            expires_at: newTokens.expires_at
        };
    }

    return stravaAuth.access_token;
}

let stravaAuth = {
    access_token: "d83ecd3b406da3a8e27d2bfab34a0be7819800ea",
    refresh_token: "405fdf74e8a792c396cb7f949f55e7b64223d880",
    expires_at: 1772587181 // unix timestamp
};

async function stravaTest() {

    //const accessToken = "7154f4b74b8f48339e2dc8ca220ab209cb4e1189"; // ⚠️ only for testing, not safe in production
    const clubId = 1959294;

    try {
        const accessToken = await getValidAccessToken();

        const response = await fetch(
            `https://www.strava.com/api/v3/clubs/${clubId}/activities?per_page=5&page=1`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

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