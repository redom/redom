var doc = document.getElementById('doc');
var menu = document.createElement('div');
var menucontainer = document.createElement('div');
var logoA = document.createElement('a');
var logo = document.createElement('img');
var hovermenu = document.createElement('div');
var hovermenuclose = document.createElement('div');
var mobile = false;

hovermenu.id = 'hovermenu';
hovermenu.textContent = 'Menu';
hovermenu.style.display = 'none';
hovermenuclose.id = 'hovermenuclose';
hovermenuclose.textContent = 'Close menu';
hovermenuclose.style.display = 'none';

hovermenu.onclick = function (e) {
  var targetMenuItem;
  for (var i = 0; i < headers.length; i++) {
    if (headers[i].getBoundingClientRect().top >= 0) {
      targetMenuItem = menuitems[i];
      break;
    }
  }

  document.body.style.overflow = 'hidden';
  menu.style.display = '';
  hovermenu.style.display = 'none';
  hovermenuclose.style.display = '';
  hovermenuclose.classList.add('slidein');
  hovermenuclose.style.animationDelay = '0.25s';
  menu.scrollTop = targetMenuItem.offsetTop - window.innerHeight / 4;
  document.body.classList.add('pushout');
  menu.classList.remove('fadeout');
  menu.classList.add('slidein');
  doc.classList.remove('pushin');
  doc.classList.add('pushout');
  menu.onclick = doc.onclick = hovermenuclose.onclick = function (e) {
    menu.onclick = doc.onclick = hovermenuclose.onclick = null;
    menu.classList.add('fadeout');
    menu.classList.remove('slidein');
    menu.style.overflow = 'hidden';
    doc.classList.add('pushin');
    doc.classList.remove('pushout');
    hovermenu.style.display = '';
    hovermenu.classList.add('slidein');
    hovermenu.style.animationDelay = '0.25s';
    hovermenuclose.classList.remove('slidein');
    hovermenuclose.classList.add('fadeout');
    hovermenuclose.style.display = 'none';
    window.onclick = null;
    document.body.style.overflow = '';
    setTimeout(function () {
      if (!mobile) {
        return;
      }
      menu.style.display = 'none';
      menu.style.overflow = '';
      menu.classList.remove('fadeout');
      doc.classList.remove('pushin');
      hovermenu.classList.remove('slidein');
    }, 750);
  };
};

menu.id = 'menu';
menucontainer.id = 'menucontainer';

logoA.href = 'https://redom.js.org';
logo.id = 'logo';
logo.src = '../img/logo.svg';

logoA.appendChild(logo);
menucontainer.appendChild(logoA);

document.body.appendChild(hovermenu);

var headers = [];
var menuitems = [];

for (var i = 0; i < doc.children.length; i++) {
  var child = doc.children[i];

  if (~'H2 H3 H4'.split(' ').indexOf(child.tagName)) {
    headers.push(child);
    addItem(menu, child);
  } else if (child.tagName === 'PRE') {
    var code = child.querySelector('code');

    if (code.className === 'lang-html') {
      code.className = 'language-markup';
    } else if (code.className === 'lang-js') {
      code.className = 'language-javascript';
    }
  }
}

function addItem (menu, child) {
  var item = document.createElement('p');
  var link = document.createElement('a');
  var indentation = parseInt(child.tagName.slice(1), 10) - 2;

  if (indentation) {
    item.className = 'menu-item menu-sub-item';
  } else {
    item.className = 'menu-item';
  }
  item.style.paddingLeft = indentation + 'rem';

  link.textContent = child.textContent;

  link.href = '#' + child.id;
  item.appendChild(link);
  menucontainer.appendChild(item);
  menuitems.push(item);
}
menu.appendChild(menucontainer);
document.body.appendChild(menu);
document.body.appendChild(hovermenuclose);

window.addEventListener('resize', resize);

resize();

function resize () {
  if (window.innerWidth <= 640) {
    if (mobile) {
      return;
    }
    mobile = true;
    menu.style.display = 'none';
    menu.style.width = '100%';
    menu.style.fontSize = 'calc(1.5rem + 1px)';
    menu.style.paddingLeft = '3rem';
    menucontainer.style.display = 'inline-block';
    hovermenu.style.display = '';
    hovermenuclose.style.display = 'none';
    doc.style.left = 0;
  } else {
    if (!mobile) {
      return;
    }
    mobile = false;
    menu.style.display = '';
    menu.style.width = '';
    menu.style.textAlign = '';
    menu.style.fontSize = '';
    menu.style.paddingLeft = '';
    menucontainer.style.textAlign = '';
    menucontainer.style.display = '';
    hovermenu.style.display = 'none';
    hovermenuclose.style.display = 'none';
    doc.style.left = '';
    doc.classList.remove('pushin');
    doc.classList.remove('pushout');
    menu.classList.remove('slidein');
    menu.classList.remove('fadeout');
    menu.onclick = doc.onclick = null;
    document.body.style.overflow = '';
  }
}
