let hr = document.querySelector("#hr");
let min = document.querySelector("#min");
let sec = document.querySelector("#sec");

setInterval(() => {
    let date = new Date();
    let h = date.getHours() * 30;
    let m = date.getMinutes() * 6;
    let s = date.getSeconds() * 6;

    hr.style.transform = `rotateZ(${h + (m / 12)}deg)`; // 30deg = 1hr
    min.style.transform = `rotateZ(${m}deg)`;
    sec.style.transform = `rotateZ(${s}deg)`;

});


// digital clock
let hour = document.querySelector("#hour");
let minute = document.querySelector("#minute");
let second = document.querySelector("#second");
let ampm = document.querySelector("#ampm");

setInterval(() => {
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();

    // convert 24hour to 12 hour clock
    let am = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;

    // add zero before single digit
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    hour.innerHTML = h;
    minute.innerHTML = m;
    second.innerHTML = s;
    ampm.innerHTML = am;
});
