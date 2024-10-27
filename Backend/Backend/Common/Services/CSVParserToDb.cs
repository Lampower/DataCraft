using Backend.Database.Models;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.Extensions.FileSystemGlobbing.Internal;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Backend.Common.Services
{
    public class CSVParserToDb
    {
        // первая строка это название таблицы
        // вторая строка это ее стобцы
        public List<PropertiesEntity>? ParseCSV(IFormFile file)
        {
            List<PropertiesEntity>? properties = new List<PropertiesEntity>();

            if (file.ContentType != "text/csv")
                return null;
            var stream = file.OpenReadStream();
            var path = Path.Combine(Directory.GetCurrentDirectory(), "file.csv");
            var streamToWrite = File.Open(path, FileMode.OpenOrCreate);
            var ws = new StreamWriter(streamToWrite);
            var rs = new StreamReader(stream);
            if (rs == null) return null;
            
            var row1 = rs.ReadLine().Split(";");
            if (row1.Length > 1)
            {
                return null;
            }
            var columnNames = rs.ReadLine().Split(";");

            Console.OutputEncoding = Encoding.UTF8;
            var input = Regex.Replace(rs.ReadToEnd(), "(\"[^;]*)(;)([^;]*\")", "$1\n$3");
            var cells = input.Split(";\r\n").SelectMany(remainder => (remainder + ";").Split(";")).ToArray();
            
            var chunks = cells.Chunk(columnNames.Length).ToArray();
            //                      Perhaps -1 here? ^^^
            for (int i = 0; i < chunks.Count(); i++)
            {
                for (int j = 0; j < chunks[i].Count(); j++)
                {
                    var element = new PropertiesEntity()
                    {
                        ColumnName = columnNames[j],
                        Value = chunks[i][j],
                        Type = GetCellType(chunks[i][j]).ToString(),
                        ColumnId = j,
                        RowId = i
                    };

                    properties.Add(element);
                }
            }

            return properties;
        }

        private void WriteFileWithoutHeaderProps()
        {

        }

        private Type GetCellType(string cell)
        {
            if (DateTime.TryParse(cell, out var rs))
            {
                return rs.GetType();
            }
            else if (int.TryParse(cell, out int num))
            {
                return num.GetType();
            }
            else
                return cell.GetType();
        }
    }
}
