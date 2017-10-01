var doc = document.getElementById('doc');
var menu = document.createElement('div');
var menucontainer = document.createElement('div');
var logoA = document.createElement('a');
var logo = document.createElement('img');
var hovermenu = document.createElement('div');
var hovermenuclose = document.createElement('div');
var searchContainer = document.createElement('div');
var searchField = document.createElement('input');
var mobile = false;
var searchData = [];

searchContainer.id = 'search';
searchContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"/></svg>';

searchField.autofocus = true;

searchField.onclick = function (e) {
  e.stopPropagation();
};

searchContainer.insertBefore(searchField, searchContainer.firstChild);
menu.appendChild(searchContainer);

searchField.oninput = function () {
  var searchResults = search(searchField.value.toLowerCase());

  for (var i = 0; i < menuitems.length; i++) {
    var menuitem = menuitems[i];

    if (searchResults[i]) {
      menuitem.style.opacity = 1;
    } else {
      menuitem.style.opacity = 0.25;
    }
  }
};

hovermenu.id = 'hovermenu';
hovermenu.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z"/></svg>';
hovermenu.style.display = 'none';
hovermenuclose.id = 'hovermenuclose';
hovermenuclose.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M231.6 256l130.1-130.1c4.7-4.7 4.7-12.3 0-17l-22.6-22.6c-4.7-4.7-12.3-4.7-17 0L192 216.4 61.9 86.3c-4.7-4.7-12.3-4.7-17 0l-22.6 22.6c-4.7 4.7-4.7 12.3 0 17L152.4 256 22.3 386.1c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c4.7 4.7 12.3 4.7 17 0L192 295.6l130.1 130.1c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17L231.6 256z"/></svg>';
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
  searchField.focus();
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
  } else if (child.tagName !== 'H1') {
    if (child.tagName === 'PRE') {
      var code = child.querySelector('code');

      if (code.className === 'lang-html') {
        code.className = 'language-markup';
      } else if (code.className === 'lang-js') {
        code.className = 'language-javascript';
      }
    }
    searchData.push({
      header: headers.length - 1,
      phrase: child.textContent.toLowerCase()
    });
  }
}

function search (str) {
  var results = {};
  for (var i = 0; i < searchData.length; i++) {
    var data = searchData[i];
    var index = data.phrase.indexOf(str);

    if (~index) {
      results[data.header] = true;
    }
  }
  return results;
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

  item.onclick = function () {
    searchField.value = '';
    searchField.oninput();
  };
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
