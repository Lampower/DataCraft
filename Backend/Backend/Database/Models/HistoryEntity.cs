namespace Backend.Database.Models
{
    public class HistoryEntity
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? PropertyName { get; set; }
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
    }
}
