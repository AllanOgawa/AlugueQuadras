import { exec } from 'child_process';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as clc from 'cli-color';
import { promisify } from 'util';

// CARREGANDO VARIÁVEIS DE AMBIENTE

const env = process.env.NODE_ENV || 'development';
const envFilePath = path.resolve(process.cwd(), `env/${env}.env`);
dotenv.config({ path: envFilePath });

const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

// EXECUTANDO SCRIPTS SQL

const execPromise = promisify(exec);

const createSQLPath = path.resolve(__dirname, '../sql/SCHEMAS.sql');

const checkDbCommand = `PGPASSWORD=${dbPassword} psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${dbName}'"`;
const createDbCommand = `PGPASSWORD=${dbPassword} createdb -h ${dbHost} -p ${dbPort} -U ${dbUser} ${dbName}`;

const runCreateCommand = `PGPASSWORD=${dbPassword} psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -f ${createSQLPath}`;

export async function runSQLScripts() {
  try {
    console.log(clc.bgCyan('Verificando se o banco de dados existe...'));
    
    // Verifica se o banco de dados existe
    const { stdout: checkStdout } = await execPromise(checkDbCommand);
    const dbExists = checkStdout.trim() === '1';

    if (!dbExists) {
      console.log(clc.bgCyan(`Banco de dados "${dbName}" não existe. Criando...`));
      
      // Cria o banco de dados
      await execPromise(createDbCommand);
      console.log(clc.green(`Banco de dados "${dbName}" criado com sucesso.`));
    } else {
      console.log(clc.bgCyan(`Banco de dados "${dbName}" já existe.`));
    }

    console.log(clc.bgCyan('Executando script SQL para criar SCHEMAS...'));
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
