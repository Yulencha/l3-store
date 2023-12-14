import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import html from './searchHints.tpl.html';

export class SearchHints {
  view: View;
  hints: Array<{ name: string; url: string }>;

  constructor(hints: Array<{ name: string; url: string }>) {
    this.hints = hints;
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.innerHTML = '';
    $root.appendChild(this.view.root);
  }

  render() {
    const container = this.view.root;
    container.innerHTML = ''; // Очистить перед добавлением нового контента

    // Создаем и добавляем элемент <p>
    const promptElement = document.createElement('p');
    promptElement.className = 'search-hints__prompt';
    promptElement.textContent = 'Например,';
    container.appendChild(promptElement);

    // Создаем и добавляем элемент <ul>
    const listElement = document.createElement('ul');
    listElement.className = 'search-hints__list';
    container.appendChild(listElement);

    // Динамическое создание элементов списка
    this.hints.forEach((hint: { name: string; url: string }, index: number) => {
      const itemElement = document.createElement('li');
      itemElement.className = 'search-hints__item';

      const linkElement = document.createElement('a');
      linkElement.className = 'search-hints__link';
      linkElement.href = hint.url;

      const textElement = document.createElement('span');
      textElement.className = 'search-hints__text';
      textElement.textContent = hint.name;
      linkElement.appendChild(textElement);

      itemElement.appendChild(linkElement);
      listElement.appendChild(itemElement);

      // Логика добавления запятых и слова "или"
      if (index < this.hints.length - 1) {
        if (index === this.hints.length - 2) {
          // Добавляем "или" перед последним элементом
          const orText = document.createTextNode('\u00A0или');
          itemElement.appendChild(orText);
        } else {
          // Добавляем запятую между элементами
          const commaText = document.createTextNode(', ');
          itemElement.appendChild(commaText);
        }
      }
    });
  }
}
