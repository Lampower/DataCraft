using Microsoft.AspNetCore.Mvc;
using Backend.Database;
using Backend.Database.Models;
using Backend.Dto;
using OfficeOpenXml;

namespace Backend.Controllers
{
    [Route("/history")]
    public class HistoryController : ControllerBase
    {
        DatabaseContext context;

        public HistoryController(DatabaseContext context) => this.context = context;

        [HttpGet]
        public IActionResult Get(string column)
        {
            var names = context.Histories.ToList()
                .Select(h => SelectColumn(h, column))
                .Distinct()
                .ToList();
            return Ok(names);
        }

        [HttpPost("filter")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetFiltered([FromBody] List<FilterDto> filters, int from = 0, int amount = 100)
        {
            if (amount > 100) amount = 100;

            var histories = context.Histories.ToList();
            histories = FilterHistory(histories, filters);
            var pagTasks = new PaginatedList<HistoryEntity>();
            pagTasks.TotalLength = histories.Count;
            pagTasks.Entities = histories.Skip(from).Take(amount).ToList();
            return Ok(pagTasks);
        }

        [HttpPost("time")]
        public IActionResult GetTime(int from = 0, int amount = 100, int days = 30)
        {
            var histories = context.Histories
                .Where(t => t.CreatedAt > DateTime.Now.AddDays(-days)
                || t.CreatedAt > DateTime.Now.AddDays(-days))
                .ToList();
            var pagHistories = new PaginatedList<HistoryEntity>();
            pagHistories.TotalLength = histories.Count;
            pagHistories.Entities = histories.Skip(from).Take(amount).ToList();
            return Ok(pagHistories);
        }

        [HttpPost("loadHistory")]
        public IActionResult Load(IFormFile file)
        {
            LoadHistory(file);
            return Ok();
        }

        object? SelectColumn(object field, string ColumnName)
        {
            {
                var property = field.GetType().GetProperty(ColumnName);
                var value = property.GetValue(field);
                return value;
            }
        }

        void LoadHistory(IFormFile file)
        {
            var stream = file.OpenReadStream();
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (var package = new ExcelPackage(stream))
            {
                var table = package.Workbook.Worksheets[0];
                var rows = table.Cells.EntireRow.Count();

                for (int i = 3; i < rows; i++)
                {
                    HistoryEntity history = new HistoryEntity();
                    history.TaskId = Convert.ToInt32(table.GetValue(i, 1));
                    history.CreatedAt = DateTime.Parse(table.GetValue(i, 2).ToString());
                    history.PropertyName = table.GetValue(i, 3).ToString();
                    // Perhaps swap OldValue and NewValue.
                    history.OldValue = table.GetValue(i, 4).ToString();
                    history.NewValue = table.GetValue(i, 5).ToString();

                    context.Histories.Add(history);
                }

                context.SaveChanges();
            }
        }

        // TODO: Reimplement with `TaskController.FilterTask` using generics.
        List<HistoryEntity> FilterHistory(List<HistoryEntity> list, List<FilterDto> filters)
        {
            if (filters.Count == 0)
                return list;
            var filter = filters[0];
            filters.Remove(filter);

            var prop = typeof(HistoryEntity).GetProperty(filter.Field);
            list = list.Where(t => prop?.GetValue(t) == null ? false : prop.GetValue(t).Equals(filter.Value)).ToList();
            return FilterHistory(list, filters);
        }
    }
}
