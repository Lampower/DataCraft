
namespace Backend.Database.Models
{
    public class TaskEntity
    {
        public int Id { get; set; }
        public int TaskId { get; set; } // ID задачи
        public string? ProjectName { get; set; } = string.Empty; // Пространство
        public string? TaskType { get; set; } = string.Empty; // Тип задачи
        public string? Status { get; set; } = string.Empty; // Статус
        public string? Priority { get; set; } = string.Empty; // Приоритет
        public string? TaskNumber { get; set; } = string.Empty; // Номер задачи
        public string? TaskName { get; set; } = string.Empty; // Имя задачи
        public DateTime? CreatedAt { get; set; } // Дата создания
        public string? CreatedBy { get; set; } = string.Empty; // Человек, создавший
        public DateTime? UpdatedAt { get; set; } // Дата обновления
        public string? UpdatedBy { get; set; } = string.Empty; // Человек, обновивший
        public string? Description {  get; set; } = string.Empty; // Описание
        public int? PrevTaskId { get; set; } // Родительский ID
        public string? Assigned { get; set; } = string.Empty; // На ком назначена задача
        public string? Owner { get; set; } = string.Empty; // Владелец задачи
        public DateTime? Deadline {  get; set; } // Дата до которой
        public int? TimeRating { get; set; } // Оценка (в секундах)
        public string? Sprint { get; set; } = string.Empty; // Имя спринта
        public int? Estimation { get; set; } // estimation
        public int? TimeTaken { get; set; } // Потраченное время
        public string? WorkerGroup {  get; set; } = string.Empty; // Рабочая группа
        public string? Resolution { get; set; } = string.Empty; // Резолюция
    }
}
