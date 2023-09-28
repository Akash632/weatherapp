let rootElement = document.getElementById("main-container");
let searchElement = document.getElementById("search");
let tempElement = document.getElementById("temp");
let cityElement = document.getElementById('city');
let dateElement = document.getElementById('date');
let iconElement = document.getElementById('icon');
let statusElement = document.getElementById('status');
let cardImgElement = document.getElementById('card-img');
let sunriseElement = document.getElementById('sunrise');
let sunsetElement = document.getElementById('sunset');
let maxElement = document.getElementById('max');
let minElement = document.getElementById('min');
let pressureElement =document.getElementById('pressure');
let windElement = document.getElementById('wind');
let humidityElement = document.getElementById('humid');
let feelsElement = document.getElementById('feels');
let degreeBtnElement = document.getElementById('degreeBtn');
let errorElement = document.getElementById('error');
let cardElement = document.getElementById('card-text');
let errHeading = document.getElementById('error-heading');
let Ftemp = false;
let url;
rootElement.style.backgroundImage="url('./assets/snow.jpg')";

function getData(){
    apiData(searchElement.value)
}

//function to get api data and update the fields
async function apiData(city,value,lat,lon){
    if(lat&&lon){
        url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=600bb031befd49676b035d8b10f716a6`;
    }else{
        url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=600bb031befd49676b035d8b10f716a6`;
    }  
    const response = await fetch(url);
    const data= await response.json();
    console.log(data);

    //destructing the data
    if(data.cod==200){
        const {weather,main,wind,dt,sys,timezone,name,cod} = data;

    //converting weather and displaying
    tempElement.innerHTML = tempConverter(main.temp,Ftemp) + "&#176;";
    cityElement.innerHTML = name;

    //converting date wrt timezone
    dateElement.innerHTML = formatter.format(dateConverter(dt,timezone));

    //updating icons as per API
    iconElement.src=`http://openweathermap.org/img/w/${weather[0].icon}.png`;

    statusElement.innerHTML = weather[0].main;

    //calling function to set background as per status
    backGrounds(weather[0].main);


    //updating sunrise and sun set values
    sunriseElement.innerHTML="Sunrise - " + formatter.format(dateConverter(sys.sunrise,timezone)).split(" ")[1];
    sunsetElement.innerHTML="Sunsnet - " + formatter.format(dateConverter(sys.sunset,timezone)).split(" ")[1];


    tempValues(main,wind,Ftemp);

    }
    else{
        errHeading.innerHTML=data.message;
        cardElement.style.display="none";
        errorElement.style.display="block";
        searchElement.value="";
    }
}


//date converter
function dateConverter(value,timezone){
    const date = new Date((value-timezone)*1000);
    return date;
}

//format converter
const formatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  hour12: false,
  minute: 'numeric',
  weekday: 'short',
  timeZone: 'Asia/Tokyo',
});

//backgrounds function
function backGrounds(data){
    switch(data){
        case "Rain" || "Drizzle" || "Thunderstorm":
            setBg('./assets/rainy1.jpg');
            break;
        case "Clouds":
            setBg('./assets/cloudy.jpg');
            break;
        case "Clear":
            setBg('./assets/clear.jpg')
            break;
        case "Mist" || "Haze" || "Fog":
            setBg('./assets/mist.jpg')
            break;
        case "Snow":
            setBg('./assets/snow.jpg')
        default:
            setBg('./assets/Backbg.jpg');
    }
}

//function to set backgrounds
function setBg(value){
    rootElement.style.backgroundImage=`url(${value})`;
    cardImgElement.src=value;
}

//function for temp values
function tempValues(main,wind,value){
    maxElement.innerHTML = "Max - "+tempConverter(main.temp_max,value)+"&#176;";
    minElement.innerHTML="Min - "+tempConverter(main.temp_min,value)+"&#176;";
    pressureElement.innerHTML = "Pressure - " +main.pressure;
    humidityElement.innerHTML="Humidity - "+main.humidity;
    windElement.innerHTML="Wind - "+wind.speed;
    feelsElement.innerHTML="Feels - "+tempConverter(main.feels_like,value)+"&#176;";
}

//function for temp converter
function tempConverter(temp,value){
    if(value){
        const celTemp = Math.ceil(temp-273);
        const newTemp = Math.ceil((celTemp * 1.8)+32);
        return newTemp;
    }
    else return Math.ceil(temp-273);
}

//funcion to convert celcius to fohrenheit
function changeTemp(){
    Ftemp = !Ftemp;
    if(Ftemp){
        degreeBtnElement.innerHTML= "C&#176;";
    }else{
        degreeBtnElement.innerHTML= "F&#176;";
    }
    apiData(searchElement.value,Ftemp)
}

//function to untoggle
function back(){
    cardElement.style.display="block";
    errorElement.style.display="none";
    if(Ftemp){
        Ftemp=false;
    }
}

//function to get user location
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition,errorFunction);
    }
  }

function showPosition(position) {
    let lat = position.coords.latitude; 
    let lon = position.coords.longitude;
    if(lat && lon){
        apiData("delhi",Ftemp,lat,lon);
    }
  }

function errorFunction(){
    apiData("delhi",Ftemp);
}

getLocation();
  
