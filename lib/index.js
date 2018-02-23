const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');

const { version } = require('../package');

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd) {
  const args = {};
  cmd.options.forEach((o) => {
    const key = o.long.replace(/^--/, '');
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function') {
      args[key] = cmd[key];
    }
  });
  return args;
}

const cli = () => {
  program
    .version(version)
    .usage('<command> [options]');

  program
    .command('foo <command>')
    .option('-t, --test [value]', 'given a test parameter')
    .option('-f, --force', 'to something force')
    .description('do "foo" with "options"')
    .action((name, cmd) => {
      // require('../lib/<command>')(name, cleanArgs(cmd))
      console.log(name, cleanArgs(cmd));

      inquirer
        .prompt([
          {
            type: 'checkbox',
            message: 'Entscheide dich für etwas',
            name: 'entscheidungen',
            choices: [
              new inquirer.Separator(' = teil 1 ='),
              { name: 'teil 1 - antwort 1' },
              { name: 'teil 1 - antwort 2' },
              { name: 'teil 1 - antwort 3' },
              new inquirer.Separator(' = teil 2 ='),
              { name: 'teil 2 - antwort 1' },
              { name: 'teil 2 - antwort 2' },
              { name: 'teil 2 - antwort 3' },
            ],
          },
          {
            type: 'list',
            name: 'size',
            message: 'What size do you need?',
            choices: ['Large', 'Medium', 'Small'],
            filter(val) {
              return val.toLowerCase();
            },
          },
        ])
        .then((answers) => {
          console.log(JSON.stringify(answers));
        });
    });

  // add some useful info on help
  program.on('--help', () => {
    console.log();
    console.log(`  Run ${chalk.cyan('ngcli-wrapper --help')} for detailed usage of given command.`);
    console.log();
  });

  program
    .parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};

module.exports.cli = cli;
