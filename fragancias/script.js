
const API_KEY = "a109257d3ba6373994e89b95e84dfad4";

window.onload = function(){

    setTimeout(()=>{
        document.getElementById("locationPopup").style.display="block";
    },2000);

};


function acceptLocation(){

    document.getElementById("locationPopup").style.display="none";

    if(!navigator.geolocation){
        alert("Tu navegador no soporta geolocalización");
        return;
    }

    navigator.geolocation.getCurrentPosition(successLocation,errorLocation);
}

function closePopup(){
    document.getElementById("locationPopup").style.display="none";
}

function successLocation(position){

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    loadWeather(lat, lon);
}

function errorLocation(){
    alert("No se pudo obtener tu ubicación");
}


async function loadWeather(lat, lon){

    try {

        const weatherURL =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

        const res = await fetch(weatherURL);
        const data = await res.json();

        const tempC = Math.round(data.main.temp - 273.15);
        const humidity = data.main.humidity;

        const iconCode = data.weather[0].icon;
const icon = document.getElementById("weatherIcon");
const placeholder = document.getElementById("weatherPlaceholder");


console.log("ICON CODE:", iconCode);


icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;


icon.style.display = "block";


if (placeholder) {
  placeholder.style.display = "none";
}


       

        const uvURL =
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

        const resUV = await fetch(uvURL);
        const uvData = await resUV.json();

        let uvIndex = 0;

        if (uvData.current && uvData.current.uvi) {
            uvIndex = Math.round(uvData.current.uvi);
        }


       
        const airURL =
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

        const resAir = await fetch(airURL);
        const airData = await resAir.json();

        const airQualityIndex = airData.list[0].main.aqi;
        const airText = airToText(airQualityIndex);


       

        document.getElementById("weatherResult").classList.remove("hidden");
        document.getElementById("recommendations").classList.remove("hidden");

       const city = await getCityName(lat, lon);

        document.getElementById("cityName").textContent =
         `${city}, ${data.sys.country}`;
        document.getElementById("temp").textContent = tempC;
        document.getElementById("humidity").textContent = humidity;
        document.getElementById("uv").textContent = uvIndex;
        document.getElementById("air").textContent = airText;


        generateRecommendations({
            temp: tempC,
            humidity: humidity,
            uv: uvIndex,
            air: airText
        });

    } catch (err) {

        console.error(err);
        alert("Error al obtener datos del clima");

    }

}


function airToText(aqi) {
    return ["Excelente", "Buena", "Aceptable", "Mala", "Muy Mala"][aqi - 1];    
}



function generateRecommendations(data){

    const recBox = document.getElementById("recContent");
    recBox.innerHTML = "";

    const products = {

        cold: {
            name: "CeraVe Crema Reparadora",
            img: "https://medipielqa.vtexassets.com/assets/vtex.file-manager-graphql/images/388fae80-bccd-4bfd-b899-d2ad52373a5e___529c9eafdd666ed15367be41b04c3ccf.png",
            desc: "Hidratación profunda con ceramidas - Perfecta para clima frío.",
            price: "$89.900"
        },

        highUV: {
            name: "Anthelios Fluido Invisible SPF50+",
            img: "https://medipielqa.vtexassets.com/assets/vtex.file-manager-graphql/images/16331969-f9cf-4232-81f6-c9a0600e7e89___92e11b2da94a749cdefb56722d4fbc15.png",
            desc: "Protección muy alta para días con radiación solar extrema.",
            price: "$119.900"
        },

        humidity: {
            name: "Niacinamida 10% + Zinc",
            img: "https://medipielqa.vtexassets.com/assets/vtex.file-manager-graphql/images/a79e9c69-b631-4e99-94e5-44286e10d9b0___be0eacc20b563a2df55dc6e051802f77.png",
            desc: "Controla grasa y minimiza poros en climas húmedos.",
            price: "$68.000"
        },

        pollution: {
            name: "Vitamina C Ferúlica",
            img: "https://medipielqa.vtexassets.com/assets/vtex.file-manager-graphql/images/96799fe0-3366-4708-88d2-2f7b8596860e___e26b275ef4d31a42dd73cfe861c36988.png",
            desc: "Antioxidante ideal para ambientes contaminados.",
            price: "$145.000"
        },

        daily: {
            name: "Hoy el clima es estable",
            img: "https://medipielqa.vtexassets.com/assets/vtex.file-manager-graphql/images/a5e18cc6-f97a-4a6f-bd52-6666fd161466___cc908f2315671e7104c075543be43a75.png",
            desc: "Kit básico para mantener tu rutina de cuidado.",
            price: "$120.000"
        }
    };


    let output = "";


    if (data.temp < 15)
        output += makeProduct(products.cold);

    if (data.uv >= 8)
        output += makeProduct(products.highUV);

    if (data.humidity > 70 && data.temp > 20)
        output += makeProduct(products.humidity);

    if (data.air === "Mala" || data.air === "Muy Mala")
        output += makeProduct(products.pollution);


    if(output === ""){
        output = makeProduct(products.daily);
    }


    recBox.innerHTML = output;

}



function makeProduct(prod){

    return `
        <div class="product-card-real fade-in">
            <img src="${prod.img}">
            <div class="product-info">
                <h4>${prod.name}</h4>
                <p>${prod.desc}</p>
                <p><strong>${prod.price}</strong></p>
                <a class="buy-btn" href="#">Comprar</a>
            </div>
        </div>
    `;
}

async function getCityName(lat, lon){

    const API_KEY = "a109257d3ba6373994e89b95e84dfad4";

    const url =
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    return data[0].name;
}


