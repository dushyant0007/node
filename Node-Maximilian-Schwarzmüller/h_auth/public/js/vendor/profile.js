
function enableEdit(event) 
{
    event.preventDefault()
    const button = event.target

    console.log(button)
    
    const nameInput = button.parentNode.getElementsByTagName('input')[0];
    nameInput.readOnly = false;
    nameInput.focus();
    
}