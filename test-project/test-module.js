export function testThing() {
  var newDiv = document.createElement('div');
  newDiv.appendChild(document.createTextNode('it\'s working!'));
  document.body.appendChild(newDiv);
}
