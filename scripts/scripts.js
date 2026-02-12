function myFunction() {
    const password = document.getElementById("password").value;
    if (password == "Thor") {
        window.location.href = "thors-it-grotte.html";
    } else {
        document.getElementById("password").value = "";
        document.getElementById("password").placeholder = "Try again";
    }
}

const spreadsheetID = "1GYe7UtTsZEgB4V4kOd_hTGG1DAnmLLK3P6xsl7uJN3o";

const apiKey = "AIzaSyD9FBj8frnBTB4dNa_RLFmEIEphsDTZVJ0";

//Lav en function der henter månedens range
const range = encodeURIComponent("'Februar 26'!A11:AE31");

const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/${range}?key=${apiKey}`;

async function readSheet() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        const date = new Date();
        const day = date.getDate() + 100;

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