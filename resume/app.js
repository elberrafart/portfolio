const lightBtn = document.getElementById('light-btn')

function darkMode(){
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
    document.getElementById('myHeader').style.backgroundColor = 'black';
}

lightBtn.addEventListener('click', function(){
    darkMode()
})