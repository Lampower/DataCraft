namespace Backend.Database.Models
{
    public class PropertiesEntity
    {
        public int Id { get; set; }
        public string ColumnName {  get; set; }
        public string Value { get; set; }
        public string Type { get; set; }
        public int ColumnId { get; set; }
        public int RowId { get; set; }
    }
}
