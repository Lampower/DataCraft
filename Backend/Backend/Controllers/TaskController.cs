using Backend.Common.Extensions;
using Backend.Common.Services;
using Backend.Database;
using Backend.Database.Models;
using Backend.Dto;
using CsvHelper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using OfficeOpenXml;
using System.Globalization;

namespace Backend.Controllers
{
    [Route("/tasks")]
    public class TaskController: ControllerBase
    {
        DatabaseContext context;
        private readonly CSVParserToDb parser;

        public TaskController(DatabaseContext context, CSVParserToDb parser)
        {
            this.context = context;
            this.parser = parser;
        }

        [HttpGet]
        public IActionResult Get(string column, int from = 0, int amount = 100)
        {
            var data = GetAsDictionaryByRows();
            var entities = data.Select(obj => { return obj[column]; })
                .Distinct()
                .ToList();
            var pag = new PaginatedList<string>();
            pag.TotalLength = entities.Count;
            pag.Entities = entities.Skip(from).Take(amount).ToList();
            return Ok(pag);
        }
        /// <summary>
        /// Can take no more than 100 objects.
        /// </summary>
        /// <returns></returns>
        [HttpPost("filter")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetFiltered([FromBody] List<FilterDto> filters, int from = 0, int amount = 100)
        {
            if (amount > 100) amount = 100; 

            var tasks = GetAsDictionaryByRows();
            
            tasks = FilterTask(tasks, filters);
            var pagTasks = new PaginatedList<Dictionary<string, string>>();
            pagTasks.TotalLength = tasks.Count;
            pagTasks.Entities = tasks.Skip(from).Take(amount).ToList();
            return Ok(pagTasks);
        }

        [HttpGet("names")]
        public IActionResult GetTableNames()
        {
            var columns = context.Properties
                //.GroupBy(p => p.ColumnName)
                .Select(t => t.ColumnName)
                .Distinct()
                .ToList();
            return Ok(columns);
        }

        //[HttpPost("time")]
        //public IActionResult GetTime(int from = 0, int amount = 100, int days = 30)
        //{
        //    var tasks = context.Tasks
        //        .Where(t => t.CreatedAt == null ? false : t.CreatedAt.Value > DateTime.Now.AddDays(-days) || 
        //        t.UpdatedAt == null ? false : t.UpdatedAt.Value > DateTime.Now.AddDays(-days))
        //        .ToList();
        //    var pagTasks = new PaginatedList<TaskEntity>();
        //    pagTasks.TotalLength = tasks.Count;
        //    pagTasks.Entities = tasks.Skip(from).Take(amount).ToList();
        //    return Ok(pagTasks);
        //}

        [HttpPost("loadTask")]
        public IActionResult Load(IFormFile file) 
        {
            LoadTask(file);
            return Ok();
        }

        [HttpPost("filterset")]
        public IActionResult FilterAndCount([FromBody] DiagramRequestDto dto, int from = 0, int amount = 100)
        {
            //var date = DateTime.Now.AddDays(-dto.Days);
            var tasks = GetAsDictionaryByRows();
            tasks = FilterTask(tasks, dto.Filters);

            Dictionary<string, PaginatedList<HashKeyDto>> responseObject = new();
            foreach (var column in dto.Columns)
            {
                var hashSet = GetColumnOverview(tasks, column);
                var pagHashSet = new PaginatedList<HashKeyDto>();
                pagHashSet.TotalLength = hashSet.Count;
                pagHashSet.Entities = hashSet.Skip(from).Take(amount).ToList();
                responseObject.Add(column, pagHashSet);
            }

            return Ok(responseObject);
        }

        object? SelectColumn(object field, string ColumnName)
        {
            {
                var property = field.GetType().GetProperty(ColumnName);
                var value = property.GetValue(field);
                return value;
            }
        }

        void LoadTask(IFormFile file)
        {
            var data = parser.ParseCSV(file);

            context.Properties.AddRange(data);
            context.SaveChanges();

            //var stream = file.OpenReadStream();
            //ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            //using (var package = new ExcelPackage(stream))
            //{
            //    var table = package.Workbook.Worksheets[0];
            //    var rows = table.Cells.EntireRow.Count();

            //    for (int i = 3; i < rows + 1; i++)
            //    {
            //        TaskEntity task = new TaskEntity();
            //        task.TaskId = Convert.ToInt32(table.GetValue(i, 1));
            //        task.ProjectName = table.GetValue(i, 2)?.ToString();
            //        task.TaskType = table.GetValue(i, 3)?.ToString();
            //        task.Status = table.GetValue(i, 4)?.ToString();
            //        task.Priority = table.GetValue(i, 5)?.ToString();
            //        task.TaskNumber = table.GetValue(i, 6).ToString();
            //        task.TaskName = table.GetValue(i, 7)?.ToString();
            //        var time = table.GetValue(i, 8)?.ToString();
            //        task.CreatedAt = time == null ? null : DateTime.Parse(time);
            //        task.CreatedBy = table.GetValue(i, 9)?.ToString();
            //        time = table.GetValue(i, 10)?.ToString();
            //        task.UpdatedAt = time == null ? null : DateTime.Parse(time);
            //        task.UpdatedBy = table.GetValue(i, 11)?.ToString();
            //        task.Description = table.GetValue(i, 12)?.ToString();
            //        task.PrevTaskId = table.GetValue(i, 13)?.ToString()?.ParseToNullableInt();
            //        task.Assigned = table.GetValue(i, 14)?.ToString();
            //        task.Owner = table.GetValue(i, 15)?.ToString();
            //        time = table.Cells[i, 16].Text?.ToString();
            //        task.Deadline = time == null || time == "" ? null : DateTime.Parse(time);
            //        task.TimeRating = table.GetValue(i, 17)?.ToString()?.ParseToNullableInt();
            //        task.Sprint = table.GetValue(i, 18)?.ToString();
            //        task.Estimation = table.GetValue(i, 19)?.ToString()?.ParseToNullableInt();
            //        task.TimeTaken = table.GetValue(i, 20)?.ToString()?.ParseToNullableInt();
            //        task.WorkerGroup = table.GetValue(i, 21)?.ToString();
            //        task.Resolution = table.GetValue(i, 22)?.ToString();

            //        context.Tasks.Add(task);
            //    }
            //}
            //context.SaveChanges();
        }
        List<Dictionary<string, string>> FilterTask(List<Dictionary<string, string>> list, List<FilterDto> filters)
        {
            if (filters.Count == 0)
                return list;
            var filter = filters[0];
            filters.Remove(filter);

            var l = list.Where(el => el[filter.Field] == filter.Value).ToList();
            return FilterTask(list, filters);
        }

        List<Dictionary<string, string>> GetAsDictionaryByRows()
        {
            var entities = context.Properties.ToList();
            int amount = entities.GroupBy(e => e.RowId).Count();
            List<Dictionary<string, string>> array = new();
            for (int i = 0; i < amount;  i++)
            {
                array.Add(new Dictionary<string, string>());
            }
            array.ForEach(el => el = new Dictionary<string, string>());
            entities.ForEach(entity =>
            {
                array[entity.RowId].Add(entity.ColumnName, entity.Value);
            });

            return array;
        }

        List<HashKeyDto> GetColumnOverview(List<Dictionary<string, string>> list, string key)
        {
            return list.GroupBy(el => el[key])
                .Select(t => new HashKeyDto { Name = t.Key, Count = t.Count() })
                .ToList();
        }
    }
}
