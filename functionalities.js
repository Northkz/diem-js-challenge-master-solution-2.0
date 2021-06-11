                                        //part 1-2: printing functions//

function  insideField(){
    if (document.getElementById("name").value.length === 0) {
        document.getElementById("nameOutput").innerHTML = "Hello there! What's your name?"
    }
}
function outsideField(){
    if (document.getElementById("name").value.length === 0){
        document.getElementById("nameOutput").innerHTML ="Would you mind enter your name!";
    }else{
        document.getElementById("nameOutput").innerHTML ="Hi " + document.getElementById("name").value+ "!";
    }
}
function guessing(){
    if (!isNaN(document.getElementById("date").value)){
        document.getElementById("ageOutput").innerHTML = "Lemme guess, your age is..."
    }
}

                                                //part 2: age calculator//
const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function ageCalculator(){
    let today = new Date()
    let inputDate = new Date(document.getElementById("date").value);
    let birthMonth, birthDate, birthYear;

    let birthDetails = {
        date: inputDate.getDate(),
        months:inputDate.getMonth()+1,
        year:inputDate.getFullYear()
    }

    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth()+1;
    let currentDate = today.getDate() ;

    leapChecker(currentYear);

    if (birthDetails.year > currentYear ||
        (birthDetails.months > currentMonth && birthDetails.year === currentYear) ||
        (birthDetails.date > currentDate && birthDetails.year === currentYear &&
            birthDetails.months === currentMonth)){
        alert("not born yet");
        return;
    }
    birthYear = currentYear - birthDetails.year;
    if (currentMonth >= birthDetails.months){
        birthMonth = currentMonth - birthDetails.months;
    }
    else {
        birthYear--;
        birthMonth = 12 + currentMonth -birthDetails.months;
    }
    if (currentDate >= birthDetails.date){
        birthDate = currentDate - birthDetails.date;
    }
    else{
        birthMonth--;
        birthDate = months[currentMonth-2] +currentDate -birthDetails.date;
    }
    if (birthMonth < 0){
        birthMonth = 11;
        birthYear--;
    }

    if (isNaN(birthYear) ||  isNaN(birthMonth) || isNaN(birthDate)){
        document.getElementById("ageOutput").innerHTML = "Would you mind entering your birthday?"
    }
    else{
        document.getElementById("ageOutput").innerHTML = "Your age is " + String(birthYear) + " years old "
    }
}
function leapChecker(year){
    if (year%4 === 0 || (year%100 === 0 && year%400 === 0) ){
        months[1] = 29
    }else {
        months[1] = 28
    }

}


                                    //part 4: button functionality part//

let btnAdd = document.getElementById("html")
let btnAdd1 = document.getElementById("css")
let btnAdd2 = document.getElementById("javascript")
let base_id_html ='html'
let base_id_css ='css'
let base_id_java = 'javascript'
let changed_id_html = 'html_1'
let changed_id_css = 'css_1'
let changed_id_java = 'javascript_1'

btnAdd.addEventListener("click", function (){ createButton1('HTML', btnAdd.id,changed_id_html)});
btnAdd1.addEventListener("click",function (){ createButton1('CSS',btnAdd1.id,changed_id_css)});
btnAdd2.addEventListener("click",function (){ createButton1('Javascript',btnAdd2.id,changed_id_java)});

function createButton1(labelName, deleteID, newID){
    let button_container
    let x
    let newBtn = document.createElement("BUTTON");
    newBtn.classList.add('btn_style')
    let elem
    if (labelName === "HTML"){
        elem = document.getElementById(deleteID);
        if (btnAdd.id === 'html') {
            button_container = document.getElementById("nothing");
            newBtn.addEventListener('mouseover', function (){ change_to_red(newBtn.id)})
            newBtn.addEventListener('mouseleave', function (){ change_to_green(newBtn.id)})
        }
        else {
            button_container = document.getElementById("mainBtnContainer");

        }
        button_container.appendChild(newBtn);
        newBtn.innerHTML = labelName;
        newBtn.setAttribute('id', newID)
        x = base_id_html
        base_id_html = changed_id_html
        changed_id_html = x
        btnAdd = document.getElementById(newID)
        elem.parentNode.removeChild(elem);
        btnAdd.addEventListener("click", function (){ createButton1('HTML', btnAdd.id,changed_id_html)});

    }
    else if (labelName === "CSS"){
        elem = document.getElementById(deleteID);
        if (btnAdd1.id === 'css') {
            button_container = document.getElementById("nothing");
            newBtn.addEventListener('mouseover', function (){ change_to_red(newBtn.id)})
            newBtn.addEventListener('mouseleave', function (){ change_to_green(newBtn.id)})
        }
        else {
            button_container = document.getElementById("mainBtnContainer");
        }

        button_container.appendChild(newBtn)
        newBtn.innerHTML = labelName;
        newBtn.setAttribute('id', newID)
        x = base_id_css
        base_id_css = changed_id_css
        changed_id_css = x
        btnAdd1 = document.getElementById(newID)
        elem.parentNode.removeChild(elem);
        btnAdd1.addEventListener("click", function (){ createButton1('CSS', btnAdd1.id,changed_id_css)});

    }
    else if (labelName === 'Javascript') {
        elem = document.getElementById(deleteID);
        if (btnAdd2.id === 'javascript') {
            button_container = document.getElementById("nothing");
            newBtn.addEventListener('mouseover', function (){ change_to_red(newBtn.id)})
            newBtn.addEventListener('mouseleave', function (){ change_to_green(newBtn.id)})
        }
        else {
            button_container = document.getElementById("mainBtnContainer");
        }
        button_container.appendChild(newBtn);
        newBtn.innerHTML = labelName;
        newBtn.setAttribute('id', newID)
        x = base_id_java
        base_id_java = changed_id_java
        changed_id_java = x
        btnAdd2 = document.getElementById(newID)
        elem.parentNode.removeChild(elem);
        btnAdd2.addEventListener("click", function (){ createButton1('Javascript', btnAdd2.id,changed_id_java)});
    }
}


                                    //part 3: dark and light mode functionality


function change_to_red(btn_name){
    document.getElementById(btn_name).style.backgroundColor = "red"
}
function change_to_green(btn_name){
    document.getElementById(btn_name).style.backgroundColor = "#28a745"
}
function changeTextColor(text_color)  {

    let elements = document.getElementsByClassName('container');
    for(let i = 0; i < elements.length; i++){
        elements[i].style.color = text_color;
    }
}
function changeColor_light(){
    document.getElementById('container').style.backgroundColor = "#f8f9fa"
    document.getElementById("themeOutput").innerHTML = "You chose Light Mode!"
    changeTextColor('black')
}
function changeColor_dark(){
    document.getElementById('container').style.backgroundColor = "#343A40"
    document.getElementById("themeOutput").innerHTML = "You chose Dark Mode!"
    changeTextColor("white")
}

