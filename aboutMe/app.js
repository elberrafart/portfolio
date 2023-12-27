const lightBtn = document.getElementById('light-btn')

function toggleTheme() {
    if (document.body.style.backgroundColor === 'black') {
        // Switch to light mode
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
        document.getElementById('myHeader').style.backgroundColor = 'white';
    } else {
        // Switch to dark mode
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
        document.getElementById('myHeader').style.backgroundColor = 'black';
    }
}

lightBtn.addEventListener('click', function() {
    console.log('You clicked it');
    toggleTheme();
});