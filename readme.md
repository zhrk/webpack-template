## Установка webpack

Для начала нужно создать **package.json** с помощью `npm init`

После этого инициализировать git репозиторий и создать файл **.gitignore** с таким содержимым внутри:

```
node_modules
package-lock.json
```

Далее нужно выполнить

```
npm i webpack webpack-cli --save-dev
```

Эта команда установит необходимые пакеты для начала минимальной работы с webpack. Первый пакет собственно сам webpack, второй - интерфейс командной строки для работы с ним. Без него банально нельзя будет сбилдить бандл.

Далее нужно создать **webpack.config** чтобы не использовать дефолтный конфиг вебпака и иметь возможность расширять свой собственный.

```
const path = require("path"); // стандартный пакет который поставляется вместе с node.js и его нет надобности устанавливать (вроде как на самом деле есть, но эта информация старая и возможно не актуальна в новых версиях ноды)

module.exports = {
  entry: './src/index.js', // точка входа в приложение
  output: {
    path: path.resolve(__dirname, 'dist'), // путь к точке выхода конечного бандла (расчитывается с помощью пакета path и константы __dirname поставляемой нодой)
    filename: 'bundle.js', // имя файла с бандлом
  },
};
```

И создать **src/index.js** + **index.html**, в первом написать любой JavaScript код для теста, во втором то, что ниже:

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    123
  </body>
  <script src="dist/bundle.js"></script>
  <!-- Тут по сути важна только строчка выше, т.к. это по сути и есть подключения бандла к документу -->
</html>
```

Собственно и все, осталось только отредактировать файл **package.json**

```
{
  ...
  "main": "index.js", - удалить эту строчку, т.к. точка входа и так определена и обрабатывается webpack-ом
  "scripts": {
    "dev": "webpack" - заменить стандартную с test на эту
  },
}

```

и выполнить билд введя в консоли `npm run dev`

По итогу получится бандл в папке **dist**, который подключается в **index.html** и берёт весь код из **src/index.js**

## Установка babel

Нужно начать с того, что указать webpack-у в каком "моде" работает скрипт. В дальнейшем это понадобится для того, чтобы опираться на это в **webpack.config**, а пока хотя бы пропадёт предупреждение при создании бандла.
Плюс ко всему можно заметить, что в production моде код, который собирается в бандле не так читаем, как в development.

```
"dev": "webpack --mode development"
```

После этого надо установить babel

```
npm i @babel/core @babel/preset-env babel-loader --save-dev
```

**@babel/core** - парсит и транспилирует JavaScript код.

**@babel/babel/preset-env** - правила, которые описаны в этом пакете, применяются при транспиляции распаршенного кода чтобы он мог запускаться в браузерах которые его не поддерживают.

**babel-loader** - лоадер для вебпака, с помощью него весь JavaScript код обрабатывается с помощью babel.

Далее сконфигурируем webpack для работы с этими пакетами изменив **webpack.config.js**:

```
module.exports = {
  ...,
  module: {
    rules: [
      {
        test: /\.js$/, // правило справедливо для всех .js файлов
        use: ['babel-loader'], // все файлы которые прошли проверку на регулярное выражение будут обработаны этим лоадером
        exclude: /node_modules/, // игнорировать папку с зависимостями
      },
    ],
  },
};
```

Теперь надо настроить сам babel создав в корне проекта файл **.babelrc** и добавив в него:

```
{
  "presets": ["@babel/preset-env"]
}
```

Таким образом вебпак будет обрабатывать все .js файлы с помощью лоадера и пропускать их через babel, который в свою очередь преобразует код для работы в старых браузерах

## Установка eslint и Prettier

https://www.npmjs.com/package/eslint-config-airbnb - пакеты для установки с React

https://www.npmjs.com/package/eslint-config-airbnb-base - без React

Выбрать airbnb-пакет, установить по инструкции и далее установить следующие пакеты:

```
npm i prettier eslint-plugin-prettier eslint-config-prettier --save-dev
```

**prettier** - необходим для корректного опредления и исправления ошибок форматирования

**eslint-plugin-prettier** - активирует Prettier в качестве зависимости для линтера, из-за чего eslint так же подсвечивает ошибки форматирования

**eslint-config-prettier** - отключает некоторые правила у eslint которые могут конфликтовать с Prettier (например чинит форматирование стрелочных функций)

И так же необходимо создать два файла для того, чтобы все это работало. Первый - **.eslintrc**, с таким содержимым:

```
{
  "extends": ["airbnb-base", "prettier"], // расширение каких-либо заранее определенных правил для линтера
  "plugins": ["prettier"], // использовать Prettier в качестве зависимости для линтера
  "env": {
    "browser": true // указывает окружение из-за чего браузерные переменные типа window не будут определены как undefined
  },
  "rules": {
    "prettier/prettier": "error", // использовать Prettier в качестве зависимости для линтера
    ... // ниже идет набор индивидуальных правил для каждого проекта
  }
}
```

`airbnb-base` в **extends** может быть просто `airbnb`, зависит от того, какой был выбран набор правил

Второй - **.prettierrc**, внутри:

```
{
  "printWidth": 110,
  "singleQuote": true,
  "trailingComma": "all"
}
```

Эти два файла необходимы просто для того, чтобы все начало работать, но настройки внутри них индивидуальны для каждого проекта. Так как для airbnb конфига нужно дублировать некоторые правила чтобы не было конфликтов при автоматическом форматировании, например с одинарными и двойными ковычками которые неправильно заменяются.

---

Так же не совсем ясно что иногда делать со следующими пакетами:

**babel-eslint** - вроде как нужен для корректного линтинга некоторых особенных конструкций кода, но я такие практически не встречаю, и возможно они просто не правильно написаны, что сводит необходимость этого плагина к нулю.

---

Вообщем и целом, чтобы адекватно и удобно линтить проект нужно довольно костыльными методами подружить между собой eslint и Prettier. В случае если правила для линтинга индвивидуальные, и все задаются вручную, то в целом ничего сложного не будет. Но если использовать какое-либо готовое решение по типу airbnb, то придётся проверять код на адекватное поведение при форматировании, так как скорее всего нужно будет переопределять или дублировать правила в двух пакетах.

## Автоматическая перезагрузка при изменении кода

Установить

```
npm i webpack-dev-server --save-dev
```

Заменить

```
"dev": "webpack --mode development"
```

на

```
"dev": "webpack-dev-server --mode development"
```

И в **webpack.config.js** добавить publicPath чтобы webpack-dev-server знал куда смотреть когда запускает проект

```
output: {
  ...,
  publicPath: 'dist',
},
```

Так же если нужно переместить index.html надо изменить конфиг дев-сервера

```
devServer: {
  contentBase: path.join(__dirname, 'public'),
},
```

Чтобы выключить логи в консоли

```
devServer: {
  clientLogLevel: 'silent',
},
```

## CSS-модули

```
npm i css-loader style-loader --save-dev
```

**css-loader** - загружает CSS код как JS-строку

**style-loader** - вставляет CSS код загржуенный с помощью `css-loader` в DOM

Добавить новое правило для обработки CSS:

```
{
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: true,
      },
    },
  ],
},
```

Так как лоадеры в вебпаке работают справа налево, то это правило будет обрабатывать каждый .css импорт соответствующим лоадером, а потом вставлять его код в DOM-дерево. При этом опция `modules: true` позволяет инкапсулировать стили рядом со своими компонентами, создавая классам уникальные имена основываясь на пути и имени файла.

Этот способ сборки стилей не идеален, но достаточно хорошие идеи можно взять из этой статьи https://habr.com/ru/company/constanta/blog/428800/.

## Установка React

Установить пакеты

```
npm i react react-dom
```

```
npm i @babel/preset-react --save-dev
```

В **index.html** добавить div для рендера приложения

```
<div id="root"></div>
```

Изменить **.babelrc** чтобы транспилировать jsx в обыкновенный JavaScript

```
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

Изменить **src/index.js**

```
import React from 'react';
import ReactDOM from 'react-dom';

const Test = () => <div>test</div>;

ReactDOM.render(<Test />, document.getElementById('root'));

```

## Остальное

ts-loader транспилирует из коробки

для .css файлов нужно описывать глобальные типы в typings.d.ts чтобы не ругалось

в конфиге вебпака настройка resolve.extensions отвечает за то, какие одноименные файлы без указания расширения вебпак при импорте будет перебирать. т.е. по дефолту там есть какой-нибудь .js, но с тайпскриптом надо добавить .ts и .tsx чтобы не писать при импорте расширение вручную

```
{
  "compilerOptions": {
    "jsx": "react", // tsx файлы с этим значением будут транспилироваться в React.createEllement, со значением "preserve" например не будет происходить ничего
    "strict": true, // включает строгую проверку для всего
    "esModuleInterop": true // настройка необходимая для корректной работы с модулями у которых нет явного указания export default, при импорте фиксит неймспейсы чтобы не было конфликтов с CommonJS модулями
  }
}
```

```
{
  "parser": "@typescript-eslint/parser", //парсер тайпскрипта для еслинта
  ...
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".ts", ".tsx"] // позволяет линтеру резолвить доп расширения файлов, такая же история как с конфигом вебпака
      }
    }
  },
  "rules": {
    "import/extensions": "off", // т.к. .ts и .tsx нестандартные расширения надо глобально заюзать это правило
  }
}
```

```
"devDependencies": {
    "@types/react": "16.9.41", // типы для реакта
    "@types/react-dom": "16.9.8", // типы для реакт-дома
    "@typescript-eslint/parser": "3.5.0", // парсер для еслинта
    "eslint-import-resolver-typescript": "2.0.0", // резолвер импортов для еслинта
    "ts-loader": "7.0.5", // лоадер для .ts и .tsx, так же из коробки имеет транспиляцию и вообще большое кол-во настроек https://www.typescriptlang.org/tsconfig
    "typescript": "3.9.6", // тайпскрипт ¯\_(ツ)_/¯
  }
```

```
{
  "extends": [
    "airbnb/hooks", // нужно экстендить доп-но чтобы работали правила для хуков
    "plugin:@typescript-eslint/recommended", // хз как это работает, но без неё и практически аналогичной строчки в плагинах не подсвечиваются нетипизированные места
    "prettier/react", // нужно экстендить если используешь eslint-plugin-react
    "prettier/@typescript-eslint" // аналогично строчке выше
  ],
  "plugins": ["prettier", "@typescript-eslint"], // см. выше
}
```

## Stylelint - пропущенные:

no-descending-specificity
color-no-hex
function-blacklist
function-url-no-scheme-relative
function-url-scheme-blacklist
function-url-scheme-whitelist
function-whitelist
keyframes-name-pattern
number-max-precision
time-min-milliseconds
unit-blacklist
unit-whitelist
custom-property-pattern
property-blacklist
property-whitelist
declaration-no-important
declaration-property-unit-blacklist
declaration-property-unit-whitelist
declaration-property-value-blacklist
declaration-property-value-whitelist
selector-attribute-operator-blacklist
selector-attribute-operator-whitelist
selector-class-pattern
selector-combinator-blacklist
selector-combinator-whitelist
selector-id-pattern
selector-max-attribute
selector-max-class
selector-max-combinators
selector-max-compound-selectors
selector-max-id
selector-max-pseudo-class
selector-max-specificity
selector-max-type
selector-max-universal
selector-no-qualifying-type
selector-pseudo-class-blacklist
selector-pseudo-class-whitelist
selector-pseudo-element-blacklist
selector-pseudo-element-whitelist
media-feature-name-blacklist
media-feature-name-value-whitelist
media-feature-name-whitelist
custom-media-pattern
at-rule-blacklist
at-rule-property-requirelist
at-rule-whitelist
comment-word-blacklist
max-nesting-depth
custom-property-empty-line-before
declaration-colon-newline-after - не хватает never
at-rule-empty-line-before
at-rule-name-newline-after
at-rule-semicolon-newline-after
at-rule-semicolon-space-before
comment-empty-line-before
max-line-length
no-eol-whitespace
no-missing-end-of-source-newline
no-empty-first-line
unicode-bom
