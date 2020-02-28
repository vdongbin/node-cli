#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const version = require('./package').version;

const {
  html,
  router,
  express,
  reactFunctional,
  reactClass
} = require('./template');

// 파일이 존재하는지 체크합니다.
const exist = dir => {
  try {
    fs.accessSync(
      dir,
      fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK
    );
    return true;
  } catch (e) {
    return false;
  }
};

// 해당 경로에 폴더를 생성합니다. 폴더 생성은 상위경로부터 진행됩니다.
const mkdirp = dir => {
  const dirname = path
    .relative('.', path.normalize(dir))
    .split(path.sep)
    .filter(p => !!p);
  dirname.forEach((d, idx) => {
    const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
    if (!exist(pathBuilder)) {
      fs.mkdirSync(pathBuilder);
    }
  });
};

const checkAndWrite = (type, name, directory) => {
  let pathToFile;
  if (type === 'html') {
    pathToFile = path.join(directory, `${name}.${type}`);
  } else {
    pathToFile = path.join(directory, `${name}.js`);
  }

  if (exist(pathToFile)) {
    console.error(chalk.bold.red('이미 해당 파일이 존재합니다'));
  } else {
    mkdirp(directory);
    if (type === 'html') {
      fs.writeFileSync(pathToFile, html);
    } else if (type === 'router') {
      fs.writeFileSync(pathToFile, router);
    } else if (type === 'express') {
      fs.writeFileSync(pathToFile, express);
    } else if (type === 'reactFunctional') {
      fs.writeFileSync(pathToFile, reactFunctional);
    } else if (type === 'reactClass') {
      fs.writeFileSync(pathToFile, reactClass);
    } else {
      console.error(chalk.bold.red('올바르지 않은 템플릿 타입입니다.'));
    }
    console.log(chalk.green(pathToFile, '생성 완료'));
  }
};

const makeTemplate = (type, name, directory) => {
  if (
    ['html', 'router', 'express', 'reactFunctional', 'reactClass'].includes(
      type
    )
  ) {
    checkAndWrite(type, name, directory);
  } else {
    console.error(
      chalk.bold.red(
        'type 명을 html || router || express || reactFunctional || reactClass 중에서 하나를 입력하세요.'
      )
    );
  }
};

let triggered = false;
program
  .version(version, '-v, --version')
  .usage('template [type] -n <name> -d [path]');

program
  .command('template <type>')
  .usage('--name <name> --path [path]')
  .description('템플릿을 생성합니다.')
  .alias('tmpl')
  .option('-n, --name <name>', '파일명을 입력하세요.', 'index')
  .option('-d, --directory [path]', '생성 경로를 입력하세요', '.')
  .action((type, options) => {
    makeTemplate(type, options.name, options.directory);
    triggered = true;
  });

program.command('*', { noHelp: true }).action(() => {
  console.log('해당 명령어를 찾을 수 없습니다.');
  program.help();
  triggered = true;
});

program.parse(process.argv);

if (!triggered) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'type',
        message: '템플릿 종류를 선택하세요.',
        choices: ['html', 'router', 'express', 'reactFunctional', 'reactClass']
      },
      {
        type: 'input',
        name: 'name',
        message: '파일의 이름을 입력하세요.',
        default: 'index'
      },
      {
        type: 'input',
        name: 'directory',
        message: '파일이 위치할 폴더의 경로를 입력하세요.',
        default: '.'
      },
      {
        type: 'confirm',
        name: 'confirm',
        message: '생성하시겠습니까?'
      }
    ])
    .then(answers => {
      if (answers.confirm) {
        makeTemplate(answers.type, answers.name, answers.directory);
        console.log(chalk.rgb(128, 128, 128)('터미널을 종료합니다.'));
      }
    });
}
