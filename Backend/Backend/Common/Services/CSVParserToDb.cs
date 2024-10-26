using Backend.Database.Models;
using System.Collections.Generic;

namespace Backend.Common.Services
{
    public class CSVParserToDb
    {
        // первая строка это название таблицы
        // вторая строка это ее стобцы
        public List<PropertiesEntity>? ParseCSV(IFormFile file)
        {
            List<PropertiesEntity> properties = new List<PropertiesEntity>();
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
            while (!rs.EndOfStream)
            {
                var row = rs.ReadLine();
                ws.WriteLine(row);
            }
            stream.Close();
            rs.Close();
            streamToWrite.Close();

            string text = File.ReadAllText(path);
            var cells = text.Split(';');
            var chunks = cells.Chunk(columnNames.Length - 1).ToArray();
            for ( int i = 0; i < chunks.Count(); i++)
            {
                for (int j = 0; j < chunks[i].Count(); j++)
                {
                    if (chunks[i][j].StartsWith("\"") && chunks[i][j].EndsWith("\""))
                    {
                        chunks[i][j].Replace("\n", " ");
                    }
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
