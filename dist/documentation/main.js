var doc = document.getElementById('doc');
var menu = document.createElement('div');
var logo = document.createElement('img');

menu.id = 'menu';

logo.id = 'logo';
logo.src = '../img/logo.svg';

menu.appendChild(logo);

for (var i = 0; i < doc.children.length; i++) {
  var child = doc.children[i];

  if (~'H1 H2 H3 H4'.split(' ').indexOf(child.tagName)) {
    addItem(menu, child);
  }
}

function addItem (menu, child) {
  var item = document.createElement('p');
  var link = document.createElement('a');
  var indentation = parseInt(child.tagName.slice(1), 10) - 1;

  item.className = 'menu-item';
  item.style.paddingLeft = indentation + 'rem';

  link.textContent = child.textContent;

  link.href = '#' + child.id;
  item.appendChild(link);
  menu.appendChild(item);
}

document.body.appendChild(menu);
