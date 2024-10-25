namespace Backend.Database.Models
{
    public class TaskEntity: BaseEntity
    {
        public string Title { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
