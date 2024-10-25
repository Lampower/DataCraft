using Backend.Database.Models;

namespace Backend.Dtos.GetDtos
{
    public class PaginatedEntitiesDto<T> where T : BaseEntity
    {
        public int TotalLength { get; set; } = 0;
        public List<T> Entities { get; set; } = new List<T>();
    }
}
