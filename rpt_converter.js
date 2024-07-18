"strict mode";
import fs from "fs";
import readline from "readline";

const inputFilePath = "./rpt/cc_t_punto_cnb.rpt";
const outputFilePath = "./rpt/out_cc_t_punto_cnb.csv";

const fileStream = fs.createReadStream(inputFilePath, {
  encoding: "utf-8",
});
const writeStream = fs.createWriteStream(outputFilePath, {
  encoding: "utf-8",
});

const readlineInterface = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

let count = 0;
for await (const line of readlineInterface) {
  if (count === 0) {
    console.log(line);
  } else {
  }
  // console.log(line.replace(/"	"/, ";"));
  // console.log(line.split("	"));
  // const content = line.split("	").join(";").toString();
  // writeStream.write(content + "\n");
  count++;
}

// Cerramos el stream de escritura
writeStream.end();
// console.log("write end");
