"strict mode";
import { parse, stringify } from "csv";
import fs from "node:fs";

const arrTocsv = (path, arr) => {
  stringify(arr, { header: true, delimiter: "," }, (err, output) => {
    if (err) throw err;
    fs.writeFile(path, output, (err) => {
      if (err) throw err;
      console.log("CSV file created successfully");
    });
  });
};

const csvToArr = async (path, parseconf) => {
  const records = [];
  const parser = fs
    .createReadStream(path, { encoding: "utf-8" })
    .pipe(parse(parseconf));
  for await (const record of parser) {
    records.push(record);
  }
  return records;
};

const desa2Map = await csvToArr("./rpt/cc_t_punto_cnb.rpt", {
  delimiter: "\t",
  relax_column_count: true,
  relax_quotes: true,
  skip_empty_lines: true,
  trim: true,
  quote: '"',
  escape: '"',
  columns: true,
});

const comerciosMap = await csvToArr(`./in/comercios.csv`, {
  delimiter: ";",
  relax_column_count: true,
  relax_quotes: true,
  skip_empty_lines: true,
  trim: true,
  quote: '"',
  escape: '"',
  columns: true,
});

// console.log(
//   "Comercios BEFORE CHANGE With Parroquia",
//   comerciosMap.filter((x) => x.pt_parroquia !== "" && x.pt_cod_parroquia !== "")
//     .length
// );

// console.log("Desa2 Length", desa2Map.length);

// console.log(
//   "Desa2 BEFORE CHANGE Without Parroquia",
//   desa2Map.filter((x) => x.pt_parroquia == "" && x.pt_cod_parroquia == "")
//     .length
// );

comerciosMap.forEach((comercio) => {
  desa2Map.forEach((desa, i) => {
    if (comercio.pt_cod === desa.pt_cod) {
      desa2Map[i].pt_parroquia = comercio.pt_parroquia;
      desa2Map[i].pt_cod_parroquia = comercio.pt_cod_parroquia;
    }
  });
});

// console.log(
//   "Desa2 AFTER CHANGE Without Parroquia",
//   desa2Map.filter((x) => !x.pt_parroquia || !x.pt_cod_parroquia).length
// );

// console.log(
//   "Desa2 AFTER CHANGE",
//   desa2Map.filter((x) => !x.pt_parroquia || !x.pt_cod_parroquia)
// );

arrTocsv("./rpt/out_cc_t_punto_cnb.csv", desa2Map);
