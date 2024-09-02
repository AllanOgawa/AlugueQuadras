import { exec, spawn } from 'child_process';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as clc from 'cli-color';

dotenv.config();

const dropSQLPath = path.resolve(__dirname, '../database/typeorm/sql/drop_alugue_quadras.sql');
const createSQLPath = path.resolve(__dirname, '../database/typeorm/sql/alugue_quadras.sql');

function startBackend() {
  console.log(clc.bgBlue('Iniciando o backend...'));

  const backendProcess = spawn('npm', ['run', 'start'], { stdio: 'inherit' });

  backendProcess.on('close', (code) => {
    console.log(`Processo de backend finalizado com o código ${code}`);
  });
}

const runDropCommand = `PGPASSWORD=${process.env.DB_PASSWORD} psql -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USERNAME} -d postgres -f ${dropSQLPath}`;
const runCreateCommand = `PGPASSWORD=${process.env.DB_PASSWORD} psql -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USERNAME} -d alugue_quadras -f ${createSQLPath}`;

exec(runDropCommand, (error, stdout, stderr) => {
  console.log(clc.bgCyan('Executando script SQL para dropar o banco de dados...'));

  if (error) {
    console.error(clc.red(`Erro ao rodar o script SQL de drop: ${error.message}`));
    process.exit(1);
  }
  if (stderr) {
    console.error(clc.yellow(`stderr: ${stderr}`));
  }
  console.log(clc.green(`stdout: ${stdout}`));

  exec(runCreateCommand, (error, stdout, stderr) => {
    console.log(clc.bgCyan('Executando script SQL para criar o banco de dados...'));

    if (error) {
      console.error(clc.red(`Erro ao rodar o script SQL de criação: ${error.message}`));
      process.exit(1);
    }
    if (stderr) {
      console.error(clc.yellow(`stderr: ${stderr}`));
    }

    console.log(clc.green(`stdout: ${stdout}`));

    startBackend();
  });
});
