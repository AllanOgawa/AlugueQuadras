import { exec } from 'child_process';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as clc from 'cli-color';
import { promisify } from 'util';

// CARREGANDO VARIÁVEIS DE AMBIENTE

const env = process.env.NODE_ENV;
const envFilePath = path.resolve(process.cwd(), `env/${env}.env`);
dotenv.config({ path: envFilePath });

const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

console.log();

const execPromise = promisify(exec);

const dropSQLPath = path.resolve(__dirname, './sql/DROP.sql');
const createSQLPath = path.resolve(__dirname, './sql/CREATE.sql');

const runDropCommand = `PGPASSWORD=${dbPassword} psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d postgres -f ${dropSQLPath}`;
const runCreateCommand = `PGPASSWORD=${dbPassword} psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -f ${createSQLPath}`;

export async function runSQLScripts() {
  try {
    console.log(clc.bgCyan('Executando script SQL para dropar o banco de dados...'));
    const dropResult = await execPromise(runDropCommand);
    console.log(clc.green(`stdout (drop): ${dropResult.stdout}`));

    if (dropResult.stderr) {
      console.error(clc.yellow(`stderr (drop): ${dropResult.stderr}`));
    }

    console.log(clc.bgCyan('Executando script SQL para criar o banco de dados...'));
    const createResult = await execPromise(runCreateCommand);
    console.log(clc.green(`stdout (create): ${createResult.stdout}`));

    if (createResult.stderr) {
      console.error(clc.yellow(`stderr (create): ${createResult.stderr}`));
    }

  } catch (error) {
    console.error(clc.red('Erro ao executar os scripts SQL:'), error);
    process.exit(1);
  }
}

runSQLScripts().then(() => {
  console.log(clc.bgGreen('Scripts SQL concluídos!'));
  process.exit(0);
});
