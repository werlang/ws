// initialize all template vars
const templateVars = {};
document.querySelectorAll('.template-var').forEach(e => {
    templateVars[ e.id ] = e.value;
    e.remove();
});

console.log(templateVars);