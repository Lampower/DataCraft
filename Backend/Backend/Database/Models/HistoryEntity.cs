namespace Backend.Database.Models
{
    public class HistoryEntity
    {
        public int Id { get; set; }
        public int TaskId { get; set; } // entity_id
        public DateTime CreatedAt { get; set; } // create_date
        public string? PropertyName { get; set; } // property_name
        public string? OldValue { get; set; } // old_value
        public string? NewValue { get; set; } // new_value
    }
}
