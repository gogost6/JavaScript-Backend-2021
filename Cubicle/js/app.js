document.querySelector('.cube-list').addEventListener('click', (event) => {
    
    if(event.target.tagName === 'BUTTON' && event.target.className.includes('more')) {
        event.target.parentNode.querySelector('.cube-description').style.display = 'block';
        event.target.className = 'btn less';
        event.target.textContent = 'Show less';
    } else if(event.target.tagName === 'BUTTON' && event.target.className.includes('less')) {
        event.target.parentNode.querySelector('.cube-description').style.display = 'none';
        event.target.className = 'btn more';
        event.target.textContent = 'Show more';
    }
});


//document.querySelectorAll('div.cube-description')[0].display = 'block';