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
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            var rs = new StreamReader(stream, Encoding.GetEncoding("windows-1251"));
            if (rs == null) return null;
            
            var row1 = rs.ReadLine().Split(";");
            //if (row1.Length > 1)
            //{
            //    return null;
            //}
            var columnNames = rs.ReadLine().Split(";");
            int rowId = -1;
            while (!rs.EndOfStream)
            {
                rowId++;
                var row = rs.ReadLine().Split(";");
                if (row.Length != columnNames.Length)
                    return null;
                for (int columnId = 0; columnId < row.Length; columnId ++)
                {
                    var entity = new PropertiesEntity
                    {
                        ColumnName = columnNames[columnId],
                        ColumnId = columnId,
                        RowId = rowId,
                        Value = row[columnId],
                        Type = GetCellType(row[columnId]).ToString()
                    };
                    properties.Add(entity);
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
