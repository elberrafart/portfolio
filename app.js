const lightBtn = document.getElementById('light-btn')

function darkMode(){
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
    document.getElementById('myHeader').style.backgroundColor = 'black';
    document.getElementById('myHeader').style.color = 'white';
}

lightBtn.addEventListener('click', function(){
    console.log('you clicked it')
    darkMode()
})